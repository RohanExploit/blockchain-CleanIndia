const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true,
  },
  username: {
    type: String,
    unique: true,
    sparse: true,
    minlength: 3,
    maxlength: 32,
  },
  nonce: { type: String, required: true },
  bio: { type: String, maxlength: 500 },
  avatar: { type: String },
  city: { type: String },
  state: { type: String },
  kycStatus: {
    type: String,
    enum: ["UNVERIFIED", "PENDING", "VERIFIED", "REJECTED"],
    default: "UNVERIFIED",
  },
  reputationScore: { type: Number, default: 0, index: true },
  reportCount: { type: Number, default: 0 },
  validationCount: { type: Number, default: 0 },
  campaignCount: { type: Number, default: 0 },
  tokensEarned: { type: Number, default: 0 },
  tier: {
    type: String,
    enum: ["Bronze", "Silver", "Gold", "Platinum", "Diamond"],
    default: "Bronze",
  },
  badges: [{
    type: { type: String },
    earnedAt: { type: Date },
    tokenId: { type: Number },
  }],
  lastLogin: { type: Date },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
});

userSchema.index({ reputationScore: -1 });
userSchema.index({ city: 1, state: 1 });

module.exports = mongoose.model("User", userSchema);
