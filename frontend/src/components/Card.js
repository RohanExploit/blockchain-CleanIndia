import React from "react";

export default function Card({ title, subtitle, children, className = "" }) {
  return (
    <div className={`card ${className}`}>
      {title && <h2 className="section-title" style={{ marginBottom: "0.25rem" }}>{title}</h2>}
      {subtitle && <p style={{ color: "var(--text-secondary)", marginBottom: "1rem", fontSize: "0.9rem" }}>{subtitle}</p>}
      {children}
    </div>
  );
}
