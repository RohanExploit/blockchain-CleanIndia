import React, { useState } from "react";
import "./ReportWaste.css";

export default function ReportWaste() {
  const [formData, setFormData] = useState({
    description: "",
    wasteType: "PLASTIC",
    severity: "MEDIUM",
    address: "",
  });
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      alert("Report submitted successfully to IPFS & Blockchain!");
      setIsSubmitting(false);
      setFormData({ description: "", wasteType: "PLASTIC", severity: "MEDIUM", address: "" });
      setImage(null);
    }, 2000);
  };

  return (
    <div className="report-container">
      <h1 className="section-title">Report Waste Incident</h1>
      <form onSubmit={handleSubmit} className="report-form card">
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe the type of waste, size, and details..."
            required
          />
        </div>

        <div className="grid grid-2">
          <div className="form-group">
            <label htmlFor="wasteType">Waste Type</label>
            <select id="wasteType" name="wasteType" value={formData.wasteType} onChange={handleInputChange}>
              <option value="PLASTIC">Plastic</option>
              <option value="ORGANIC">Organic</option>
              <option value="EWASTE">E-Waste</option>
              <option value="HAZARDOUS">Hazardous</option>
              <option value="CONSTRUCTION">Construction</option>
              <option value="MIXED">Mixed</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="severity">Severity</label>
            <select id="severity" name="severity" value={formData.severity} onChange={handleInputChange}>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="address">Location Address / Landmark</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Enter location address..."
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Upload Evidence Image</label>
          <input type="file" id="image" accept="image/*" onChange={handleImageChange} required />
          {image && <img src={image} alt="Preview" className="image-preview" />}
        </div>

        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Submitting to Blockchain..." : "Submit Report"}
        </button>
      </form>
    </div>
  );
}
