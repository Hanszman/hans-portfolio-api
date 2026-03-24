import { Module } from '@nestjs/common';
import { HealthController } from './controllers/health.controller';
import { SystemController } from './controllers/system.controller';
import { SystemDiagnosticsService } from './services/system-diagnostics.service';

@Module({
  controllers: [SystemController, HealthController],
  providers: [SystemDiagnosticsService],
})
export class SystemModule {}
