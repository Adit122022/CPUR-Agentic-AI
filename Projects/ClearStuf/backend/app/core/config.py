import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "ClearStuf"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Database
    # Default to a local SQLite database if DATABASE_URL is not provided (useful for development)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./forecasting.db")
    
    # LLM Settings for CrewAI
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "mock-key")
    OPENAI_MODEL_NAME: str = os.getenv("OPENAI_MODEL_NAME", "gpt-4o")
    
    # Groq Settings
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GROQ_MODEL_NAME: str = os.getenv("GROQ_MODEL_NAME", "llama-3.1-70b-versatile")

    # Clerk Auth
    CLERK_PUBLISHABLE_KEY: str = os.getenv("CLERK_PUBLISHABLE_KEY", "")
    CLERK_JWKS_URL: str = os.getenv("CLERK_JWKS_URL", "")

    class Config:
        case_sensitive = True

settings = Settings()
