import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsArray, IsNumber } from 'class-validator';

export class BankFilterDto {
  @ApiProperty({
    required: false,
    type: [Number]
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  categoryIds?: number[];
}