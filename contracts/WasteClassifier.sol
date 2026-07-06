// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title WasteClassifier
 * @notice On-chain waste classification oracle integration
 * @dev Stores AI-classified waste data on-chain for verification
 */
contract WasteClassifier is AccessControl {
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");

    struct Classification {
        uint256 reportId;
        string wasteCategory;
        uint256 confidenceScore; // basis points (0-10000)
        string modelVersion;
        uint256 timestamp;
        bool verified;
    }

    mapping(uint256 => Classification) public classifications;
    mapping(string => uint256) public categoryCount;

    string[] public wasteCategories;
    uint256 public totalClassifications;
    uint256 public constant MIN_CONFIDENCE = 7000; // 70%

    event WasteClassified(uint256 indexed reportId, string category, uint256 confidence);
    event ClassificationVerified(uint256 indexed reportId, bool isCorrect);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ORACLE_ROLE, msg.sender);

        wasteCategories.push("plastic");
        wasteCategories.push("organic");
        wasteCategories.push("e-waste");
        wasteCategories.push("hazardous");
        wasteCategories.push("construction");
        wasteCategories.push("textile");
        wasteCategories.push("glass");
        wasteCategories.push("metal");
        wasteCategories.push("paper");
        wasteCategories.push("mixed");
    }

    function classifyWaste(
        uint256 _reportId,
        string calldata _category,
        uint256 _confidenceScore,
        string calldata _modelVersion
    ) external onlyRole(ORACLE_ROLE) {
        require(_confidenceScore <= 10000, "Invalid confidence score");
        require(_confidenceScore >= MIN_CONFIDENCE, "Confidence too low");
        require(classifications[_reportId].timestamp == 0, "Already classified");

        classifications[_reportId] = Classification({
            reportId: _reportId,
            wasteCategory: _category,
            confidenceScore: _confidenceScore,
            modelVersion: _modelVersion,
            timestamp: block.timestamp,
            verified: false
        });

        categoryCount[_category]++;
        totalClassifications++;

        emit WasteClassified(_reportId, _category, _confidenceScore);
    }

    function verifyClassification(uint256 _reportId, bool _isCorrect) 
        external 
        onlyRole(ORACLE_ROLE) 
    {
        Classification storage c = classifications[_reportId];
        require(c.timestamp > 0, "Classification not found");
        require(!c.verified, "Already verified");

        c.verified = true;
        emit ClassificationVerified(_reportId, _isCorrect);
    }

    function getClassification(uint256 _reportId) external view returns (Classification memory) {
        return classifications[_reportId];
    }

    function getCategories() external view returns (string[] memory) {
        return wasteCategories;
    }
}
