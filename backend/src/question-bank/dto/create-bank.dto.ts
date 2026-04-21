import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Validate,
} from 'class-validator';
import { CategoryExists } from '../validators/category-exitst.validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBankDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  description: string;

  @Type(() => Number)
  @IsInt()
  @ApiProperty()
  creatorId: number;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Validate(CategoryExists)
  categoryId: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  imageUrl?: string | null;

  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false })
  public?: boolean = false;
}
