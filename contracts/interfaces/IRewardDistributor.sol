// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.19;

interface IRewardDistributor {
    struct RewardTier {
        string name;
        uint256 minReports;
        uint256 multiplier;
        uint256 bonusTokens;
    }

    event RewardAccrued(address indexed user, uint256 amount, string activityType);
    event RewardClaimed(address indexed user, uint256 amount);

    function accrueReportReward(address _user) external;
    function accrueValidationReward(address _user) external;
    function accrueCleanupReward(address _user) external;
}
