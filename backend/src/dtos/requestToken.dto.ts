import { ApiProperty } from "@nestjs/swagger";
import { Signature } from "ethers";

export class RequestTokenDto{
    @ApiProperty()
    readonly address:string;
    @ApiProperty()
    readonly signature: string;
}