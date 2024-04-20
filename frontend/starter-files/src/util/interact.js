//export const helloWorldContract;
import React from 'react';
import axios from 'axios';
import { ethers } from 'ethers';


const contractABI = require("../contract-abi.json");
const contractAddress = '0xE7fB6BCbc0C4d2F23DFD4d2D3B30c8E758c9f052';

const NFTcontractABI=require('../nft-contract-abi.json')
const NFTcontractAddress='0xFc79973984cD3C581d22fB19a7660966Be880448'

const ECRcontractABI=require('../ecr-contract-abi.json')
const ECRcontractAddress='0x87130f07A702570f3BFbab5Af6E52133f5e6e84d'

const alchemyKey = "wss://eth-sepolia.g.alchemy.com/v2/68Q6Ct2SUFm90rXgyhiYF3GFl7LiHw7i"
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey); 

export const helloWorldContract = new web3.eth.Contract(
    contractABI,
    contractAddress
  );

export const loadCurrentMessage = async () => { 
  
};

export const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const addressArray = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const obj = {
          status: "👆🏽 Write a message in the text-field above.",
          address: addressArray[0],
        };
        return obj;
      } catch (err) {
        return {
          address: "",
          status: "😥 " + err.message,
        };
      }
    } else {
      return {
        address: "",
        status: (
          <span>
            <p>
              {" "}
              🦊{" "}
              <a target="_blank" rel="noopener noreferrer" href={`https://metamask.io/download`}>
                You must install Metamask, a virtual Ethereum wallet, in your
                browser.
              </a>
            </p>
          </span>
        ),
      };
    }
  };

  export const getCurrentWalletConnected = async () => {
    if (window.ethereum) {
      try {
        const addressArray = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (addressArray.length > 0) {
          return {
            address: addressArray[0],
            status: "👆🏽 Write a message in the text-field above.",
          };
        } else {
          return {
            address: "",
            status: "🦊 Connect to Metamask using the top right button.",
          };
        }
      } catch (err) {
        return {
          address: "",
          status: "😥 " + err.message,
        };
      }
    } else {
      return {
        address: "",
        status: (
          <span>
            <p>
              {" "}
              🦊{" "}
              <a target="_blank" rel="noopener noreferrer" href={`https://metamask.io/download`}>
                You must install Metamask, a virtual Ethereum wallet, in your
                browser.
              </a>
            </p>
          </span>
        ),
      };
    }
  };

  export const updateMessage = async (address, message) => {

    //input error handling
    if (!window.ethereum || address === null) {
      return {
        status:
          "💡 Connect your Metamask wallet to update the message on the blockchain.",
      };
    }
  
    if (message.trim() === "") {
      return {
        status: "❌ Your message cannot be an empty string.",
      };
    }
  
    //set up transaction parameters
    const transactionParameters = {
      to: contractAddress, // Required except during contract publications.
      from: address, // must match user's active address.
      data: helloWorldContract.methods.update(message).encodeABI(),
    };
  
    //sign the transaction
    try {
      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [transactionParameters],
      });
      return {
        status: (
          <span role="img" aria-label="na">
            ✅{" "}
            <a target="_blank" rel="noopener noreferrer" href={`https://sepolia.etherscan.io/tx/${txHash}`}>
              View the status of your transaction on Etherscan!
            </a>
            <br />
            ℹ️ Once the transaction is verified by the network, the message will
            be updated automatically.
          </span>
        ),
      };
    } catch (error) {
      return {
        status: "😥 " + error.message,
      };
    }
  };

  //uoload file to ipfs
