import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { urlencoded, json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{
    bodyParser: true,
  });    
  app.enableCors();
  app.use(urlencoded({ extended: true }));
  app.use(json());
  await app.listen(5555);  
}
bootstrap();
