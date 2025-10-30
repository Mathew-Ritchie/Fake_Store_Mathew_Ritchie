import React from "react";

export default function ClearAllButton({ onClick, message }) {
  return (
    <button
      onClick={onClick}
      className="clear-btn button-style-1 bg-red-800 hover:bg-red-900 transition text-white px-4 py-2 rounded-md"
    >
      {message}
    </button>
  );
}
