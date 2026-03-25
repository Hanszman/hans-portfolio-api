import { Controller, Get } from '@nestjs/common';
import {
  ApiExcludeEndpoint,
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiRoutes } from '../../routing/api-routes';
import { DatabaseDiagnosticsResponse } from '../contracts/database-diagnostics.response';
import { PingResponse } from '../contracts/ping.response';
import { SystemDiagnosticsService } from '../services/system-diagnostics.service';

@ApiTags('System')
@Controller()
export class SystemRootController {
  constructor(
    private readonly systemDiagnosticsService: SystemDiagnosticsService,
  ) {}

  @Get(ApiRoutes.root)
  @ApiExcludeEndpoint()
  getRootPing(): PingResponse {
    return this.systemDiagnosticsService.getPing();
  }
}

@ApiTags('System')
@Controller(ApiRoutes.system.base)
export class SystemController {
  constructor(
    private readonly systemDiagnosticsService: SystemDiagnosticsService,
  ) {}

  @Get(ApiRoutes.system.ping)
  @ApiOperation({ summary: 'Checks whether the API is alive.' })
  @ApiOkResponse({ type: PingResponse })
  getPing(): PingResponse {
    return this.systemDiagnosticsService.getPing();
  }

  @Get(ApiRoutes.system.database)
  @ApiOperation({ summary: 'Executes a database probe against PostgreSQL.' })
  @ApiOkResponse({ type: DatabaseDiagnosticsResponse })
  @ApiServiceUnavailableResponse({
    description: 'The database is unavailable.',
  })
  getDatabaseDiagnostics(): Promise<DatabaseDiagnosticsResponse> {
    return this.systemDiagnosticsService.getDatabaseDiagnostics();
  }
}
