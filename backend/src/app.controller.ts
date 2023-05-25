import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import {RequestTokenDto} from './dtos/requestToken.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return  this.appService.getHello();
  }

  @Get("last-block")
  getLastBlock() {
    return this.appService.getLastBlock();
  }

  @Get("token-contract-address")
  getTokenContractAddress() {
    return this.appService.getTokenContractAddress();
  }


  @Get("ballot-contract-address")
  getBallotContractAddress() {
    return this.appService.getBallotContractAddress();
  }

  @Get("total-supply")
  getTotalSupply() {
    return this.appService.getTotalSupply();
  }

  @Get("balance/:address")
  getBalance(@Param('address') address:string) {
    return this.appService.getBalance(address);
  }

  @Get("receipt")
  async getReceipt(@Query('hash') hash:string) {
    return await this.appService.getReceipt(hash);
  }

  @Get("voting-power/:address")
  async getVotingPower(@Param('address') address:string) {
    return await this.appService.getVotingPower(address);
  }

  @Get("winner-name")
 async getWinnerName() {
    return await this.appService.getWinnerName();
  }


  
  

  @Post("request-tokens")
  requestTokens(@Body() body: RequestTokenDto) {
    return this.appService.requestTokens(body.address);
  }
  
  /*
  @Post("request-tokens")
  delegate(@Body() body: RequestTokenDto) {
    return this.appService.delegate(body.address);
  }*/
  
}
