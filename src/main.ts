import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import { config } from 'dotenv';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  config();
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));
  await app.listen(3000);
  console.log(`Listening on url ${await app.getUrl()}`);
}
bootstrap();
