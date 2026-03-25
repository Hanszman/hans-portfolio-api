import { Module } from '@nestjs/common';
import { HealthController } from './controllers/health.controller';
import {
  SystemController,
  SystemRootController,
} from './controllers/system.controller';
import { SystemDiagnosticsService } from './services/system-diagnostics.service';

@Module({
  controllers: [SystemRootController, SystemController, HealthController],
  providers: [SystemDiagnosticsService],
})
export class SystemModule {}
