const { logger } = require("../utils/logger");

/**
 * Middleware to log request durations
 */
module.exports = (req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info(`HTTP ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
  });
  next();
};
