import * as React from 'react';
import Router, { useRouter } from "next/router";

export function WinningProposal() {
    const [txData, setTxData] = React.useState(null);
	  const [isLoading, setLoading] = React.useState(false);
    const router = useRouter();
		let apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL + "/winner-name";

    return (
        <div>
          <h2>Check The Winner</h2>
          <button onClick={() => requestWinner(apiUrl, setLoading, setTxData)}>Winner</button>
          { 
            isLoading? <p>Requesting the winner...</p> : <p></p>
          }
          {
            txData? <p>The winner is {txData}</p> : <p></p>
          }
        </div>
    );
    
  }

function requestWinner(apiUrl, setLoading, setTxData) {
    setTxData(null);
    setLoading(true);
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };
    fetch(apiUrl, requestOptions)
        .then(response => response.json())
        .then((data) => {
            setTxData(data);
            setLoading(false);
    });
}

 