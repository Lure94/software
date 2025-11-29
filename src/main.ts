import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('NikaFlex')
    .setDescription('API para el proyecto de la abuela de Ari')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap()
  .then(() => {
    console.log(
      `Application is running on: http://localhost:${process.env.PORT ?? 3000}`,
    );
  })
  .catch((err) => {
    console.error('Error starting the application', err);
  });
