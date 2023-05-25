// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;
import "./MyERC20Token.sol";
import "./MyERC721Token.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenSale is Ownable{
    uint256 public ratio;
    uint256 price;
    MyERC20Token public paymentToken;
    MyERC721Token public nftContract;
    uint256 withdrawableAmount;

    constructor(uint _ratio, uint256 _price, MyERC20Token _paymentToken, MyERC721Token _nftContract){
        ratio = _ratio;
        paymentToken =  _paymentToken;
        // TODO price
        price = _price;
        // TODO nft
        nftContract = _nftContract;

    }

    function buyToken() external payable{
        uint256 amountToBeMinted = msg.value * ratio;
        paymentToken.mint(msg.sender, amountToBeMinted);

    }

    function returnTokens(uint256 amount) external{
        paymentToken.burnFrom(msg.sender, amount);
        payable(msg.sender).transfer(amount/ratio);
    }

    function buyNFT(uint256 tokenId) external{
        // charge from the user the correct price
        paymentToken.transferFrom(msg.sender, address(this), price);
        // mint the tokenId for the buyer
        nftContract.safeMint(msg.sender, tokenId);
        // account the value that owner can withdraw
        withdrawableAmount += price/2;


    }

    function withdraw(uint256 amount) external onlyOwner{
        withdrawableAmount -= amount;
        // transfer to the owner
        paymentToken.transfer(owner(), amount);
    }

    // function withdraw
    // modifier onlyowner
    // the owner will specify an amount to be withdrawn
    // do the acounting
    /// transfer to the owner

}