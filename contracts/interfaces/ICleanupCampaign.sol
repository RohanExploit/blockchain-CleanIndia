// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.19;

interface ICleanupCampaign {
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

    event CampaignCreated(uint256 indexed campaignId, address indexed organizer, string title);
    event VolunteerRegistered(uint256 indexed campaignId, address indexed volunteer);
    event VolunteerUnregistered(uint256 indexed campaignId, address indexed volunteer);

    function createCampaign(
        string calldata _title,
        string calldata _description,
        string calldata _locationHash,
        uint256 _startTime,
        uint256 _endTime,
        uint256 _maxVolunteers,
        uint256 _rewardPerVolunteer
    ) external returns (uint256);

    function registerVolunteer(uint256 _campaignId) external;
}
