const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const { logger } = require("./utils/logger");
require("dotenv").config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: "Too many requests, please try again later" },
});
app.use("/api/", limiter);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan("combined", {
  stream: { write: (message) => logger.info(message.trim()) },
}));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/reports", require("./routes/reports"));
app.use("/api/campaigns", require("./routes/campaigns"));
app.use("/api/users", require("./routes/users"));
app.use("/api/rewards", require("./routes/rewards"));
app.use("/api/marketplace", require("./routes/marketplace"));
app.use("/api/zones", require("./routes/zones"));
app.use("/api/analytics", require("./routes/analytics"));
app.use("/api/ipfs", require("./routes/ipfs"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: require("../package.json").version,
  });
});

// Error handling middleware
app.use(require("./middleware/errorHandler"));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Database connection and server start
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/cleanindia", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info("📦 Connected to MongoDB");

    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📋 Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

module.exports = app;
