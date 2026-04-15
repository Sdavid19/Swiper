import { ApiProperty } from "@nestjs/swagger";
import { CreateAnswerDto } from "./create-answer.dto";
import { IsArray, IsInt } from "class-validator";
import { Type } from "class-transformer";

export class CreateVoteDataDto {
    @ApiProperty()
    @Type(() => Number)
    @IsInt()
    @ApiProperty()
    bankId: number;

    @Type(() => Number)
    @IsInt()
    @ApiProperty()
    creatorId: number;

    @ApiProperty({ type: [CreateAnswerDto] })
    @IsArray()
    @Type(() => CreateAnswerDto)
    answers: CreateAnswerDto[];
}