import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../../prisma/prisma.service';
import { LoginResponse } from '../../contracts/auth/login.response';
import { type JwtAccessTokenPayload } from '../../types/auth.types';
import { AuthenticatedAdminMapperService } from '../authenticated-admin-mapper/authenticated-admin-mapper.service';
import { PasswordService } from '../password/password.service';

@Injectable()
export class AuthService {
  /* c8 ignore next 5 */
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly authenticatedAdminMapperService: AuthenticatedAdminMapperService,
    private readonly passwordService: PasswordService,
  ) {}

  async login(email: string, password: string): Promise<LoginResponse> {
    const adminUser = await this.prismaService.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (
      !adminUser ||
      !adminUser.isActive ||
      adminUser.role !== UserRole.ADMIN
    ) {
      throw new UnauthorizedException('Invalid admin credentials.');
    }

    const passwordMatches = await this.passwordService.matchesPassword(
      password,
      adminUser.passwordHash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid admin credentials.');
    }

    const authenticatedAdmin =
      this.authenticatedAdminMapperService.toAuthenticatedAdmin(adminUser);
    const jwtPayload: JwtAccessTokenPayload = {
      sub: authenticatedAdmin.id,
      email: authenticatedAdmin.email,
      name: authenticatedAdmin.name,
      role: authenticatedAdmin.role,
    };

    const accessToken = await this.jwtService.signAsync(jwtPayload);

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: process.env.JWT_EXPIRES_IN!,
      user: authenticatedAdmin,
    };
  }
}
