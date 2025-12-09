import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // ✅ Correct import for React Router v6+
import HomeButton from "../Components/buttons/GoBackBtn";
import { useUserStore } from "../GlobalStore/useUserStore"; // ✅ use your Zustand user store

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
    <div className="w-full">
      <div className="flex w-full justify-start items-center">
        <HomeButton />
      </div>
      <form
        onSubmit={handleLoginSubmit}
        className="login-form-wrapper w-full flex flex-col justify-start items-center bg-gray-100 p-8 text-gray-800 h-screen"
      >
        <h2 className="login-form-title mt-0 text-3xl mb-5">Login</h2>

        {/* ✅ Show error messages */}
        {localError && <p style={{ color: "red" }}>{localError}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* Email input */}
        <div className="login-input-divs flex flex-col gap-1 mb-5">
          <label>Email:</label>
          <input
            className="login-input border border-gray-400 shadow-lg text-sm p-2.5 w-[300px] h-[30px] rounded-sm"
            type="email"
            placeholder="email@mail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password input */}
        <div className="login-input-divs flex flex-col gap-1 mb-5">
          <label>Password:</label>
          <input
            className="login-input border border-gray-400 shadow-lg text-sm p-2.5 w-[300px] h-[30px] rounded-sm"
            type="password"
            placeholder="xxxxxxxxxxx"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Submit button */}
        <button type="submit" className="button-style-1 my-10" disabled={loading}>
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
    </div>
  );
}

export default Login;
