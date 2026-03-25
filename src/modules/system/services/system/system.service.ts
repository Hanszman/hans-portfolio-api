import { Injectable } from '@nestjs/common';
import { ApiRoutes } from '../../../../routing/api-routes';
import { SystemResponse } from '../../contracts/system/system.response';
import { PingService } from '../ping/ping.service';

@Injectable()
export class SystemService {
  /* c8 ignore next */
  constructor(private readonly pingService: PingService) {}

  getSystemOverview(): SystemResponse {
    return {
      name: this.pingService.getPing().name,
      module: 'system',
      status: 'operational',
      routes: [
        `/${ApiRoutes.system.base}/${ApiRoutes.system.ping}`,
        `/${ApiRoutes.system.base}/${ApiRoutes.system.database}`,
        `/${ApiRoutes.system.base}/${ApiRoutes.system.health}`,
        `/${ApiRoutes.health.alias}`,
        `/${ApiRoutes.swagger}`,
      ],
    };
  }
}
