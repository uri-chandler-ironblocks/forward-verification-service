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

  async verifyEvent(event: any) {
    const vapiUrl = this.configService.get<string>('VAPI_BASE_URL');
    const apiKey = this.configService.get<string>('VAPI_API_KEY');

    try {
      this.logger.log(`Verifying event: ${JSON.stringify(event)}`);
      const response = await this.axios.post(`${vapiUrl}/verify`, event, {
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
