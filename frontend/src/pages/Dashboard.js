import React, { useState, useEffect } from "react";
import StatCard from "../components/StatCard";
import { Link } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalReports: 0,
    resolvedReports: 0,
    activeCampaigns: 0,
    rewardPool: "0 CIT",
  });

  useEffect(() => {
    // Simulated data fetch
    setStats({
      totalReports: 1248,
      resolvedReports: 942,
      activeCampaigns: 14,
      rewardPool: "45,280 CIT",
    });
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="section-title">Clean India Dashboard</h1>
        <p className="subtitle">Real-time environmental statistics powered by blockchain consensus.</p>
      </div>

      <div className="grid grid-4 stat-grid">
        <StatCard icon="📋" label="Total Waste Reports" value={stats.totalReports} trend="12% vs last week" trendUp={true} />
        <StatCard icon="✅" label="Resolved Issues" value={stats.resolvedReports} trend="94% resolution rate" trendUp={true} />
        <StatCard icon="🏕️" label="Active Campaigns" value={stats.activeCampaigns} trend="3 starting today" trendUp={true} />
        <StatCard icon="🪙" label="Rewards Distributed" value={stats.rewardPool} trend="5,000 CIT minted today" trendUp={true} />
      </div>

      <div className="dashboard-actions card">
        <h2>Participate in Swachh Bharat Web3</h2>
        <p>Report littering, join local cleanup campaigns, and earn Clean India Tokens.</p>
        <div className="action-buttons">
          <Link to="/report" className="btn btn-primary">Report Littering</Link>
          <Link to="/campaigns" className="btn btn-secondary">Join Cleanup Campaign</Link>
        </div>
      </div>
    </div>
  );
}
