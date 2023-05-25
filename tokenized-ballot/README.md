# Hardhat Tokenized Ballot Project

To compile the contract use the following command:
```shell
yarn hardhat compile
```

To deploy the token contract run the following command:
```shell
yarn hardhat run .\scripts\deploy-token-contract.ts
```

To deploy the ballot contract, run the following command with list of voting proposals as the argument:
```shell
yarn ts-node --files .\scripts\deploy-ballot-contract.ts <List of Proposals>

yarn ts-node --files .\scripts\deploy-ballot-contract.ts Chocolate Strawberry Vanilla
```
