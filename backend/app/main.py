from fastapi.security import HTTPBearer
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth_routes
from app.routes import upload_routes
from app.routes import interview_routes

security = HTTPBearer()
app = FastAPI(
    title="IntelliHire Backend",
    openapi_tags=[
        {"name": "auth", "description": "Authentication"},
        {"name": "interview", "description": "Interview flow"},
        {"name": "upload", "description": "File uploads"},
    ]
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register your routers
app.include_router(auth_routes.router, prefix="/api/auth", tags=["auth"])
app.include_router(upload_routes.router, prefix="/api/upload", tags=["upload"])
app.include_router(interview_routes.router, prefix="/api/interview", tags=["interview"])

@app.get("/")
def root():
    return {"status": "ok"}

from fastapi.openapi.utils import get_openapi

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title="IntelliHire Backend",
        version="0.1.0",
        description="API for IntelliHire",
        routes=app.routes,
    )

    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
        }
    }

    # Apply globally
    for path in openapi_schema["paths"].values():
        for method in path.values():
            method["security"] = [{"BearerAuth": []}]

    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi
