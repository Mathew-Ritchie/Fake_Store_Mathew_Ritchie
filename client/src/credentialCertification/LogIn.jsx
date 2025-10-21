import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // ✅ Correct import for React Router v6+
import { IoIosArrowRoundBack } from "react-icons/io";
import HomeButton from "../Components/buttons/HomeButton";
import { useUserStore } from "../GlobalStore/useUserStore"; // ✅ use your Zustand user store
import "./login.css";

function Login() {
  // Local form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const navigate = useNavigate();

  // ✅ Pull from Zustand store
  const { login, loading, error } = useUserStore();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    try {
      await login(email, password);
      navigate("/"); // ✅ redirect to homepage on success
    } catch (err) {
      setLocalError(error || "An unexpected error occurred during login.");
      console.error("Login attempt failed:", err);
    }
  };

  return (
    <form onSubmit={handleLoginSubmit} className="login-form-wrapper">
      <HomeButton />

      <h2 className="login-form-title">Login</h2>

      {/* ✅ Show error messages */}
      {localError && <p style={{ color: "red" }}>{localError}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Email input */}
      <div className="login-input-divs">
        <label>Email:</label>
        <input
          className="login-input"
          type="email"
          placeholder="email@mail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      {/* Password input */}
      <div className="login-input-divs">
        <label>Password:</label>
        <input
          className="login-input"
          type="password"
          placeholder="xxxxxxxxxxx"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {/* Submit button */}
      <button type="submit" className="login-submit-btn" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>

      {/* Link to Register */}
      <div>
        <p>
          If you are not yet registered{" "}
          <span>
            <Link to={"/register"}>click here</Link>
          </span>
        </p>
      </div>
    </form>
  );
}

export default Login;
