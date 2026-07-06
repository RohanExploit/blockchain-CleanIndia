import React from "react";
import "./StatCard.css";

export default function StatCard({ icon, label, value, trend, trendUp }) {
  return (
    <div className="stat-card card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
        {trend && (
          <div className={`stat-trend ${trendUp ? "up" : "down"}`}>
            {trendUp ? "↑" : "↓"} {trend}
          </div>
        )}
      </div>
    </div>
  );
}
