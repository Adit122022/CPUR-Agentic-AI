import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import products, forecast, websocket, forecast_data, upload, history
from app.database.connection import engine, Base
from app.services import forecast_service

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    docs_url="/docs"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://clearstuff.vercel.app", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(products.router,      prefix="/api/products",   tags=["Products"])
app.include_router(forecast.router,      prefix="/api/forecast",   tags=["Forecast"])
app.include_router(forecast_data.router)
app.include_router(websocket.router,     prefix="/api",            tags=["Websocket Logs"])
app.include_router(upload.router,        prefix="/api/upload",     tags=["Data Upload"])
app.include_router(history.router,       prefix="/api/history",    tags=["System History"])

@app.on_event("startup")
async def startup_event():
    Base.metadata.create_all(bind=engine)
    
    # Ensure upload_id column exists in historical_sales (migration fallback)
    from sqlalchemy import text
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE historical_sales ADD COLUMN IF NOT EXISTS upload_id INTEGER REFERENCES upload_history(id) ON DELETE CASCADE;"))
            conn.commit()
            print("Database migration check complete: upload_id column verified.")
        except Exception as e:
            print(f"Database migration note: {e}")
            
    forecast_service.main_loop = asyncio.get_running_loop()
    print("FastAPI backend initialized — CSV upload mode active.")

@app.get("/")
def read_root():
    return {"message": "ClearShelf Retail Forecasting API — upload your CSV to get started."}
