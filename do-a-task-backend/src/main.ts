import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({whitelist: true})); //whitelist true to ignore unnecessary parameters
  app.enableCors({
    credentials: true,
  });
  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 3333);
}
bootstrap();
