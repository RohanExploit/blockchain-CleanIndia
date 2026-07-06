// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.19;

interface IWasteMarketplace {
    event ListingCreated(uint256 indexed listingId, address indexed seller, string wasteType);
    event OrderPlaced(uint256 indexed orderId, uint256 indexed listingId, address indexed buyer);

    function createListing(
        string calldata _wasteType,
        uint256 _quantityKg,
        uint256 _pricePerKg,
        string calldata _locationHash,
        string calldata _qualityCertHash,
        uint256 _duration
    ) external returns (uint256);

    function placeOrder(uint256 _listingId, uint256 _quantity) external payable returns (uint256);
}
