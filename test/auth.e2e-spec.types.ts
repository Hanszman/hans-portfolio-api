import type { UserRole } from '@prisma/client';

export type LoginEndpointResponse = {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
  };
};
