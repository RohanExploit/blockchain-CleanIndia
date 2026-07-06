// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title RewardDistributor
 * @notice Manages reward calculation and distribution for waste cleanup activities
 * @dev Works with CleanIndiaToken for minting rewards based on contribution metrics
 */
contract RewardDistributor is AccessControl, ReentrancyGuard {
    bytes32 public constant DISTRIBUTOR_ROLE = keccak256("DISTRIBUTOR_ROLE");

    struct RewardTier {
        string name;
        uint256 minReports;
        uint256 multiplier; // basis points (10000 = 1x)
        uint256 bonusTokens;
    }

    struct UserRewardInfo {
        uint256 totalEarned;
        uint256 totalClaimed;
        uint256 pendingRewards;
        uint256 reportCount;
        uint256 validationCount;
        uint256 cleanupCount;
        uint8 currentTier;
    }

    mapping(address => UserRewardInfo) public userRewards;
    RewardTier[] public rewardTiers;

    uint256 public constant REPORT_REWARD = 10 * 10**18;
    uint256 public constant VALIDATION_REWARD = 5 * 10**18;
    uint256 public constant CLEANUP_REWARD = 50 * 10**18;
    uint256 public constant STREAK_BONUS = 2 * 10**18;

    mapping(address => uint256) public lastActivityDay;
    mapping(address => uint256) public streakCount;

    event RewardAccrued(address indexed user, uint256 amount, string activityType);
    event RewardClaimed(address indexed user, uint256 amount);
    event TierUpgrade(address indexed user, uint8 newTier);
    event StreakBonus(address indexed user, uint256 streakDays, uint256 bonusAmount);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(DISTRIBUTOR_ROLE, msg.sender);

        // Initialize reward tiers
        rewardTiers.push(RewardTier("Bronze", 0, 10000, 0));
        rewardTiers.push(RewardTier("Silver", 10, 12000, 100 * 10**18));
        rewardTiers.push(RewardTier("Gold", 50, 15000, 500 * 10**18));
        rewardTiers.push(RewardTier("Platinum", 200, 20000, 2000 * 10**18));
        rewardTiers.push(RewardTier("Diamond", 500, 30000, 10000 * 10**18));
    }

    /**
     * @notice Record a report activity and accrue rewards
     * @param _user Address of the reporter
     */
    function accrueReportReward(address _user) external onlyRole(DISTRIBUTOR_ROLE) {
        UserRewardInfo storage info = userRewards[_user];
        uint256 reward = _applyMultiplier(_user, REPORT_REWARD);

        info.reportCount++;
        info.pendingRewards += reward;
        info.totalEarned += reward;

        _checkStreak(_user);
        _checkTierUpgrade(_user);

        emit RewardAccrued(_user, reward, "report");
    }

    /**
     * @notice Record a validation activity and accrue rewards
     */
    function accrueValidationReward(address _user) external onlyRole(DISTRIBUTOR_ROLE) {
        UserRewardInfo storage info = userRewards[_user];
        uint256 reward = _applyMultiplier(_user, VALIDATION_REWARD);

        info.validationCount++;
        info.pendingRewards += reward;
        info.totalEarned += reward;

        _checkStreak(_user);

        emit RewardAccrued(_user, reward, "validation");
    }

    /**
     * @notice Record a cleanup activity and accrue rewards
     */
    function accrueCleanupReward(address _user) external onlyRole(DISTRIBUTOR_ROLE) {
        UserRewardInfo storage info = userRewards[_user];
        uint256 reward = _applyMultiplier(_user, CLEANUP_REWARD);

        info.cleanupCount++;
        info.pendingRewards += reward;
        info.totalEarned += reward;

        _checkStreak(_user);
        _checkTierUpgrade(_user);

        emit RewardAccrued(_user, reward, "cleanup");
    }

    /**
     * @notice Get user's current tier info
     */
    function getUserTier(address _user) external view returns (RewardTier memory) {
        return rewardTiers[userRewards[_user].currentTier];
    }

    /**
     * @notice Get user's complete reward info
     */
    function getUserRewardInfo(address _user) external view returns (UserRewardInfo memory) {
        return userRewards[_user];
    }

    function _applyMultiplier(address _user, uint256 _baseAmount) internal view returns (uint256) {
        uint8 tier = userRewards[_user].currentTier;
        return (_baseAmount * rewardTiers[tier].multiplier) / 10000;
    }

    function _checkStreak(address _user) internal {
        uint256 today = block.timestamp / 1 days;
        if (lastActivityDay[_user] == today - 1) {
            streakCount[_user]++;
            if (streakCount[_user] % 7 == 0) {
                uint256 bonus = STREAK_BONUS * (streakCount[_user] / 7);
                userRewards[_user].pendingRewards += bonus;
                emit StreakBonus(_user, streakCount[_user], bonus);
            }
        } else if (lastActivityDay[_user] != today) {
            streakCount[_user] = 1;
        }
        lastActivityDay[_user] = today;
    }

    function _checkTierUpgrade(address _user) internal {
        UserRewardInfo storage info = userRewards[_user];
        uint256 totalActivities = info.reportCount + info.cleanupCount;

        for (uint8 i = uint8(rewardTiers.length - 1); i > info.currentTier; i--) {
            if (totalActivities >= rewardTiers[i].minReports) {
                info.currentTier = i;
                info.pendingRewards += rewardTiers[i].bonusTokens;
                emit TierUpgrade(_user, i);
                break;
            }
        }
    }
}
