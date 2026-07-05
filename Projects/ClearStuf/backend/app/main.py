import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import products, forecast, websocket, forecast_data, upload
from app.database.connection import engine, Base
from app.services import forecast_service

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    docs_url="/docs"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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

@app.on_event("startup")
async def startup_event():
    Base.metadata.create_all(bind=engine)
    forecast_service.main_loop = asyncio.get_running_loop()
    print("FastAPI backend initialized — CSV upload mode active.")

@app.get("/")
def read_root():
    return {"message": "ClearShelf Retail Forecasting API — upload your CSV to get started."}
