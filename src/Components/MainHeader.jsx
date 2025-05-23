import React from "react";
import { Outlet } from "react-router";
import "./main-header.css";

export default function MainHeader() {
  return (
    <div className="main-header-div">
      <h1 className="main-header-title">FAKE-A-LOT.COM</h1>
      <Outlet />
    </div>
  );
}
