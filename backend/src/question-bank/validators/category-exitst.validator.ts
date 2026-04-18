import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CategoryService } from '../../category';

@Injectable()
@ValidatorConstraint({ async: true })
export class CategoryExists implements ValidatorConstraintInterface {
  constructor(
    private readonly categoryService: CategoryService,
  ) {}

  async validate(categoryId: number) {
    const category =
      await this.categoryService.findById(
        categoryId,
      );
    return !!category;
  }

  defaultMessage() {
    return 'Category not found';
  }
}
