// SPDX-License-Identifier: MIT

pragma solidity ^0.8.27;

contract PortfolioManager {
    struct Asset {
        string assetId;
        uint256 amount;
    }

    mapping(address => Asset[]) private userAssets;

    event AssetAdded(address indexed user, string assetId, uint256 amount);

    function addAsset(string memory _assetId, uint256 _amount) public {
        require(_amount > 0, "Amount must be greater than zero");
        userAssets[msg.sender].push(Asset(_assetId, _amount));
        emit AssetAdded(msg.sender, _assetId, _amount);
    }

    function getAssets() public view returns (Asset[] memory) {
        return userAssets[msg.sender];
    }
}
