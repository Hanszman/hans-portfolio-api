import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ensureRuntimeEnvironment } from './config/runtime-env';
import { AuthModule } from './modules/auth/auth.module';
import { ContentModule } from './modules/content/content.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { SystemModule } from './modules/system/system.module';
import { PrismaModule } from './prisma/prisma.module';

ensureRuntimeEnvironment();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    PrismaModule,
    AuthModule,
    ContentModule,
    DashboardModule,
    SystemModule,
  ],
})
export class AppModule {}
