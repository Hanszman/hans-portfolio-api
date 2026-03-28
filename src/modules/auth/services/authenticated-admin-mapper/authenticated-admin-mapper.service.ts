import { Injectable } from '@nestjs/common';
import type {
  AuthenticatedAdminSource,
  AuthenticatedAdminUser,
} from '../../types/auth.types';

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
