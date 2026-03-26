import { Injectable } from '@nestjs/common';
import type { User } from '@prisma/client';
import type { AuthenticatedAdminUser } from '../../types/auth.types';

type AuthenticatedAdminSource = Pick<User, 'id' | 'email' | 'name' | 'role'>;

@Injectable()
export class AuthenticatedAdminMapperService {
  toAuthenticatedAdmin(user: AuthenticatedAdminSource): AuthenticatedAdminUser {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }
}
