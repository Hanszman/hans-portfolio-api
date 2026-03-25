import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ensureRuntimeEnvironment } from './config/runtime-env';
import { PrismaModule } from './prisma/prisma.module';
import { SystemModule } from './system/system.module';

ensureRuntimeEnvironment();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    PrismaModule,
    SystemModule,
  ],
})
export class AppModule {}
