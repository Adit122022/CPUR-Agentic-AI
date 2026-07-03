from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.connection import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    sku = Column(String, unique=True, index=True, nullable=False)
    category = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    current_stock = Column(Integer, default=0)

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
