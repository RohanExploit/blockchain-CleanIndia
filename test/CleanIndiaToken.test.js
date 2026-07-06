const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CleanIndiaToken Smart Contract", function () {
  let CleanIndiaToken, token, owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    CleanIndiaToken = await ethers.getContractFactory("CleanIndiaToken");
    token = await CleanIndiaToken.deploy();
    await token.deployed();
  });

  describe("Deployment", function () {
    it("Should set the correct token metadata", async function () {
      expect(await token.name()).to.equal("Clean India Token");
      expect(await token.symbol()).to.equal("CIT");
    });

    it("Should mint initial supply to deployer", async function () {
      const initialSupply = ethers.utils.parseEther("10000000"); // 10M tokens
      expect(await token.balanceOf(owner.address)).to.equal(initialSupply);
      expect(await token.totalMinted()).to.equal(initialSupply);
    });
  });

  describe("Token Rewards", function () {
    it("Should allow MINTER_ROLE to mint rewards", async function () {
      const amount = ethers.utils.parseEther("100");
      await token.mintReward(addr1.address, amount, "Valid Report Reward");
      expect(await token.balanceOf(addr1.address)).to.equal(amount);
    });

    it("Should fail if non-minter tries to mint rewards", async function () {
      const amount = ethers.utils.parseEther("100");
      await expect(
        token.connect(addr1).mintReward(addr2.address, amount, "Unauthorized")
      ).to.be.revertedWith("AccessControl: account");
    });
  });
});
