// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title CleanupCampaign
 * @notice Manages organized cleanup campaigns and volunteer coordination
 * @dev Tracks campaign lifecycle from creation to completion with participant management
 */
contract CleanupCampaign is AccessControl {
    using Counters for Counters.Counter;

    bytes32 public constant ORGANIZER_ROLE = keccak256("ORGANIZER_ROLE");

    enum CampaignStatus { PLANNED, ACTIVE, COMPLETED, CANCELLED }

    struct Campaign {
        uint256 id;
        address organizer;
        string title;
        string description;
        string locationHash;
        uint256 startTime;
        uint256 endTime;
        uint256 maxVolunteers;
        uint256 volunteerCount;
        uint256 wasteCollectedKg;
        CampaignStatus status;
        uint256 rewardPerVolunteer;
    }

    Counters.Counter private _campaignIds;
    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => mapping(address => bool)) public volunteers;
    mapping(uint256 => address[]) public campaignVolunteers;
    mapping(address => uint256[]) public userCampaigns;

    event CampaignCreated(uint256 indexed campaignId, address indexed organizer, string title);
    event VolunteerRegistered(uint256 indexed campaignId, address indexed volunteer);
    event VolunteerUnregistered(uint256 indexed campaignId, address indexed volunteer);
    event CampaignStarted(uint256 indexed campaignId);
    event CampaignCompleted(uint256 indexed campaignId, uint256 wasteCollectedKg);
    event CampaignCancelled(uint256 indexed campaignId);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ORGANIZER_ROLE, msg.sender);
    }

    function createCampaign(
        string calldata _title,
        string calldata _description,
        string calldata _locationHash,
        uint256 _startTime,
        uint256 _endTime,
        uint256 _maxVolunteers,
        uint256 _rewardPerVolunteer
    ) external onlyRole(ORGANIZER_ROLE) returns (uint256) {
        require(_startTime > block.timestamp, "Start time must be in the future");
        require(_endTime > _startTime, "End time must be after start time");
        require(_maxVolunteers > 0, "Must allow at least one volunteer");

        _campaignIds.increment();
        uint256 campaignId = _campaignIds.current();

        campaigns[campaignId] = Campaign({
            id: campaignId,
            organizer: msg.sender,
            title: _title,
            description: _description,
            locationHash: _locationHash,
            startTime: _startTime,
            endTime: _endTime,
            maxVolunteers: _maxVolunteers,
            volunteerCount: 0,
            wasteCollectedKg: 0,
            status: CampaignStatus.PLANNED,
            rewardPerVolunteer: _rewardPerVolunteer
        });

        emit CampaignCreated(campaignId, msg.sender, _title);
        return campaignId;
    }

    function registerVolunteer(uint256 _campaignId) external {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.status == CampaignStatus.PLANNED, "Registration closed");
        require(!volunteers[_campaignId][msg.sender], "Already registered");
        require(campaign.volunteerCount < campaign.maxVolunteers, "Campaign full");

        volunteers[_campaignId][msg.sender] = true;
        campaignVolunteers[_campaignId].push(msg.sender);
        campaign.volunteerCount++;
        userCampaigns[msg.sender].push(_campaignId);

        emit VolunteerRegistered(_campaignId, msg.sender);
    }

    function completeCampaign(uint256 _campaignId, uint256 _wasteCollectedKg) 
        external 
        onlyRole(ORGANIZER_ROLE) 
    {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.status == CampaignStatus.ACTIVE, "Not active");

        campaign.status = CampaignStatus.COMPLETED;
        campaign.wasteCollectedKg = _wasteCollectedKg;

        emit CampaignCompleted(_campaignId, _wasteCollectedKg);
    }

    function getCampaign(uint256 _campaignId) external view returns (Campaign memory) {
        return campaigns[_campaignId];
    }

    function getCampaignVolunteers(uint256 _campaignId) external view returns (address[] memory) {
        return campaignVolunteers[_campaignId];
    }

    function getUserCampaigns(address _user) external view returns (uint256[] memory) {
        return userCampaigns[_user];
    }

    function getCampaignCount() external view returns (uint256) {
        return _campaignIds.current();
    }
}
