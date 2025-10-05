import axios from 'axios';
import { Module } from '@nestjs/common';

import { VAPIClientService } from './vapi-client.service';

@Module({
  providers: [VAPIClientService, { provide: 'AXIOS', useValue: axios }],
  exports: [VAPIClientService],
})
export class VAPIClientModule {}
