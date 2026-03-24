import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ensureRuntimeEnvironment } from './config/runtime-env';
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
    SystemModule,
  ],
})
export class AppModule {}
