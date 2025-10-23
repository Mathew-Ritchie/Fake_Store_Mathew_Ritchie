import React from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../GlobalStore/useUserStore"; // ✅ make sure this path matches your project
import LoginRegisterBtns from "../buttons/LoginRegisterBtns";
import "./login-and-register-header.css";

export default function LoginAndRegisterHeader() {
  // ✅ Pull everything we need from Zustand
  const { user, token, logout } = useUserStore();
  const navigate = useNavigate();
  const isLoggedIn = Boolean(token && user);

  const handleLogoutClick = () => {
    try {
      logout();
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="login-and-register-header-div">
      {!isLoggedIn && <LoginRegisterBtns />}
      {isLoggedIn && (
        <>
          <span>Welcome, {user?.username || user?.email}!</span>
          <button onClick={handleLogoutClick} className="login-and-register-header-logout-btn">
            Logout
          </button>
        </>
      )}
    </div>
  );
}
