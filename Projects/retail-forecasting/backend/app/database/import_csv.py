import os
import csv
import random
import string
from datetime import datetime, timedelta
from app.database.connection import SessionLocal, engine, Base
from app.database import models

def get_random_sku(length=8):
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))

def import_dmart_data(csv_path: str, max_rows: int = 500):
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # Check if we already have data
    if db.query(models.Product).count() > 0:
        print("Database already has products. Dropping and re-creating.")
        Base.metadata.drop_all(bind=engine)
        Base.metadata.create_all(bind=engine)
        
    print(f"Importing dataset from {csv_path}...")
    
    products_added = 0
    today = datetime.now()
    
    try:
        with open(csv_path, mode='r', encoding='utf-8', errors='ignore') as file:
            reader = csv.DictReader(file)
            for row in reader:
                if products_added >= max_rows:
                    break
                    
                # Clean up price (might have commas or be empty)
                price_str = row.get('Price', '0').replace(',', '')
                try:
                    price = float(price_str) if price_str else 0.0
                except:
                    price = 0.0
                    
                discount_str = row.get('DiscountedPrice', '0').replace(',', '')
                try:
                    discount = float(discount_str) if discount_str else price
                except:
                    discount = price

                # Synthesize stock levels
                current_stock = random.randint(0, 150)
                
                db_product = models.Product(
                    name=row.get('Name', 'Unknown Product'),
                    brand=row.get('Brand', ''),
                    price=price,
                    discounted_price=discount,
                    category=row.get('Category', 'General'),
                    sub_category=row.get('SubCategory', ''),
                    quantity=row.get('Quantity', ''),
                    description=row.get('Description', ''),
                    current_stock=current_stock,
                    sku=f"DMART-{get_random_sku(6)}"
                )
                db.add(db_product)
                db.commit()
                db.refresh(db_product)
                
                # Synthesize 30 days of history so the ML models (LinearRegression, etc.) can train
                base_sales = random.randint(5, 50)
                for i in range(30, 0, -1):
                    date_str = (today - timedelta(days=i)).strftime("%Y-%m-%d")
                    day_of_week = (today - timedelta(days=i)).weekday()
                    
                    # Add some seasonality/noise
                    seasonality = 1.3 if day_of_week in [4, 5, 6] else 0.9 # Weekends higher
                    qty = int(base_sales * seasonality * random.uniform(0.7, 1.3))
                    
                    sale = models.HistoricalSales(
                        product_id=db_product.id,
                        date=date_str,
                        quantity=max(0, qty)
                    )
                    db.add(sale)
                    
                db.commit()
                products_added += 1
                
        print(f"Successfully imported {products_added} products with synthesized 30-day sales history!")
    except Exception as e:
        print(f"Error importing data: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    csv_path = r"c:\Users\Aditya\Desktop\CPUR-Agentic-AI\retail-forecasting\data\DMart.csv"
    if os.path.exists(csv_path):
        import_dmart_data(csv_path, max_rows=500)
    else:
        print(f"Dataset not found at {csv_path}")
