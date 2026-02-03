import { Type } from "class-transformer"
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, Validate } from "class-validator"
import { CategoryExists } from "../validators/category-exitst.validator"

export class CreateBankDto {
    @IsString()
    @IsNotEmpty()
    title: string

    @IsString()
    @IsOptional()
    description: string

    @Type(() => Number)
    @IsInt()
    @IsPositive()
    creatorId: number

    @Validate(CategoryExists) 
    categoryId: number

    @IsString()
    @IsOptional()
    imageUrl: string

    @Type(() => Boolean)
    @IsBoolean()
    @IsOptional()
    public?: boolean = false
}