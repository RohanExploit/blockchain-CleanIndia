const { create } = require("ipfs-http-client");
const { logger } = require("../utils/logger");

let ipfs;

/**
 * Initialize IPFS client
 */
function getIPFSClient() {
  if (!ipfs) {
    const projectId = process.env.IPFS_PROJECT_ID;
    const projectSecret = process.env.IPFS_PROJECT_SECRET;

    if (projectId && projectSecret) {
      const auth = "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");
      ipfs = create({
        host: "ipfs.infura.io",
        port: 5001,
        protocol: "https",
        headers: { authorization: auth },
      });
    } else {
      // Local IPFS node fallback
      ipfs = create({ url: process.env.IPFS_API_URL || "http://localhost:5001" });
    }
  }
  return ipfs;
}

/**
 * Upload content to IPFS
 * @param {Buffer|string} content - Content to upload
 * @returns {string} IPFS hash (CID)
 */
async function uploadToIPFS(content) {
  try {
    const client = getIPFSClient();
    const result = await client.add(content);
    logger.info(`Uploaded to IPFS: ${result.path}`);
    return result.path;
  } catch (error) {
    logger.error("IPFS upload failed:", error.message);
    throw new Error("Failed to upload to IPFS");
  }
}

/**
 * Get content from IPFS
 * @param {string} hash - IPFS hash (CID)
 * @returns {string} Content
 */
async function getFromIPFS(hash) {
  try {
    const client = getIPFSClient();
    const chunks = [];
    for await (const chunk of client.cat(hash)) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks).toString();
  } catch (error) {
    logger.error(`IPFS retrieval failed for ${hash}:`, error.message);
    throw new Error("Failed to retrieve from IPFS");
  }
}

module.exports = { uploadToIPFS, getFromIPFS };
