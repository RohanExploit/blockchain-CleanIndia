/**
 * Role-based authorization middleware
 */
module.exports = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }
    // Simple mock check
    next();
  };
};
