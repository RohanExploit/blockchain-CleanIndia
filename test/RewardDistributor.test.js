const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RewardDistributor Contract", function () {
  let RewardDistributor, distributor, owner, addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    RewardDistributor = await ethers.getContractFactory("RewardDistributor");
    distributor = await RewardDistributor.deploy();
    await distributor.deployed();
  });

  describe("Reward Accruals", function () {
    it("Should accrue report reward with tier multipliers", async function () {
      await distributor.accrueReportReward(addr1.address);
      const info = await distributor.getUserRewardInfo(addr1.address);
      
      // Bronze multiplier is 10000 (1x), report reward is 10 CIT
      const expectedReward = ethers.utils.parseEther("10");
      expect(info.pendingRewards).to.equal(expectedReward);
      expect(info.reportCount).to.equal(1);
    });

    it("Should accrue validation reward", async function () {
      await distributor.accrueValidationReward(addr1.address);
      const info = await distributor.getUserRewardInfo(addr1.address);

      // Validation reward is 5 CIT
      const expectedReward = ethers.utils.parseEther("5");
      expect(info.pendingRewards).to.equal(expectedReward);
      expect(info.validationCount).to.equal(1);
    });
  });
});
