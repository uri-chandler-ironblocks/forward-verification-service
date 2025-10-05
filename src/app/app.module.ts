import { Module } from '@nestjs/common';

import { ConfigModule } from '../config/config.module';
import { ListenerModule } from '../listener/listener.module';

@Module({
  imports: [ConfigModule, ListenerModule],
})
export class AppModule {}
