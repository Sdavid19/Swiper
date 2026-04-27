import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsArray,
  IsNumber,
  IsString,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum BankState {
  OPEN = "OPEN",
  LOCKED = "LOCKED",
  ALL = "ALL"
}

export class BankFilterDto {
  @ApiProperty({
    required: false,
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  categoryIds?: number[];

  @ApiProperty({ enum: BankState, required: false })
  @IsEnum(BankState)
  @IsOptional()
  state?: BankState;

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
