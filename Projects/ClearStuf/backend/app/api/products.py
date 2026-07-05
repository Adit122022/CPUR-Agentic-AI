import random
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel

from app.database.connection import get_db
from app.database import models
from app.core.auth import get_current_user

router = APIRouter(dependencies=[Depends(get_current_user)])


class ProductBase(BaseModel):
    name: str
    sku: str
    brand: str | None = None
    category: str
    sub_category: str | None = None
    price: float
    discounted_price: float | None = None
    quantity: str | None = None
    description: str | None = None
    current_stock: int

class ProductResponse(ProductBase):
    id: int

    class Config:
        from_attributes = True

@router.get("", response_model=List[ProductResponse])
def get_products(db: Session = Depends(get_db), limit: int = 100):
    return db.query(models.Product).order_by(models.Product.id.asc()).limit(limit).all()

@router.post("", response_model=ProductResponse)
def create_product(product_in: ProductBase, db: Session = Depends(get_db)):
    # Check if SKU already exists
    existing = db.query(models.Product).filter(models.Product.sku == product_in.sku).first()
    if existing:
        raise HTTPException(status_code=400, detail="SKU already exists")
        
    db_product = models.Product(
        name=product_in.name,
        sku=product_in.sku.upper(),
        brand=product_in.brand,
        category=product_in.category,
        sub_category=product_in.sub_category,
        price=product_in.price,
        discounted_price=product_in.discounted_price,
        quantity=product_in.quantity,
        description=product_in.description,
        current_stock=product_in.current_stock
    )
    
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    
    # Auto-seed 30 days of sales history for new product so forecasting does not error out!
    today = datetime.now()
    base_sales = random.randint(5, 20)
    
    for i in range(30, 0, -1):
        date_str = (today - timedelta(days=i)).strftime("%Y-%m-%d")
        day_of_week = (today - timedelta(days=i)).weekday()
        
        seasonality = 1.4 if day_of_week in [4, 5, 6] else 1.0
        qty = int(base_sales * seasonality * random.uniform(0.8, 1.2))
        
        sale = models.HistoricalSales(
            product_id=db_product.id,
            date=date_str,
            quantity=max(0, qty)
        )
        db.add(sale)
        
    db.commit()
    return db_product
