import { useState } from "react";

function Interview({ onFinish, onHistory }) {
  const [role, setRole] = useState("backend");
  const [difficulty, setDifficulty] = useState("medium");
  const [numQuestions, setNumQuestions] = useState(3);

  const [questions, setQuestions] = useState([]);
  const [interviewId, setInterviewId] = useState(null);
  const [answers, setAnswers] = useState({});
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("remember_me");
    window.location.reload();
  };

  const startInterview = async () => {
    setLoading(true);

    const res = await fetch("http://127.0.0.1:8000/api/interview/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        role,
        difficulty,
        num_questions: Number(numQuestions),
      }),
    });

    const data = await res.json();

    setInterviewId(data.interview_id);
    setQuestions(data.questions || []);
    setStarted(true);
    setLoading(false);
  };

  const submitAnswer = async (qid) => {
    await fetch("http://127.0.0.1:8000/api/interview/answer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        interview_id: interviewId,
        question_id: qid,
        s3_key: "text-answer",
        transcript: answers[qid],
      }),
    });
  };

  const finishInterview = async () => {
    for (const q of questions) {
      if (answers[q.id]) {
        await submitAnswer(q.id);
      }
    }

    const res = await fetch(
      "http://127.0.0.1:8000/api/interview/finish",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          interview_id: interviewId,
        }),
      }
    );

    const data = await res.json();
    onFinish(data);
  };

  /* ========================
     INTERVIEW SETUP
  ========================= */
  if (!started) {
    return (
      <div className="app-container">
        <div className="card">
          <div className="flex">
            <h2>Interview Setup</h2>
            <div>
              <button onClick={onHistory} style={{ marginRight: "10px" }}>
                History
              </button>
              <button onClick={logout}>Logout</button>
            </div>
          </div>

          <p>Configure your interview preferences</p>

          <label>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="backend">Backend</option>
            <option value="frontend">Frontend</option>
            <option value="fullstack">Full Stack</option>
          </select>

          <label>Difficulty</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <label>Number of Questions</label>
          <input
            type="number"
            min="1"
            max="10"
            value={numQuestions}
            onChange={(e) => setNumQuestions(e.target.value)}
          />

          <button onClick={startInterview} disabled={loading}>
            {loading ? "Starting..." : "Start Interview"}
          </button>
        </div>
      </div>
    );
  }

  /* ========================
     INTERVIEW QUESTIONS
  ========================= */
  return (
    <div className="app-container">
      <div className="card">
        <div className="flex">
          <h2>Interview in Progress</h2>
          <div>
            <button onClick={onHistory} style={{ marginRight: "10px" }}>
              History
            </button>
            <button onClick={logout}>Logout</button>
          </div>
        </div>

        {questions.map((q, i) => (
          <div
            key={q.id}
            style={{
              marginTop: "20px",
              padding: "20px",
              borderRadius: "10px",
              border: "1px solid #ddd",
              background: "#fafafa",
            }}
          >
            <p>
              <strong>Question {i + 1}</strong>
            </p>
            <p>{q.text}</p>

            <textarea
              rows="4"
              placeholder="Type your answer here..."
              value={answers[q.id] || ""}
              onChange={(e) =>
                setAnswers({ ...answers, [q.id]: e.target.value })
              }
            />

            <button
              onClick={() => submitAnswer(q.id)}
              style={{ marginTop: "10px" }}
            >
              Save Answer
            </button>
          </div>
        ))}

        <button
          onClick={finishInterview}
          style={{ marginTop: "25px" }}
        >
          Finish Interview
        </button>
      </div>
    </div>
  );
}

export default Interview;
