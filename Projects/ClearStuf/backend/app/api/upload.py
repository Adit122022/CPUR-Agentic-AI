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



# ─────────────────────────────────────────────────────────────────────────────
#  CLEAR ALL DATA
# ─────────────────────────────────────────────────────────────────────────────
@router.delete("/clear")
def clear_all_data(db: Session = Depends(get_db)):
    """Wipe all products, sales history, and forecasts from the database."""
    try:
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
#  VALIDATE CSV STRUCTURE (preview without importing)
# ─────────────────────────────────────────────────────────────────────────────
REQUIRED_COLUMNS = {"date", "product_name", "sku", "category", "price", "quantity_sold", "current_stock"}

@router.post("/validate")
async def validate_csv(file: UploadFile = File(...)):
    """Parse CSV and return validation result + preview rows. Does NOT write to DB."""
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only .csv files are accepted.")

    content = await file.read()
    try:
        text_content = content.decode("utf-8-sig")  # handle Excel BOM
    except UnicodeDecodeError:
        text_content = content.decode("latin-1")

    reader = csv.DictReader(io.StringIO(text_content))
    columns = set(reader.fieldnames or [])
    missing = REQUIRED_COLUMNS - columns

    if missing:
        return {
            "valid": False,
            "error": f"Missing required columns: {', '.join(sorted(missing))}",
            "columns_found": list(columns),
            "columns_required": list(REQUIRED_COLUMNS),
        }

    rows = list(reader)
    if len(rows) == 0:
        return {"valid": False, "error": "CSV file has no data rows."}

    # Count unique skus and dates
    skus   = set(r["sku"] for r in rows if r.get("sku"))
    errors = []
    for i, row in enumerate(rows[:200], start=2):  # check first 200 rows
        if not row.get("date"):
            errors.append(f"Row {i}: missing date")
        if not row.get("sku"):
            errors.append(f"Row {i}: missing sku")
        try:
            float(row.get("price", ""))
        except ValueError:
            errors.append(f"Row {i}: invalid price '{row.get('price')}'")
        try:
            int(row.get("quantity_sold", ""))
        except ValueError:
            errors.append(f"Row {i}: invalid quantity_sold '{row.get('quantity_sold')}'")

    return {
        "valid": len(errors) == 0,
        "errors": errors[:10],  # return at most 10 errors
        "total_rows": len(rows),
        "unique_products": len(skus),
        "columns_found": list(columns),
        "preview": rows[:8],    # first 8 rows for preview table
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
    Parse and import a CSV file into the database.
    - Groups rows by SKU to create/update Product records.
    - Each row becomes one HistoricalSales record.
    - If clear_existing=True, wipes the DB first.
    """
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only .csv files are accepted.")

    content = await file.read()
    try:
        text_content = content.decode("utf-8-sig")
    except UnicodeDecodeError:
        text_content = content.decode("latin-1")

    reader = csv.DictReader(io.StringIO(text_content))
    columns = set(reader.fieldnames or [])
    missing = REQUIRED_COLUMNS - columns
    if missing:
        raise HTTPException(
            status_code=400,
            detail=f"Missing required columns: {', '.join(sorted(missing))}"
        )

    rows = list(reader)
    if not rows:
        raise HTTPException(status_code=400, detail="CSV file has no data rows.")

    try:
        if clear_existing:
            db.query(models.Forecast).delete()
            db.query(models.HistoricalSales).delete()
            db.query(models.Product).delete()
            db.flush()

        # ── Group rows by SKU ──────────────────────────────────────────────
        sku_map: dict[str, dict] = {}
        for row in rows:
            sku = row["sku"].strip().upper()
            if sku not in sku_map:
                sku_map[sku] = {
                    "name":             row["product_name"].strip(),
                    "sku":              sku,
                    "category":         row["category"].strip(),
                    "brand":            row.get("brand", "").strip() or None,
                    "price":            float(row["price"]),
                    "discounted_price": float(row["discounted_price"]) if row.get("discounted_price","").strip() else None,
                    "description":      row.get("description", "").strip() or None,
                    "current_stock":    int(row["current_stock"]),
                    "sales":            [],
                }
            sku_map[sku]["sales"].append({
                "date":     row["date"].strip(),
                "quantity": int(row["quantity_sold"]),
            })

        # ── Upsert products and insert sales ──────────────────────────────
        products_created = 0
        products_updated = 0
        sales_inserted   = 0

        for sku, data in sku_map.items():
            existing = db.query(models.Product).filter(models.Product.sku == sku).first()

            if existing:
                # Update product metadata
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
                db.flush()  # get product.id
                products_created += 1

            # Insert sales rows (skip duplicates by date)
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
