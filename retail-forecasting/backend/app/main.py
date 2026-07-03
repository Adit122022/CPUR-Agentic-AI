import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import products, forecast, websocket
from app.database.connection import engine, Base
from app.database import seed_data
from app.services import forecast_service

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    docs_url="/docs"
)

# Set up CORS middleware to allow communication from Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(products.router, prefix="/api/products", tags=["Products"])
app.include_router(forecast.router, prefix="/api/forecast", tags=["Forecast"])
app.include_router(websocket.router, prefix="/api", tags=["Websocket Logs"])

@app.on_event("startup")
async def startup_event():
    # 1. Initialize Database Tables
    Base.metadata.create_all(bind=engine)
    
    # 2. Seed initial data if tables are empty
    seed_data.seed_db()
    
    # 3. Capture the running event loop for thread-safe websocket broadcasts
    forecast_service.main_loop = asyncio.get_running_loop()
    print("FastAPI backend application successfully initialized.")

@app.get("/")
def read_root():
    return {"message": "Antigravity Retail Forecasting API is online."}
