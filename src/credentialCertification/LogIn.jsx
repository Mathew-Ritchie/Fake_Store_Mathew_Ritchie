import React, { useState } from "react";
import { auth } from "../firebase"; // Import your initialized Firebase auth
import { signInWithEmailAndPassword } from "firebase/auth";
import "./login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      setSuccess(`Logged in as: ${user.email}`);
      // Redirect user, update global state, etc.
    } catch (err) {
      console.error("Login error:", err.message);
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleLogin} className="login-form-wrapper">
      <h2 className="login-form-title">Login</h2>
      {success && <p style={{ color: "green" }}>{success}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
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
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
