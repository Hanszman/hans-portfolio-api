import { Controller, Get } from '@nestjs/common';
import {
  ApiExcludeEndpoint,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ApiRoutes } from '../../../../routing/api-routes';
import { PingResponse } from '../../contracts/ping/ping.response';
import { PingService } from '../../services/ping/ping.service';

@ApiTags('System')
@Controller()
export class PingController {
  /* c8 ignore next */
  constructor(private readonly pingService: PingService) {}

  @Get(ApiRoutes.root)
  @ApiExcludeEndpoint()
  /* c8 ignore next */
  getRootPing(): PingResponse {
    return this.pingService.getPing();
  }

  @Get(`${ApiRoutes.system.base}/${ApiRoutes.system.ping}`)
  @ApiOperation({ summary: 'Checks whether the API is alive.' })
  @ApiOkResponse({ type: PingResponse })
  /* c8 ignore next */
  getPing(): PingResponse {
    return this.pingService.getPing();
  }
}
