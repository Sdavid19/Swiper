import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDateString, IsNumber, IsOptional, IsString } from "class-validator";
export class VoteFilterDto {

    @IsOptional()
    @IsDateString()
    @ApiProperty({ required: false, })
    date?: string;

    @ApiProperty({
        required: false,
        type: [Number],
    })
    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    categoryIds?: number[];

    @ApiProperty({
        required: false,
        default: 1
    })
    @IsOptional()
    @IsNumber()
    page?: number;

    @ApiProperty({
        required: false,
        default: 1
    })
    @IsOptional()
    @IsNumber()
    limit?: number;

    @ApiProperty({ required: false, })
    @IsOptional()
    @IsString()
    text?: string;
}