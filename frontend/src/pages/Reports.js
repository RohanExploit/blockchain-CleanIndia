import React, { useState, useEffect } from "react";
import "./Reports.css";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated fetch
    setTimeout(() => {
      setReports([
        {
          id: 1,
          description: "Massive plastic dump near municipal park gate.",
          wasteType: "PLASTIC",
          severity: "HIGH",
          status: "SUBMITTED",
          address: "Sector 15, Park Side Rd, Noida",
          validatorsCount: 1,
        },
        {
          id: 2,
          description: "E-waste and toxic batteries found near water body.",
          wasteType: "EWASTE",
          severity: "CRITICAL",
          status: "VALIDATED",
          address: "Powai Lake Walkway, Mumbai",
          validatorsCount: 3,
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleValidate = (id) => {
    setReports(reports.map(r => r.id === id ? { ...r, validatorsCount: r.validatorsCount + 1 } : r));
  };

  if (loading) return <div className="loading-spinner"></div>;

  return (
    <div className="reports-page">
      <h1 className="section-title">Waste Reports</h1>
      <div className="reports-list">
        {reports.map((report) => (
          <div key={report.id} className="report-card card">
            <div className="report-header">
              <span className={`badge badge-${report.severity.toLowerCase() === "critical" ? "error" : "warning"}`}>
                {report.severity}
              </span>
              <span className="badge badge-info">{report.wasteType}</span>
            </div>
            <p className="report-desc">{report.description}</p>
            <div className="report-details">
              <p>📍 {report.address}</p>
              <p>✓ {report.validatorsCount}/3 Validations</p>
            </div>
            {report.validatorsCount < 3 && (
              <button onClick={() => handleValidate(report.id)} className="btn btn-secondary btn-sm mt-3">
                Validate Report
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
