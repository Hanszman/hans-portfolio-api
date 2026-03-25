import { Module } from '@nestjs/common';
import { DatabaseDiagnosticsController } from './controllers/database/database-diagnostics.controller';
import { HealthController } from './controllers/health/health.controller';
import { PingController } from './controllers/ping/ping.controller';
import { SystemController } from './controllers/system/system.controller';
import { DatabaseDiagnosticsService } from './services/database/database-diagnostics.service';
import { HealthService } from './services/health/health.service';
import { PingService } from './services/ping/ping.service';
import { SystemService } from './services/system/system.service';

@Module({
  controllers: [
    SystemController,
    PingController,
    DatabaseDiagnosticsController,
    HealthController,
  ],
  providers: [
    SystemService,
    PingService,
    DatabaseDiagnosticsService,
    HealthService,
  ],
})
export class SystemModule {}
