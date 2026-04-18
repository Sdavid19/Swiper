import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { CategoryService } from '../../category';

@ValidatorConstraint({ async: true })
@Injectable()
export class CategoriesExist implements ValidatorConstraintInterface {
  constructor(
    private readonly categoryService: CategoryService,
  ) {}

  async validate(categoryIds: number[]) {
    if (!categoryIds || categoryIds.length === 0)
      return true;

    for (const id of categoryIds) {
      const exists =
        await this.categoryService.findById(id);
      if (!exists) return false;
    }
    return true;
  }

  defaultMessage() {
    return 'One or more categories do not exist';
  }
}

export function CategoriesExistValidator(
  validationOptions?: ValidationOptions,
) {
  return function (
    object: Object,
    propertyName: string,
  ) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: CategoriesExist,
    });
  };
}
