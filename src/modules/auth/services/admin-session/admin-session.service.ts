import { Injectable } from '@nestjs/common';
import { AdminSessionResponse } from '../../contracts/admin-session/admin-session.response';
import type { AuthenticatedAdminUser } from '../../types/auth.types';

@Injectable()
export class AdminSessionService {
  getSession(user: AuthenticatedAdminUser): AdminSessionResponse {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }
}
