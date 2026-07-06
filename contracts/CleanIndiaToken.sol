// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title CleanIndiaToken (CIT)
 * @notice ERC-20 reward token for the Clean India blockchain initiative
 * @dev Minted as rewards for waste reporting, cleanup participation, and governance
 */
contract CleanIndiaToken is ERC20, ERC20Burnable, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    uint256 public constant MAX_SUPPLY = 100_000_000 * 10**18; // 100M tokens
    uint256 public totalMinted;

    mapping(address => uint256) public lastClaimTimestamp;
    uint256 public constant CLAIM_COOLDOWN = 1 days;

    event TokensMinted(address indexed to, uint256 amount, string reason);
    event RewardDistributed(address indexed recipient, uint256 amount);

    constructor() ERC20("Clean India Token", "CIT") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);

        // Initial supply: 10M tokens to treasury
        uint256 initialSupply = 10_000_000 * 10**18;
        _mint(msg.sender, initialSupply);
        totalMinted = initialSupply;
    }

    /**
     * @notice Mint tokens as rewards
     * @param to Recipient address
     * @param amount Number of tokens to mint
     * @param reason Description of why tokens are minted
     */
    function mintReward(address to, uint256 amount, string calldata reason) 
        external 
        onlyRole(MINTER_ROLE) 
    {
        require(totalMinted + amount <= MAX_SUPPLY, "Exceeds max supply");
        require(to != address(0), "Invalid recipient");

        totalMinted += amount;
        _mint(to, amount);

        emit TokensMinted(to, amount, reason);
    }

    /**
     * @notice Distribute rewards to multiple addresses
     * @param recipients Array of recipient addresses
     * @param amounts Array of token amounts
     */
    function batchDistribute(address[] calldata recipients, uint256[] calldata amounts) 
        external 
        onlyRole(MINTER_ROLE) 
    {
        require(recipients.length == amounts.length, "Length mismatch");
        require(recipients.length <= 100, "Batch too large");

        for (uint256 i = 0; i < recipients.length; i++) {
            require(recipients[i] != address(0), "Invalid recipient");
            uint256 amount = amounts[i];
            require(totalMinted + amount <= MAX_SUPPLY, "Exceeds max supply");

            totalMinted += amount;
            _mint(recipients[i], amount);

            emit RewardDistributed(recipients[i], amount);
        }
    }

    /**
     * @notice Check remaining mintable supply
     */
    function remainingSupply() external view returns (uint256) {
        return MAX_SUPPLY - totalMinted;
    }
}
