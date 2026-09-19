import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Broiler Integration Management Platform"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = "SUPER_SECRET_KEY_BROILER_ERP_2026_PRODUCTION_READY"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    # DB URL - defaults to sqlite async for dev/testing, supports Postgres
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./broiler_erp.db")
    
    # Business Rules Defaults
    DEFAULT_BIRD_LIFTING_AGE: int = 35
    DEFAULT_MORTALITY_HIGH_THRESHOLD: float = 5.0 # %
    DEFAULT_MORTALITY_MEDIUM_THRESHOLD: float = 3.0 # %

    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()
