import {
  Inject,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { DatabaseDiagnosticsResponse } from '../../contracts/database/database-diagnostics.response';
import { DatabaseProbeRow } from '../../types/database/database-probe-row.type';

@Injectable()
export class DatabaseDiagnosticsService {
  /* c8 ignore start */
  @Inject(PrismaService)
  private readonly prisma!: PrismaService;
  /* c8 ignore stop */

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
}
