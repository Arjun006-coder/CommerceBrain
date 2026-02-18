"""
Configuration settings for CommerceBrain AI
Loads environment variables and provides app configuration
"""

from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings"""
    
    # Environment
    environment: str = "development"
    
    # OpenAI
    openai_api_key: Optional[str] = None
    openai_model: str = "gpt-4-turbo-preview"
    
    # Qdrant
    qdrant_host: str = "localhost"
    qdrant_port: int = 6333
    qdrant_api_key: Optional[str] = None
    
    # Database
    database_url: str = "sqlite:///./commercebrain.db"
    
    # API
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    api_reload: bool = True
    
    # CORS
    cors_origins: str = "http://localhost:3000,http://localhost:3001"
    
    # Features
    track_costs: bool = True
    log_level: str = "INFO"
    
    # Models
    sentiment_model: str = "backend/models/sentiment_feature_store/final_model"
    embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2"
    
    # Apify
    apify_api_token: Optional[str] = None
    
    # Performance
    max_workers: int = 4
    batch_size: int = 32
    
    class Config:
        env_file = ".env"
        case_sensitive = False


# Global settings instance
settings = Settings()
