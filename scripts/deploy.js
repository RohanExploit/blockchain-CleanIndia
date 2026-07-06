const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying Clean India Blockchain contracts...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer:", deployer.address);
  console.log("Balance:", hre.ethers.utils.formatEther(await deployer.getBalance()), "ETH\n");

  // 1. Deploy CleanIndiaToken
  console.log("📦 Deploying CleanIndiaToken...");
  const CleanIndiaToken = await hre.ethers.getContractFactory("CleanIndiaToken");
  const token = await CleanIndiaToken.deploy();
  await token.deployed();
  console.log("  ✅ CleanIndiaToken:", token.address);

  // 2. Deploy UserRegistry
  console.log("📦 Deploying UserRegistry...");
  const UserRegistry = await hre.ethers.getContractFactory("UserRegistry");
  const registry = await UserRegistry.deploy();
  await registry.deployed();
  console.log("  ✅ UserRegistry:", registry.address);

  // 3. Deploy WasteReport
  console.log("📦 Deploying WasteReport...");
  const WasteReport = await hre.ethers.getContractFactory("WasteReport");
  const wasteReport = await WasteReport.deploy();
  await wasteReport.deployed();
  console.log("  ✅ WasteReport:", wasteReport.address);

  // 4. Deploy WasteClassifier
  console.log("📦 Deploying WasteClassifier...");
  const WasteClassifier = await hre.ethers.getContractFactory("WasteClassifier");
  const classifier = await WasteClassifier.deploy();
  await classifier.deployed();
  console.log("  ✅ WasteClassifier:", classifier.address);

  // 5. Deploy RewardDistributor
  console.log("📦 Deploying RewardDistributor...");
  const RewardDistributor = await hre.ethers.getContractFactory("RewardDistributor");
  const rewardDistributor = await RewardDistributor.deploy();
  await rewardDistributor.deployed();
  console.log("  ✅ RewardDistributor:", rewardDistributor.address);

  // 6. Deploy CleanupCampaign
  console.log("📦 Deploying CleanupCampaign...");
  const CleanupCampaign = await hre.ethers.getContractFactory("CleanupCampaign");
  const campaign = await CleanupCampaign.deploy();
  await campaign.deployed();
  console.log("  ✅ CleanupCampaign:", campaign.address);

  // 7. Deploy ImpactNFT
  console.log("📦 Deploying ImpactNFT...");
  const ImpactNFT = await hre.ethers.getContractFactory("ImpactNFT");
  const nft = await ImpactNFT.deploy();
  await nft.deployed();
  console.log("  ✅ ImpactNFT:", nft.address);

  // 8. Deploy WasteMarketplace
  console.log("📦 Deploying WasteMarketplace...");
  const WasteMarketplace = await hre.ethers.getContractFactory("WasteMarketplace");
  const marketplace = await WasteMarketplace.deploy();
  await marketplace.deployed();
  console.log("  ✅ WasteMarketplace:", marketplace.address);

  // 9. Deploy ZoneManager
  console.log("📦 Deploying ZoneManager...");
  const ZoneManager = await hre.ethers.getContractFactory("ZoneManager");
  const zoneManager = await ZoneManager.deploy();
  await zoneManager.deployed();
  console.log("  ✅ ZoneManager:", zoneManager.address);

  // 10. Deploy StakingPool
  console.log("📦 Deploying StakingPool...");
  const rewardRate = hre.ethers.utils.parseEther("0.001"); // 0.001 tokens/sec/staked
  const StakingPool = await hre.ethers.getContractFactory("StakingPool");
  const stakingPool = await StakingPool.deploy(rewardRate);
  await stakingPool.deployed();
  console.log("  ✅ StakingPool:", stakingPool.address);

  console.log("\n✨ All contracts deployed successfully!\n");

  // Print deployment summary
  const deployments = {
    CleanIndiaToken: token.address,
    UserRegistry: registry.address,
    WasteReport: wasteReport.address,
    WasteClassifier: classifier.address,
    RewardDistributor: rewardDistributor.address,
    CleanupCampaign: campaign.address,
    ImpactNFT: nft.address,
    WasteMarketplace: marketplace.address,
    ZoneManager: zoneManager.address,
    StakingPool: stakingPool.address,
  };

  console.log("📋 Deployment Summary:");
  console.log(JSON.stringify(deployments, null, 2));

  // Save deployment addresses
  const fs = require("fs");
  fs.writeFileSync(
    "./deployments.json",
    JSON.stringify(deployments, null, 2)
  );
  console.log("\n💾 Deployment addresses saved to deployments.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
