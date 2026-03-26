import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import type { StringValue } from 'ms';
import { PrismaModule } from '../../prisma/prisma.module';
import { AdminSessionController } from './controllers/admin-session/admin-session.controller';
import { AuthController } from './controllers/auth/auth.controller';
import { AdminJwtAuthGuard } from './guards/admin-jwt-auth.guard';
import { AdminRoleGuard } from './guards/admin-role.guard';
import { AdminSessionService } from './services/admin-session/admin-session.service';
import { AuthenticatedAdminMapperService } from './services/authenticated-admin-mapper/authenticated-admin-mapper.service';
import { AuthService } from './services/auth/auth.service';
import { PasswordService } from './services/password/password.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PrismaModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET!,
        signOptions: {
          expiresIn: process.env.JWT_EXPIRES_IN! as StringValue,
        },
      }),
    }),
  ],
  controllers: [AuthController, AdminSessionController],
  providers: [
    AuthService,
    AdminSessionService,
    AuthenticatedAdminMapperService,
    PasswordService,
    JwtStrategy,
    AdminJwtAuthGuard,
    AdminRoleGuard,
  ],
  exports: [
    AuthService,
    AuthenticatedAdminMapperService,
    PasswordService,
    AdminJwtAuthGuard,
    AdminRoleGuard,
  ],
})
export class AuthModule {}
