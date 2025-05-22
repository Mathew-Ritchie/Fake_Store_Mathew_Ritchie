import React from "react";
import { Outlet } from "react-router";

export default function MainHeader() {
  return (
    <div>
      <h1>FAKE-A-LOT.COM</h1>
      <Outlet />
    </div>
  );
}
