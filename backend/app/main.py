from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from fastapi.openapi.utils import get_openapi

from app.routes import auth_routes
from app.routes import upload_routes
from app.routes import interview_routes

# Security scheme (DO NOT apply globally)
security = HTTPBearer()

app = FastAPI(
    title="IntelliHire Backend",
    version="0.1.0",
    description="API for IntelliHire",
    openapi_tags=[
        {"name": "auth", "description": "Authentication"},
        {"name": "interview", "description": "Interview flow"},
        {"name": "upload", "description": "File uploads"},
    ],
)

# ✅ CORS (allow frontend + Swagger)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://intellihire-qutc.onrender.com",
        "*"  # you can restrict later
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth_routes.router, prefix="/api/auth", tags=["auth"])
app.include_router(upload_routes.router, prefix="/api/upload", tags=["upload"])
app.include_router(interview_routes.router, prefix="/api/interview", tags=["interview"])

# Health check
@app.get("/", tags=["health"])
def root():
    return {"status": "ok"}

# ✅ CUSTOM OPENAPI (Swagger FIXED)
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title="IntelliHire Backend",
        version="0.1.0",
        description="API for IntelliHire",
        routes=app.routes,
    )

    # Define BearerAuth (for Swagger "Authorize" button)
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
        }
    }

    # ❌ DO NOT force security globally
    # Swagger must access /openapi.json without auth

    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi
