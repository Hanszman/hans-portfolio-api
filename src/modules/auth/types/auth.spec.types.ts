import type { UserRole } from '@prisma/client';

export type AuthSpecUserRecord = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type UserFindUniqueArgs = {
  where: { email?: string; id?: string };
};

export type MockUserDelegate = {
  findUnique: jest.Mock<
    Promise<AuthSpecUserRecord | null>,
    [UserFindUniqueArgs]
  >;
};
