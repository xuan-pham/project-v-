import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  const configService = new ConfigService();
  const PORT = configService.get('PORT') || 8080;
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('project-v1')
    .setDescription('the project-v1 API description')
    .setVersion('1.0')
    .addTag('project-v1')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(PORT, () => {
    console.log(`App is running http://localhost:${PORT}`);
  });
}

bootstrap().then();
