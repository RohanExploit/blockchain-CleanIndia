# CleanIndia Smart Contract Architecture

Functional documentation for developers building on the Clean India protocol.

## CleanIndiaToken.sol

Extends `ERC20`, `ERC20Burnable`, and `AccessControl`.

### Write Methods

- `mintReward(address to, uint256 amount, string reason)`:
  - Caller must have `MINTER_ROLE`.
  - Mints standard ERC-20 utility tokens to target user up to `MAX_SUPPLY`.

- `batchDistribute(address[] recipients, uint256[] amounts)`:
  - Distributes token batches up to 100 addresses in a single block.

## WasteReport.sol

Extends `AccessControl` and `ReentrancyGuard`.

### Core Structures

```solidity
struct Report {
    uint256 id;
    address reporter;
    string locationHash;
    string imageHash;
    string description;
    WasteType wasteType;
    Severity severity;
    ReportStatus status;
    uint256 timestamp;
    uint256 validationCount;
    uint256 rewardAmount;
    bool rewardClaimed;
}
```

### Write Methods

- `submitReport(string _locationHash, string _imageHash, string _description, WasteType _wasteType, Severity _severity)`:
  - Submits a waste incident report. Registers geolocation metadata and assigns starting validation requirements.
- `validateReport(uint256 _reportId)`:
  - Increments validation counter. Self-validates report state once minimum threshold of 3 validations is reached.
