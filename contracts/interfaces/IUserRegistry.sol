// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.19;

interface IUserRegistry {
    event UserRegistered(address indexed user, string username);
    event ReputationUpdated(address indexed user, uint256 newScore);

    function registerUser(string calldata _username, string calldata _profileHash) external;
    function updateReputation(address _user, uint256 _points) external;
    function isRegistered(address _user) external view returns (bool);
}
