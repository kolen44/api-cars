import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import { config } from 'dotenv';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';
async function bootstrap() {
  try {
    console.log('Loading environment variables...');
    config();
    console.log('Creating NestJS application...');
    const app = await NestFactory.create(AppModule);
    console.log('Configuring application...');
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ limit: '50mb', extended: true }));

    const PORT = process.env.PORT || 3000;
    console.log(`Starting application on port ${PORT}...`);
    await app.listen(PORT);
    console.log(`Listening on url ${await app.getUrl()}`);
  } catch (error) {
    console.error('Error during application bootstrap:', error);
  }
}

bootstrap();
