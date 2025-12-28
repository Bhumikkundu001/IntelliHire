# backend/app/db.py
import os
from pathlib import Path
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

# --- robust .env loading ---
base = Path.cwd()
env_path = None
for p in [base, base.parent, base.parent.parent, base.parent.parent.parent]:
    candidate = p / ".env"
    if candidate.exists():
        env_path = candidate
        break

if env_path is None:
    candidate = Path(__file__).resolve().parent.parent / ".env"
    if candidate.exists():
        env_path = candidate

if env_path:
    load_dotenv(dotenv_path=env_path, override=True)
else:
    load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    raise RuntimeError(f"MONGO_URI not found (checked {env_path})")

# ✅ Atlas-safe connection
client = AsyncIOMotorClient(MONGO_URI)

db = client["intellihire"]

# Collections
users = db["users"]
questions = db["questions"]
interviews = db["interviews"]
answers = db["answers"]
results = db["results"]
