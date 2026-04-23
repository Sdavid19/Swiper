import { ApiProperty } from '@nestjs/swagger';
import { MediaType } from '@prisma/client';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateMediaBankDto {
  @ApiProperty({
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  platforms?: string[];

  @ApiProperty({ required: true, type: Number })
  @IsNumber()
  bankTemplateId: number;


  @ApiProperty({ enum: MediaType })
  @IsEnum(MediaType)
  mediaType: MediaType;
}
