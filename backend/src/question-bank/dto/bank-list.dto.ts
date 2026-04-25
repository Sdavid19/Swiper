import { ApiProperty } from "@nestjs/swagger";
import { BankListItemDto } from "./bank-list-item.dto";
import { IsArray } from "class-validator";
import { Type } from "class-transformer";

export class BankListDto {
    @ApiProperty({ type: [BankListItemDto] })
    @IsArray()
    @Type(() => BankListItemDto)
    banks: BankListItemDto[];

    @ApiProperty()
    hasMore: boolean;
}