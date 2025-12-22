from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, EmailStr
from bson import ObjectId
from datetime import datetime

from app.auth import (
    hash_password,
    verify_password,
    create_access_token,
    decode_token,
)
from app.db import users

router = APIRouter()

# OAuth2 scheme (this fixes Swagger + frontend auth issues)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


# -------------------- SCHEMAS --------------------

class RegisterIn(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "candidate"


class LoginIn(BaseModel):
    email: EmailStr
    password: str


# -------------------- ROUTES --------------------

@router.post("/register")
async def register(payload: RegisterIn):
    existing = await users.find_one({"email": payload.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    doc = {
        "name": payload.name,
        "email": payload.email,
        "password_hash": hash_password(payload.password),
        "role": payload.role,
        "created_at": datetime.utcnow(),
    }

    res = await users.insert_one(doc)
    return {"id": str(res.inserted_id), "email": payload.email}


@router.post("/login")
async def login(payload: LoginIn):
    user = await users.find_one({"email": payload.email})
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = create_access_token(
        user_id=str(user["_id"]),
        role=user.get("role", "candidate"),
    )

    return {"access_token": token, "token_type": "bearer"}


# -------------------- AUTH DEPENDENCY --------------------

async def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = decode_token(token)

    if not payload or "sub" not in payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user = await users.find_one({"_id": ObjectId(payload["sub"])})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return {
        "id": str(user["_id"]),
        "email": user["email"],
        "role": user.get("role", "candidate"),
    }
