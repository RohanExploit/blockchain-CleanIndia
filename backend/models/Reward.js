const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema({
  walletAddress: { type: String, required: true, lowercase: true, index: true },
  amount: { type: Number, required: true },
  reason: {
    type: String,
    enum: ["REPORT", "VALIDATION", "CLEANUP", "CAMPAIGN", "STREAK_BONUS", "TIER_UPGRADE", "REFERRAL"],
    required: true,
  },
  referenceId: { type: String }, // report ID, campaign ID, etc.
  txHash: { type: String },
  claimed: { type: Boolean, default: false },
  claimedAt: { type: Date },
}, {
  timestamps: true,
});

rewardSchema.index({ walletAddress: 1, claimed: 1 });
rewardSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Reward", rewardSchema);
