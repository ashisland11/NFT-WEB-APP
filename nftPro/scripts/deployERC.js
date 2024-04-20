async function main() {
    const [deployer] = await ethers.getSigners();
    
    console.log("Deploying contracts with the account:", deployer.address);
    
    const ERCContract = await ethers.getContractFactory("ERCContract");
    const erc_contract = await ERCContract.deploy();
    
    await erc_contract.deployed();
    
    console.log("ECR1155 deployed to:", erc_contract.address);
      
    }
    main()
      .then(() => process.exit(0))
      .catch((error) => {
        console.error(error);
        process.exit(1);
      });