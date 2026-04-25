import { ApiProperty } from "@nestjs/swagger";
import {IsArray } from "class-validator";
import { Type } from "class-transformer";
import { VoteDto } from "./vote.dto";

export class VoteListDto {
    @ApiProperty({ type: [VoteDto] })
    @IsArray()
    @Type(() => VoteDto)
    votes: VoteDto[];

    @ApiProperty()
    hasMore: boolean;
}