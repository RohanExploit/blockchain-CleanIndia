const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  walletAddress: { type: String, required: true, lowercase: true, index: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
  },
  locationHash: { type: String },
  imageHash: { type: String },
  description: { type: String, required: true, maxlength: 1000 },
  wasteType: {
    type: String,
    enum: ["PLASTIC", "ORGANIC", "EWASTE", "HAZARDOUS", "CONSTRUCTION", "MIXED", "TEXTILE", "GLASS", "METAL", "PAPER"],
    required: true,
    index: true,
  },
  severity: {
    type: String,
    enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
    default: "MEDIUM",
    index: true,
  },
  status: {
    type: String,
    enum: ["SUBMITTED", "VALIDATED", "IN_PROGRESS", "RESOLVED", "REJECTED"],
    default: "SUBMITTED",
    index: true,
  },
  validators: [{ type: String }],
  validationCount: { type: Number, default: 0 },
  onChainReportId: { type: Number },
  txHash: { type: String },
  rewardAmount: { type: Number, default: 0 },
  rewardClaimed: { type: Boolean, default: false },
  resolvedBy: { type: String },
  resolvedAt: { type: Date },
  resolutionNotes: { type: String },
  resolutionImageHash: { type: String },
}, {
  timestamps: true,
});

reportSchema.index({ "location.lat": 1, "location.lng": 1 });
reportSchema.index({ createdAt: -1 });
reportSchema.index({ status: 1, wasteType: 1 });

module.exports = mongoose.model("Report", reportSchema);
