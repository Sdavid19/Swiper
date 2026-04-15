import { ApiProperty } from "@nestjs/swagger";
import { BankDto } from "./bank.dto";

export class BankListItemDto extends BankDto {
    @ApiProperty()
    voteCount: number

}