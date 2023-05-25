# Voting dApp Project

A simple dApp to demonstrate token-based voting on a blockchain.  
The application is developed using NestJS as the backend framework and Next.js as the frontend framework.
The contracts are deployed at the Mumbai tesnet.

Here are several steps to run this dApp:
1. deploy the MyERC20Vote contract using hardhat script (see the tokenized-ballot repo).
2. after the token contract is deployed, find the contract address and put it into the .env file both on the frontend and backend. 
3. run the frontend using this command: 
   ```properties
   npm run dev
   ```
4. run the backend using this command:
   ```properties
   yarn start:dev
   ```
5. open the frontend using your browser at the following address: http://localhost:3000/ and then connect to the wallet of a voter using the connect button 
6. using the frontend, each voter can request the token. request will be handled by the backend to mint requested tokens to the corresponding voters' address.
7. using the frontend, each voter can then delegate voting power to himself
8. deploy the TokenizedBallot contract using hardhat script by referring the MyERC20Vote address deployed at the first step.
9. after the ballot contract is deployed, find the contract address and put it into the .env file both on the frontend and backend. don't forget to restart the frontend and backend server after editing the .env files. 
10. using the frontend, now each voter can then check their voting power, cast the vote and finally check the winner.   
  
<br/> <br/>
The deployed MyERC20Vote token contract address: 
0x86757CC01F8BfA9dB48407147BdD00BDeD177e73
https://mumbai.polygonscan.com/address/0x86757cc01f8bfa9db48407147bdd00bded177e73


The deployed tokenized ballot contract address:
0xabd444215f3c7c516ea2beF173D85c2464dA3750
https://mumbai.polygonscan.com/address/0xabd444215f3c7c516ea2bef173d85c2464da3750

