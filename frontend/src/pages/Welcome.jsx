function Welcome({ onLogin, onRegister }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          padding: "40px 50px",
          borderRadius: "16px",
          textAlign: "center",
          boxShadow: "0 25px 50px rgba(0,0,0,0.2)",
          width: "100%",
          maxWidth: "420px",
          animation: "fadeIn 0.4s ease",
        }}
      >
        <h1
          style={{
            marginBottom: "10px",
            color: "#0f2027",
          }}
        >
          IntelliHire
        </h1>

        <p
          style={{
            marginBottom: "30px",
            color: "#555",
            fontSize: "15px",
          }}
        >
          AI-powered interview practice platform
        </p>

        <button
          onClick={onLogin}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "10px",
            border: "none",
            background: "#2c5364",
            color: "#fff",
            fontSize: "15px",
            cursor: "pointer",
            marginBottom: "15px",
            transition: "all 0.2s ease",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.background = "#203a43")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.background = "#2c5364")
          }
        >
          Login
        </button>

        <button
          onClick={onRegister}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #2c5364",
            background: "#ffffff",
            color: "#2c5364",
            fontSize: "15px",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "#f0f4f6";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "#ffffff";
          }}
        >
          Register
        </button>
      </div>

      {/* Animation */}
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}

export default Welcome;
