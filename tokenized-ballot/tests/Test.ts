import { expect } from "chai";
import { ethers } from "hardhat";
import { MyERC20Token__factory, MyERC20Token, MyERC721Token__factory, MyERC721Token, TokenSale, TokenSale__factory } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";

const TEST_RATIO = 10;
const TEST_PRICE = 2;
const TEST_BUY_TOKEN_AMOUNT = ethers.utils.parseUnits("1");

describe("NFT Shop", async () => {
    let contract: TokenSale;
    let paymentToken: MyERC20Token;
    let nftContract: MyERC721Token;
    let deployer: SignerWithAddress;
    let acc1: SignerWithAddress;
    let acc2: SignerWithAddress;
  
    beforeEach(async () => {
      [deployer, acc1, acc2] = await ethers.getSigners();
      const tokenFactory = new MyERC20Token__factory(deployer);
      paymentToken = await tokenFactory.deploy();
      await paymentToken.deployed();

      const nftContractFactory = new MyERC721Token__factory(deployer);
      nftContract = await nftContractFactory.deploy();
      await nftContract.deployed();

      const contractFactory = new TokenSale__factory(deployer);
      contract = await contractFactory.deploy(TEST_RATIO, TEST_PRICE, paymentToken.address, nftContract.address);
      await contract.deployed();
      const MINTER_ROLE = await paymentToken.MINTER_ROLE();
      const roleTX = await paymentToken.grantRole(
        MINTER_ROLE,
        contract.address
      );
      await roleTX.wait();
    });

  describe("When the Shop contract is deployed", async () => {
    it("defines the ratio as provided in parameters", async () => {
        const ratio = await contract.ratio();
      expect(ratio).to.eq(TEST_RATIO);
    });

    it("uses a valid ERC20 as payment token", async () => {
        const tokenAddress = await contract.paymentToken();
        const tokenFactory = new MyERC20Token__factory(deployer);
        const tokenContract = tokenFactory.attach(tokenAddress);
        await expect(tokenContract.totalSupply()).not.to.be.reverted;
        await expect(tokenContract.balanceOf(deployer.address)).not.to.be
          .reverted;
        await expect(tokenContract.approve(acc1.address, 1)).not.to.be.reverted;
      });

  describe("When a user buys an ERC20 from the Token contract", async () => {
    let tokenBalanceBefore: BigNumber;
    let ethBalanceBefore: BigNumber;
    let gasFees: BigNumber;
    beforeEach(async () => {
      tokenBalanceBefore =  await paymentToken.balanceOf(acc1.address);
      ethBalanceBefore = await acc1.getBalance();
      const buyTokenTx = await contract.connect(acc1).buyToken({value: TEST_BUY_TOKEN_AMOUNT}); // buyToken function dont have parameter of amount of ether, we need to override to put the value of ETH to the msg.value of payable function
      const buyTokenTxReceipt =  await buyTokenTx.wait();
      gasFees = buyTokenTxReceipt.gasUsed.mul(buyTokenTxReceipt.effectiveGasPrice);


    });

    it("charges the correct amount of ETH", async () => {
      const ethBalanceAfter = await acc1.getBalance();
      const ethBalanceDiff = ethBalanceBefore.sub(ethBalanceAfter);
      expect(ethBalanceDiff).to.eq(TEST_BUY_TOKEN_AMOUNT.add(gasFees));
      
      
    });

    it("gives the correct amount of tokens", async () => {
      const tokenBalanceAfter = await paymentToken.balanceOf(acc1.address);
      const tokenBalanceDiff = tokenBalanceAfter.sub(tokenBalanceBefore);
      expect(tokenBalanceDiff).eq(TEST_BUY_TOKEN_AMOUNT.mul(TEST_RATIO));
    });
  

  describe("When a user burns an ERC20 at the Shop contract", async () => {
    let tokenBalanceBeforeBurn: BigNumber;
    let ethBalanceBeforeBurn: BigNumber;

    beforeEach(async () => {
      tokenBalanceBeforeBurn =  await paymentToken.balanceOf(acc1.address);
      ethBalanceBeforeBurn = await acc1.getBalance();
      const burnValue = tokenBalanceBeforeBurn.div(2);

      const approveTx = await paymentToken.connect(acc1).approve(contract.address, burnValue);
      const approveTxReceipt = await approveTx.wait();

      const burnTokensTx = await contract.connect(acc1).returnTokens(burnValue);
      const burnTokensTxReceipt = await burnTokensTx.wait();

    });

    it("gives the correct amount of ETH", async () => {
      throw new Error("Not implemented");
    });

    it("burns the correct amount of tokens", async () => {
      const tokenBalanceAfterBurn = await paymentToken.balanceOf(acc1.address);
      const tokenBalanceDiff = tokenBalanceBeforeBurn.sub(tokenBalanceAfterBurn);
      expect(tokenBalanceDiff).to.eq(tokenBalanceBeforeBurn.div(2));
    });
  });

});

  describe("When a user buys an NFT from the Shop contract", async () => {
    it("charges the correct amount of ERC20 tokens", async () => {
      throw new Error("Not implemented");
    });

    it("gives the correct NFT", async () => {
      throw new Error("Not implemented");
    });
  });

  describe("When a user burns their NFT at the Shop contract", async () => {
    it("gives the correct amount of ERC20 tokens", async () => {
      throw new Error("Not implemented");
    });
  });

  describe("When the owner withdraws from the Shop contract", async () => {
    it("recovers the right amount of ERC20 tokens", async () => {
      throw new Error("Not implemented");
    });

    it("updates the owner pool account correctly", async () => {
      throw new Error("Not implemented");
    });
  });
  });
});