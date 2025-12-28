import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    raise RuntimeError("MONGO_URI is missing")

client = AsyncIOMotorClient(MONGO_URI)

db = client["intellihire"]

users = db["users"]
questions = db["questions"]
interviews = db["interviews"]
answers = db["answers"]
results = db["results"]