export const handleSubmission = async (selectedFile, setCid,setURL) => {
  try {
    const formData = new FormData();
    formData.append("file", selectedFile);
    const metadata = JSON.stringify({
      name: "File name",
    });
    formData.append("pinataMetadata", metadata);

    const options = JSON.stringify({
      cidVersion: 0,
    });
    formData.append("pinataOptions", options);

    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_PINATA_JWT}`,
      },
      body: formData,
    });
    const resData = await res.json();
    const hashData=resData.IpfsHash
    setCid(hashData);
    setURL(`${process.env.REACT_APP_GATEWAY_URL}/ipfs/${hashData}`)
    localStorage.setItem('savedCid', hashData);
    console.log(resData,"-----");
  } catch (error) {
    console.error(error);
  }
};

export const createNFT = async (metadata) => {
 

  try {
      const data = JSON.stringify({metadata});

      const res = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", data, {
          headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${process.env.REACT_APP_PINATA_JWT}`
          }
      });

      if (res.status !== 200) {
          return {
              success: false,
              status: "😢 Something went wrong while uploading your tokenURI.",
          };
      }

      const pinataResponse = res.data;
      const pinataUrl = `${process.env.REACT_APP_GATEWAY_URL}/ipfs/${pinataResponse.IpfsHash}`;

      return {
          success: true,
          status: "🎉 Your NFT has been successfully created and uploaded.",
          pinataUrl: pinataUrl
      };
  } catch (error) {
      console.error("Failed to upload NFT metadata to Pinata:", error);
      return {
          success: false,
          status: "❗Error while communicating with Pinata: " + error.message
      };
  }
};

export const mintNFT= async(imageUrL, name, description)=>{
     //error handling
     if (imageUrL.trim() == "" || (name.trim() == "" || description.trim() == "")) { 
      return {
          success: false,
          status: "❗Please make sure all fields are completed before minting.",
      }
  }

  const metadata = {
    name: name,
    description: description,
    image: imageUrL,
    external_url: "https://pinata.cloud"  
};

    const pinataResponse = await createNFT(metadata);
    if (!pinataResponse.success) {
        return {
            success: false,
            status: "😢 Something went wrong while uploading your tokenURI.",
        }
    } 
    const tokenURI = pinataResponse.pinataUrl;  

    window.contract = await new web3.eth.Contract(NFTcontractABI, NFTcontractAddress);

    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (accounts.length === 0) {
        return {
            success: false,
            status: "🚫 No connected account. Please connect to MetaMask and try again."
        };
    }
    const currentAccount = accounts[0];  
   
    const transactionParameters = {
        to: NFTcontractAddress,
        from: currentAccount,
        // data:mintNFTContract.methods.mintNFT(currentAccount, tokenURI).encodeABI() 
        'data': window.contract.methods.mintNFT(currentAccount, tokenURI).encodeABI() //call 
    };


    //sign transaction via Metamask
    try {
        const txHash = await window.ethereum
            .request({
                method: 'eth_sendTransaction',
                params: [transactionParameters],
            });
        return {
            success: true,
            status: "✅ Check out your transaction on Etherscan: https://sepolia.etherscan.io/tx/" + txHash
        }
    } catch (error) {
        return {
            success: false,
            status: "😥 Something went wrong: " + error.message
        }
      }
}

const provider = new ethers.providers.Web3Provider(window.ethereum);

async function requestAccount() {
  await provider.send("eth_requestAccounts", []);
}


export async function getERCContract() {
  await requestAccount();  //make sure users have connected to wallet
  const signer = provider.getSigner();
  const contract = new ethers.Contract(ECRcontractAddress, ECRcontractABI, signer);
  return contract;
}

export const fetchTokenIds = async (setTokenIds) => {
  try {
      const contract = await getERCContract();
      const ids = await contract.getAllTokenData();
      setTokenIds(ids.map(id => id.toNumber())); 
  } catch (error) {
      console.error('Error fetching token IDs:', error);
  }
};
  
export const mintToken = async (tokenId, amount, uri) => {
  const contract = await getERCContract();
  try {
    const transaction = await contract.mintToken(tokenId, amount, uri, await contract.signer.getAddress());
    await transaction.wait();
    console.log('Token minted successfully');
  } catch (error) {
    console.error('Error minting token:', error);
  }
};


export const checkBalance = async (tokenId,setBalanceCallback) => {
  try {
    const contract = getERCContract();
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const balance = await contract.balanceOf(address, tokenId);
    setBalanceCallback(balance.toString());
  } catch (error) {
    console.error('Error retrieving balance:', error);
  }
};
