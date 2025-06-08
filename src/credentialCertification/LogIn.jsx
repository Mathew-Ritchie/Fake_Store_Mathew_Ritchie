import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import "./login.css";
import { IoIosArrowRoundBack } from "react-icons/io";
import useGlobalStore from "../GlobalStore/useGlobalStore";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const navigate = useNavigate();

  const loginUser = useGlobalStore((state) => state.loginUser);
  const authLoading = useGlobalStore((state) => state.authLoading);
  const authError = useGlobalStore((state) => state.authError);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    try {
      await loginUser(email, password);
      navigate("/");
    } catch (err) {
      setLocalError(authError || "An unexpected error occurred during login.");
    }
  };

  return (
    <form onSubmit={handleLogin} className="login-form-wrapper">
      <Link to={"/"} className="product-page-header-link">
        <IoIosArrowRoundBack className="back-arrow" />
      </Link>
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
      <button type="submit" className="login-btn">
        Login
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
