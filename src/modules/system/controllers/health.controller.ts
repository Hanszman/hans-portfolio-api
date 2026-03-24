import { Controller, Get } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiRoutes } from '../../../routing/api-routes';
import { HealthResponse } from '../contracts/health.response';
import { SystemDiagnosticsService } from '../services/system-diagnostics.service';

@ApiTags('System')
@Controller(ApiRoutes.health)
export class HealthController {
  constructor(
    private readonly systemDiagnosticsService: SystemDiagnosticsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Checks whether the API and database are healthy.' })
  @ApiOkResponse({ type: HealthResponse })
  @ApiServiceUnavailableResponse({
    description: 'The API or database is unhealthy.',
  })
  getHealth(): Promise<HealthResponse> {
    return this.systemDiagnosticsService.getHealth();
  }
}
