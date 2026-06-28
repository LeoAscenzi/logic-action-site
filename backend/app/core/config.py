from pydantic import model_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Either set DATABASE_URL directly, or set the POSTGRES_* vars below.
    # DATABASE_URL takes precedence when provided (local docker-compose path).
    DATABASE_URL: str = ""

    POSTGRES_HOST: str = "db"
    POSTGRES_PORT: int = 5432
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = ""
    POSTGRES_DB: str = "logicaction"

    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30
    ALLOWED_ORIGINS: str = "http://localhost:3000"  # comma-separated in prod
    ENVIRONMENT: str = "dev"
    COOKIE_DOMAIN: str | None = None

    STORAGE_BACKEND: str = "local"  # "local" or "s3"
    S3_BUCKET: str = ""
    AWS_REGION: str = "us-east-2"
    AWS_ACCESS_KEY_ID: str = ""
    AWS_SECRET_ACCESS_KEY: str = ""

    EMAIL_HOST: str = "smtp.gmail.com"
    EMAIL_PORT: int = 587
    EMAIL_USERNAME: str = ""   # empty = email disabled (dev)
    EMAIL_PASSWORD: str = ""
    EMAIL_FROM: str = ""
    SITE_URL: str = "http://localhost:3000"  # used in invite/notification links

    @model_validator(mode="after")
    def build_database_url(self) -> "Settings":
        if not self.DATABASE_URL:
            ssl = "?ssl=require" if self.ENVIRONMENT != "dev" else ""
            self.DATABASE_URL = (
                f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
                f"@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}{ssl}"
            )
        return self

    @property
    def secure_cookies(self) -> bool:
        return self.ENVIRONMENT != "dev"

    class Config:
        env_file = ".env"


settings = Settings()
