import React from "react";
import { NavLink } from "react-router";
// import "./login-register-btns.css";

export default function LoginRegisterBtns() {
  return (
    <div className="login-register-btn-div flex items-center justify-end gap-1 w-full">
      <NavLink to={"/register"} className="register-btn w-10 no-underline text-white mr-5  ">
        Register
      </NavLink>
      <p className="text-white">/</p>
      <NavLink to={"/login"} className="login-btn w-10 no-underline text-white mr-5">
        Login
      </NavLink>
    </div>
  );
}
