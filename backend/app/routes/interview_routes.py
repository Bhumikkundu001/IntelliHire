from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from bson import ObjectId
from datetime import datetime
import random
import json

from app.db import questions, interviews, answers, results
from app.routes.auth_routes import get_current_user
from app.openai_scoring import score_answer

router = APIRouter()

# =========================
# REQUEST MODELS
# =========================

class InterviewStartIn(BaseModel):
    role: str
    difficulty: str = "medium"
    num_questions: int = 3


class AnswerIn(BaseModel):
    interview_id: str
    question_id: str
    s3_key: str
    transcript: str | None = None
    duration_seconds: int | None = None


class FinishInterviewIn(BaseModel):
    interview_id: str


# =========================
# START INTERVIEW
# =========================

@router.post("/start")
async def start_interview(
    payload: InterviewStartIn,
    user=Depends(get_current_user)
):
    cursor = questions.find({
        "role": payload.role,
        "difficulty": payload.difficulty
    })
    all_questions = await cursor.to_list(length=100)

    if not all_questions:
        raise HTTPException(
            status_code=404,
            detail="No questions found for this role and difficulty"
        )

    random.shuffle(all_questions)
    selected = all_questions[:payload.num_questions]

    interview_doc = {
        "user_id": user["id"],
        "role": payload.role,
        "difficulty": payload.difficulty,
        "question_ids": [str(q["_id"]) for q in selected],
        "status": "in_progress",
        "started_at": datetime.utcnow()
    }

    res = await interviews.insert_one(interview_doc)

    return {
        "interview_id": str(res.inserted_id),
        "questions": [
            {
                "id": str(q["_id"]),
                "text": q.get("text") or q.get("question", "")
            }
            for q in selected
        ]
    }


# =========================
# SUBMIT ANSWER
# =========================

@router.post("/answer")
async def submit_answer(
    payload: AnswerIn,
    user=Depends(get_current_user)
):
    try:
        iid = ObjectId(payload.interview_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid interview ID")

    interview = await interviews.find_one({"_id": iid})
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")

    if interview["user_id"] != user["id"]:
        raise HTTPException(status_code=403, detail="Not your interview")

    answer_doc = {
        "interview_id": payload.interview_id,
        "question_id": payload.question_id,
        "s3_key": payload.s3_key,
        "transcript": payload.transcript,
        "duration_seconds": payload.duration_seconds,
        "created_at": datetime.utcnow(),
    }

    res = await answers.insert_one(answer_doc)

    return {
        "answer_id": str(res.inserted_id),
        "message": "Answer saved successfully",
    }


# =========================
# FINISH INTERVIEW (FIXED)
# =========================

@router.post("/finish")
async def finish_interview(
    payload: FinishInterviewIn,
    user=Depends(get_current_user)
):
    try:
        iid = ObjectId(payload.interview_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid interview ID")

    interview = await interviews.find_one({"_id": iid})
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")

    if interview["user_id"] != user["id"]:
        raise HTTPException(status_code=403, detail="Not your interview")

    if interview.get("status") == "finished":
        raise HTTPException(status_code=400, detail="Interview already finished")

    ans_list = await answers.find(
        {"interview_id": payload.interview_id}
    ).to_list(length=200)

    question_map = {}
    for qid in interview["question_ids"]:
        qdoc = await questions.find_one({"_id": ObjectId(qid)})
        if qdoc:
            question_map[qid] = qdoc.get("text") or qdoc.get("question", "")

    scored_answers = []
    for ans in ans_list:
        qid = ans["question_id"]
        question_text = question_map.get(qid, "Unknown question")
        transcript = ans.get("transcript", "")

        raw_score = score_answer(question_text, transcript)

        try:
            score_data = json.loads(raw_score)
        except:
            score_data = {"error": "Invalid AI response"}

        scored_answers.append({
            "question_id": qid,
            "answer_id": str(ans["_id"]),
            "score": score_data,
        })

    summary = {
        "total_questions": len(interview["question_ids"]),
        "answers_scored": len(scored_answers),
        "scores": scored_answers,
        "status": "completed",
    }

    await interviews.update_one(
        {"_id": iid},
        {
            "$set": {
                "status": "finished",
                "finished_at": datetime.utcnow(),
                "summary": summary,
            }
        },
    )

    await results.insert_one({
        "interview_id": payload.interview_id,
        "user_id": user["id"],
        "summary": summary,
        "created_at": datetime.utcnow(),
    })

    return {
        "message": "Interview finished successfully",
        "summary": summary,
    }
# =========================
# INTERVIEW HISTORY 
@router.get("/history")
async def interview_history(user=Depends(get_current_user)):
    cursor = results.find(
        {"user_id": user["id"]}
    ).sort("created_at", -1)

    data = await cursor.to_list(length=50)

    return [
        {
            "interview_id": r["interview_id"],
            "created_at": r["created_at"],
            "summary": r["summary"],
        }
        for r in data
    ]
