import pandas as pd
import numpy as np
import io
import hashlib
from datetime import datetime

def calculate_file_hash(content: bytes) -> str:
    """Generate SHA-256 hash of file content bytes to detect duplicate uploads."""
    return hashlib.sha256(content).hexdigest()

def preprocess_csv_dataframe(content: bytes) -> tuple[pd.DataFrame, list[str]]:
    """
    Perform smart column mapping, clean formatting, handle missing/null values,
    and return the cleaned DataFrame along with a list of logs/EDA actions performed.
    """
    eda_logs = []
    
    # Load raw content
    try:
        df = pd.read_csv(io.BytesIO(content), encoding="utf-8-sig")
    except UnicodeDecodeError:
        df = pd.read_csv(io.BytesIO(content), encoding="latin-1")
        eda_logs.append("Fallback to latin-1 encoding for decoding CSV.")
    
    eda_logs.append(f"Initial raw data contains {len(df)} rows and {len(df.columns)} columns.")

    # 1. Smart Column Mapping (case-insensitive, strip spaces, allow underscores/spaces)
    mapping = {
        'date': ['date', 'sales_date', 'transaction_date', 'date_sold', 'dt'],
        'product_name': ['product_name', 'name', 'product', 'title', 'item_name', 'item'],
        'sku': ['sku', 'product_sku', 'sku_code', 'item_code', 'id_code'],
        'category': ['category', 'cat', 'product_category', 'group', 'department', 'dept'],
        'price': ['price', 'mrp', 'rate', 'unit_price', 'cost'],
        'quantity_sold': ['quantity_sold', 'quantity', 'qty_sold', 'units_sold', 'qty', 'sales_qty'],
        'current_stock': ['current_stock', 'stock', 'inventory', 'stock_level', 'current_inventory', 'qty_in_stock'],
        'brand': ['brand', 'manufacturer', 'make'],
        'discounted_price': ['discounted_price', 'discount_price', 'sale_price', 'promo_price'],
        'description': ['description', 'desc', 'details', 'about']
    }
    
    col_map = {}
    df.columns = [str(c).strip() for c in df.columns]
    
    for target, alternates in mapping.items():
        for col in df.columns:
            if col.lower() in alternates or col.lower().replace('_', ' ') in alternates or col.lower().replace(' ', '_') in alternates:
                col_map[col] = target
                if col != target:
                    eda_logs.append(f"Auto-mapped column '{col}' to standard '{target}'")
                break
    
    df = df.rename(columns=col_map)
    
    # Ensure all required standard columns exist
    required = ['date', 'product_name', 'sku', 'category', 'price', 'quantity_sold', 'current_stock']
    missing = [r for r in required if r not in df.columns]
    if missing:
        raise ValueError(f"Missing required columns in CSV (even after mapping): {', '.join(missing)}")
        
    # 2. Drop rows where critical fields are null (like date and SKU)
    initial_len = len(df)
    df = df.dropna(subset=['date', 'sku'])
    dropped = initial_len - len(df)
    if dropped > 0:
        eda_logs.append(f"Dropped {dropped} rows with missing critical field 'date' or 'sku'.")
        
    # 3. Clean and parse Dates
    def parse_date(val):
        if pd.isna(val):
            return None
        val_str = str(val).strip()
        for fmt in ('%Y-%m-%d', '%d/%m/%Y', '%m/%d/%Y', '%Y/%m/%d', '%d-%m-%Y', '%Y-%m-%d %H:%M:%S'):
            try:
                return datetime.strptime(val_str, fmt).strftime('%Y-%m-%d')
            except ValueError:
                continue
        try:
            return pd.to_datetime(val_str).strftime('%Y-%m-%d')
        except:
            return None

    df['date'] = df['date'].apply(parse_date)
    initial_len = len(df)
    df = df.dropna(subset=['date'])
    dropped_dates = initial_len - len(df)
    if dropped_dates > 0:
        eda_logs.append(f"Dropped {dropped_dates} rows due to unparseable date formats.")

    # 4. Clean Numeric columns (price, quantity_sold, current_stock)
    def clean_numeric(val, is_float=False):
        if pd.isna(val):
            return 0.0 if is_float else 0
        val_str = str(val).replace(',', '').replace('₹', '').replace('$', '').strip()
        try:
            return float(val_str) if is_float else int(float(val_str))
        except ValueError:
            return 0.0 if is_float else 0

    df['price'] = df['price'].apply(lambda x: clean_numeric(x, is_float=True))
    df['quantity_sold'] = df['quantity_sold'].apply(lambda x: clean_numeric(x, is_float=False))
    df['current_stock'] = df['current_stock'].apply(lambda x: clean_numeric(x, is_float=False))

    # Fill default for optional columns
    if 'brand' in df.columns:
        df['brand'] = df['brand'].fillna("Generic").apply(lambda x: str(x).strip())
    else:
        df['brand'] = "Generic"
        eda_logs.append("Added default brand column with value 'Generic'.")

    if 'discounted_price' in df.columns:
        df['discounted_price'] = df['discounted_price'].apply(lambda x: clean_numeric(x, is_float=True))
        df['discounted_price'] = np.where((df['discounted_price'] <= 0) | (df['discounted_price'] > df['price']), df['price'], df['discounted_price'])
    else:
        df['discounted_price'] = df['price']
        eda_logs.append("Synthesized 'discounted_price' values matching standard price.")

    if 'description' in df.columns:
        df['description'] = df['description'].fillna("").apply(lambda x: str(x).strip())
    else:
        df['description'] = ""

    df['product_name'] = df['product_name'].fillna("Unnamed Product").apply(lambda x: str(x).strip())
    df['category'] = df['category'].fillna("General").apply(lambda x: str(x).strip())
    df['sku'] = df['sku'].apply(lambda x: str(x).strip().upper())

    # Drop duplicate sales logs for same SKU and Date
    initial_len = len(df)
    df = df.drop_duplicates(subset=['sku', 'date'])
    dropped_dupes = initial_len - len(df)
    if dropped_dupes > 0:
        eda_logs.append(f"De-duplicated {dropped_dupes} rows containing redundant date-sku sales entries.")
        
    eda_logs.append(f"Data preprocessing complete. Final dataset has {len(df)} clean rows and {len(df['sku'].unique())} unique SKUs.")
    return df, eda_logs
