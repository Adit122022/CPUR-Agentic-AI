import pandas as pd
from sqlalchemy.orm import Session
from app.database.connection import SessionLocal, engine, Base
from app.database.models import DailySales
import os

def import_data():
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)
    
    db: Session = SessionLocal()
    
    file_path = "../data/kota_retail_sales.csv"
    if not os.path.exists(file_path):
        print(f"Error: {file_path} not found.")
        return

    print("Reading CSV...")
    df = pd.read_csv(file_path)
    
    print("Clearing old data...")
    db.query(DailySales).delete()
    db.commit()

    print("Inserting new time-series data...")
    records = df.to_dict(orient="records")
    
    # Bulk insert for speed
    db.bulk_insert_mappings(DailySales, records)
    db.commit()
    
    count = db.query(DailySales).count()
    print(f"Successfully imported {count} DailySales records.")

if __name__ == "__main__":
    import_data()
