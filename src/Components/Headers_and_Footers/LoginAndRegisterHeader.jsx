import React from "react";

import useAuthStore from "../../GlobalStore/useAuthStore";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";

import LoginRegisterBtns from "../buttons/LoginRegisterBtns";
import "./login-and-register-header.css";

export default function LoginAndRegisterHeader() {
  const user = useAuthStore((state) => state.user);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const logoutUser = useAuthStore((state) => state.logoutUser);

  const handleLogoutClick = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  console.log(user);

  return (
    <div className="login-and-register-header-div">
      {!isLoggedIn && <LoginRegisterBtns />}
      {isLoggedIn && (
        <>
          <span>Welcome, {user.username || user.email}!</span>
          <button onClick={handleLogoutClick} className="login-and-register-header-logout-btn">
            Logout
          </button>
        </>
      )}
    </div>
  );
}
