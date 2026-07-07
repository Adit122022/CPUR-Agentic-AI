from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from datetime import datetime

from app.database.connection import get_db
from app.database import models
from app.core.auth import get_current_user

router = APIRouter(dependencies=[Depends(get_current_user)])

class UploadHistoryResponse(BaseModel):
    id: int
    filename: str
    file_hash: str
    total_rows: int
    unique_products: int
    uploaded_at: datetime
    status: str

    class Config:
        from_attributes = True

class PredictionHistoryResponse(BaseModel):
    id: int
    product_id: int
    product_name: str
    product_sku: str
    forecast_date: str
    predicted_quantity: float
    model_used: str
    agent_adjustments: str | None
    adjusted_quantity: float | None
    created_at: datetime

    class Config:
        from_attributes = True

@router.get("/uploads", response_model=List[UploadHistoryResponse])
def get_upload_history(db: Session = Depends(get_db)):
    """Fetch history of all uploaded data spreadsheets."""
    history = db.query(models.UploadHistory).order_by(models.UploadHistory.uploaded_at.desc()).all()
    return history

@router.get("/predictions", response_model=List[PredictionHistoryResponse])
def get_prediction_history(db: Session = Depends(get_db)):
    """Fetch history of all agent forecasts, joined with product info."""
    results = db.query(
        models.Forecast.id,
        models.Forecast.product_id,
        models.Product.name.label("product_name"),
        models.Product.sku.label("product_sku"),
        models.Forecast.forecast_date,
        models.Forecast.predicted_quantity,
        models.Forecast.model_used,
        models.Forecast.agent_adjustments,
        models.Forecast.adjusted_quantity,
        models.Forecast.created_at
    ).join(
        models.Product, models.Product.id == models.Forecast.product_id
    ).order_by(
        models.Forecast.created_at.desc()
    ).all()
    
    # Map the sqlalchemy tuples to models
    mapped_results = []
    for r in results:
        mapped_results.append(PredictionHistoryResponse(
            id=r.id,
            product_id=r.product_id,
            product_name=r.product_name,
            product_sku=r.product_sku,
            forecast_date=r.forecast_date,
            predicted_quantity=r.predicted_quantity,
            model_used=r.model_used,
            agent_adjustments=r.agent_adjustments,
            adjusted_quantity=r.adjusted_quantity,
            created_at=r.created_at
        ))
        
    return mapped_results
