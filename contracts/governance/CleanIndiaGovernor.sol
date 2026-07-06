// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol";

/**
 * @title CleanIndiaGovernor
 * @notice On-chain governance for the Clean India DAO
 * @dev Uses OpenZeppelin Governor with timelock for proposal execution
 */
contract CleanIndiaGovernor is 
    Governor, 
    GovernorCountingSimple, 
    GovernorVotes, 
    GovernorVotesQuorumFraction, 
    GovernorTimelockControl 
{
    uint256 private _votingDelay_;
    uint256 private _votingPeriod_;
    uint256 private _proposalThreshold_;

    constructor(
        IVotes _token,
        TimelockController _timelock,
        uint256 votingDelay_,
        uint256 votingPeriod_,
        uint256 proposalThreshold_
    )
        Governor("CleanIndiaGovernor")
        GovernorVotes(_token)
        GovernorVotesQuorumFraction(4) // 4% quorum
        GovernorTimelockControl(_timelock)
    {
        _votingDelay_ = votingDelay_;
        _votingPeriod_ = votingPeriod_;
        _proposalThreshold_ = proposalThreshold_;
    }

    function votingDelay() public view override returns (uint256) {
        return _votingDelay_; // e.g., 1 day in blocks
    }

    function votingPeriod() public view override returns (uint256) {
        return _votingPeriod_; // e.g., 1 week in blocks
    }

    function proposalThreshold() public view override returns (uint256) {
        return _proposalThreshold_;
    }

    // Required overrides
    function state(uint256 proposalId)
        public view override(Governor, GovernorTimelockControl) returns (ProposalState)
    {
        return super.state(proposalId);
    }

    function propose(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description
    ) public override(Governor) returns (uint256) {
        return super.propose(targets, values, calldatas, description);
    }

    function _execute(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) {
        super._execute(proposalId, targets, values, calldatas, descriptionHash);
    }

    function _cancel(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) returns (uint256) {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }

    function _executor()
        internal view override(Governor, GovernorTimelockControl) returns (address)
    {
        return super._executor();
    }

    function supportsInterface(bytes4 interfaceId)
        public view override(Governor, GovernorTimelockControl) returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
