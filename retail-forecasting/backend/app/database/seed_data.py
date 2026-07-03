import random
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.database.connection import engine, SessionLocal, Base
from app.database.models import Product, HistoricalSales

def seed_db():
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    db: Session = SessionLocal()
    try:
        # Check if products already exist
        if db.query(Product).first():
            print("Database already seeded.")
            return

        print("Seeding database with sample retail data...")
        
        # Sample products
        sample_products = [
            Product(name="Winter Parka Jacket", sku="JKT-WIN-001", category="Apparel", price=189.99, current_stock=45),
            Product(name="Rainproof Hiking Boots", sku="BTS-HIK-002", category="Footwear", price=129.50, current_stock=110),
            Product(name="UHD Smart Projector", sku="PRJ-UHD-003", category="Electronics", price=450.00, current_stock=18),
            Product(name="Thermos Travel Mug", sku="MUG-TRV-004", category="Kitchenware", price=24.95, current_stock=350),
            Product(name="Ergonomic Desk Chair", sku="CHR-ERG-005", category="Furniture", price=299.99, current_stock=25)
        ]
        
        db.add_all(sample_products)
        db.commit()
        
        # Refresh to get IDs
        for p in sample_products:
            db.refresh(p)
            
        # Seed 30 days of historical sales
        # Creating a trending pattern with weekly seasonality (higher on weekends)
        today = datetime.now()
        
        for product in sample_products:
            base_sales = {
                "JKT-WIN-001": 8,   # Parka: mid volume
                "BTS-HIK-002": 15,  # Boots: high volume
                "PRJ-UHD-003": 2,   # Projector: low volume
                "MUG-TRV-004": 30,  # Mug: very high volume
                "CHR-ERG-005": 4    # Chair: low volume
            }[product.sku]
            
            for i in range(30, 0, -1):
                date_str = (today - timedelta(days=i)).strftime("%Y-%m-%d")
                day_of_week = (today - timedelta(days=i)).weekday()
                
                # Introduce weekly seasonality: sales are ~50% higher on weekends (Friday, Saturday, Sunday)
                seasonality = 1.5 if day_of_week in [4, 5, 6] else 1.0
                
                # Introduce random noise
                noise = random.uniform(0.8, 1.2)
                
                # Calculated quantity
                qty = int(base_sales * seasonality * noise)
                if qty < 0:
                    qty = 0
                    
                sale = HistoricalSales(
                    product_id=product.id,
                    date=date_str,
                    quantity=qty
                )
                db.add(sale)
                
        db.commit()
        print("Database seeding completed successfully.")
        
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
