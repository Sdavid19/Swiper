import {
  ValidationPipe,
  ValidationError,
  BadRequestException,
} from '@nestjs/common';

export class FieldErrorValidationPipe extends ValidationPipe {
  constructor() {
    super({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const formatted: Record<string, string[]> = {};

        validationErrors.forEach((error) => {
          if (error.constraints) {
            formatted[error.property] = Object.values(error.constraints);
          } else {
            formatted[error.property] = [];
          }
        });

        return new BadRequestException({
          statusCode: 400,
          error: 'Field error',
          message: formatted,
        });
      },
    });
  }
}