from fastapi import APIRouter, Depends, HTTPException
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

class UploadPreviewItem(BaseModel):
    date: str
    product_name: str
    sku: str
    category: str
    price: float
    quantity_sold: int
    current_stock: int

@router.get("/uploads/{upload_id}/preview", response_model=List[UploadPreviewItem])
def get_upload_preview(upload_id: int, db: Session = Depends(get_db), limit: int = 100):
    """
    Reconstruct and preview the first N rows imported from the spreadsheet.
    """
    sales = db.query(models.HistoricalSales)\
        .filter(models.HistoricalSales.upload_id == upload_id)\
        .limit(limit)\
        .all()
        
    preview_items = []
    for s in sales:
        preview_items.append(UploadPreviewItem(
            date=s.date,
            product_name=s.product.name,
            sku=s.product.sku,
            category=s.product.category,
            price=s.product.price,
            quantity_sold=s.quantity,
            current_stock=s.product.current_stock
        ))
        
    return preview_items

@router.delete("/uploads/{upload_id}")
def delete_upload(upload_id: int, db: Session = Depends(get_db)):
    """
    Deletes the upload history log, all associated sales records, and cleans up orphaned products.
    """
    upload = db.query(models.UploadHistory).filter(models.UploadHistory.id == upload_id).first()
    if not upload:
        raise HTTPException(status_code=404, detail="Upload record not found")
        
    try:
        # Delete associated sales records
        db.query(models.HistoricalSales).filter(models.HistoricalSales.upload_id == upload_id).delete()
        
        # Delete the upload log
        db.query(models.UploadHistory).filter(models.UploadHistory.id == upload_id).delete()
        db.flush()
        
        # Clean up products with no remaining sales history (orphaned products)
        orphaned_products = db.query(models.Product).filter(
            ~models.Product.sales_history.any()
        ).all()
        
        num_products_deleted = len(orphaned_products)
        for p in orphaned_products:
            db.delete(p)
            
        db.commit()
        return {
            "success": True,
            "message": f"Upload '{upload.filename}' deleted successfully. Cleaned up {num_products_deleted} orphaned products."
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to delete upload: {str(e)}")
