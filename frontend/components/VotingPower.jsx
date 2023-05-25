import * as React from 'react';
import Router, { useRouter } from "next/router";
import { useSigner } from 'wagmi';

export function VotingPower() {
    const [txData, setTxData] = React.useState(null);
	const [isLoading, setLoading] = React.useState(false);
    const router = useRouter();
    const { data:signer} = useSigner();
    const url = process.env.NEXT_PUBLIC_BACKEND_URL + "/voting-power/"; 
    //"http://localhost:3001/voting-power/";

    return (
        <div>
          <h2>Check The Voting Power</h2>
          <button onClick={() => requestVotingPower(url, signer, setLoading, setTxData)}>Voting Power</button>
          { 
            isLoading? <p>Requesting voting power...</p> : <p></p>
          }
          {
            txData? <p>Your voting power is {txData}</p> : <p></p>
          }
        </div>
      );
    
  }

function requestVotingPower(url, signer, setLoading, setTxData) {
  if(signer){
    setTxData(null);
    setLoading(true);
    const apiUrl = url + signer._address;
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };
    fetch(apiUrl, requestOptions)
        .then(response => response.json())
        .then((data) => {
            setTxData(data);
            console.log("Response "+data);
            setLoading(false);
    });
  }else{
    alert("Please connect to a wallet");
  }
    
}

 