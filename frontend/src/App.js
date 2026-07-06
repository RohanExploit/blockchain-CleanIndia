import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import ReportWaste from "./pages/ReportWaste";
import Reports from "./pages/Reports";
import Campaigns from "./pages/Campaigns";
import Marketplace from "./pages/Marketplace";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import Analytics from "./pages/Analytics";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/report" element={<ReportWaste />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile/:address?" element={<Profile />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
