import React from "react";

export default function Badge({ text, type = "info", className = "" }) {
  return (
    <span className={`badge badge-${type} ${className}`}>
      {text}
    </span>
  );
}
