import { IsDateString, IsOptional } from "class-validator";

export class VoteFilterDto {

    @IsOptional()
    @IsDateString()
    date?: string;
}