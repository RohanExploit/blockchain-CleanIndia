// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title WasteMarketplace
 * @notice Decentralized marketplace for recyclable waste trading
 * @dev Enables verified waste collectors to list and trade recyclable materials
 */
contract WasteMarketplace is Ownable {
    enum ListingStatus { ACTIVE, SOLD, CANCELLED, EXPIRED }

    struct Listing {
        uint256 id;
        address seller;
        string wasteType;
        uint256 quantityKg;
        uint256 pricePerKg;
        string locationHash;
        string qualityCertHash;
        ListingStatus status;
        uint256 createdAt;
        uint256 expiresAt;
    }

    struct Order {
        uint256 id;
        uint256 listingId;
        address buyer;
        uint256 quantity;
        uint256 totalPrice;
        bool fulfilled;
        uint256 createdAt;
    }

    uint256 private _listingCounter;
    uint256 private _orderCounter;
    uint256 public platformFee = 250; // 2.5% in basis points

    mapping(uint256 => Listing) public listings;
    mapping(uint256 => Order) public orders;
    mapping(address => uint256[]) public sellerListings;
    mapping(address => uint256[]) public buyerOrders;
    mapping(address => bool) public verifiedSellers;

    event ListingCreated(uint256 indexed listingId, address indexed seller, string wasteType);
    event OrderPlaced(uint256 indexed orderId, uint256 indexed listingId, address indexed buyer);
    event OrderFulfilled(uint256 indexed orderId);
    event ListingCancelled(uint256 indexed listingId);

    function createListing(
        string calldata _wasteType,
        uint256 _quantityKg,
        uint256 _pricePerKg,
        string calldata _locationHash,
        string calldata _qualityCertHash,
        uint256 _duration
    ) external returns (uint256) {
        require(verifiedSellers[msg.sender], "Not a verified seller");
        require(_quantityKg > 0, "Invalid quantity");
        require(_pricePerKg > 0, "Invalid price");

        _listingCounter++;
        listings[_listingCounter] = Listing({
            id: _listingCounter,
            seller: msg.sender,
            wasteType: _wasteType,
            quantityKg: _quantityKg,
            pricePerKg: _pricePerKg,
            locationHash: _locationHash,
            qualityCertHash: _qualityCertHash,
            status: ListingStatus.ACTIVE,
            createdAt: block.timestamp,
            expiresAt: block.timestamp + _duration
        });

        sellerListings[msg.sender].push(_listingCounter);
        emit ListingCreated(_listingCounter, msg.sender, _wasteType);
        return _listingCounter;
    }

    function placeOrder(uint256 _listingId, uint256 _quantity) external payable returns (uint256) {
        Listing storage listing = listings[_listingId];
        require(listing.status == ListingStatus.ACTIVE, "Listing not active");
        require(block.timestamp < listing.expiresAt, "Listing expired");
        require(_quantity <= listing.quantityKg, "Exceeds available quantity");

        uint256 totalPrice = _quantity * listing.pricePerKg;
        require(msg.value >= totalPrice, "Insufficient payment");

        _orderCounter++;
        orders[_orderCounter] = Order({
            id: _orderCounter,
            listingId: _listingId,
            buyer: msg.sender,
            quantity: _quantity,
            totalPrice: totalPrice,
            fulfilled: false,
            createdAt: block.timestamp
        });

        listing.quantityKg -= _quantity;
        if (listing.quantityKg == 0) listing.status = ListingStatus.SOLD;

        buyerOrders[msg.sender].push(_orderCounter);
        emit OrderPlaced(_orderCounter, _listingId, msg.sender);
        return _orderCounter;
    }

    function verifySeller(address _seller) external onlyOwner {
        verifiedSellers[_seller] = true;
    }

    function getListing(uint256 _id) external view returns (Listing memory) {
        return listings[_id];
    }
}
