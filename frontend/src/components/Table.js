import React from "react";

export default function Table({ headers, data, renderRow, className = "" }) {
  return (
    <div className={`table-container card ${className}`} style={{ padding: 0, overflowX: "auto" }}>
      <table className="leaderboard-table" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>{data.map((item, idx) => renderRow(item, idx))}</tbody>
      </table>
    </div>
  );
}
