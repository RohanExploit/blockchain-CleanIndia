/**
 * Validation utility helpers
 */

function validateWasteType(type) {
  const validTypes = ["PLASTIC", "ORGANIC", "EWASTE", "HAZARDOUS", "CONSTRUCTION", "MIXED", "TEXTILE", "GLASS", "METAL", "PAPER"];
  return validTypes.includes(type?.toUpperCase());
}

function validateSeverity(severity) {
  return ["LOW", "MEDIUM", "HIGH", "CRITICAL"].includes(severity?.toUpperCase());
}

function validateLocation(location) {
  if (!location || typeof location !== "object") return false;
  const { lat, lng } = location;
  return typeof lat === "number" && typeof lng === "number" &&
    lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

function validatePagination(page, limit) {
  const p = parseInt(page) || 1;
  const l = Math.min(parseInt(limit) || 20, 100);
  return { page: Math.max(p, 1), limit: Math.max(l, 1) };
}

function sanitizeString(str, maxLength = 1000) {
  if (!str || typeof str !== "string") return "";
  return str.trim().slice(0, maxLength);
}

module.exports = {
  validateWasteType,
  validateSeverity,
  validateLocation,
  validatePagination,
  sanitizeString,
};
