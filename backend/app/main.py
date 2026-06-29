from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.routers import auth, admin, parent, teacher, community

app = FastAPI(title="Logic Action API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS.split(","),
    allow_origin_regex=r"https://(logic-action-site[\w-]*\.vercel\.app|(www|dashboard)\.ivybridgesociety\.com)",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if settings.STORAGE_BACKEND == "local":
    media_dir = Path("media")
    media_dir.mkdir(exist_ok=True)
    app.mount("/media", StaticFiles(directory="media"), name="media")

app.include_router(auth.router)
app.include_router(admin.router)
app.include_router(parent.router)
app.include_router(teacher.router)
app.include_router(community.router)


@app.get("/health")
async def health():
    return {"status": "ok"}
