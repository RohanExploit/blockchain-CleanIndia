const { ethers } = require("ethers");
const { logger } = require("../utils/logger");

/**
 * BlockchainService - Handles all on-chain interactions
 */
class BlockchainService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contracts = {};
  }

  /**
   * Initialize provider and signer
   */
  async initialize() {
    try {
      const rpcUrl = process.env.RPC_URL || "http://127.0.0.1:8545";
      this.provider = new ethers.providers.JsonRpcProvider(rpcUrl);

      if (process.env.PRIVATE_KEY) {
        this.signer = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
        logger.info(`Blockchain service initialized. Signer: ${this.signer.address}`);
      }

      const network = await this.provider.getNetwork();
      logger.info(`Connected to chain ID: ${network.chainId}`);
    } catch (error) {
      logger.error("Failed to initialize blockchain service:", error.message);
    }
  }

  /**
   * Load a contract instance
   */
  loadContract(name, address, abi) {
    try {
      const contract = new ethers.Contract(address, abi, this.signer || this.provider);
      this.contracts[name] = contract;
      logger.info(`Loaded contract: ${name} at ${address}`);
      return contract;
    } catch (error) {
      logger.error(`Failed to load contract ${name}:`, error.message);
      throw error;
    }
  }

  /**
   * Submit a waste report on-chain
   */
  async submitReportOnChain(locationHash, imageHash, description, wasteType, severity) {
    const contract = this.contracts["WasteReport"];
    if (!contract) throw new Error("WasteReport contract not loaded");

    const tx = await contract.submitReport(locationHash, imageHash, description, wasteType, severity);
    const receipt = await tx.wait();

    const event = receipt.events?.find((e) => e.event === "ReportCreated");
    const reportId = event?.args?.reportId?.toNumber();

    logger.info(`Report submitted on-chain. ID: ${reportId}, TX: ${receipt.transactionHash}`);
    return { reportId, txHash: receipt.transactionHash };
  }

  /**
   * Get token balance for an address
   */
  async getTokenBalance(address) {
    const contract = this.contracts["CleanIndiaToken"];
    if (!contract) throw new Error("Token contract not loaded");

    const balance = await contract.balanceOf(address);
    return ethers.utils.formatEther(balance);
  }

  /**
   * Get current gas price
   */
  async getGasPrice() {
    const gasPrice = await this.provider.getGasPrice();
    return ethers.utils.formatUnits(gasPrice, "gwei");
  }
}

module.exports = new BlockchainService();
