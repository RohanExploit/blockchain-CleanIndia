import React, { useState, useEffect } from "react";
import "./Campaigns.css";

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setCampaigns([
        {
          id: 1,
          title: "Yamuna Bank Clean Drive",
          description: "Community driven garbage pickup drive along the Yamuna banks.",
          location: "Yamuna Ghat, Delhi",
          date: "2026-07-12",
          volunteersCount: 24,
          maxVolunteers: 50,
          reward: "50 CIT",
        },
        {
          id: 2,
          title: "Beach Cleanup Drive Powai",
          description: "Volunteers gathering to collect solid plastic waste from shores.",
          location: "Powai Lake, Mumbai",
          date: "2026-07-18",
          volunteersCount: 42,
          maxVolunteers: 50,
          reward: "50 CIT",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleRegister = (id) => {
    setCampaigns(campaigns.map(c => c.id === id ? { ...c, volunteersCount: c.volunteersCount + 1 } : c));
  };

  if (loading) return <div className="loading-spinner"></div>;

  return (
    <div className="campaigns-page">
      <h1 className="section-title">Cleanup Campaigns</h1>
      <div className="campaigns-grid">
        {campaigns.map((camp) => (
          <div key={camp.id} className="campaign-card card">
            <h2>{camp.title}</h2>
            <p className="camp-desc">{camp.description}</p>
            <div className="camp-meta">
              <p>📍 {camp.location}</p>
              <p>📅 {camp.date}</p>
              <p>👥 {camp.volunteersCount}/{camp.maxVolunteers} Volunteers</p>
              <p className="reward-tag">💰 Reward: {camp.reward}</p>
            </div>
            {camp.volunteersCount < camp.maxVolunteers && (
              <button onClick={() => handleRegister(camp.id)} className="btn btn-primary mt-3">
                Register as Volunteer
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
