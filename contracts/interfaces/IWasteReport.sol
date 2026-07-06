// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.19;

interface IWasteReport {
    enum WasteType { PLASTIC, ORGANIC, EWASTE, HAZARDOUS, CONSTRUCTION, MIXED }
    enum ReportStatus { SUBMITTED, VALIDATED, IN_PROGRESS, RESOLVED, REJECTED }
    enum Severity { LOW, MEDIUM, HIGH, CRITICAL }

    struct Report {
        uint256 id;
        address reporter;
        string locationHash;
        string imageHash;
        string description;
        WasteType wasteType;
        Severity severity;
        ReportStatus status;
        uint256 timestamp;
        uint256 validationCount;
        uint256 rewardAmount;
        bool rewardClaimed;
    }

    event ReportCreated(uint256 indexed reportId, address indexed reporter, WasteType wasteType);
    event ReportValidated(uint256 indexed reportId, address indexed validator);
    event ReportStatusChanged(uint256 indexed reportId, ReportStatus newStatus);
    event RewardClaimed(uint256 indexed reportId, address indexed reporter, uint256 amount);

    function submitReport(
        string calldata _locationHash,
        string calldata _imageHash,
        string calldata _description,
        WasteType _wasteType,
        Severity _severity
    ) external returns (uint256);

    function validateReport(uint256 _reportId) external;
    function getReport(uint256 _reportId) external view returns (Report memory);
}
