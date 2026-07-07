import io
import csv
import json
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.database.connection import get_db
from app.database import models
from app.core.auth import get_current_user

router = APIRouter(dependencies=[Depends(get_current_user)])



from app.services.preprocessing_service import calculate_file_hash, preprocess_csv_dataframe

# ─────────────────────────────────────────────────────────────────────────────
#  CLEAR ALL DATA
# ─────────────────────────────────────────────────────────────────────────────
@router.delete("/clear")
def clear_all_data(db: Session = Depends(get_db)):
    """Wipe all products, sales history, forecasts, and upload history from the database."""
    try:
        deleted_history   = db.query(models.UploadHistory).delete()
        deleted_forecasts = db.query(models.Forecast).delete()
        deleted_sales     = db.query(models.HistoricalSales).delete()
        deleted_products  = db.query(models.Product).delete()
        db.commit()
        return {
            "message": "Database cleared successfully.",
            "deleted": {
                "products": deleted_products,
                "sales_records": deleted_sales,
                "forecasts": deleted_forecasts,
                "upload_history": deleted_history,
            }
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to clear database: {str(e)}")


# ─────────────────────────────────────────────────────────────────────────────
#  DOWNLOAD SAMPLE CSV TEMPLATE
# ─────────────────────────────────────────────────────────────────────────────
@router.get("/template")
def download_template():
    """Return a sample CSV file the user can fill in."""
    sample_rows = [
        ["date", "product_name", "sku", "category", "brand", "price",
         "quantity_sold", "current_stock", "discounted_price", "description"],
        ["2024-06-01", "Blue Denim Jeans",    "CLT-001", "Apparels",   "Levi's",   "1299", "12", "150", "999",  "Slim-fit blue denim jeans"],
        ["2024-06-02", "Blue Denim Jeans",    "CLT-001", "Apparels",   "Levi's",   "1299", "15", "150", "999",  "Slim-fit blue denim jeans"],
        ["2024-06-03", "Blue Denim Jeans",    "CLT-001", "Apparels",   "Levi's",   "1299", "9",  "150", "999",  "Slim-fit blue denim jeans"],
        ["2024-06-04", "Blue Denim Jeans",    "CLT-001", "Apparels",   "Levi's",   "1299", "20", "150", "999",  "Slim-fit blue denim jeans"],
        ["2024-06-05", "Blue Denim Jeans",    "CLT-001", "Apparels",   "Levi's",   "1299", "18", "150", "999",  "Slim-fit blue denim jeans"],
        ["2024-06-06", "Blue Denim Jeans",    "CLT-001", "Apparels",   "Levi's",   "1299", "25", "150", "999",  "Slim-fit blue denim jeans"],
        ["2024-06-07", "Blue Denim Jeans",    "CLT-001", "Apparels",   "Levi's",   "1299", "11", "150", "999",  "Slim-fit blue denim jeans"],
        ["2024-06-01", "White Cotton Shirt",  "CLT-002", "Apparels",   "Arrow",    "799",  "8",  "200", "",     "Regular-fit white cotton shirt"],
        ["2024-06-02", "White Cotton Shirt",  "CLT-002", "Apparels",   "Arrow",    "799",  "6",  "200", "",     "Regular-fit white cotton shirt"],
        ["2024-06-03", "White Cotton Shirt",  "CLT-002", "Apparels",   "Arrow",    "799",  "10", "200", "",     "Regular-fit white cotton shirt"],
        ["2024-06-04", "White Cotton Shirt",  "CLT-002", "Apparels",   "Arrow",    "799",  "7",  "200", "",     "Regular-fit white cotton shirt"],
        ["2024-06-05", "White Cotton Shirt",  "CLT-002", "Apparels",   "Arrow",    "799",  "14", "200", "",     "Regular-fit white cotton shirt"],
        ["2024-06-06", "White Cotton Shirt",  "CLT-002", "Apparels",   "Arrow",    "799",  "16", "200", "",     "Regular-fit white cotton shirt"],
        ["2024-06-07", "White Cotton Shirt",  "CLT-002", "Apparels",   "Arrow",    "799",  "5",  "200", "",     "Regular-fit white cotton shirt"],
        ["2024-06-01", "Black Formal Trousers","CLT-003","Formals",    "Raymond",  "1599", "4",  "80",  "1299", "Slim-fit black formal trousers"],
        ["2024-06-02", "Black Formal Trousers","CLT-003","Formals",    "Raymond",  "1599", "6",  "80",  "1299", "Slim-fit black formal trousers"],
        ["2024-06-03", "Black Formal Trousers","CLT-003","Formals",    "Raymond",  "1599", "3",  "80",  "1299", "Slim-fit black formal trousers"],
        ["2024-06-04", "Black Formal Trousers","CLT-003","Formals",    "Raymond",  "1599", "8",  "80",  "1299", "Slim-fit black formal trousers"],
        ["2024-06-05", "Black Formal Trousers","CLT-003","Formals",    "Raymond",  "1599", "5",  "80",  "1299", "Slim-fit black formal trousers"],
        ["2024-06-06", "Black Formal Trousers","CLT-003","Formals",    "Raymond",  "1599", "9",  "80",  "1299", "Slim-fit black formal trousers"],
        ["2024-06-07", "Black Formal Trousers","CLT-003","Formals",    "Raymond",  "1599", "2",  "80",  "1299", "Slim-fit black formal trousers"],
    ]

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerows(sample_rows)
    output.seek(0)

    return StreamingResponse(
        io.BytesIO(output.getvalue().encode("utf-8")),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=clearshelf_template.csv"}
    )


# ─────────────────────────────────────────────────────────────────────────────
#  VALIDATE CSV STRUCTURE (preview + EDA preprocessing)
# ─────────────────────────────────────────────────────────────────────────────
@router.post("/validate")
async def validate_csv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Parse CSV, check hashes, run preprocessing & return preview rows with EDA logs. Does NOT write to DB."""
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only .csv files are accepted.")

    content = await file.read()
    
    # Calculate SHA-256 hash to detect duplicate uploads
    file_hash = calculate_file_hash(content)
    existing_upload = db.query(models.UploadHistory).filter(models.UploadHistory.file_hash == file_hash).first()
    if existing_upload:
        return {
            "valid": False,
            "error": "Duplicate upload: This spreadsheet has already been loaded to the database.",
            "duplicate": True
        }

    # Run robust data preprocessing
    try:
        df, eda_logs = preprocess_csv_dataframe(content)
    except ValueError as ve:
        return {
            "valid": False,
            "error": str(ve),
            "columns_found": [],
        }
    except Exception as e:
        return {
            "valid": False,
            "error": f"Failed to parse CSV: {str(e)}",
            "columns_found": [],
        }

    preview_rows = df.head(8).to_dict(orient="records")
    return {
        "valid": True,
        "eda_logs": eda_logs,
        "total_rows": len(df),
        "unique_products": len(df["sku"].unique()),
        "columns_found": list(df.columns),
        "preview": preview_rows,
    }


# ─────────────────────────────────────────────────────────────────────────────
#  IMPORT CSV → DATABASE
# ─────────────────────────────────────────────────────────────────────────────
@router.post("/import")
async def import_csv(
    file: UploadFile = File(...),
    clear_existing: bool = False,
    db: Session = Depends(get_db),
):
    """
    Parse, clean, and import a CSV file into the database.
    - Blocks duplicate uploads using the unique content SHA-256 hash.
    - Groups rows by SKU to create/update Product records.
    - Inserts HistoricalSales records (skipping duplicate date/sku conflicts).
    - Records metadata in the UploadHistory table.
    """
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only .csv files are accepted.")

    content = await file.read()
    
    # Calculate and verify unique hash
    file_hash = calculate_file_hash(content)
    existing_upload = db.query(models.UploadHistory).filter(models.UploadHistory.file_hash == file_hash).first()
    if existing_upload:
        raise HTTPException(
            status_code=400,
            detail="Duplicate upload: This spreadsheet file has already been loaded to Neon DB."
        )

    # Preprocess and clean the raw data
    try:
        df, eda_logs = preprocess_csv_dataframe(content)
    except Exception as e:
        # Create a failed record in history
        failed_history = models.UploadHistory(
            filename=file.filename,
            file_hash=file_hash,
            total_rows=0,
            unique_products=0,
            status=f"Failed: {str(e)}"
        )
        db.add(failed_history)
        db.commit()
        raise HTTPException(status_code=400, detail=f"Data preprocessing failed: {str(e)}")

    rows = df.to_dict(orient="records")
    try:
        if clear_existing:
            db.query(models.Forecast).delete()
            db.query(models.HistoricalSales).delete()
            db.query(models.Product).delete()
            db.query(models.UploadHistory).delete()
            db.flush()

        # Group rows by SKU
        sku_map: dict[str, dict] = {}
        for row in rows:
            sku = row["sku"]
            if sku not in sku_map:
                sku_map[sku] = {
                    "name":             row["product_name"],
                    "sku":              sku,
                    "category":         row["category"],
                    "brand":            row["brand"] if row.get("brand") else None,
                    "price":            row["price"],
                    "discounted_price": row["discounted_price"] if row.get("discounted_price") else None,
                    "description":      row["description"] if row.get("description") else None,
                    "current_stock":    row["current_stock"],
                    "sales":            [],
                }
            sku_map[sku]["sales"].append({
                "date":     row["date"],
                "quantity": row["quantity_sold"],
            })

        products_created = 0
        products_updated = 0
        sales_inserted   = 0

        for sku, data in sku_map.items():
            existing = db.query(models.Product).filter(models.Product.sku == sku).first()

            if existing:
                existing.name             = data["name"]
                existing.category         = data["category"]
                existing.brand            = data["brand"]
                existing.price            = data["price"]
                existing.discounted_price = data["discounted_price"]
                existing.description      = data["description"]
                existing.current_stock    = data["current_stock"]
                product = existing
                products_updated += 1
            else:
                product = models.Product(
                    name             = data["name"],
                    sku              = sku,
                    category         = data["category"],
                    brand            = data["brand"],
                    price            = data["price"],
                    discounted_price = data["discounted_price"],
                    description      = data["description"],
                    current_stock    = data["current_stock"],
                )
                db.add(product)
                db.flush()
                products_created += 1

            # Insert sales rows (skip duplicate date-product pairs)
            existing_dates = {
                s.date for s in db.query(models.HistoricalSales)
                .filter(models.HistoricalSales.product_id == product.id).all()
            }
            for sale in data["sales"]:
                if sale["date"] not in existing_dates:
                    db.add(models.HistoricalSales(
                        product_id = product.id,
                        date       = sale["date"],
                        quantity   = sale["quantity"],
                    ))
                    sales_inserted += 1

        # Save success logs in UploadHistory
        success_history = models.UploadHistory(
            filename=file.filename,
            file_hash=file_hash,
            total_rows=len(df),
            unique_products=len(sku_map),
            status="Success"
        )
        db.add(success_history)
        db.commit()

        return {
            "success": True,
            "message": f"Import complete! {products_created} products created, {products_updated} updated, {sales_inserted} sales records added.",
            "products_created": products_created,
            "products_updated": products_updated,
            "sales_inserted":   sales_inserted,
            "total_products":   len(sku_map),
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Import failed: {str(e)}")
