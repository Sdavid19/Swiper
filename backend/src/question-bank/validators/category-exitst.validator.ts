import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { CategoryService } from '../../category';

@ValidatorConstraint({ async: true })
@Injectable()
export class CategoryExists implements ValidatorConstraintInterface {
  constructor(private categoryService: CategoryService) {}

  async validate(categoryId: number) {
    const category = await this.categoryService.findById(categoryId);
    return !!category;
  }

  defaultMessage() {
    return 'Category does not exist';
  }
}
