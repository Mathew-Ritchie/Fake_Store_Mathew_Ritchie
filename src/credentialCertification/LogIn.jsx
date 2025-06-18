import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import "./login.css";
import { IoIosArrowRoundBack } from "react-icons/io";
import useAuthStore from "../GlobalStore/useAuthStore";

function Login() {
  // State for input fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // local state to display error message to the login form
  const [localError, setLocalError] = useState("");

  //Hook to navigate user after successful login
  const navigate = useNavigate();

  //Access authentication-related actions from global store
  const loginUser = useAuthStore((state) => state.loginUser);

  const authLoading = useAuthStore((state) => state.authLoading);
  //const authLoading = useGlobalStore((state) => state.authLoading);
  const authError = useAuthStore((state) => state.authError);

  // handles form submission for login. accepts the form event as a parameter.
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    try {
      await loginUser(email, password);
      navigate("/");
    } catch (err) {
      setLocalError(authError || "An unexpected error occurred during login.");
      console.error("Login attempt failed:", err);
    }
  };

  return (
    <form onSubmit={handleLoginSubmit} className="login-form-wrapper">
      <Link to={"/"} className="product-page-header-link">
        <IoIosArrowRoundBack className="back-arrow" />
      </Link>
      <h2 className="login-form-title">Login</h2>
      {localError && <p style={{ color: "red" }}>{error}</p>}
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
      <button type="submit" className="login-submit-btn">
        {authLoading ? "Logging in..." : "Login"}
      </button>
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
