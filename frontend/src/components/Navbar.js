import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useWeb3 } from "../context/Web3Context";
import "./Navbar.css";

export default function Navbar() {
  const { account, isConnected, connectWallet, disconnectWallet, isConnecting } = useWeb3();
  const location = useLocation();

  const navLinks = [
    { path: "/", label: "Dashboard", icon: "📊" },
    { path: "/report", label: "Report", icon: "📝" },
    { path: "/reports", label: "Reports", icon: "📋" },
    { path: "/campaigns", label: "Campaigns", icon: "🏕️" },
    { path: "/marketplace", label: "Market", icon: "🏪" },
    { path: "/leaderboard", label: "Leaders", icon: "🏆" },
    { path: "/analytics", label: "Analytics", icon: "📈" },
  ];

  const shortenAddress = (addr) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">♻️</span>
          <span className="brand-text">CleanIndia</span>
          <span className="brand-badge">Web3</span>
        </Link>

        <div className="nav-links">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? "active" : ""}`}
            >
              <span className="nav-icon">{link.icon}</span>
              <span className="nav-label">{link.label}</span>
            </Link>
          ))}
        </div>

        <div className="nav-actions">
          {isConnected ? (
            <div className="wallet-info">
              <Link to={`/profile/${account}`} className="wallet-address">
                {shortenAddress(account)}
              </Link>
              <button onClick={disconnectWallet} className="btn btn-secondary btn-sm">
                Disconnect
              </button>
            </div>
          ) : (
            <button onClick={connectWallet} className="btn btn-primary" disabled={isConnecting}>
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
