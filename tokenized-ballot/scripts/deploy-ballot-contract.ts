import { ethers } from "hardhat";
import { TokenizedBallot__factory } from "../typechain-types";
import * as dotenv from 'dotenv'
import { Provider } from "@ethersproject/abstract-provider";
dotenv.config();

const getMySigners = async (privateKeys: string[], provider: Provider) => {
  const signers = []
  for(let index=0; index < privateKeys.length; index ++){
    const wallet = new ethers.Wallet(privateKeys[index]);
    const signer = wallet.connect(provider);
    signers.push(signer);
    console.log(`Signer ${index+1} address: ${signer.address}`);
  }
  return signers;
} 
const MINT_VALUE = ethers.utils.parseUnits("10");

async function main() {
  const provider = new ethers.providers.EtherscanProvider("maticmum", process.env.ETHERSCAN_API_KEY);
  const privateKeys = [process.env.PRIVATE_KEY?? ""];
  const [deployer] = await getMySigners(privateKeys, provider); 
  const proposals =  process.argv.slice(2);
  console.log("Proposals: ");
  proposals.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`);
  });
  
  const tokenContractAddress = "0x6FD3943A4Fe36366dF04a417E2Dc610D3a08F4Fa";
 //Ballot contract 
  const latestBlock = await provider.getBlockNumber()
  console.log("mumbai current block: ", latestBlock)
  const ballotFactory = new TokenizedBallot__factory(deployer);
  const ballotContract = await ballotFactory.deploy(
    proposals.map(ethers.utils.formatBytes32String), tokenContractAddress, latestBlock
  );
  const deployTxReceipt = await ballotContract.deployTransaction.wait();
  
  console.log(
    `Ballot contract was deployed at address ${ballotContract.address} at block number
      ${deployTxReceipt.blockNumber} at transactionHash: ${deployTxReceipt.transactionHash}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});