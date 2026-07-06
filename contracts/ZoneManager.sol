// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.19;

/**
 * @title ZoneManager
 * @notice Geographic zone management for waste tracking regions
 * @dev Divides areas into zones for efficient waste collection and monitoring
 */
contract ZoneManager {
    struct Zone {
        uint256 id;
        string name;
        string boundaryHash;    // IPFS hash of GeoJSON boundary
        address zoneManager;
        uint256 totalReports;
        uint256 resolvedReports;
        uint256 activeCollectors;
        bool isActive;
    }

    struct Collector {
        address wallet;
        string name;
        uint256 zoneId;
        uint256 collectionsCompleted;
        uint256 totalWasteKg;
        bool isActive;
    }

    uint256 private _zoneCounter;
    mapping(uint256 => Zone) public zones;
    mapping(address => Collector) public collectors;
    mapping(uint256 => address[]) public zoneCollectors;

    address public admin;

    event ZoneCreated(uint256 indexed zoneId, string name);
    event CollectorAssigned(address indexed collector, uint256 indexed zoneId);
    event CollectionRecorded(address indexed collector, uint256 wasteKg);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function createZone(string calldata _name, string calldata _boundaryHash, address _manager) 
        external onlyAdmin returns (uint256) 
    {
        _zoneCounter++;
        zones[_zoneCounter] = Zone({
            id: _zoneCounter,
            name: _name,
            boundaryHash: _boundaryHash,
            zoneManager: _manager,
            totalReports: 0,
            resolvedReports: 0,
            activeCollectors: 0,
            isActive: true
        });

        emit ZoneCreated(_zoneCounter, _name);
        return _zoneCounter;
    }

    function assignCollector(address _collector, string calldata _name, uint256 _zoneId) 
        external onlyAdmin 
    {
        require(zones[_zoneId].isActive, "Zone not active");

        collectors[_collector] = Collector({
            wallet: _collector,
            name: _name,
            zoneId: _zoneId,
            collectionsCompleted: 0,
            totalWasteKg: 0,
            isActive: true
        });

        zoneCollectors[_zoneId].push(_collector);
        zones[_zoneId].activeCollectors++;

        emit CollectorAssigned(_collector, _zoneId);
    }

    function recordCollection(uint256 _wasteKg) external {
        Collector storage collector = collectors[msg.sender];
        require(collector.isActive, "Not an active collector");

        collector.collectionsCompleted++;
        collector.totalWasteKg += _wasteKg;
        zones[collector.zoneId].resolvedReports++;

        emit CollectionRecorded(msg.sender, _wasteKg);
    }

    function getZone(uint256 _zoneId) external view returns (Zone memory) {
        return zones[_zoneId];
    }

    function getCollector(address _addr) external view returns (Collector memory) {
        return collectors[_addr];
    }

    function getZoneCollectors(uint256 _zoneId) external view returns (address[] memory) {
        return zoneCollectors[_zoneId];
    }

    function getZoneCount() external view returns (uint256) {
        return _zoneCounter;
    }
}
