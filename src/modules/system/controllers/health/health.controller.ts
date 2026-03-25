import { Controller, Get } from '@nestjs/common';
import {
  ApiExcludeEndpoint,
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiRoutes } from '../../../../routing/api-routes';
import { HealthResponse } from '../../contracts/health/health.response';
import { HealthService } from '../../services/health/health.service';

@ApiTags('System')
@Controller()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get(`${ApiRoutes.system.base}/${ApiRoutes.system.health}`)
  @ApiOperation({ summary: 'Checks whether the API and database are healthy.' })
  @ApiOkResponse({ type: HealthResponse })
  @ApiServiceUnavailableResponse({
    description: 'The API or database is unhealthy.',
  })
  getSystemHealth(): Promise<HealthResponse> {
    return this.healthService.getHealth();
  }

  @Get(ApiRoutes.health.alias)
  @ApiExcludeEndpoint()
  getHealthAlias(): Promise<HealthResponse> {
    return this.healthService.getHealth();
  }
}
