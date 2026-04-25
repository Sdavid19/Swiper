import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsArray,
  IsNumber,
  IsBoolean,
  IsString,
} from 'class-validator';
import { CategoriesExistValidator } from '../validators/categories-exists.validator';

export class BankFilterDto {
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

  @ApiProperty()
  @IsBoolean()
  locked: boolean

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

   @ApiProperty({ required: false,})
  @IsOptional()
  @IsString()
  text?: string;
}
