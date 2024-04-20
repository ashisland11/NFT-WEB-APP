import React from "react";
import { useEffect, useState } from "react";
import {
  helloWorldContract,
  connectWallet,
  updateMessage,
  loadCurrentMessage,
  getCurrentWalletConnected,
  handleSubmission,
  mintNFT,
  getERCContract,
  fetchTokenIds,
  mintToken,
  checkBalance
} from "./util/interact.js";

 import NFTlogo from './NFT-LOGO.png'

const HelloWorld = () => {
  //state variables
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("No connection to the network."); //default message
  const [newMessage, setNewMessage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setURL] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [cid, setCid] = useState("");
  const [tokenIds, setTokenIds] = useState([]);
  const [selectedTokenId, setSelectedTokenId] = useState('0'); 
  const [amount, setAmount] = useState(1);
  const [uri, setUri] = useState('');
  const [balance, setBalance] = useState('');


 //called only once
 useEffect(() => {
  async function fetchMessage() {
    const message = await loadCurrentMessage();
    setMessage(message);
  }
  const savedCid = localStorage.getItem('savedCid');
  if (savedCid) {
    setCid(savedCid);
    setURL(`${process.env.REACT_APP_GATEWAY_URL}/ipfs/${savedCid}`)
  }
  fetchMessage();
  addSmartContractListener();

  async function fetchWallet() {
    const {address, status} = await getCurrentWalletConnected();
    setWallet(address);
    setStatus(status); 
  }
  fetchWallet();
  addWalletListener(); 
}, []);

const changeHandler = (event) => {
  setSelectedFile(event.target.files[0]);
};



function addSmartContractListener() {
  helloWorldContract.events.UpdatedMessages({}, (error, data) => {
    if (error) {
      setStatus("😥 " + error.message);
    } else {
      setMessage(data.returnValues[1]);
      setNewMessage("");
      setStatus("🎉 Your message has been updated!");
    }
  });
}
function addWalletListener() {
  if (window.ethereum) {
    window.ethereum.on("accountsChanged", (accounts) => {
      if (accounts.length > 0) {
        setWallet(accounts[0]);
        setStatus("👆🏽 Write a message in the text-field above.");
      } else {
        setWallet("");
        setStatus("🦊 Connect to Metamask using the top right button.");
      }
    });
  } else {
    setStatus(
      <p>
        {" "}
        🦊{" "}
        <a target="_blank" rel="noopener noreferrer" href={`https://metamask.io/download`}>
          You must install Metamask, a virtual Ethereum wallet, in your
          browser.
        </a>
      </p>
    );
  }
}

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };
  const onUpdatePressed = async () => {
    const { status } = await updateMessage(walletAddress, newMessage);
    setStatus(status);
};
const onMintPressed = async () => { 
  const {status}=await mintNFT(url,name,description);
  setStatus(status);
};

  //the UI of our component
  return (
    <div id="container">
      <img id="logo" alt=""  src={NFTlogo} style={{width: '100px',height: 'auto'}}></img>
      <button id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>

      <h2 style={{ paddingTop: "50px" }}>Current Message:</h2>
      <p>{message}</p>

      <h2 style={{ paddingTop: "18px" }}>New Message:</h2>

      <div className="Minter">
        <input
          type="text"
          placeholder="Update the message in your smart contract."
          onChange={(e) => setNewMessage(e.target.value)}
          value={newMessage}
        />
        <p id="status">{status}</p>
        <button id="publish" onClick={onUpdatePressed}>
          Transaction
        </button>
      </div>
      <br></br>
      <div>
      <h1 id="title">🧙‍♂️ Upload Your local image to IPFS</h1>
      <label className="form-label"> Choose File</label>
      <input type="file" onChange={changeHandler} />
      <button onClick={() => handleSubmission(selectedFile, setCid,setURL)}>Submit</button>
      {cid && (
        <a href={`${process.env.REACT_APP_GATEWAY_URL}/ipfs/${cid}`} target="_blank" rel="noopener noreferrer">
            <img
                src={`${process.env.REACT_APP_GATEWAY_URL}/ipfs/${cid}`}
                style={{ objectFit: 'scale-down', width: '200px', height: '150px' }}
                alt="Uploaded to IPFS"
            />
        </a>
    )}
    {!cid && <p style={{ color: "red" }}>Upload file and click "Submit"</p>}
      </div>
      <div>
      <p>
        Simply add your asset's link, name, and description, then press "Mint."
      </p>
      <form>
        <h2>🖼 Link to asset: </h2>
        <input
          value={url} 
          onChange={(event) => setURL(event.target.value)}
          type="text"
          placeholder="e.g. https://gateway.pinata.cloud/ipfs/<hash>"
        />
        <h2>🤔 Name: </h2>
        <input
          type="text"
          placeholder="e.g. My first NFT!"
          onChange={(event) => setName(event.target.value)}
        />
        <h2>✍️ Description: </h2>
        <input
          type="text"
          placeholder="e.g. Even cooler than cryptokitties ;)"
          onChange={(event) => setDescription(event.target.value)}
        />
      </form>
      <button id="mintButton" onClick={onMintPressed}>
        Mint NFT
      </button>
      <p id="status">
        {status}
      </p>
      </div>
      <div>
      <h1 id="title">Mint your ERC1155 tokens</h1>
      <select value={selectedTokenId} onChange={(e) => setSelectedTokenId(e.target.value)}>
        <option value="0">GOLD</option>
        <option value="1">SILVER</option>
        <option value="2">SWORD</option>
        <option value="3">SHIELD</option>
        <option value="4">CROWN</option>
      </select>
      <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount to mint"/>
      <input type="text" value={uri} onChange={(e) => setUri(e.target.value)} placeholder="Token URI"/>
      <button id="ECRButton"  onClick={() => mintToken(selectedTokenId, amount, uri)}>Mint ERC1155 Token</button>
      <button  id="ECRButton"  onClick={() => checkBalance(selectedTokenId, setBalance)}>Check Balance</button>
      <div>Balance of token {selectedTokenId}: {balance}</div>
    </div>
    </div>
  );
};

export default HelloWorld;
