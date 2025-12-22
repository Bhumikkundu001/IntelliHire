import { useEffect, useState } from "react";
import api, { setAuthToken } from "../api/api";

function Login({ onSuccess, onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  // Clear token on load if remember me was not checked
  useEffect(() => {
    const remember = localStorage.getItem("remember_me");
    if (!remember) {
      localStorage.removeItem("token");
    }
  }, []);

  const login = async () => {
    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const token = res.data.access_token;
      localStorage.setItem("token", token);
      setAuthToken(token);

      if (rememberMe) {
        localStorage.setItem("remember_me", "true");
      } else {
        localStorage.removeItem("remember_me");
      }

      onSuccess();
    } catch {
      setError("Invalid email or password");
    }
  };

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
          width: "100%",
          maxWidth: "420px",
          boxShadow: "0 25px 50px rgba(0,0,0,0.2)",
          animation: "fadeIn 0.4s ease",
        }}
      >
        <h2 style={{ textAlign: "center", color: "#0f2027" }}>
          Login
        </h2>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        {/* Password with eye icon */}
        <div style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ ...inputStyle, paddingRight: "45px" }}
          />

          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              fontSize: "14px",
              color: "#2c5364",
              userSelect: "none",
            }}
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        {/* Remember me */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "10px",
            gap: "8px",
            fontSize: "14px",
            color: "#333",
          }}
        >
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <span>Remember me</span>
        </div>

        <button onClick={login} style={primaryButton}>
          Login
        </button>

        {/* Back button */}
        <button
          onClick={onBack}
          style={{
            ...primaryButton,
            marginTop: "10px",
            background: "#ffffff",
            color: "#2c5364",
            border: "1px solid #2c5364",
          }}
        >
          Back
        </button>

        {error && (
          <p style={{ color: "crimson", marginTop: "10px" }}>
            {error}
          </p>
        )}
      </div>

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

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "15px",
  borderRadius: "10px",
  border: "1px solid #ccc",
  fontSize: "14px",
};

const primaryButton = {
  width: "100%",
  marginTop: "20px",
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  background: "#2c5364",
  color: "#ffffff",
  fontSize: "15px",
  cursor: "pointer",
};

export default Login;
