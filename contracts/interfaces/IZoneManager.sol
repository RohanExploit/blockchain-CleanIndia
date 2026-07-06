// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.19;

interface IZoneManager {
    event ZoneCreated(uint256 indexed zoneId, string name);
    event CollectorAssigned(address indexed collector, uint256 indexed zoneId);

    function createZone(string calldata _name, string calldata _boundaryHash, address _manager) external returns (uint256);
    function assignCollector(address _collector, string calldata _name, uint256 _zoneId) external;
    function recordCollection(uint256 _wasteKg) external;
}
