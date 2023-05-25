import styles from "../styles/InstructionsComponent.module.css";
import Router, { useRouter } from "next/router";
import { useState } from 'react';
import { useSigner } from 'wagmi';

import { VotingPower } from "./VotingPower";
import { WinningProposal } from "./WinningProposal";
import { Voting } from "./Voting";
import { Delegate } from "./Delegate";

export default function InstructionsComponent() {
	const router = useRouter();
	return (
		<div className={styles.container}>
			<header className={styles.header_container}>
				<h1>
					Voting dApp
				</h1>
			</header>

			<div className={styles.buttons_container}>
				<PageBody></PageBody>
			</div>
			<div className={styles.footer}>
				Group 1 Cohort 2 Encode Solidity Bootcamp April 2023
			</div>
		</div>
	);
}


function PageBody(){
	return(
		<div>
			<RequestTokens/><br />
			<div><Delegate/></div><br />
			<div><VotingPower></VotingPower></div> <br />
			<div><Voting/></div> <br />
			<div><WinningProposal></WinningProposal></div> <br />
			<br />
		</div>
	)
}


function RequestTokens() {
		const { data: signer } = useSigner();
		const [txData, setTxData] = useState(null);
		const [isLoading, setLoading] = useState(false);
		const [errorReason, setError] = useState(null);
		let apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL + "/request-tokens";

		return (
			<div>
			  <h2>Request Tokens</h2>
			  <button onClick={() => requestTokens(apiUrl, signer, "anything", setLoading, setTxData, setError)}>Request Tokens</button>
				{ 
				  isLoading? <p>Requesting tokens to be minted...</p> : <p></p>
				}
				{ 
				  errorReason? <p>Token request is failed: {errorReason}</p> : <p></p>
				}
				{
				  txData? <p>Transaction completed! :  <a href={"https://mumbai.polygonscan.com/tx/" + txData.hash} target="_blank">{txData.hash}</a> </p> : <p></p>
				}
			</div>
		  )
}

function requestTokens(apiUrl, signer, signature, setLoading, setTxData, setError) {
	if(signer){
		setLoading(true);
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ address: signer._address, signature: signature })
		};
		fetch(apiUrl, requestOptions)
			.then(response => response.json())
			.then((data) => {
				setTxData(data);
				setLoading(false);
			}).catch((err) => {
			setError(err.reason); 
			setLoading(false);
			console.log(err);
		 });
	}else{
		alert("Please connect to a wallet");
	}
		
}