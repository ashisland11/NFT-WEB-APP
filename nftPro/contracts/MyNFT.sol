// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenId; 
    constructor() ERC721("MyNFT", "NFT") {
        _tokenId = 0; 
    }

    function mintNFT(address recipient, string memory tokenURI)
        public
        onlyOwner
        returns (uint256)
    {
        _tokenId++; // 增加tokenId

        uint256 newItemId = _tokenId; 
        _mint(recipient, newItemId); 
        _setTokenURI(newItemId, tokenURI); 

        return newItemId;
    }
}
