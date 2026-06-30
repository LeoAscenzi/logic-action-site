import uuid
from pathlib import Path
from urllib.parse import urlparse

from fastapi import HTTPException, UploadFile, status

from app.core.config import settings

UPLOAD_DIR = Path("media/uploads")

ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/gif", "image/webp"}
MAX_UPLOAD_BYTES = 5 * 1024 * 1024  # 5 MB


async def upload_file(file: UploadFile, request_base_url: str) -> str:
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported file type. Allowed: JPEG, PNG, GIF, WEBP.",
        )

    content = await file.read()
    if len(content) > MAX_UPLOAD_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File too large. Maximum size is 5MB.",
        )

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
        s3.put_object(
            Bucket=settings.S3_BUCKET,
            Key=key,
            Body=content,
            ContentType=file.content_type or "application/octet-stream",
        )
        return f"https://{settings.S3_BUCKET}.s3.{settings.AWS_REGION}.amazonaws.com/{key}"

    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    dest = UPLOAD_DIR / filename
    dest.write_bytes(content)
    base = request_base_url.rstrip("/")
    return f"{base}/media/uploads/{filename}"


def delete_file(url: str) -> None:
    """Best-effort removal of a previously uploaded file. Swallows not-found."""
    if not url:
        return

    filename = Path(urlparse(url).path).name
    if not filename:
        return

    if settings.STORAGE_BACKEND == "s3":
        try:
            import boto3
            s3 = boto3.client(
                "s3",
                region_name=settings.AWS_REGION,
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            )
            s3.delete_object(Bucket=settings.S3_BUCKET, Key=f"uploads/{filename}")
        except Exception:
            pass
        return

    try:
        (UPLOAD_DIR / filename).unlink(missing_ok=True)
    except OSError:
        pass
