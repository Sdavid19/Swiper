import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { useContainer, ValidationError } from 'class-validator';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';

async function bootstrap() {

   const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads/' });

    console.log(join(__dirname, '..', 'uploads'));

  app.useGlobalPipes(
  new ValidationPipe({
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
        error: "Field error",
        message: formatted,
      });
    },
  }),
);

  const config = new DocumentBuilder()
  .setTitle('My API')
  .setDescription('API dokumentáció a szakdolgozathoz')
  .setVersion('1.0')
  .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
  .build()

  const document = SwaggerModule.createDocument(app, config)
  
   writeFileSync('./swagger.json', JSON.stringify(document, null, 2));
  SwaggerModule.setup('api', app, document)

    
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
