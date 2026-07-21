import type { Request } from 'express';
import type { AuthenticatedAdminUser } from './auth.types';

export type AuthenticatedAdminRequest = Request & {
  user: AuthenticatedAdminUser;
};

export type OptionalAuthenticatedAdminRequest = Request & {
  user?: AuthenticatedAdminUser;
};
