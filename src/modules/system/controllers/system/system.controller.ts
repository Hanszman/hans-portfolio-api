import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiRoutes } from '../../../../routing/api-routes';
import { SystemResponse } from '../../contracts/system/system.response';
import { SystemService } from '../../services/system/system.service';

@ApiTags('System')
@Controller()
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @Get(ApiRoutes.system.base)
  @ApiOperation({
    summary: 'Returns an overview of the system diagnostics routes.',
  })
  @ApiOkResponse({ type: SystemResponse })
  getSystemOverview(): SystemResponse {
    return this.systemService.getSystemOverview();
  }
}
