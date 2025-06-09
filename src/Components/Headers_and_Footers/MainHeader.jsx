import React from "react";
import { Outlet } from "react-router";
import "./main-header.css";

export default function MainHeader() {
  return (
    <div className="main-header-div">
      <div className="main-header-title-div">
        <h1 className="main-header-title">MY-FAKE-STORE.COM</h1>
      </div>

      <Outlet />
    </div>
  );
}
