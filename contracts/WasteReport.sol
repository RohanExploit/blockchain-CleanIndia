// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title WasteReport
 * @notice Core contract for reporting and tracking waste incidents
 * @dev Implements a decentralized waste reporting system for Clean India initiative
 */
contract WasteReport is AccessControl, ReentrancyGuard {
    bytes32 public constant VALIDATOR_ROLE = keccak256("VALIDATOR_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    enum WasteType { PLASTIC, ORGANIC, EWASTE, HAZARDOUS, CONSTRUCTION, MIXED }
    enum ReportStatus { SUBMITTED, VALIDATED, IN_PROGRESS, RESOLVED, REJECTED }
    enum Severity { LOW, MEDIUM, HIGH, CRITICAL }

    struct Report {
        uint256 id;
        address reporter;
        string locationHash;      // IPFS hash of GPS coordinates
        string imageHash;         // IPFS hash of evidence photo
        string description;
        WasteType wasteType;
        Severity severity;
        ReportStatus status;
        uint256 timestamp;
        uint256 validationCount;
        uint256 rewardAmount;
        bool rewardClaimed;
    }

    uint256 private _reportCounter;
    mapping(uint256 => Report) public reports;
    mapping(uint256 => mapping(address => bool)) public validations;
    mapping(address => uint256[]) public userReports;
    mapping(address => uint256) public userReputationScore;

    uint256 public constant MIN_VALIDATIONS = 3;
    uint256 public constant BASE_REWARD = 10 ether; // 10 CIT tokens

    event ReportCreated(uint256 indexed reportId, address indexed reporter, WasteType wasteType);
    event ReportValidated(uint256 indexed reportId, address indexed validator);
    event ReportStatusChanged(uint256 indexed reportId, ReportStatus newStatus);
    event RewardClaimed(uint256 indexed reportId, address indexed reporter, uint256 amount);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    /**
     * @notice Submit a new waste report
     * @param _locationHash IPFS hash of location data
     * @param _imageHash IPFS hash of evidence image
     * @param _description Text description of the waste issue
     * @param _wasteType Category of waste
     * @param _severity Severity level of the issue
     */
    function submitReport(
        string calldata _locationHash,
        string calldata _imageHash,
        string calldata _description,
        WasteType _wasteType,
        Severity _severity
    ) external returns (uint256) {
        require(bytes(_locationHash).length > 0, "Location required");
        require(bytes(_imageHash).length > 0, "Image evidence required");

        _reportCounter++;
        uint256 reportId = _reportCounter;

        reports[reportId] = Report({
            id: reportId,
            reporter: msg.sender,
            locationHash: _locationHash,
            imageHash: _imageHash,
            description: _description,
            wasteType: _wasteType,
            severity: _severity,
            status: ReportStatus.SUBMITTED,
            timestamp: block.timestamp,
            validationCount: 0,
            rewardAmount: _calculateReward(_severity),
            rewardClaimed: false
        });

        userReports[msg.sender].push(reportId);
        userReputationScore[msg.sender] += 1;

        emit ReportCreated(reportId, msg.sender, _wasteType);
        return reportId;
    }

    /**
     * @notice Validate an existing waste report
     * @param _reportId ID of the report to validate
     */
    function validateReport(uint256 _reportId) external {
        require(_reportId <= _reportCounter && _reportId > 0, "Invalid report");
        Report storage report = reports[_reportId];
        require(report.reporter != msg.sender, "Cannot validate own report");
        require(!validations[_reportId][msg.sender], "Already validated");
        require(report.status == ReportStatus.SUBMITTED, "Not in submitted state");

        validations[_reportId][msg.sender] = true;
        report.validationCount++;
        userReputationScore[msg.sender] += 2;

        emit ReportValidated(_reportId, msg.sender);

        if (report.validationCount >= MIN_VALIDATIONS) {
            report.status = ReportStatus.VALIDATED;
            emit ReportStatusChanged(_reportId, ReportStatus.VALIDATED);
        }
    }

    /**
     * @notice Update report status (admin/validator only)
     */
    function updateReportStatus(uint256 _reportId, ReportStatus _newStatus) 
        external 
        onlyRole(VALIDATOR_ROLE) 
    {
        require(_reportId <= _reportCounter && _reportId > 0, "Invalid report");
        reports[_reportId].status = _newStatus;
        emit ReportStatusChanged(_reportId, _newStatus);
    }

    /**
     * @notice Get report details
     */
    function getReport(uint256 _reportId) external view returns (Report memory) {
        require(_reportId <= _reportCounter && _reportId > 0, "Invalid report");
        return reports[_reportId];
    }

    /**
     * @notice Get all reports by a user
     */
    function getUserReports(address _user) external view returns (uint256[] memory) {
        return userReports[_user];
    }

    /**
     * @notice Get total report count
     */
    function getReportCount() external view returns (uint256) {
        return _reportCounter;
    }

    function _calculateReward(Severity _severity) internal pure returns (uint256) {
        if (_severity == Severity.CRITICAL) return BASE_REWARD * 4;
        if (_severity == Severity.HIGH) return BASE_REWARD * 3;
        if (_severity == Severity.MEDIUM) return BASE_REWARD * 2;
        return BASE_REWARD;
    }
}
