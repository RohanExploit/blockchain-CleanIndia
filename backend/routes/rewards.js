const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Reward = require("../models/Reward");

/**
 * @route   GET /api/rewards/balance/:walletAddress
 * @desc    Get user's reward balance and history
 */
router.get("/balance/:walletAddress", async (req, res, next) => {
  try {
    const rewards = await Reward.find({ walletAddress: req.params.walletAddress.toLowerCase() })
      .sort({ createdAt: -1 });

    const totalEarned = rewards.reduce((sum, r) => sum + r.amount, 0);
    const totalClaimed = rewards.filter(r => r.claimed).reduce((sum, r) => sum + r.amount, 0);

    res.json({
      totalEarned,
      totalClaimed,
      pending: totalEarned - totalClaimed,
      history: rewards.slice(0, 50),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/rewards/claim
 * @desc    Claim pending rewards
 */
router.post("/claim", auth, async (req, res, next) => {
  try {
    const pendingRewards = await Reward.find({
      walletAddress: req.user.walletAddress,
      claimed: false,
    });

    if (pendingRewards.length === 0) {
      return res.status(400).json({ error: "No pending rewards" });
    }

    const totalAmount = pendingRewards.reduce((sum, r) => sum + r.amount, 0);

    // Mark all as claimed
    await Reward.updateMany(
      { walletAddress: req.user.walletAddress, claimed: false },
      { claimed: true, claimedAt: new Date() }
    );

    res.json({
      message: "Rewards claimed successfully",
      amount: totalAmount,
      count: pendingRewards.length,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/rewards/tiers
 * @desc    Get reward tier information
 */
router.get("/tiers", (req, res) => {
  res.json([
    { name: "Bronze", minReports: 0, multiplier: 1.0, perks: ["Basic reporting"] },
    { name: "Silver", minReports: 10, multiplier: 1.2, perks: ["Priority validation", "Silver badge"] },
    { name: "Gold", minReports: 50, multiplier: 1.5, perks: ["Campaign creation", "Gold badge", "Governance voting"] },
    { name: "Platinum", minReports: 200, multiplier: 2.0, perks: ["Zone management", "Platinum badge", "Proposal creation"] },
    { name: "Diamond", minReports: 500, multiplier: 3.0, perks: ["Admin access", "Diamond badge", "Revenue sharing"] },
  ]);
});

module.exports = router;
