import { Module } from '@nestjs/common';
import { ConfigModule as NestJSConfigModule } from '@nestjs/config';

import { ConfigSchema } from './config.schema';

@Module({
  imports: [
    NestJSConfigModule.forRoot({
      // Only read `process.env` once for better performance
      //
      cache: true,

      // Make the ConfigService auto-available for all modules
      //
      isGlobal: true,

      // Allow using FOO=bar and then BAZ=${FOO} in .env files
      //
      expandVariables: true,

      // Config validation
      //
      validationSchema: ConfigSchema,
    }),
  ],
})
export class ConfigModule {}
