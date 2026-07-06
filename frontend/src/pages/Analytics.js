import React from "react";
import "./Analytics.css";

export default function Analytics() {
  return (
    <div className="analytics-page">
      <h1 className="section-title">CleanIndia Analytics</h1>
      <p className="subtitle">Environmental impact metrics and waste management transparency dashboard.</p>
      
      <div className="grid grid-3 mt-4">
        <div className="chart-card card">
          <h3>Waste Type Distribution</h3>
          <div className="fake-chart">
            <div className="bar plastic" style={{ height: "80%" }}><span>Plastic (42%)</span></div>
            <div className="bar organic" style={{ height: "50%" }}><span>Organic (25%)</span></div>
            <div className="bar ewaste" style={{ height: "30%" }}><span>E-Waste (15%)</span></div>
          </div>
        </div>

        <div className="chart-card card">
          <h3>Collection Activity (Monthly)</h3>
          <div className="fake-chart line-chart">
            <div className="point" style={{ bottom: "20%", left: "10%" }}></div>
            <div className="point" style={{ bottom: "40%", left: "30%" }}></div>
            <div className="point" style={{ bottom: "55%", left: "50%" }}></div>
            <div className="point" style={{ bottom: "85%", left: "80%" }}></div>
            <div className="line-connector"></div>
          </div>
        </div>

        <div className="chart-card card">
          <h3>Environmental Impact</h3>
          <div className="impact-list">
            <div className="impact-item">
              <span className="impact-val">4.2 Tons</span>
              <span className="impact-lbl">Plastic diverted from landfills</span>
            </div>
            <div className="impact-item">
              <span className="impact-val">12.8 Tons</span>
              <span className="impact-lbl">CO2 emissions avoided</span>
            </div>
            <div className="impact-item">
              <span className="impact-val">184 Trees</span>
              <span className="impact-lbl">Equivalent planting impact</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
