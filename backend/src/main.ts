import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { useContainer, ValidationError } from 'class-validator';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {

   const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads/' });

    console.log(join(__dirname, '..', 'uploads'));

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const formattedErrors: Record<string, string[]> = {};

        validationErrors.forEach((error) => {
          if (error.constraints) {
            formattedErrors[error.property] = Object.values(error.constraints);
          }
        });

        return new BadRequestException({ error: formattedErrors });
      },
    }),
  );

    
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
