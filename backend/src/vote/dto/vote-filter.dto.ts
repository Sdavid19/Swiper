import { IsDateString, IsOptional } from "class-validator";

export class VoteFilterDto {

    @IsOptional()
    @IsDateString()
    from?: string;

    @IsOptional()
    @IsDateString()
    to?: string;
}