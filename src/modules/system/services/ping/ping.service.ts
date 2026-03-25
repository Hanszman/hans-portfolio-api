import { Injectable } from '@nestjs/common';
import { PingResponse } from '../../contracts/ping/ping.response';

@Injectable()
export class PingService {
  getPing(): PingResponse {
    return {
      name: process.env.APP_NAME ?? 'Hans Portfolio API',
      environment: process.env.NODE_ENV ?? 'development',
      status: 'ok',
      utcNow: new Date().toISOString(),
    };
  }
}
