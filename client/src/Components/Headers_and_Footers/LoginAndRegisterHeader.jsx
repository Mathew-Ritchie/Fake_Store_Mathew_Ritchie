import React from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../GlobalStore/useUserStore"; // ✅ make sure this path matches your project
import LoginRegisterBtns from "../buttons/LoginRegisterBtns";

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
    <div className="login-and-register-header-div flex relative justify-between items-center gap-2.5 h-8 z-10 p-2.5 w-full bg-gray-700">
      {!isLoggedIn && <LoginRegisterBtns />}
      {isLoggedIn && (
        <>
          <span className="text-white">Welcome, {user?.username || user?.email}!</span>
          <button
            onClick={handleLogoutClick}
            className="login-and-register-header-logout-btn text-white"
          >
            Logout
          </button>
        </>
      )}
    </div>
  );
}
