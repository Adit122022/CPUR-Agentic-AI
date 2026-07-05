from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.database.models import DailySales
from sqlalchemy import func
from datetime import datetime, timedelta
from app.core.auth import get_current_user

router = APIRouter(
    prefix="/api/forecast-data",
    tags=["Forecast Data"],
    dependencies=[Depends(get_current_user)]
)


@router.get("/categories")
def get_category_demand(db: Session = Depends(get_db)):
    # Calculate average demand and trend over last 30 days vs previous 30 days
    today = datetime.today()
    thirty_days_ago = (today - timedelta(days=30)).strftime('%Y-%m-%d')
    sixty_days_ago = (today - timedelta(days=60)).strftime('%Y-%m-%d')

    # Current 30 days
    recent = db.query(
        DailySales.retailer,
        DailySales.category,
        func.sum(DailySales.sales_qty).label('total_qty')
    ).filter(DailySales.date >= thirty_days_ago).group_by(DailySales.retailer, DailySales.category).all()

    # Previous 30 days
    previous = db.query(
        DailySales.retailer,
        DailySales.category,
        func.sum(DailySales.sales_qty).label('total_qty')
    ).filter(DailySales.date >= sixty_days_ago, DailySales.date < thirty_days_ago).group_by(DailySales.retailer, DailySales.category).all()

    prev_dict = {(r.retailer, r.category): r.total_qty for r in previous}

    CATEGORY_METADATA = {
        "Stationery & Books": {"icon": "📚", "reason": "Corporate and academic seasonal restocking"},
        "Ready-to-Eat & Instant Food": {"icon": "🍜", "reason": "High-velocity convenience category"},
        "Groceries & Staples": {"icon": "🌾", "reason": "Standard household necessities"},
        "Beverages & Cold Drinks": {"icon": "🥤", "reason": "Seasonal temperature-driven volume"},
        "Personal Care": {"icon": "🧼", "reason": "Consistent daily replenishment"},
        "Apparels & Innerwear": {"icon": "👕", "reason": "Trend and seasonal rotation"}
    }

    results = []
    # Structure it like the frontend expects KOTA_CATEGORIES
    categories_set = set([r.category for r in recent])
    for cat in categories_set:
        meta = CATEGORY_METADATA.get(cat, {"icon": "📦", "reason": "General retail demand"})
        cat_data = {
            "category": cat,
            "icon": meta["icon"],
            "reason": meta["reason"]
        }
        for retailer in ['dmart', 'vmart', 'local']:
            curr_val = next((r.total_qty for r in recent if r.retailer == retailer and r.category == cat), 0)
            prev_val = prev_dict.get((retailer, cat), 0)
            
            # Normalize for progress bar (0-100)
            # Assuming max possible sum for 30 days is around 4000
            demand_score = min(int((curr_val / 4000) * 100), 100)
            trend = int(((curr_val - prev_val) / prev_val) * 100) if prev_val > 0 else 0
            
            cat_data[retailer] = {"demand": demand_score, "trend": trend}
        results.append(cat_data)
        
    return results

@router.get("/weekly")
def get_weekly_forecast(db: Session = Depends(get_db)):
    # Group by day of week for the last 90 days to generate an average "typical week"
    ninety_days_ago = (datetime.today() - timedelta(days=90)).strftime('%Y-%m-%d')
    
    # In SQLite, we can't easily extract day of week, so we'll do it in Python
    sales = db.query(DailySales.date, DailySales.retailer, DailySales.sales_qty).filter(DailySales.date >= ninety_days_ago).all()
    
    # Aggregate by day of week (0=Mon, 6=Sun)
    day_totals = {d: {'dmart': [], 'vmart': [], 'local': []} for d in range(7)}
    
    for s in sales:
        dt = datetime.strptime(s.date, '%Y-%m-%d')
        day_totals[dt.weekday()][s.retailer].append(s.sales_qty)
        
    day_names = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    weekly_forecast = []
    
    for i in range(7):
        weekly_forecast.append({
            'day': day_names[i],
            'dmart': int(sum(day_totals[i]['dmart']) / len(day_totals[i]['dmart'])) if day_totals[i]['dmart'] else 0,
            'vmart': int(sum(day_totals[i]['vmart']) / len(day_totals[i]['vmart'])) if day_totals[i]['vmart'] else 0,
            'local': int(sum(day_totals[i]['local']) / len(day_totals[i]['local'])) if day_totals[i]['local'] else 0,
        })
        
    return weekly_forecast

@router.get("/radar")
def get_radar_data(db: Session = Depends(get_db)):
    # Average score (0-100) per category per retailer
    thirty_days_ago = (datetime.today() - timedelta(days=30)).strftime('%Y-%m-%d')
    recent = db.query(
        DailySales.retailer,
        DailySales.category,
        func.sum(DailySales.sales_qty).label('total_qty')
    ).filter(DailySales.date >= thirty_days_ago).group_by(DailySales.retailer, DailySales.category).all()
    
    categories = list(set([r.category for r in recent]))
    radar_data = []
    
    for cat in categories:
        # Simplify names for radar
        subject = cat.split('&')[0].strip() if '&' in cat else cat
        
        dmart = next((r.total_qty for r in recent if r.retailer == 'dmart' and r.category == cat), 0)
        vmart = next((r.total_qty for r in recent if r.retailer == 'vmart' and r.category == cat), 0)
        local = next((r.total_qty for r in recent if r.retailer == 'local' and r.category == cat), 0)
        
        radar_data.append({
            'subject': subject,
            'dmart': min(int((dmart / 3500) * 100), 100),
            'vmart': min(int((vmart / 3500) * 100), 100),
            'local': min(int((local / 3500) * 100), 100)
        })
        
    return radar_data

from app.database.models import HistoricalSales, Product
from sqlalchemy import func as sqlfunc
from collections import defaultdict

@router.get("/stock-trend")
def get_stock_trend(db: Session = Depends(get_db)):
    """
    Returns 6-week aggregated sales volumes by top category from real HistoricalSales data.
    Powers the trend chart on the Stock Dashboard.
    """
    forty_two_days_ago = (datetime.today() - timedelta(days=42)).strftime('%Y-%m-%d')
    
    sales = db.query(
        HistoricalSales.date,
        HistoricalSales.quantity,
        Product.category
    ).join(Product, Product.id == HistoricalSales.product_id)\
     .filter(HistoricalSales.date >= forty_two_days_ago)\
     .all()

    # Group by week number and category
    week_cat: dict = defaultdict(lambda: defaultdict(int))
    for s in sales:
        dt = datetime.strptime(s.date, '%Y-%m-%d')
        # Week 1 = oldest, Week 6 = most recent
        days_ago = (datetime.today() - dt).days
        week_num = min(6, max(1, 6 - (days_ago // 7)))
        week_cat[week_num][s.category] += s.quantity

    # Find top 3 categories by total volume
    cat_totals: dict = defaultdict(int)
    for wk, cats in week_cat.items():
        for cat, qty in cats.items():
            cat_totals[cat] += qty

    top_cats = sorted(cat_totals, key=lambda c: cat_totals[c], reverse=True)[:3]

    result = []
    for wk in range(1, 7):
        row: dict = {"name": f"Week {wk}"}
        for cat in top_cats:
            # Shorten category name
            short = cat.split('&')[0].strip() if '&' in cat else cat.split(' ')[0]
            row[short] = week_cat[wk].get(cat, 0)
        result.append(row)

    return {"data": result, "categories": [c.split('&')[0].strip() if '&' in c else c.split(' ')[0] for c in top_cats]}
