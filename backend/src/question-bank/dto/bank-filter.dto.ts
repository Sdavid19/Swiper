import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsArray, IsNumber } from 'class-validator';
import { CategoriesExistValidator } from '../validators/categories-exists.validator';

export class BankFilterDto {
  @ApiProperty({ required: false, type: [Number] })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @CategoriesExistValidator({ message: 'Some category IDs do not exist' })
  categoryIds?: number[];
}