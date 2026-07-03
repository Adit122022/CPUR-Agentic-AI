from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.connection import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    brand = Column(String, nullable=True)
    price = Column(Float, nullable=False)
    discounted_price = Column(Float, nullable=True)
    category = Column(String, nullable=False)
    sub_category = Column(String, nullable=True)
    quantity = Column(String, nullable=True) # e.g., '500 gm'
    description = Column(String, nullable=True)
    current_stock = Column(Integer, default=0) # We will synthesize this
    sku = Column(String, unique=True, index=True, nullable=False)
    image = Column(String, nullable=True)

    # Relationships
    sales_history = relationship("HistoricalSales", back_populates="product", cascade="all, delete-orphan")
    forecasts = relationship("Forecast", back_populates="product", cascade="all, delete-orphan")


class HistoricalSales(Base):
    __tablename__ = "historical_sales"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    date = Column(String, nullable=False)  # YYYY-MM-DD
    quantity = Column(Integer, nullable=False)

    # Relationships
    product = relationship("Product", back_populates="sales_history")


class Forecast(Base):
    __tablename__ = "forecasts"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    forecast_date = Column(String, nullable=False)  # YYYY-MM-DD
    predicted_quantity = Column(Float, nullable=False)
    model_used = Column(String, nullable=False)  # e.g., 'linear_regression'
    agent_adjustments = Column(String, nullable=True)  # Markdown narrative
    adjusted_quantity = Column(Float, nullable=True)  # Final adjustment
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    product = relationship("Product", back_populates="forecasts")

class DailySales(Base):
    __tablename__ = "daily_sales"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(String, index=True, nullable=False) # YYYY-MM-DD
    retailer = Column(String, index=True, nullable=False) # dmart, vmart, local
    category = Column(String, index=True, nullable=False)
    sales_qty = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)
    promotion = Column(Integer, nullable=False) # 1 or 0
