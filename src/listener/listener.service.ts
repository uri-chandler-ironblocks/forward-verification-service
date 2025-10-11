import type { JsonRpcProvider } from 'ethers';
import { Inject, Injectable, Logger } from '@nestjs/common';

import { VAPIClientService } from '../vapi-client/vapi-client.service';
import { ListenerConfigType } from './listener-config.types';
import { ListenerConfigService } from './listener-config.service';

type EthersType = typeof import('ethers');

@Injectable()
export class ListenerService {
  private readonly logger = new Logger(ListenerService.name, {
    timestamp: true,
  });

  constructor(
    @Inject('ETHERS') private readonly ethers: EthersType,
    private readonly listenerConfigService: ListenerConfigService,
    private readonly vapiClientService: VAPIClientService,
  ) {}

  async onApplicationBootstrap() {
    await this.start();
  }

  async start() {
    this.logger.log('Starting ...');

    const chains = this.listenerConfigService.get('chains');
    this.logger.log(`Detected ${chains.length} chains in configuration.`);

    for (const chain of chains) {
      const provider = new this.ethers.JsonRpcProvider(chain.rpcURL);
      await this.listenToChainEvents(chain, provider);
    }

    this.logger.log('Listener started.');
  }

  async listenToChainEvents(
    chain: ListenerConfigType['chains'][number],
    provider: JsonRpcProvider,
  ) {
    this.logger.log(
      `Chain: ${chain.name} has ${chain.events.length} events to listen to.`,
    );

    for (const event of chain.events) {
      let fromBlock = await provider.getBlockNumber();

      const contract = new this.ethers.Contract(
        event.contract,
        [event.abi],
        provider,
      );

      const tick = async () => {
        const toBlock = await provider.getBlockNumber();

        if (fromBlock < toBlock) {
          this.logger.debug(
            `Block range ${chain.name}: ${fromBlock} - ${toBlock}`,
          );

          const newEvents = await contract.queryFilter(
            event.name,
            fromBlock,
            toBlock,
          );

          if (newEvents.length > 0) {
            this.logger.log(
              `Found ${newEvents.length} new ${event.name} events on ${chain.name}.`,
            );

            for (const evt of newEvents) {
              await this.vapiClientService.verifyEvent(chain.id, evt);
            }
          }

          fromBlock = toBlock + 1;
        }
        setTimeout(() => void tick(), 1000);
      };

      setTimeout(() => void tick(), 1000);

      this.logger.log(`Listening for event: ${event.name}`);
    }
  }
}
