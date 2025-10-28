import React, { useState } from "react";
import { Link } from "react-router-dom"; // Make sure this matches your routing
import { IoIosArrowRoundBack } from "react-icons/io";
import HomeButton from "../Components/buttons/HomeButton";
import { useUserStore } from "../GlobalStore/useUserStore";

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
    <form
      onSubmit={handleSubmit}
      className="register-form flex flex-col justify-start items-center bg-gray-100 p-5 text-gray-800 w-full h-screen"
    >
      <div className="flex w-full justify-start items-center">
        <HomeButton />
      </div>

      <h2 className="login-form-title mt-0 text-3xl mb-5">Register</h2>

      {/* Success / Error messages */}
      {success && <p style={{ color: "green" }}>{success}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Username input */}
      <div className="register-input-div  flex flex-col g-1 mb-5">
        <label>Username (for profile):</label>
        <input
          type="text"
          placeholder="username"
          className="register-input  border border-gray-400 shadow-lg text-sm p-2.5 w-[300px] h-[30px] rounded-sm"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      {/* Email input */}
      <div className="register-input-div  flex flex-col g-1 mb-5">
        <label>Email:</label>
        <input
          type="email"
          placeholder="email@mail.com"
          className="register-input  border border-gray-400 shadow-lg text-sm p-2.5 w-[300px] h-[30px] rounded-sm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      {/* Password input */}
      <div className="register-input-div flex flex-col g-1 mb-5">
        <label>Password:</label>
        <input
          type="password"
          placeholder="xxxxxxxxxxx"
          className="register-input  border border-gray-400 shadow-lg text-sm p-2.5 w-[300px] h-[30px] rounded-sm"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {/* Submit button */}
      <button type="submit" className="button-style-1 my-10" disabled={loading}>
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
