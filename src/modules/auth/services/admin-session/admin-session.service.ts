import { Injectable } from '@nestjs/common';
import { AdminSessionResponse } from '../../contracts/admin-session/admin-session.response';
import type { AuthenticatedAdminUser } from '../../types/auth.types';
import { AuthenticatedAdminMapperService } from '../authenticated-admin-mapper/authenticated-admin-mapper.service';

@Injectable()
export class AdminSessionService {
  /* c8 ignore next 3 */
  constructor(
    private readonly authenticatedAdminMapperService: AuthenticatedAdminMapperService,
  ) {}

  getSession(user: AuthenticatedAdminUser): AdminSessionResponse {
    return this.authenticatedAdminMapperService.toAuthenticatedAdmin(user);
  }
}
