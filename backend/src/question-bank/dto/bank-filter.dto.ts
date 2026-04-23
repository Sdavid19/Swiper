import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsArray,
  IsNumber,
  IsBoolean,
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
}
