import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-section">
            <h3>♻️ CleanIndia Web3</h3>
            <p>Decentralized waste management platform powered by blockchain technology for a cleaner India.</p>
          </div>
          <div className="footer-section">
            <h4>Platform</h4>
            <ul>
              <li><a href="/report">Report Waste</a></li>
              <li><a href="/campaigns">Campaigns</a></li>
              <li><a href="/marketplace">Marketplace</a></li>
              <li><a href="/analytics">Analytics</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Resources</h4>
            <ul>
              <li><a href="/docs">Documentation</a></li>
              <li><a href="https://github.com/fy23-ssvhankade-star/blockchain-CleanIndia">GitHub</a></li>
              <li><a href="/docs/api">API Reference</a></li>
              <li><a href="/docs/smart-contracts">Smart Contracts</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Community</h4>
            <ul>
              <li><a href="/leaderboard">Leaderboard</a></li>
              <li><a href="/governance">Governance</a></li>
              <li><a href="/staking">Staking</a></li>
              <li><a href="/nft-badges">NFT Badges</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 CleanIndia DAO. Licensed under AGPL-3.0.</p>
          <p>Built with ❤️ for Swachh Bharat</p>
        </div>
      </div>
    </footer>
  );
}
