// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.19;

interface IImpactNFT {
    enum BadgeType { FIRST_REPORT, CLEANUP_HERO, COMMUNITY_LEADER, ECO_WARRIOR, DIAMOND_CONTRIBUTOR }

    event BadgeMinted(address indexed to, uint256 indexed tokenId, BadgeType badgeType);

    function mintBadge(
        address _to,
        BadgeType _badgeType,
        string calldata _tokenURI,
        string calldata _achievement,
        uint256 _impactScore
    ) external returns (uint256);
}
