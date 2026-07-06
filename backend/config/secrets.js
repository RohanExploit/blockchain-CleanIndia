module.exports = {
  jwtSecret: process.env.JWT_SECRET || "dev-secret-key-replace-in-production",
  jwtExpiry: process.env.JWT_EXPIRY || "7d",
  ipfsApiUrl: process.env.IPFS_API_URL || "http://localhost:5001",
  port: process.env.PORT || 5000,
};
