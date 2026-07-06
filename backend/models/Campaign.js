const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema({
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  organizerWallet: { type: String, required: true, lowercase: true },
  title: { type: String, required: true, maxlength: 200 },
  description: { type: String, required: true, maxlength: 2000 },
  location: {
    lat: { type: Number },
    lng: { type: Number },
    address: { type: String },
    city: { type: String },
    state: { type: String },
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  maxVolunteers: { type: Number, default: 50 },
  volunteers: [{ type: String }],
  rewardPerVolunteer: { type: Number, default: 10 },
  status: {
    type: String,
    enum: ["PLANNED", "ACTIVE", "COMPLETED", "CANCELLED"],
    default: "PLANNED",
  },
  wasteCollectedKg: { type: Number, default: 0 },
  onChainCampaignId: { type: Number },
  txHash: { type: String },
  completedAt: { type: Date },
  imageHashes: [{ type: String }],
}, {
  timestamps: true,
});

campaignSchema.index({ status: 1, startDate: -1 });

module.exports = mongoose.model("Campaign", campaignSchema);
