import fs from 'fs';
import joi from 'joi';
import path from 'path';
import yaml from 'yaml';
import { ethers } from 'ethers';
import { Module } from '@nestjs/common';

import { ListenerService } from './listener.service';
import { VAPIClientModule } from '../vapi-client/vapi-client.module';
import { ListenerConfigService } from './listener-config.service';

@Module({
  imports: [VAPIClientModule],

  providers: [
    ListenerService,
    ListenerConfigService,

    { provide: 'JOI', useValue: joi },
    { provide: 'YAML', useValue: yaml },
    { provide: 'ETHERS', useValue: ethers },
    { provide: 'FS_MODULE', useValue: fs },
    { provide: 'PATH_MODULE', useValue: path },
  ],
})
export class ListenerModule {}
