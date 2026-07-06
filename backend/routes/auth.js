const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { ethers } = require("ethers");
const User = require("../models/User");
const { logger } = require("../utils/logger");

/**
 * @route   POST /api/auth/nonce
 * @desc    Generate a nonce for wallet signature verification
 */
router.post("/nonce", async (req, res, next) => {
  try {
    const { walletAddress } = req.body;
    if (!walletAddress || !ethers.utils.isAddress(walletAddress)) {
      return res.status(400).json({ error: "Invalid wallet address" });
    }

    const nonce = Math.floor(Math.random() * 1000000).toString();
    let user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });

    if (!user) {
      user = new User({ walletAddress: walletAddress.toLowerCase(), nonce });
    } else {
      user.nonce = nonce;
    }
    await user.save();

    res.json({ nonce, message: `Sign this message to authenticate with Clean India: ${nonce}` });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/auth/verify
 * @desc    Verify wallet signature and issue JWT
 */
router.post("/verify", async (req, res, next) => {
  try {
    const { walletAddress, signature } = req.body;
    if (!walletAddress || !signature) {
      return res.status(400).json({ error: "Wallet address and signature required" });
    }

    const user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: "User not found. Request a nonce first." });
    }

    // Verify signature
    const message = `Sign this message to authenticate with Clean India: ${user.nonce}`;
    const recoveredAddress = ethers.utils.verifyMessage(message, signature);

    if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      return res.status(401).json({ error: "Signature verification failed" });
    }

    // Rotate nonce
    user.nonce = Math.floor(Math.random() * 1000000).toString();
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, walletAddress: user.walletAddress },
      process.env.JWT_SECRET || "dev-secret",
      { expiresIn: process.env.JWT_EXPIRY || "7d" }
    );

    logger.info(`User authenticated: ${walletAddress}`);
    res.json({ token, user: { id: user._id, walletAddress: user.walletAddress, username: user.username } });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get authenticated user profile
 */
router.get("/me", require("../middleware/auth"), async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select("-nonce");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
