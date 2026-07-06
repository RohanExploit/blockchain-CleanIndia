// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title UserRegistry
 * @notice On-chain user identity and reputation management
 * @dev Manages user profiles, KYC status, and reputation scores
 */
contract UserRegistry is AccessControl {
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");

    enum KYCStatus { UNVERIFIED, PENDING, VERIFIED, REJECTED }

    struct UserProfile {
        address wallet;
        string username;
        string profileHash;     // IPFS hash of profile data
        KYCStatus kycStatus;
        uint256 reputationScore;
        uint256 reportCount;
        uint256 validationCount;
        uint256 campaignCount;
        uint256 registrationDate;
        bool isActive;
    }

    mapping(address => UserProfile) public users;
    mapping(string => address) public usernameToAddress;
    address[] public registeredUsers;

    uint256 public totalUsers;

    event UserRegistered(address indexed user, string username);
    event ProfileUpdated(address indexed user);
    event KYCStatusChanged(address indexed user, KYCStatus newStatus);
    event ReputationUpdated(address indexed user, uint256 newScore);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(VERIFIER_ROLE, msg.sender);
    }

    function registerUser(string calldata _username, string calldata _profileHash) external {
        require(!users[msg.sender].isActive, "Already registered");
        require(usernameToAddress[_username] == address(0), "Username taken");
        require(bytes(_username).length >= 3 && bytes(_username).length <= 32, "Invalid username length");

        users[msg.sender] = UserProfile({
            wallet: msg.sender,
            username: _username,
            profileHash: _profileHash,
            kycStatus: KYCStatus.UNVERIFIED,
            reputationScore: 0,
            reportCount: 0,
            validationCount: 0,
            campaignCount: 0,
            registrationDate: block.timestamp,
            isActive: true
        });

        usernameToAddress[_username] = msg.sender;
        registeredUsers.push(msg.sender);
        totalUsers++;

        emit UserRegistered(msg.sender, _username);
    }

    function updateProfile(string calldata _profileHash) external {
        require(users[msg.sender].isActive, "Not registered");
        users[msg.sender].profileHash = _profileHash;
        emit ProfileUpdated(msg.sender);
    }

    function verifyKYC(address _user) external onlyRole(VERIFIER_ROLE) {
        require(users[_user].isActive, "User not registered");
        users[_user].kycStatus = KYCStatus.VERIFIED;
        users[_user].reputationScore += 100;
        emit KYCStatusChanged(_user, KYCStatus.VERIFIED);
    }

    function updateReputation(address _user, uint256 _points) external onlyRole(VERIFIER_ROLE) {
        require(users[_user].isActive, "User not registered");
        users[_user].reputationScore += _points;
        emit ReputationUpdated(_user, users[_user].reputationScore);
    }

    function getUser(address _user) external view returns (UserProfile memory) {
        return users[_user];
    }

    function isRegistered(address _user) external view returns (bool) {
        return users[_user].isActive;
    }
}
