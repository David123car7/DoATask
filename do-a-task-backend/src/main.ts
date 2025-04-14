import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({whitelist: true})); //whitelist true to ignore unnecessary parameters
  app.enableCors({
    origin: 'http://localhost:3000', // Your frontend URL
    credentials: true, // Added to handle cookies and authentication in CORS requests
  })
  await app.listen(3005);
}
bootstrap();
