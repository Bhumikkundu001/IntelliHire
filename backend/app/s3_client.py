import boto3
import os
from botocore.client import Config

AWS_REGION = os.getenv("AWS_REGION")
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_S3_BUCKET = os.getenv("AWS_S3_BUCKET")

s3 = boto3.client(
    "s3",
    region_name=AWS_REGION,
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    config=Config(signature_version="s3v4")
)

def generate_presigned_url(key: str, expires_in: int = 3600):
    """Generate a presigned URL for downloading"""
    return s3.generate_presigned_url(
        ClientMethod="get_object",
        Params={"Bucket": AWS_S3_BUCKET, "Key": key},
        ExpiresIn=expires_in
    )

def generate_presigned_upload_url(key: str, expires_in: int = 3600):
    """Generate a presigned URL for uploading"""
    return s3.generate_presigned_url(
        ClientMethod="put_object",
        Params={"Bucket": AWS_S3_BUCKET, "Key": key},
        ExpiresIn=expires_in
    )
