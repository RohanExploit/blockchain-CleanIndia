import React from "react";

export default function Header({ title, description, className = "" }) {
  return (
    <div className={`dashboard-header ${className}`} style={{ marginBottom: "2rem" }}>
      <h1 className="section-title">{title}</h1>
      {description && <p className="subtitle">{description}</p>}
    </div>
  );
}
