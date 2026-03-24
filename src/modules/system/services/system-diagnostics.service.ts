import {
  Inject,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { DatabaseDiagnosticsResponse } from '../contracts/database-diagnostics.response';
import { HealthResponse } from '../contracts/health.response';
import { PingResponse } from '../contracts/ping.response';

type DatabaseProbeRow = {
  databaseName: string;
  currentSchema: string;
  serverVersion: string;
  executedAtUtc: Date | string;
};

@Injectable()
export class SystemDiagnosticsService {
  /* c8 ignore start */
  @Inject(PrismaService)
  private readonly prisma!: PrismaService;
  /* c8 ignore stop */

  getPing(): PingResponse {
    return {
      name: process.env.APP_NAME ?? 'Hans Portfolio API',
      environment: process.env.NODE_ENV ?? 'development',
      status: 'ok',
      utcNow: new Date().toISOString(),
    };
  }

  async getDatabaseDiagnostics(): Promise<DatabaseDiagnosticsResponse> {
    try {
      const [result] = await this.prisma.$queryRaw<DatabaseProbeRow[]>`
        SELECT
          current_database() AS "databaseName",
          current_schema() AS "currentSchema",
          version() AS "serverVersion",
          CURRENT_TIMESTAMP AT TIME ZONE 'UTC' AS "executedAtUtc"
      `;

      return {
        isConnected: true,
        probe: 'postgresql',
        databaseName: result.databaseName,
        currentSchema: result.currentSchema,
        serverVersion: result.serverVersion,
        executedAtUtc: new Date(result.executedAtUtc).toISOString(),
      };
    } catch (error) {
      throw new ServiceUnavailableException({
        status: 'unhealthy',
        checks: {
          database: 'down',
        },
        checkedAtUtc: new Date().toISOString(),
        error:
          error instanceof Error ? error.message : 'Unknown database error.',
      });
    }
  }

  async getHealth(): Promise<HealthResponse> {
    await this.getDatabaseDiagnostics();

    return {
      status: 'healthy',
      checks: {
        database: 'up',
      },
      checkedAtUtc: new Date().toISOString(),
    };
  }
}
