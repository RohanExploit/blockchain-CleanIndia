const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("WasteReport Smart Contract", function () {
  let WasteReport, report, owner, addr1, addr2, addr3;

  beforeEach(async function () {
    [owner, addr1, addr2, addr3] = await ethers.getSigners();
    WasteReport = await ethers.getContractFactory("WasteReport");
    report = await WasteReport.deploy();
    await report.deployed();
  });

  describe("Report Submission", function () {
    it("Should submit a report correctly and emit event", async function () {
      await expect(
        report.connect(addr1).submitReport(
          "QmLocationHash123",
          "QmImageHash123",
          "Discarded plastic bottles",
          0, // WasteType.PLASTIC
          1  // Severity.MEDIUM
        )
      )
        .to.emit(report, "ReportCreated")
        .withArgs(1, addr1.address, 0);

      const r = await report.getReport(1);
      expect(r.reporter).to.equal(addr1.address);
      expect(r.locationHash).to.equal("QmLocationHash123");
      expect(r.validationCount).to.equal(0);
      expect(r.status).to.equal(0); // ReportStatus.SUBMITTED
    });

    it("Should fail if location hash is empty", async function () {
      await expect(
        report.connect(addr1).submitReport("", "QmImageHash", "Desc", 0, 1)
      ).to.be.revertedWith("Location required");
    });
  });

  describe("Report Validation", function () {
    beforeEach(async function () {
      await report.connect(addr1).submitReport("QmLoc", "QmImg", "Desc", 0, 1);
    });

    it("Should increment validation count", async function () {
      await report.connect(addr2).validateReport(1);
      const r = await report.getReport(1);
      expect(r.validationCount).to.equal(1);
    });

    it("Should fail if reporter tries to self-validate", async function () {
      await expect(
        report.connect(addr1).validateReport(1)
      ).to.be.revertedWith("Cannot validate own report");
    });
  });
});
