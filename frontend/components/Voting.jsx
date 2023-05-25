import * as React from 'react';
import Router, { useRouter } from "next/router";
import { useSigner } from 'wagmi';
import * as ballotJson from '../abi/TokenizedBallot.json';
import {ethers, Contract} from 'ethers';

export function Voting() {
  const [txData, setTxData] = React.useState(null);
	const [loading, setLoading] = React.useState(false);
  const [errorReason, setError] = React.useState(null);
  
  const { data:signer} = useSigner();
  const router = useRouter();

  let etherscan = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;
  let ballotAddress = process.env.NEXT_PUBLIC_BALLOT_ADDRESS;
  let testnet = process.env.NEXT_PUBLIC_TESTNET;
   const provider = new ethers.providers.EtherscanProvider(testnet, etherscan);
   const ballotContract = new Contract(ballotAddress, ballotJson.abi, provider);

   async function handleSubmit(e) {
      if(signer){
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        let proposalIdx = formData.get('selectedProposal');
        let voteAmount = formData.get('amount');
    
        await vote(signer, ballotContract, setLoading, setError, setTxData, parseInt(proposalIdx), voteAmount);
      }else{
        alert("Please connect to a wallet");
        e.preventDefault();
      }
    
    //console.log(formData.get('selectedProposal')+"  "+formData.get("amount"));
  }

    return (
        <div>
          <h2>Voting</h2>
           
          <form method="post" onSubmit={handleSubmit}>
              Vote: &nbsp;
              <select name="selectedProposal">
                <option value="0">Chcocolate</option>
                <option value="1">Strawberry</option>
                <option value="2">Vanilla</option>
              </select>
              <label>
              &nbsp;  Amount: &nbsp; 
              </label>
              <input name="amount" /> &nbsp; 
              <button type="submit">Vote</button>
          </form>
          
        { 
          loading? <p>Voting in Progress...</p> : <p></p>
        }      
        { 
          errorReason? <p>Voting Failed: {errorReason}</p> : <p></p>
        }
        { 
          txData? <p>Voted at:  <a href={"https://mumbai.polygonscan.com/tx/" + txData.hash} target="_blank">{txData.hash}</a> </p> : <p></p>
        }    
        </div>
    )  
    
  }

  
 async function vote(signer, ballotContract, setLoading, setError, setTxData, propIdx, amount){
   setLoading(true);
   ballotContract.connect(signer).vote(propIdx, ethers.utils.parseUnits(amount))
       .then((data) => {
         setTxData(data);
         setLoading(false);
         console.log("Voting is Done!");
       }).catch((err) => {
        setError(err.reason); 
        setLoading(false);
        console.log(err.reason);
       });
 }

   
 


 