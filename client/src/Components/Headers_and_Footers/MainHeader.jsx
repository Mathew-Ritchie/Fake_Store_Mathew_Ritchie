import React from "react";
import { Outlet } from "react-router";

import LoginAndRegisterHeader from "./LoginAndRegisterHeader";
import MainFooter from "./MainFooter";

export default function MainHeader() {
  return (
    <div className="main-header-div relative z-10 flex flex-col justify-center items-center">
      <div className="main-header-title-div bg-gray-800 w-full text-center relative z-10">
        <h1 className="main-header-title">MY-FAKE-STORE.COM</h1>
      </div>
    </div>
  );
}
