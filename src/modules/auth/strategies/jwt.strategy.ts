import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UserRole } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../../prisma/prisma.service';
import type {
  AuthenticatedAdminUser,
  JwtAccessTokenPayload,
} from '../types/auth.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /* c8 ignore next 7 */
  constructor(private readonly prismaService: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET!,
    });
  }

  async validate(
    payload: JwtAccessTokenPayload,
  ): Promise<AuthenticatedAdminUser> {
    const adminUser = await this.prismaService.user.findUnique({
      where: { id: payload.sub },
    });

    if (
      !adminUser ||
      !adminUser.isActive ||
      adminUser.role !== UserRole.ADMIN
    ) {
      throw new UnauthorizedException('Admin authentication is required.');
    }

    return {
      id: adminUser.id,
      email: adminUser.email,
      name: adminUser.name,
      role: adminUser.role,
    };
  }
}
