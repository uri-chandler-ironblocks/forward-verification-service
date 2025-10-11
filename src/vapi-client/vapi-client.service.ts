import { ConfigService } from '@nestjs/config';
import { Inject, Injectable, Logger } from '@nestjs/common';

type AxiosType = typeof import('axios');

@Injectable()
export class VAPIClientService {
  private readonly logger = new Logger(VAPIClientService.name, {
    timestamp: true,
  });

  constructor(
    @Inject('AXIOS') private readonly axios: AxiosType,
    private readonly configService: ConfigService,
  ) {}

  async verifyEvent(chainId: number, event: { [key: string]: any }) {
    const vapiUrl = this.configService.get<string>('VAPI_BASE_URL');
    const apiKey = this.configService.get<string>('VAPI_API_KEY');
    const payload = {
      chainId,
      txHash: event.transactionHash as string,
      eventName: event.event as string,
      eventData: event,
    };

    try {
      this.logger.log(
        `Verifying event transaction: ${JSON.stringify(payload)}`,
      );
      const response = await this.axios.post(`${vapiUrl}/verify`, payload, {
        headers: {
          'x-api-key': apiKey,
        },
      });
      this.logger.log(`VAPI response: ${JSON.stringify(response.data)}`);
    } catch (error) {
      this.logger.error(`Error verifying event: ${(error as Error).message}`);
    }
  }
}
