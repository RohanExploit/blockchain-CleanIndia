// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title ImpactNFT
 * @notice NFT badges minted for environmental impact achievements
 * @dev Each NFT represents a verified cleanup milestone or achievement
 */
contract ImpactNFT is ERC721, ERC721URIStorage, AccessControl {
    using Counters for Counters.Counter;
    
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    Counters.Counter private _tokenIds;

    enum BadgeType { FIRST_REPORT, CLEANUP_HERO, COMMUNITY_LEADER, ECO_WARRIOR, DIAMOND_CONTRIBUTOR }

    struct Badge {
        BadgeType badgeType;
        uint256 mintTimestamp;
        string achievement;
        uint256 impactScore;
    }

    mapping(uint256 => Badge) public badges;
    mapping(address => mapping(BadgeType => bool)) public hasBadge;
    mapping(BadgeType => uint256) public badgeMintCount;

    event BadgeMinted(address indexed to, uint256 indexed tokenId, BadgeType badgeType);

    constructor() ERC721("CleanIndia Impact Badge", "CIB") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    function mintBadge(
        address _to,
        BadgeType _badgeType,
        string calldata _tokenURI,
        string calldata _achievement,
        uint256 _impactScore
    ) external onlyRole(MINTER_ROLE) returns (uint256) {
        require(!hasBadge[_to][_badgeType], "Badge already earned");

        _tokenIds.increment();
        uint256 tokenId = _tokenIds.current();

        _safeMint(_to, tokenId);
        _setTokenURI(tokenId, _tokenURI);

        badges[tokenId] = Badge({
            badgeType: _badgeType,
            mintTimestamp: block.timestamp,
            achievement: _achievement,
            impactScore: _impactScore
        });

        hasBadge[_to][_badgeType] = true;
        badgeMintCount[_badgeType]++;

        emit BadgeMinted(_to, tokenId, _badgeType);
        return tokenId;
    }

    function getBadge(uint256 _tokenId) external view returns (Badge memory) {
        require(_exists(_tokenId), "Badge does not exist");
        return badges[_tokenId];
    }

    // Required overrides
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
