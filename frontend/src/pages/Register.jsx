import { useState } from "react";
import api from "../api/api";

function Register({ onSuccess, onBack }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const register = async () => {
    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
      });

      alert("Registration successful. Please login.");
      onSuccess();
    } catch (err) {
      setError(
        err.response?.data?.detail || "Registration failed"
      );
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
          Register
        </h2>

        <input
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        <button onClick={register} style={primaryButton}>
          Register
        </button>

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

export default Register;
