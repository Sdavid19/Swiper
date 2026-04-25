import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDateString, IsNumber, IsOptional, IsString } from "class-validator";
import { CategoriesExistValidator } from "../../question-bank/validators/categories-exists.validator";

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
    @CategoriesExistValidator({
        message: 'Some category IDs do not exist',
    })
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