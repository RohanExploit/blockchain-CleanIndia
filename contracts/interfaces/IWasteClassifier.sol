// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.19;

interface IWasteClassifier {
    event WasteClassified(uint256 indexed reportId, string category, uint256 confidence);

    function classifyWaste(
        uint256 _reportId,
        string calldata _category,
        uint256 _confidenceScore,
        string calldata _modelVersion
    ) external;
}
