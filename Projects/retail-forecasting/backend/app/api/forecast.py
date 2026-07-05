from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from datetime import datetime, timedelta
import numpy as np

from app.database.connection import get_db
from app.database import models
from app.services.forecast_service import ForecastService
from app.models.linear_regression import LinearRegressionModel

router = APIRouter()

class ForecastRequest(BaseModel):
    product_id: int
    model_type: str
    use_agents: bool

class SalesHistoryResponse(BaseModel):
    date: str
    quantity: int

    class Config:
        from_attributes = True

class ForecastResultResponse(BaseModel):
    id: int
    product_id: int
    forecast_date: str
    predicted_quantity: float
    model_used: str
    agent_adjustments: str | None
    adjusted_quantity: float | None

    class Config:
        from_attributes = True

class ForecastResponse(BaseModel):
    message: str
    forecast: ForecastResultResponse

class MultiDayForecastPoint(BaseModel):
    date: str
    predicted_quantity: float
    is_forecast: bool  # True = future prediction, False = historical actuals

class MultiDayForecastResponse(BaseModel):
    product_id: int
    product_name: str
    sku: str
    category: str
    current_stock: int
    data_points: List[MultiDayForecastPoint]
    summary: dict  # avg, max, min of forecast

@router.get("/history/{product_id}", response_model=List[SalesHistoryResponse])
def get_sales_history(product_id: int, db: Session = Depends(get_db)):
    sales = db.query(models.HistoricalSales).filter(models.HistoricalSales.product_id == product_id).all()
    return sorted(sales, key=lambda x: x.date)

@router.get("/multi/{product_id}", response_model=MultiDayForecastResponse)
def get_multi_day_forecast(product_id: int, days: int = 7, db: Session = Depends(get_db)):
    """
    Returns the last 30 days of actual sales history + next N days of predicted demand
    for a given product. This powers the Forecast page chart.
    """
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail=f"Product {product_id} not found")

    sales = db.query(models.HistoricalSales)\
        .filter(models.HistoricalSales.product_id == product_id)\
        .all()

    if not sales:
        raise HTTPException(status_code=400, detail="No sales history found for this product")

    sorted_sales = sorted(sales, key=lambda x: x.date)
    # Last 30 days of actual data
    last_30 = sorted_sales[-30:]

    data_points: List[MultiDayForecastPoint] = []

    # Add historical actuals
    for s in last_30:
        data_points.append(MultiDayForecastPoint(
            date=s.date,
            predicted_quantity=float(s.quantity),
            is_forecast=False
        ))

    # Train model on available history
    history = [{"date": s.date, "quantity": s.quantity} for s in sorted_sales]
    model = LinearRegressionModel()

    # Generate N future predictions
    last_date = datetime.strptime(sorted_sales[-1].date, "%Y-%m-%d")
    predictions = []
    for i in range(1, days + 1):
        future_date = last_date + timedelta(days=i)
        future_str = future_date.strftime("%Y-%m-%d")

        # Add previously predicted points to history for rolling forecast
        rolling_history = history + [{"date": p.date, "quantity": int(p.predicted_quantity)} for p in predictions]
        pred = model.predict_next_day(rolling_history)
        pt = MultiDayForecastPoint(
            date=future_str,
            predicted_quantity=float(max(0, pred)),
            is_forecast=True
        )
        predictions.append(pt)
        data_points.append(pt)

    forecast_qtys = [p.predicted_quantity for p in predictions]
    summary = {
        "avg_daily_forecast": round(sum(forecast_qtys) / len(forecast_qtys), 1),
        "max_day_forecast": round(max(forecast_qtys), 1),
        "min_day_forecast": round(min(forecast_qtys), 1),
        "total_7day_forecast": round(sum(forecast_qtys), 1),
        "reorder_recommended": product.current_stock < sum(forecast_qtys),
        "days_of_stock_left": round(product.current_stock / max(1, sum(forecast_qtys) / days), 1),
    }

    return MultiDayForecastResponse(
        product_id=product.id,
        product_name=product.name,
        sku=product.sku,
        category=product.category,
        current_stock=product.current_stock,
        data_points=data_points,
        summary=summary
    )

@router.get("/results/{product_id}", response_model=List[ForecastResultResponse])
def get_forecast_results(product_id: int, limit: int = 10, db: Session = Depends(get_db)):
    """
    Returns past forecast records for a product (most recent first).
    """
    results = db.query(models.Forecast)\
        .filter(models.Forecast.product_id == product_id)\
        .order_by(models.Forecast.created_at.desc())\
        .limit(limit)\
        .all()
    return results

@router.post("/trigger", response_model=ForecastResponse)
def trigger_forecast(req: ForecastRequest, db: Session = Depends(get_db)):
    """
    Triggers AI agent forecast for a specific product.
    Runs in a thread pool to avoid blocking the main event loop.
    """
    try:
        forecast_record = ForecastService.generate_forecast(
            db=db,
            product_id=req.product_id,
            model_type=req.model_type,
            use_agents=req.use_agents
        )
        return {
            "message": "Forecasting calculations completed.",
            "forecast": forecast_record
        }
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Forecasting engine failure: {str(e)}")
