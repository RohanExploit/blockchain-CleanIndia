const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { uploadToIPFS, getFromIPFS } = require("../services/ipfsService");
const multer = require("multer");

const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

/**
 * @route   POST /api/ipfs/upload
 * @desc    Upload file to IPFS
 */
router.post("/upload", auth, upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file provided" });
    const hash = await uploadToIPFS(req.file.buffer);
    res.json({ hash, url: `https://ipfs.io/ipfs/${hash}` });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/ipfs/upload-json
 * @desc    Upload JSON data to IPFS
 */
router.post("/upload-json", auth, async (req, res, next) => {
  try {
    const hash = await uploadToIPFS(JSON.stringify(req.body.data));
    res.json({ hash, url: `https://ipfs.io/ipfs/${hash}` });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/ipfs/:hash
 * @desc    Get content from IPFS by hash
 */
router.get("/:hash", async (req, res, next) => {
  try {
    const content = await getFromIPFS(req.params.hash);
    res.json({ hash: req.params.hash, content });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
