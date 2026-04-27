import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Validate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ValidationMessages } from '../../shared/constants/validation-messages';

export class CreateBankDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @Length(1, 100, {
    message: ValidationMessages.bankTitleLengthInvalid,
  })
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  description: string;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
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
