const { ethers } = require("ethers");

/**
 * Blockchain utility helpers
 */

/**
 * Validate Ethereum address
 */
function isValidAddress(address) {
  try {
    return ethers.utils.isAddress(address);
  } catch {
    return false;
  }
}

/**
 * Convert waste type string to enum value
 */
function wasteTypeToEnum(wasteType) {
  const types = { PLASTIC: 0, ORGANIC: 1, EWASTE: 2, HAZARDOUS: 3, CONSTRUCTION: 4, MIXED: 5 };
  return types[wasteType.toUpperCase()] ?? 5;
}

/**
 * Convert severity string to enum value
 */
function severityToEnum(severity) {
  const levels = { LOW: 0, MEDIUM: 1, HIGH: 2, CRITICAL: 3 };
  return levels[severity.toUpperCase()] ?? 1;
}

/**
 * Format token amount from wei to human readable
 */
function formatTokens(weiAmount) {
  return ethers.utils.formatEther(weiAmount);
}

/**
 * Parse token amount from human readable to wei
 */
function parseTokens(amount) {
  return ethers.utils.parseEther(amount.toString());
}

/**
 * Shorten address for display (0x1234...abcd)
 */
function shortenAddress(address, chars = 4) {
  if (!address) return "";
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
}

/**
 * Calculate estimated gas cost in ETH
 */
async function estimateGasCost(provider, gasLimit) {
  const gasPrice = await provider.getGasPrice();
  const cost = gasPrice.mul(gasLimit);
  return ethers.utils.formatEther(cost);
}

module.exports = {
  isValidAddress,
  wasteTypeToEnum,
  severityToEnum,
  formatTokens,
  parseTokens,
  shortenAddress,
  estimateGasCost,
};
