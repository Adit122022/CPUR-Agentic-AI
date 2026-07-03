from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel

from app.database.connection import get_db
from app.database import models
from app.services.forecast_service import ForecastService

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

@router.get("/history/{product_id}", response_model=List[SalesHistoryResponse])
def get_sales_history(product_id: int, db: Session = Depends(get_db)):
    sales = db.query(models.HistoricalSales).filter(models.HistoricalSales.product_id == product_id).all()
    # Sort by date
    return sorted(sales, key=lambda x: x.date)

@router.post("/trigger", response_model=ForecastResponse)
def trigger_forecast(req: ForecastRequest, db: Session = Depends(get_db)):
    """
    Triggers forecast. Note that we declare this with standard 'def' (not 'async def') 
    so FastAPI runs it in an external thread pool, keeping the main loop non-blocking 
    during heavy ML and CrewAI tasks.
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
