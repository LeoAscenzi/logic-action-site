import uuid
from pathlib import Path

from fastapi import UploadFile

from app.core.config import settings

UPLOAD_DIR = Path("media/uploads")


async def upload_file(file: UploadFile, request_base_url: str) -> str:
    ext = Path(file.filename or "file").suffix.lower() or ".bin"
    filename = f"{uuid.uuid4().hex}{ext}"

    if settings.STORAGE_BACKEND == "s3":
        import boto3
        s3 = boto3.client(
            "s3",
            region_name=settings.AWS_REGION,
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        )
        key = f"uploads/{filename}"
        s3.upload_fileobj(file.file, settings.S3_BUCKET, key, ExtraArgs={"ContentType": file.content_type or "application/octet-stream"})
        return f"https://{settings.S3_BUCKET}.s3.{settings.AWS_REGION}.amazonaws.com/{key}"

    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    dest = UPLOAD_DIR / filename
    content = await file.read()
    dest.write_bytes(content)
    base = request_base_url.rstrip("/")
    return f"{base}/media/uploads/{filename}"
