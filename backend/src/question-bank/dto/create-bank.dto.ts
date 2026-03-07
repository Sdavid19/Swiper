import { Type } from "class-transformer"
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, Validate } from "class-validator"
import { CategoryExists } from "../validators/category-exitst.validator"
import { ApiProperty } from "@nestjs/swagger"

export class CreateBankDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    title: string

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false })
    description: string

    @Type(() => Number)
    @IsInt()
    @IsPositive()
    @ApiProperty()
    creatorId: number

    @Validate(CategoryExists)
    @ApiProperty() 
    categoryId: number

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false })
    imageUrl?: string

    @Type(() => Boolean)
    @IsBoolean()
    @IsOptional()
    @ApiProperty({ required: false })
    public?: boolean = false
}