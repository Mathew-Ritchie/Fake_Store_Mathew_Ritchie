import React, { useState } from "react";
import { Link } from "react-router";
import { auth, db } from "../firebase"; // Import your initialized Firebase auth and db
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; // For Firestore
import "./register.css";
import { IoIosArrowRoundBack } from "react-icons/io";

function Register() {
  // States for form submission inputs.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handles form submission for registration. takes the form event as a parametre.
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      // Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Store additional user info in Firestore using the user's UID
      await setDoc(doc(db, "users", user.uid), {
        username: username,
        email: email,
        createdAt: new Date(),
      });

      setSuccess("Registration successful! You can now log in.");
      setEmail("");
      setPassword("");
      setUsername("");
    } catch (err) {
      console.error("Registration error:", err.message);
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleRegister} className="register-form">
      <Link to={"/"} className="product-page-header-link">
        <IoIosArrowRoundBack className="back-arrow" />
      </Link>
      <h2>Register</h2>
      {success && <p style={{ color: "green" }}>{success}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
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
      <button type="submit" className="register-submit-btn">
        Register
      </button>
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
