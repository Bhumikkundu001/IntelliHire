import { useEffect, useState } from "react";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Interview from "./pages/Interview";
import Result from "./pages/Result";
import History from "./pages/History";
import { setAuthToken } from "./api/api";

function App() {
  const [stage, setStage] = useState("welcome");
  const [result, setResult] = useState(null);

  // Always start clean unless Remember Me is used
  useEffect(() => {
    const remember = localStorage.getItem("remember_me");
    if (!remember) {
      localStorage.removeItem("token");
    } else {
      const token = localStorage.getItem("token");
      if (token) {
        setAuthToken(token);
      }
    }
  }, []);

  if (stage === "welcome") {
    return (
      <Welcome
        onLogin={() => setStage("login")}
        onRegister={() => setStage("register")}
      />
    );
  }

  if (stage === "register") {
    return (
      <Register
        onSuccess={() => setStage("login")}
        onBack={() => setStage("welcome")}
      />
    );
  }

  if (stage === "login") {
    return (
      <Login
        onSuccess={() => setStage("interview")}
        onBack={() => setStage("welcome")}
      />
    );
  }

  if (stage === "interview") {
    return (
      <Interview
        onFinish={(res) => {
          setResult(res);
          setStage("result");
        }}
        onHistory={() => setStage("history")}
      />
    );
  }

  if (stage === "result") {
    return (
      <Result
        data={result}
        onBack={() => setStage("history")}
      />
    );
  }

  if (stage === "history") {
    return <History onBack={() => setStage("interview")} />;
  }

  return null;
}

export default App;
