import React from "react";

import useGlobalStore from "../../GlobalStore/useGlobalStore";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";

import LoginRegisterBtns from "../buttons/LoginRegisterBtns";
import "./login-and-register-header.css";

export default function LoginAndRegisterHeader() {
  const user = useGlobalStore((state) => state.user);
  const isLoggedIn = useGlobalStore((state) => state.isLoggedIn);
  const logoutUser = useGlobalStore((state) => state.logoutUser);

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
          <button onClick={handleLogoutClick}>Logout</button>
        </>
      )}
    </div>
  );
}
