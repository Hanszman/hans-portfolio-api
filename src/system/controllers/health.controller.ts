import { Controller, Get } from '@nestjs/common';
import {
  ApiExcludeEndpoint,
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiRoutes } from '../../routing/api-routes';
import { HealthResponse } from '../contracts/health.response';
import { SystemDiagnosticsService } from '../services/system-diagnostics.service';

@ApiTags('System')
@Controller()
export class HealthController {
  constructor(
    private readonly systemDiagnosticsService: SystemDiagnosticsService,
  ) {}

  @Get(`${ApiRoutes.system.base}/${ApiRoutes.system.health}`)
  @ApiOperation({ summary: 'Checks whether the API and database are healthy.' })
  @ApiOkResponse({ type: HealthResponse })
  @ApiServiceUnavailableResponse({
    description: 'The API or database is unhealthy.',
  })
  getSystemHealth(): Promise<HealthResponse> {
    return this.systemDiagnosticsService.getHealth();
  }

  @Get(ApiRoutes.health.alias)
  @ApiExcludeEndpoint()
  getHealthAlias(): Promise<HealthResponse> {
    return this.systemDiagnosticsService.getHealth();
  }
}
