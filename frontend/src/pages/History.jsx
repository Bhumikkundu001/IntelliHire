import { useEffect, useState } from "react";
import api from "../api/api";

function History({ onBack }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/interview/history")
      .then((res) => {
        setHistory(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="app-container">
        <div className="card center">Loading history...</div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="card">
        <div className="flex">
          <h2>Interview History</h2>
          <button onClick={onBack}>Back</button>
        </div>

        {history.length === 0 && (
          <p>No interviews taken yet.</p>
        )}

        {history.map((item, i) => (
          <div
            key={i}
            style={{
              marginTop: "20px",
              padding: "15px",
              border: "1px solid #ddd",
              borderRadius: "10px",
              background: "#fafafa",
            }}
          >
            <p>
              <strong>Date:</strong>{" "}
              {new Date(item.created_at).toLocaleString()}
            </p>

            <p>
              <strong>Total Questions:</strong>{" "}
              {item.summary.total_questions}
            </p>

            <p>
              <strong>Answers Evaluated:</strong>{" "}
              {item.summary.answers_scored}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {item.summary.status}
            </p>

            <p>
              <strong>Average Score:</strong>{" "}
              {Math.round(
                item.summary.scores.reduce(
                  (a, s) => a + (s.score.overall_score || 0),
                  0
                ) / item.summary.scores.length
              )}/10
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default History;
