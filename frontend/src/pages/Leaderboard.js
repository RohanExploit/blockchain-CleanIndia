import React, { useState, useEffect } from "react";
import "./Leaderboard.css";

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    setLeaders([
      { rank: 1, name: "Rohan Gaikwad", address: "0x71C...9B2a", score: 2840, tier: "Diamond" },
      { rank: 2, name: "Sneha Hankade", address: "0x89D...E24b", score: 2410, tier: "Platinum" },
      { rank: 3, name: "Amit Sharma", address: "0x3F5...A19c", score: 1890, tier: "Gold" },
      { rank: 4, name: "Pooja Patel", address: "0x2A1...C32e", score: 1450, tier: "Gold" },
      { rank: 5, name: "Vikram Singh", address: "0x5E8...D76f", score: 980, tier: "Silver" },
    ]);
  }, []);

  return (
    <div className="leaderboard-page">
      <h1 className="section-title">Clean India Leaderboard</h1>
      <div className="leaderboard-container card">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Contributor</th>
              <th>Wallet</th>
              <th>Reputation Score</th>
              <th>Tier</th>
            </tr>
          </thead>
          <tbody>
            {leaders.map((user) => (
              <tr key={user.rank} className={user.rank <= 3 ? `top-${user.rank}` : ""}>
                <td>{user.rank === 1 ? "🥇" : user.rank === 2 ? "🥈" : user.rank === 3 ? "🥉" : user.rank}</td>
                <td className="user-name">{user.name}</td>
                <td className="user-addr">{user.address}</td>
                <td className="user-score">{user.score} pts</td>
                <td><span className={`badge badge-info`}>{user.tier}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
