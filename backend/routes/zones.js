const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

/**
 * @route   GET /api/zones
 * @desc    Get all waste collection zones
 */
router.get("/", async (req, res, next) => {
  try {
    const { city, state, active } = req.query;
    const filter = {};
    if (city) filter.city = city;
    if (state) filter.state = state;
    if (active !== undefined) filter.isActive = active === "true";

    res.json({ zones: [], total: 0, message: "Zones endpoint active" });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/zones
 * @desc    Create a new collection zone
 */
router.post("/", auth, async (req, res, next) => {
  try {
    const { name, boundary, city, state, manager } = req.body;
    res.status(201).json({
      message: "Zone created",
      zone: { name, city, state, manager: manager || req.user.walletAddress, isActive: true },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/zones/:id/collectors
 * @desc    Get collectors assigned to a zone
 */
router.get("/:id/collectors", async (req, res, next) => {
  try {
    res.json({ zoneId: req.params.id, collectors: [] });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/zones/:id/stats
 * @desc    Get zone statistics
 */
router.get("/:id/stats", async (req, res, next) => {
  try {
    res.json({
      zoneId: req.params.id,
      totalReports: 0,
      resolvedReports: 0,
      activeCollectors: 0,
      wasteCollectedKg: 0,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
