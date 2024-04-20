require('dotenv').config();
const ethers = require('ethers');

// Configure environment variables and providers
const API_URL = process.env.API_URL;
const privateKey = process.env.PRIVATE_KEY;
const contractAddress = process.env.NFT_CONTRACT_ADDRESS;

// Define an Alchemy Provider
const alchemyProvider = new ethers.providers.JsonRpcProvider(API_URL);

// Get contract ABI
const contract = require("../artifacts/contracts/MyNFT.sol/MyNFT.json");
const abi = contract.abi;

// Create a signer
const signer = new ethers.Wallet(privateKey, alchemyProvider);

// Create a contract instance
const myNftContract = new ethers.Contract(contractAddress, abi, signer);

// Modified mintNFT function to accept tokenUri dynamically
const mintNFT = async (tokenUri) => {
    try {
        let nftTxn = await myNftContract.mintNFT(signer.address, tokenUri);
        await nftTxn.wait();
        console.log(`NFT Minted! Check it out at: https://sepolia.etherscan.io/tx/${nftTxn.hash}`);
    } catch (error) {
        console.error("Error minting NFT:", error);
    }
};


