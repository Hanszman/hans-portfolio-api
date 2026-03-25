import { Controller, Get } from '@nestjs/common';
import {
  ApiExcludeEndpoint,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ApiRoutes } from '../../../../routing/api-routes';
import { PingResponse } from '../../contracts/ping/ping.response';
import { SystemResponse } from '../../contracts/system/system.response';
import { SystemService } from '../../services/system/system.service';

@ApiTags('System')
@Controller()
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @Get(ApiRoutes.root)
  @ApiExcludeEndpoint()
  getRootPing(): PingResponse {
    return this.systemService.getRootPing();
  }

  @Get(ApiRoutes.system.base)
  @ApiOperation({
    summary: 'Returns an overview of the system diagnostics routes.',
  })
  @ApiOkResponse({ type: SystemResponse })
  getSystemOverview(): SystemResponse {
    return this.systemService.getSystemOverview();
  }
}
