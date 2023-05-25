import { ethers } from "hardhat";
import {MyERC20Vote__factory } from "../typechain-types";
import * as dotenv from 'dotenv'
dotenv.config();

const getMySigners = async (privateKeys: string[]) => {
  const signers = []
  for(let index=0; index < privateKeys.length; index ++){
    const provider = new ethers.providers.EtherscanProvider("maticmum", process.env.ETHERSCAN_API_KEY);
    const wallet = new ethers.Wallet(privateKeys[index]);
    const signer = wallet.connect(provider);
    signers.push(signer);
    console.log(`Signer ${index+1} address: ${signer.address}`);
  }
  return signers;
} 
const MINT_VALUE = ethers.utils.parseUnits("10");

async function main() {
  
  const privateKeys = [process.env.PRIVATE_KEY?? ""];
  const [deployer] = await getMySigners(privateKeys); 
  
  const myErc20VoteFactory = new MyERC20Vote__factory(deployer);
  const myErc20VoteContract = await myErc20VoteFactory.deploy();
  const myErc20VoteContractReceipt = await myErc20VoteContract.deployTransaction.wait();
  console.log(
    `myErc20Vote contract was deployed at address ${myErc20VoteContract.address} at blockNumber: ${myErc20VoteContractReceipt.blockNumber} at transactionHash: ${myErc20VoteContractReceipt.transactionHash}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});