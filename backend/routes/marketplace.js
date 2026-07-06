const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

/**
 * @route   GET /api/marketplace/listings
 * @desc    Get active marketplace listings
 */
router.get("/listings", async (req, res, next) => {
  try {
    const { wasteType, minPrice, maxPrice, page = 1, limit = 20 } = req.query;
    const filter = { status: "ACTIVE" };
    if (wasteType) filter.wasteType = wasteType;
    if (minPrice || maxPrice) {
      filter.pricePerKg = {};
      if (minPrice) filter.pricePerKg.$gte = parseFloat(minPrice);
      if (maxPrice) filter.pricePerKg.$lte = parseFloat(maxPrice);
    }

    // Placeholder response
    res.json({
      listings: [],
      total: 0,
      page: parseInt(page),
      message: "Marketplace listings endpoint active",
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/marketplace/listings
 * @desc    Create a new marketplace listing
 */
router.post("/listings", auth, async (req, res, next) => {
  try {
    const { wasteType, quantityKg, pricePerKg, description, location } = req.body;

    if (!wasteType || !quantityKg || !pricePerKg) {
      return res.status(400).json({ error: "Waste type, quantity, and price are required" });
    }

    res.status(201).json({
      message: "Listing created",
      listing: {
        seller: req.user.walletAddress,
        wasteType,
        quantityKg,
        pricePerKg,
        description,
        location,
        status: "ACTIVE",
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/marketplace/orders
 * @desc    Place an order for a listing
 */
router.post("/orders", auth, async (req, res, next) => {
  try {
    const { listingId, quantity } = req.body;
    res.status(201).json({
      message: "Order placed",
      order: { listingId, quantity, buyer: req.user.walletAddress, status: "PENDING" },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
