import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import type { AuthenticatedAdminUser } from '../types/auth.types';

@Injectable()
export class AdminRoleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{
      user?: AuthenticatedAdminUser;
    }>();

    if (request.user?.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Admin access is required.');
    }

    return true;
  }
}
