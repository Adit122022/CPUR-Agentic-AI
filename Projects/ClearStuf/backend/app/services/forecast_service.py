import asyncio
from datetime import datetime, timedelta
from sqlalchemy.orm import Session

from app.database.models import Product, HistoricalSales, Forecast
from app.models.linear_regression import LinearRegressionModel
from app.services.weather_service import WeatherService
from app.services.social_media_service import SocialMediaService
from app.agents.crew import run_forecast_crew

# Global reference to event loop for thread-safe websocket broadcasts
main_loop = None

def send_agent_log(agent: str, message: str):
    """
    Thread-safe helper to send logs to the main event loop for WebSocket broadcasting.
    """
    global main_loop
    from app.api.websocket import manager
    
    payload = {"agent": agent, "message": message}
    if main_loop and main_loop.is_running():
        main_loop.call_soon_threadsafe(
            lambda: asyncio.create_task(manager.broadcast(payload))
        )
    else:
        print(f"[{agent}]: {message}")

class ForecastService:
    @staticmethod
    def ensure_30_days_history(db: Session, product_id: int) -> list[HistoricalSales]:
        """
        Ensures the product has at least 30 days of sales history.
        Pads the database if records are missing, using the average of available sales
        as a baseline, with added weekly seasonality and noise.
        """
        import random
        sales = db.query(HistoricalSales).filter(HistoricalSales.product_id == product_id).all()
        if len(sales) >= 30:
            return sales

        if len(sales) == 0:
            avg_qty = 10.0
        else:
            avg_qty = sum(s.quantity for s in sales) / len(sales)

        existing_dates = {s.date for s in sales}
        today = datetime.now()
        new_records = []

        for i in range(30, 0, -1):
            date_str = (today - timedelta(days=i)).strftime("%Y-%m-%d")
            if date_str not in existing_dates:
                day_of_week = (today - timedelta(days=i)).weekday()
                # Friday, Saturday, Sunday have higher sales
                seasonality = 1.4 if day_of_week in [4, 5, 6] else 1.0
                qty = int(avg_qty * seasonality * random.uniform(0.8, 1.2))
                
                new_record = HistoricalSales(
                    product_id=product_id,
                    date=date_str,
                    quantity=max(1, qty)
                )
                db.add(new_record)
                new_records.append(new_record)

        if new_records:
            try:
                db.commit()
                sales = db.query(HistoricalSales).filter(HistoricalSales.product_id == product_id).all()
            except Exception as e:
                db.rollback()
                print(f"Failed to pad sales history: {e}")

        return sales

    @staticmethod
    def generate_forecast(
        db: Session,
        product_id: int,
        model_type: str,
        use_agents: bool
    ) -> Forecast:
        # 1. Fetch Product
        product = db.query(Product).filter(Product.id == product_id).first()
        if not product:
            raise ValueError(f"Product with ID {product_id} not found")
            
        # 2. Fetch/Ensure Historical Sales (at least 30 days)
        sales = ForecastService.ensure_30_days_history(db, product_id)
            
        sales_history = [{"date": s.date, "quantity": s.quantity} for s in sales]
        
        # 3. Select and Run ML Model (Simplified to Linear Regression)
        if model_type not in ["linear_regression", "decision_tree", "neural_network"]:
            # For backward compatibility with the frontend dropdown, we accept all 
            # but map them directly to Linear Regression for simplicity
            pass 
            
        model = LinearRegressionModel()
        model_used_name = "linear_regression"
            
        predicted_qty = model.predict_next_day(sales_history)
        
        # Determine tomorrow's date string
        tomorrow_str = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
        
        agent_adjustments = None
        adjusted_qty = None
        
        # 4. Run CrewAI Overlay (if requested)
        if use_agents:
            # Gather contextual service inputs
            weather_data = WeatherService.get_forecast(tomorrow_str)
            social_data = SocialMediaService.get_product_buzz(product.sku)
            
            # Execute Crew (will trigger simulation if no OpenAI Key is set)
            crew_output = run_forecast_crew(
                product_name=product.name,
                sku=product.sku,
                ml_prediction=predicted_qty,
                weather_info=weather_data,
                social_info=social_data,
                sales_history=sales_history,
                log_callback=send_agent_log
            )
            
            agent_adjustments = crew_output["report"]
            adjusted_qty = crew_output["adjusted_quantity"]
            
        # 5. Save results to Database
        db_forecast = Forecast(
            product_id=product.id,
            forecast_date=tomorrow_str,
            predicted_quantity=predicted_qty,
            model_used=model_used_name,
            agent_adjustments=agent_adjustments,
            adjusted_quantity=adjusted_qty
        )
        
        db.add(db_forecast)
        db.commit()
        db.refresh(db_forecast)
        
        return db_forecast
