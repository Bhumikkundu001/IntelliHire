from fastapi import APIRouter, HTTPException
from app.s3_client import generate_presigned_upload_url
import uuid

router = APIRouter()

@router.get("/get-upload-url")
async def get_upload_url():
    """
    Generate a presigned URL so frontend can upload audio/video directly to S3.
    """
    key = f"interview_uploads/{uuid.uuid4()}.webm"   # or .mp3 .wav
    try:
        url = generate_presigned_upload_url(key)
        return {"upload_url": url, "s3_key": key}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
