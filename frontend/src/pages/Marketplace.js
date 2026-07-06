import React, { useState } from "react";
import "./Marketplace.css";

export default function Marketplace() {
  const [listings] = useState([
    {
      id: 1,
      title: "Clean PET Plastic Bottles Batch",
      seller: "0x71C...9B2a",
      quantity: "250 Kg",
      price: "15 CIT / Kg",
      cert: "Verified A Grade",
    },
    {
      id: 2,
      title: "Mixed Cardboard & Paper Pulp",
      seller: "0x89D...E24b",
      quantity: "500 Kg",
      price: "8 CIT / Kg",
      cert: "Verified Recyclable",
    },
  ]);

  return (
    <div className="marketplace-page">
      <h1 className="section-title">Waste Marketplace</h1>
      <p className="subtitle">Buy and sell verified recyclable waste for commercial processing.</p>
      <div className="listings-grid grid grid-2 mt-4">
        {listings.map((list) => (
          <div key={list.id} className="listing-card card">
            <h3>{list.title}</h3>
            <div className="list-details">
              <p>👤 Seller: {list.seller}</p>
              <p>⚖️ Quantity: {list.quantity}</p>
              <p>📜 Quality Certificate: <span className="badge badge-success">{list.cert}</span></p>
              <p className="price">🏷️ Price: {list.price}</p>
            </div>
            <button className="btn btn-primary mt-3 w-100">Purchase Batch</button>
          </div>
        ))}
      </div>
    </div>
  );
}
