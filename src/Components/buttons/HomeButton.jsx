import React from "react";
import { Link } from "react-router";
import { IoIosArrowRoundBack } from "react-icons/io";

export default function HomeButton() {
  const backButtonStyles = {
    display: "flex",
    justifyContent: "start",
    alignItems: "center",
    padding: "0px 10px",
    gap: "10px",
    textDecoration: "none",
    color: "#023e8a",
  };

  return (
    <Link to={"/"} className="home-button" style={backButtonStyles}>
      <IoIosArrowRoundBack className="back-arrow" />
      <h2>HOME</h2>
    </Link>
  );
}
