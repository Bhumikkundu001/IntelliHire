# backend/app/db.py
import os
from pathlib import Path
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

# --- robust .env loading: find .env in repo root or backend folder ---
# try the current working directory, then parent directories up to 3 levels
base = Path.cwd()
env_path = None
for p in [base] + [base.parent, base.parent.parent, base.parent.parent.parent]:
    candidate = p / ".env"
    if candidate.exists():
        env_path = candidate
        break

# If still not found, try relative to this file (app/db.py)
if env_path is None:
    candidate = Path(__file__).resolve().parent.parent / ".env"
    if candidate.exists():
        env_path = candidate

if env_path:
    load_dotenv(dotenv_path=env_path, override=True)
else:
    # still continue — load_dotenv() without path may also work in some setups
    load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    raise RuntimeError("MONGO_URI not found in .env (checked {})".format(env_path))

# Connect to MongoDB
client = AsyncIOMotorClient(
    MONGO_URI,
    tls=False,
    ssl=False
)


db = client["intellihire"]  # 👈 EXPLICIT DATABASE


# Collections
users = db["users"]
questions = db["questions"]
interviews = db["interviews"]
answers = db["answers"]
results = db["results"]
