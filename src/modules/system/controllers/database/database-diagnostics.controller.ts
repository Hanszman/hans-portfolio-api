import { Controller, Get } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiRoutes } from '../../../../routing/api-routes';
import { DatabaseDiagnosticsResponse } from '../../contracts/database/database-diagnostics.response';
import { DatabaseDiagnosticsService } from '../../services/database/database-diagnostics.service';

@ApiTags('System')
@Controller(ApiRoutes.system.base)
export class DatabaseDiagnosticsController {
  constructor(
    private readonly databaseDiagnosticsService: DatabaseDiagnosticsService,
  ) {}

  @Get(ApiRoutes.system.database)
  @ApiOperation({ summary: 'Executes a database probe against PostgreSQL.' })
  @ApiOkResponse({ type: DatabaseDiagnosticsResponse })
  @ApiServiceUnavailableResponse({
    description: 'The database is unavailable.',
  })
  getDatabaseDiagnostics(): Promise<DatabaseDiagnosticsResponse> {
    return this.databaseDiagnosticsService.getDatabaseDiagnostics();
  }
}
