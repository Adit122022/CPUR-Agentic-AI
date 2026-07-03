from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.database.models import DailySales
from sqlalchemy import func
from datetime import datetime, timedelta

router = APIRouter(prefix="/api/forecast-data", tags=["Forecast Data"])

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
        "Stationery & Books": {"icon": "📚", "reason": "Consistent high student demand"},
        "Ready-to-Eat & Instant Food": {"icon": "🍜", "reason": "Late-night study snack consumption"},
        "Groceries & Staples": {"icon": "🌾", "reason": "Standard household necessities"},
        "Beverages & Cold Drinks": {"icon": "🥤", "reason": "Summer heatwave hydration needs"},
        "Personal Care": {"icon": "🧼", "reason": "Regular hygiene products"},
        "Apparels & Innerwear": {"icon": "👕", "reason": "Seasonal light wear clothes"}
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
