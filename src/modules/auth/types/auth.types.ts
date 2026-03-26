import type { UserRole } from '@prisma/client';

export type JwtAccessTokenPayload = {
  sub: string;
  email: string;
  name: string;
  role: UserRole;
};

export type AuthenticatedAdminUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
};
