import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@prisma/client';
import type { Request } from 'express';
import { PrismaService } from '../../../../prisma/prisma.service';
import type { JwtAccessTokenPayload } from '../../../auth/types/auth.types';

@Injectable({ scope: Scope.REQUEST })
export class PublicContentPreviewService {
  private adminPreviewEnabled: boolean | null = null;

  /* c8 ignore next 5 */
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async isAdminPreviewEnabled(): Promise<boolean> {
    if (this.adminPreviewEnabled !== null) {
      return this.adminPreviewEnabled;
    }

    const accessToken = this.extractAccessToken();

    if (!accessToken) {
      return this.cacheResult(false);
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtAccessTokenPayload>(
        accessToken,
        {
          secret: process.env.JWT_SECRET!,
        },
      );
      const adminUser = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      return this.cacheResult(
        Boolean(
          adminUser && adminUser.isActive && adminUser.role === UserRole.ADMIN,
        ),
      );
    } catch {
      return this.cacheResult(false);
    }
  }

  private cacheResult(value: boolean): boolean {
    this.adminPreviewEnabled = value;

    return value;
  }

  private extractAccessToken(): string | null {
    const authorizationHeaderValue = this.request.headers.authorization;
    const normalizedHeader =
      typeof authorizationHeaderValue === 'string'
        ? authorizationHeaderValue
        : Array.isArray(authorizationHeaderValue)
          ? authorizationHeaderValue[0]
          : undefined;

    if (!normalizedHeader) {
      return null;
    }

    const [scheme, token] = normalizedHeader.split(' ');

    if (scheme?.toLowerCase() !== 'bearer' || !token) {
      return null;
    }

    const normalizedToken = token.trim();

    return normalizedToken || null;
  }
}
