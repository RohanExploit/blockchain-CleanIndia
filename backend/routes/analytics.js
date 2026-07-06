const express = require("express");
const router = express.Router();
const Report = require("../models/Report");

/**
 * @route   GET /api/analytics/dashboard
 * @desc    Get dashboard analytics summary
 */
router.get("/dashboard", async (req, res, next) => {
  try {
    const totalReports = await Report.countDocuments();
    const resolvedReports = await Report.countDocuments({ status: "RESOLVED" });
    const validatedReports = await Report.countDocuments({ status: "VALIDATED" });

    const wasteByType = await Report.aggregate([
      { $group: { _id: "$wasteType", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const reportsByMonth = await Report.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 12 },
    ]);

    const severityDistribution = await Report.aggregate([
      { $group: { _id: "$severity", count: { $sum: 1 } } },
    ]);

    res.json({
      overview: {
        totalReports,
        resolvedReports,
        validatedReports,
        resolutionRate: totalReports > 0 ? ((resolvedReports / totalReports) * 100).toFixed(1) : 0,
      },
      wasteByType,
      reportsByMonth,
      severityDistribution,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/analytics/impact
 * @desc    Get environmental impact metrics
 */
router.get("/impact", async (req, res, next) => {
  try {
    res.json({
      totalWasteReportedKg: 0,
      totalWasteCleanedKg: 0,
      totalCampaigns: 0,
      totalVolunteers: 0,
      co2SavedKg: 0,
      treesEquivalent: 0,
      citiesImpacted: 0,
      statesImpacted: 0,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/analytics/heatmap
 * @desc    Get waste report heatmap data
 */
router.get("/heatmap", async (req, res, next) => {
  try {
    const reports = await Report.find({ "location.lat": { $exists: true } })
      .select("location.lat location.lng severity wasteType")
      .limit(1000);

    const heatmapData = reports.map((r) => ({
      lat: r.location?.lat,
      lng: r.location?.lng,
      weight: r.severity === "CRITICAL" ? 4 : r.severity === "HIGH" ? 3 : r.severity === "MEDIUM" ? 2 : 1,
    }));

    res.json(heatmapData);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
