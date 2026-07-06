// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.19;

interface IStakingPool {
    event Staked(address indexed user, uint256 amount, uint256 lockDuration);
    event Unstaked(address indexed user, uint256 amount);

    function stake(uint256 _amount, uint256 _lockDuration) external;
    function unstake(uint256 _stakeIndex) external;
    function getVotingPower(address _user) external view returns (uint256);
}
