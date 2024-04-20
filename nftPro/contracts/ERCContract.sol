// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ERCContract is ERC1155, Ownable {
    uint256 public constant GOLD = 0;
    uint256 public constant SILVER = 1;
    uint256 public constant SWORD = 2;
    uint256 public constant SHIELD = 3;
    uint256 public constant CROWN = 4;

    mapping (uint256 => string) private _tokenURIs; // Dynamic URI management

    constructor() ERC1155("https://azure-written-vulture-181.mypinata.cloud/ipfs/QmSVAYh1RXPntbeDvh8voe3ogFZmLSRPqHkqgiVGxD56Dp") {
        _mint(msg.sender, GOLD, 10**18, "");
        _mint(msg.sender, SILVER, 10**18, "");
        _mint(msg.sender, SWORD, 1000, "");
        _mint(msg.sender, SHIELD, 1000, "");
        _mint(msg.sender, CROWN, 1, "");

        // Setting URIs for each token type right after minting
        setTokenURI(GOLD, "https://azure-written-vulture-181.mypinata.cloud/ipfs/QmUTcUWZGPRYaeUti6sNoKm4gx4mu6YaKUvqnrFroJt9FE");
        setTokenURI(SILVER, "https://azure-written-vulture-181.mypinata.cloud/ipfs/QmZqX86Xe5HP94c614MaN6T6L6uSchCK6onoDnF7ZrPPuP");
        setTokenURI(SWORD, "https://azure-written-vulture-181.mypinata.cloud/ipfs/QmRPqfntaRY5yJopH3BharyBJFrvTAgQNBeevY1ZJG42FW");
        setTokenURI(SHIELD, "https://azure-written-vulture-181.mypinata.cloud/ipfs/QmSwDCB2WMFLgF8FLcwHBtR7ajDWSeCeQT1JMTrCszswn4");
        setTokenURI(CROWN, "https://azure-written-vulture-181.mypinata.cloud/ipfs/QmW5EkvPQGz5bjZhNjyuPk51oP33WzJ73BfWqEYVnHdphT");
    }

    function setTokenURI(uint256 tokenId, string memory newURI) public onlyOwner {
        _tokenURIs[tokenId] = newURI;
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        return _tokenURIs[tokenId];
    }

    // Function to retrieve all token IDs and URIs
    function getAllTokenData() public view returns (uint256[] memory, string[] memory) {
        uint256[] memory ids = new uint256[](5);
        string[] memory uris = new string[](5);
        ids[0] = GOLD; uris[0] = uri(GOLD);
        ids[1] = SILVER; uris[1] = uri(SILVER);
        ids[2] = SWORD; uris[2] = uri(SWORD);
        ids[3] = SHIELD; uris[3] = uri(SHIELD);
        ids[4] = CROWN; uris[4] = uri(CROWN);
        return (ids, uris);
    }

     function mintToken(uint256 tokenId, uint256 amount, string memory newURI, address to) public onlyOwner {
        require(tokenId <= CROWN, "Token ID does not exist.");
        _mint(to, tokenId, amount, "");
        setTokenURI(tokenId, newURI);
    }
}
