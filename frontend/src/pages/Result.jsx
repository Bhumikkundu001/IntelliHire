function Result({ data }) {
  if (!data || !data.summary) {
    return (
      <div className="app-container">
        <div className="card center">
          <p>No result available.</p>
        </div>
      </div>
    );
  }

  const { summary } = data;

  return (
    <div className="app-container">
      <div className="card">
        <h2 className="center">Interview Results</h2>

        {/* Summary */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            marginTop: "20px",
            padding: "15px",
            background: "#f4f6f8",
            borderRadius: "10px",
          }}
        >
          <div>
            <strong>Total Questions</strong>
            <p>{summary.total_questions}</p>
          </div>
          <div>
            <strong>Answers Evaluated</strong>
            <p>{summary.answers_scored}</p>
          </div>
          <div>
            <strong>Status</strong>
            <p>{summary.status}</p>
          </div>
        </div>

        {/* Detailed Scores */}
        <h3 style={{ marginTop: "30px" }}>
          Detailed Evaluation
        </h3>

        {summary.scores.map((item, i) => (
          <div
            key={i}
            style={{
              marginTop: "20px",
              padding: "20px",
              border: "1px solid #e0e0e0",
              borderRadius: "10px",
              background: "#ffffff",
            }}
          >
            <h4>Question {i + 1}</h4>

            <p>
              <strong>Clarity:</strong>{" "}
              {item.score.clarity}/10
            </p>
            <p>
              <strong>Technical Depth:</strong>{" "}
              {item.score.technical_depth}/10
            </p>
            <p>
              <strong>Confidence:</strong>{" "}
              {item.score.confidence}/10
            </p>
            <p>
              <strong>Overall Score:</strong>{" "}
              {item.score.overall_score}/10
            </p>

            <p
              style={{
                marginTop: "10px",
                fontStyle: "italic",
                color: "#444",
              }}
            >
              {item.score.feedback}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Result;
