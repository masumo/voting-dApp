import * as React from 'react';
import Router, { useRouter } from "next/router";
import { useSigner } from 'wagmi';
import {ethers, Contract} from 'ethers';
import * as tokenJson from '../abi/MyERC20Vote.json';

export function Delegate() {
  const [txData, setTxData] = React.useState(null);
	const [isLoading, setLoading] = React.useState(false);
  const { data:signer} = useSigner();
  const [errorReason, setError] = React.useState(null);
  const router = useRouter();

  let etherscanApi = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;
  let tokenAddress = process.env.NEXT_PUBLIC_TOKEN_ADDRESS;
  let testnet = process.env.NEXT_PUBLIC_TESTNET;

  //const TOKEN_CONTRACT = "0x86757CC01F8BfA9dB48407147BdD00BDeD177e73";
   const provider = new ethers.providers.EtherscanProvider(testnet, etherscanApi);
   const tokenContract = new Contract(tokenAddress, tokenJson.abi, provider);

    return (
      <div>
        <h2>Delegate The Voting Power</h2>
        <button onClick={async () => await delegate(signer, tokenContract, setLoading, setTxData, setError)}>
          Delegate
        </button>
          { 
            isLoading? <p>Delegating voting power...</p> : <p></p>
          }
          { 
            errorReason? <p>Delegating is failed: {errorReason}</p> : <p></p>
          }
          {
            txData? <p>Delegated at:  <a href={"https://mumbai.polygonscan.com/tx/" + txData.hash} target="_blank">{txData.hash}</a> </p> : <p></p>
          }
      </div>
    )
    
  }

 async function delegate(signer, tokenContract, setLoading, setTxData, setError){
  if(signer){
    setLoading(true);
    tokenContract.connect(signer).delegate(signer._address)
       .then((data) => {
         setTxData(data);
         setLoading(false);
         console.log("Delegation Done!");
         console.log(data);
       }).catch((err) => {
          setError(err.reason); 
          setLoading(false);
          console.log(err);
       });
  }else{
    alert("Please connect to a wallet");
  }
   
 }

   
 


 