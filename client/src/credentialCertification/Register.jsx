import React, { useState } from "react";
import { Link } from "react-router-dom"; // Make sure this matches your routing
import { IoIosArrowRoundBack } from "react-icons/io";
import HomeButton from "../Components/buttons/HomeButton";
import { useUserStore } from "../GlobalStore/useUserStore";
import "./register.css";

function Register() {
  // Form states
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState("");

  // Zustand store
  const { register, loading, error } = useUserStore();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");

    const result = await register(username, email, password);
    if (result) {
      setSuccess("Registration successful! You can now log in.");
      setUsername("");
      setEmail("");
      setPassword("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="register-form">
      <HomeButton />

      <h2>Register</h2>

      {/* Success / Error messages */}
      {success && <p style={{ color: "green" }}>{success}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Username input */}
      <div className="register-input-div">
        <label>Username (for profile):</label>
        <input
          type="text"
          placeholder="username"
          className="register-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      {/* Email input */}
      <div className="register-input-div">
        <label>Email:</label>
        <input
          type="email"
          placeholder="email@mail.com"
          className="register-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      {/* Password input */}
      <div className="register-input-div">
        <label>Password:</label>
        <input
          type="password"
          placeholder="xxxxxxxxxxx"
          className="register-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {/* Submit button */}
      <button type="submit" className="register-submit-btn" disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </button>

      {/* Login link */}
      <div>
        <p>
          If you are already registered{" "}
          <span>
            <Link to={"/login"}>click here</Link>
          </span>{" "}
          to log in
        </p>
      </div>
    </form>
  );
}

export default Register;
