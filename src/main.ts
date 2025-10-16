import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();

  const configService = app.get<ConfigService>(ConfigService);
  const PORT = configService.get<number>('PORT') as number;

  await app.listen(PORT);
}
void bootstrap().catch(console.error);
