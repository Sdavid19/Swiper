import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateMediaBankDto {
     @ApiProperty({ required: false, type: [String] })
     @IsOptional()
     @IsArray()
     @IsString({ each: true })
     platforms?: string[];
}