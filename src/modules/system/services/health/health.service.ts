import { Injectable } from '@nestjs/common';
import { HealthResponse } from '../../contracts/health/health.response';
import { DatabaseDiagnosticsService } from '../database/database-diagnostics.service';

@Injectable()
export class HealthService {
  /* c8 ignore start */
  constructor(
    private readonly databaseDiagnosticsService: DatabaseDiagnosticsService,
  ) {}
  /* c8 ignore stop */

  async getHealth(): Promise<HealthResponse> {
    await this.databaseDiagnosticsService.getDatabaseDiagnostics();

    return {
      status: 'healthy',
      checks: {
        database: 'up',
      },
      checkedAtUtc: new Date().toISOString(),
    };
  }
}
