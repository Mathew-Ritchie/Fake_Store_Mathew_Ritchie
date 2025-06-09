import React from "react";
import { NavLink } from "react-router";
import "./login-register-btns.css";

export default function LoginRegisterBtns() {
  return (
    <div className="login-register-btn-div">
      <NavLink to={"/register"} className="register-btn">
        Register
      </NavLink>
      <p>/</p>
      <NavLink to={"/login"} className="login-btn">
        Login
      </NavLink>
    </div>
  );
}
