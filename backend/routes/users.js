const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");

/**
 * @route   GET /api/users/profile/:walletAddress
 * @desc    Get user public profile
 */
router.get("/profile/:walletAddress", async (req, res, next) => {
  try {
    const user = await User.findOne({ walletAddress: req.params.walletAddress.toLowerCase() })
      .select("-nonce -__v");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 */
router.put("/profile", auth, async (req, res, next) => {
  try {
    const { username, bio, avatar, city, state } = req.body;
    const update = {};
    if (username) update.username = username;
    if (bio) update.bio = bio;
    if (avatar) update.avatar = avatar;
    if (city) update.city = city;
    if (state) update.state = state;

    const user = await User.findByIdAndUpdate(req.user.userId, update, { new: true })
      .select("-nonce");
    res.json(user);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/users/leaderboard
 * @desc    Get top contributors leaderboard
 */
router.get("/leaderboard", async (req, res, next) => {
  try {
    const { limit = 50, timeframe = "all" } = req.query;

    let dateFilter = {};
    if (timeframe === "week") {
      dateFilter = { lastLogin: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } };
    } else if (timeframe === "month") {
      dateFilter = { lastLogin: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } };
    }

    const users = await User.find(dateFilter)
      .sort({ reputationScore: -1 })
      .limit(parseInt(limit))
      .select("username walletAddress reputationScore reportCount validationCount tier");

    res.json(users);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/users/stats/:walletAddress
 * @desc    Get user statistics
 */
router.get("/stats/:walletAddress", async (req, res, next) => {
  try {
    const user = await User.findOne({ walletAddress: req.params.walletAddress.toLowerCase() });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      reportCount: user.reportCount || 0,
      validationCount: user.validationCount || 0,
      campaignCount: user.campaignCount || 0,
      reputationScore: user.reputationScore || 0,
      tier: user.tier || "Bronze",
      tokensEarned: user.tokensEarned || 0,
      badgeCount: user.badges ? user.badges.length : 0,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
