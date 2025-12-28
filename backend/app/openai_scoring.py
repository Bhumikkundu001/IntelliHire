# backend/app/openai_scoring.py
import random
import json

def score_answer(question: str, answer: str) -> str:
    """
    Mock AI scoring function.
    Returns a structured JSON string similar to an LLM response.
    """

    if not answer or len(answer.strip()) == 0:
        score = {
            "clarity": 2,
            "technical_depth": 1,
            "confidence": 2,
            "overall_score": 2,
            "feedback": "Answer was too short or unclear. Try explaining concepts with examples."
        }
    else:
        score = {
            "clarity": random.randint(6, 9),
            "technical_depth": random.randint(5, 9),
            "confidence": random.randint(6, 9),
            "overall_score": random.randint(6, 9),
            "feedback": "Good answer. Shows understanding of the t opic. Can improve with more real-world examples."
        }

    return json.dumps(score)
