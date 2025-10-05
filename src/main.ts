import { NestFactory } from '@nestjs/core';
// import { ConfigService } from '@nestjs/config';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  app.enableShutdownHooks();
}
void bootstrap().catch(console.error);
