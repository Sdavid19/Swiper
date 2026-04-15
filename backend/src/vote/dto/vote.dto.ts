import { ApiProperty } from "@nestjs/swagger";
import { BankDto } from "../../question-bank/dto/bank.dto";

export class VoteDto {
    @ApiProperty()
    id:number;

    @ApiProperty()
    title: string;

    @ApiProperty()
    bank: BankDto;
}
