import { ApiProperty } from "@nestjs/swagger";
import { Signature } from "ethers";

export class DelegateDto{
    readonly address:string;
    readonly signature: string;
}