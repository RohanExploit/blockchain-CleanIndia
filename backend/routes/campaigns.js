const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Campaign = require("../models/Campaign");
const { logger } = require("../utils/logger");

/**
 * @route   POST /api/campaigns
 * @desc    Create a new cleanup campaign
 */
router.post("/", auth, async (req, res, next) => {
  try {
    const { title, description, location, startDate, endDate, maxVolunteers, rewardPerVolunteer } = req.body;

    const campaign = new Campaign({
      organizer: req.user.userId,
      organizerWallet: req.user.walletAddress,
      title,
      description,
      location,
      startDate,
      endDate,
      maxVolunteers: maxVolunteers || 50,
      rewardPerVolunteer: rewardPerVolunteer || 10,
      status: "PLANNED",
    });

    await campaign.save();
    logger.info(`Campaign created: ${campaign._id}`);
    res.status(201).json(campaign);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/campaigns
 * @desc    List all campaigns with filtering
 */
router.get("/", async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const campaigns = await Campaign.find(filter)
      .sort({ startDate: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .populate("organizer", "username walletAddress");

    const total = await Campaign.countDocuments(filter);
    res.json({ campaigns, total, page: parseInt(page) });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/campaigns/:id/register
 * @desc    Register as a volunteer for a campaign
 */
router.post("/:id/register", auth, async (req, res, next) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ error: "Campaign not found" });
    if (campaign.status !== "PLANNED") return res.status(400).json({ error: "Registration closed" });
    if (campaign.volunteers.includes(req.user.walletAddress)) {
      return res.status(400).json({ error: "Already registered" });
    }
    if (campaign.volunteers.length >= campaign.maxVolunteers) {
      return res.status(400).json({ error: "Campaign full" });
    }

    campaign.volunteers.push(req.user.walletAddress);
    await campaign.save();

    res.json({ message: "Registered successfully", campaign });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/campaigns/:id/complete
 * @desc    Mark a campaign as completed
 */
router.put("/:id/complete", auth, async (req, res, next) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ error: "Campaign not found" });
    if (campaign.organizerWallet !== req.user.walletAddress) {
      return res.status(403).json({ error: "Only organizer can complete" });
    }

    campaign.status = "COMPLETED";
    campaign.wasteCollectedKg = req.body.wasteCollectedKg || 0;
    campaign.completedAt = new Date();
    await campaign.save();

    res.json(campaign);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
