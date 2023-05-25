import { Injectable } from '@nestjs/common';
import {ethers} from 'ethers';
import * as tokenJson from './assets/MyERC20Vote.json';
import * as ballotJson from './assets/TokenizedBallot.json';
import { ConfigService } from '@nestjs/config';
import { sign } from 'crypto';

@Injectable()
export class AppService {
  
  
  provider;
  tokenContract: ethers.Contract;
  ballotContract: ethers.Contract;

  constructor(private configService: ConfigService){
    const apiKey = this.configService.get<string>('ETHERSCAN_API_KEY');
    this.provider = new ethers.providers.EtherscanProvider('maticmum', apiKey);
    //this.provider = ethers.getDefaultProvider("sepolia");
    this.tokenContract = new ethers.Contract(this.getTokenContractAddress(), tokenJson.abi, this.provider);
    this.ballotContract = new ethers.Contract(this.getBallotContractAddress(), ballotJson.abi, this.provider);
    console.log("Ballot address is"+this.ballotContract)
  }
  
  getHello(): string {
    return JSON.stringify('Hello World!');
  }
  getLastBlock(): Promise<ethers.providers.Block>{
  
    return this.provider.getBlock("latest");

  }
  getTokenContractAddress() {
    let contractAddress = this.configService.get<string>('TOKEN_ADDRESS_MUMBAI');
    return contractAddress;
  }
  getBallotContractAddress() {
    let contractAddress = this.configService.get<string>('BALLOT_ADDRESS_MUMBAI');
    return contractAddress; 
  }
  
  getTotalSupply(){
    return this.tokenContract.totalSupply();
  }

  getBalance(address:string) {
    return this.tokenContract.balanceOf(address);
  }

  async getReceipt(hash: string) {
    const tx = await this.provider.getTransaction(hash);
    //const receipt = await tx.wait();
    const receipt = await this.awaitTx(tx);
    return receipt;

  }
  async awaitTx(tx: ethers.providers.TransactionResponse) {
    return await tx.wait();
  }
  // mint
  //call request - chairperson -> requester/user 
  requestTokens(requesterAddress: string) {
    const pKey = this.configService.get<string>('PRIVATE_KEY');
    const wallet = new ethers.Wallet(pKey);
    const signer = wallet.connect(this.provider);
    //if(user.balance > 10 ) throw error 
    //if(noOfTokens > 10 ) throw error 
    return this.tokenContract.connect(signer).mint(requesterAddress, ethers.utils.parseUnits("10"));
  }

  async getVotingPower(address: string) {
    return ethers.utils.formatUnits(await this.ballotContract.votingPower(address));
  }

  async checkWinningProposal() {
    await this.ballotContract.winningProposal();
  }
  
  async getWinnerName(): Promise<string> {
    await this.checkWinningProposal();
    let winnername = await this.ballotContract.winnerName();
    winnername = ethers.utils.parseBytes32String(winnername);
    return JSON.stringify(winnername);
    
  }
  

  /*
  async delegate(address: string) {
    const pKey = this.configService.get<string>(address + '_PRIVATE_KEY');
    const wallet = new ethers.Wallet(pKey);
    const signer = wallet.connect(this.provider);
    return await this.tokenContract.connect(signer).delegate(address);
  }*/
  

  // Chairperson
  // propose -> chairperson
  // minting
  // Deploy the contract -> setting new session for voting -> blocknumber
  // transfer voting powers to an address
  // delegate -> voters
  // vote
  // check winning proposal

  // users/voters
  // request tokens (fixed amount of tokens)
  // check token balance
  // delegate
  // transfer voting power
  // vote
  // check winning proposal

}
