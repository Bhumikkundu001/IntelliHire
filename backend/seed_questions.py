import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URI = "mongodb://127.0.0.1:27017"
DB_NAME = "intellihire"

async def seed():
    print("🔹 Connecting to MongoDB...")
    client = AsyncIOMotorClient(MONGO_URI)

    db = client[DB_NAME]
    questions = db["questions"]

    print("🔹 Inserting questions...")

    sample_questions = [
        {
            "role": "python",
            "difficulty": "easy",
            "text": "What is the difference between a list and a tuple in Python?"
        },
        {
            "role": "python",
            "difficulty": "easy",
            "text": "What is a dictionary in Python?"
        },
        {
            "role": "python",
            "difficulty": "medium",
            "text": "Explain decorators in Python."
        },
        {
            "role": "backend",
            "difficulty": "easy",
            "text": "Explain REST APIs and HTTP methods."
        },
        {
            "role": "backend",
            "difficulty": "medium",
            "text": "What is middleware in web frameworks?"
        }
    ]

    result = await questions.insert_many(sample_questions)
    print(f"✅ Inserted {len(result.inserted_ids)} questions")

    client.close()
    print("🔹 Done.")

if __name__ == "__main__":
    asyncio.run(seed())
