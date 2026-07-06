import React from "react";
import "./Profile.css";

export default function Profile() {
  const profile = {
    username: "Rohan Gaikwad",
    wallet: "0x71C...9B2a",
    tier: "Diamond",
    score: 2840,
    balance: "1,450 CIT",
    achievements: [
      { name: "Pull Shark", desc: "Contributed 100+ merged PRs to the ecosystem.", icon: "🦈" },
      { name: "Pair Extraordinaire", desc: "Collaborated on verified smart contract updates.", icon: "👫" },
      { name: "Community Leader", desc: "Organized 5+ clean drives.", icon: "👑" },
      { name: "Quickdraw", desc: "Validated a report within 5 minutes.", icon: "⚡" },
    ]
  };

  return (
    <div className="profile-page">
      <div className="profile-header card">
        <div className="profile-avatar">👤</div>
        <div className="profile-info">
          <h1>{profile.username}</h1>
          <p className="profile-wallet">{profile.wallet}</p>
          <span className="badge badge-success mt-2">{profile.tier} Contributor</span>
        </div>
        <div className="profile-stats">
          <div>
            <div className="stat-value">{profile.score}</div>
            <div className="stat-label">Reputation Score</div>
          </div>
          <div>
            <div className="stat-value">{profile.balance}</div>
            <div className="stat-label">CIT Balance</div>
          </div>
        </div>
      </div>

      <div className="achievements-section mt-4">
        <h2 className="section-title">Verified Achievements</h2>
        <div className="grid grid-2">
          {profile.achievements.map((ach, idx) => (
            <div key={idx} className="achievement-card card">
              <div className="achievement-icon">{ach.icon}</div>
              <div className="achievement-details">
                <h3>{ach.name}</h3>
                <p>{ach.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
