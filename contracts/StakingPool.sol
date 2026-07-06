// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title StakingPool
 * @notice Token staking for governance weight and reward multipliers
 * @dev Users stake CIT tokens to earn voting power and enhanced rewards
 */
contract StakingPool is AccessControl, Pausable {
    bytes32 public constant POOL_MANAGER = keccak256("POOL_MANAGER");

    struct StakeInfo {
        uint256 amount;
        uint256 startTime;
        uint256 lockDuration;
        uint256 rewardDebt;
        bool active;
    }

    mapping(address => StakeInfo[]) public userStakes;
    mapping(address => uint256) public totalStakedByUser;

    uint256 public totalStaked;
    uint256 public rewardRate; // tokens per second per staked token (in wei)
    uint256 public lastUpdateTime;
    uint256 public rewardPerTokenStored;

    uint256 public constant MIN_STAKE = 100 * 10**18;
    uint256 public constant MIN_LOCK_DURATION = 7 days;
    uint256 public constant MAX_LOCK_DURATION = 365 days;

    uint256[] public lockMultipliers; // basis points for different lock durations

    event Staked(address indexed user, uint256 amount, uint256 lockDuration);
    event Unstaked(address indexed user, uint256 amount);
    event RewardClaimed(address indexed user, uint256 reward);

    constructor(uint256 _rewardRate) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(POOL_MANAGER, msg.sender);
        rewardRate = _rewardRate;

        // Lock multipliers: 7d=1x, 30d=1.5x, 90d=2x, 180d=3x, 365d=5x
        lockMultipliers.push(10000);
        lockMultipliers.push(15000);
        lockMultipliers.push(20000);
        lockMultipliers.push(30000);
        lockMultipliers.push(50000);
    }

    function stake(uint256 _amount, uint256 _lockDuration) external whenNotPaused {
        require(_amount >= MIN_STAKE, "Below minimum stake");
        require(_lockDuration >= MIN_LOCK_DURATION, "Lock too short");
        require(_lockDuration <= MAX_LOCK_DURATION, "Lock too long");

        userStakes[msg.sender].push(StakeInfo({
            amount: _amount,
            startTime: block.timestamp,
            lockDuration: _lockDuration,
            rewardDebt: 0,
            active: true
        }));

        totalStakedByUser[msg.sender] += _amount;
        totalStaked += _amount;

        emit Staked(msg.sender, _amount, _lockDuration);
    }

    function unstake(uint256 _stakeIndex) external {
        require(_stakeIndex < userStakes[msg.sender].length, "Invalid index");
        StakeInfo storage stakeInfo = userStakes[msg.sender][_stakeIndex];
        require(stakeInfo.active, "Already unstaked");
        require(block.timestamp >= stakeInfo.startTime + stakeInfo.lockDuration, "Still locked");

        stakeInfo.active = false;
        totalStakedByUser[msg.sender] -= stakeInfo.amount;
        totalStaked -= stakeInfo.amount;

        emit Unstaked(msg.sender, stakeInfo.amount);
    }

    function getStakes(address _user) external view returns (StakeInfo[] memory) {
        return userStakes[_user];
    }

    function getVotingPower(address _user) external view returns (uint256) {
        uint256 power = 0;
        StakeInfo[] storage stakes = userStakes[_user];
        for (uint256 i = 0; i < stakes.length; i++) {
            if (stakes[i].active) {
                uint256 multiplier = _getLockMultiplier(stakes[i].lockDuration);
                power += (stakes[i].amount * multiplier) / 10000;
            }
        }
        return power;
    }

    function _getLockMultiplier(uint256 _duration) internal view returns (uint256) {
        if (_duration >= 365 days) return lockMultipliers[4];
        if (_duration >= 180 days) return lockMultipliers[3];
        if (_duration >= 90 days) return lockMultipliers[2];
        if (_duration >= 30 days) return lockMultipliers[1];
        return lockMultipliers[0];
    }

    function pause() external onlyRole(POOL_MANAGER) { _pause(); }
    function unpause() external onlyRole(POOL_MANAGER) { _unpause(); }
}
