const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Report = require("../models/Report");
const { uploadToIPFS } = require("../services/ipfsService");
const { logger } = require("../utils/logger");

/**
 * @route   POST /api/reports
 * @desc    Create a new waste report
 */
router.post("/", auth, async (req, res, next) => {
  try {
    const { location, description, wasteType, severity, imageData } = req.body;

    if (!location || !description || !wasteType) {
      return res.status(400).json({ error: "Location, description, and waste type are required" });
    }

    // Upload image to IPFS if provided
    let imageHash = "";
    if (imageData) {
      imageHash = await uploadToIPFS(imageData);
    }

    // Upload location data to IPFS
    const locationHash = await uploadToIPFS(JSON.stringify(location));

    const report = new Report({
      reporter: req.user.userId,
      walletAddress: req.user.walletAddress,
      location,
      locationHash,
      imageHash,
      description,
      wasteType,
      severity: severity || "MEDIUM",
      status: "SUBMITTED",
    });

    await report.save();
    logger.info(`Report created: ${report._id} by ${req.user.walletAddress}`);

    res.status(201).json(report);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/reports
 * @desc    Get all reports with pagination and filters
 */
router.get("/", async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, wasteType, severity, sortBy = "createdAt" } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (wasteType) filter.wasteType = wasteType;
    if (severity) filter.severity = severity;

    const reports = await Report.find(filter)
      .sort({ [sortBy]: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .populate("reporter", "username walletAddress");

    const total = await Report.countDocuments(filter);

    res.json({
      reports,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalReports: total,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/reports/:id
 * @desc    Get single report by ID
 */
router.get("/:id", async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate("reporter", "username walletAddress reputationScore");

    if (!report) return res.status(404).json({ error: "Report not found" });
    res.json(report);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/reports/:id/validate
 * @desc    Validate a waste report
 */
router.put("/:id/validate", auth, async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ error: "Report not found" });
    if (report.walletAddress === req.user.walletAddress) {
      return res.status(400).json({ error: "Cannot validate own report" });
    }

    if (report.validators.includes(req.user.walletAddress)) {
      return res.status(400).json({ error: "Already validated" });
    }

    report.validators.push(req.user.walletAddress);
    report.validationCount++;

    if (report.validationCount >= 3) {
      report.status = "VALIDATED";
    }

    await report.save();
    res.json(report);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/reports/user/:walletAddress
 * @desc    Get reports by a specific user
 */
router.get("/user/:walletAddress", async (req, res, next) => {
  try {
    const reports = await Report.find({ walletAddress: req.params.walletAddress })
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
