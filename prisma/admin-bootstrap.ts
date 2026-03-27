import { PrismaClient, UserRole } from '@prisma/client';
import { PasswordService } from '../src/modules/auth/services/password/password.service';

export type AdminBootstrapInput = {
  name: string;
  email: string;
  password: string;
};

const passwordService = new PasswordService();

export async function bootstrapAdminUser(
  prisma: Pick<PrismaClient, 'user'>,
  bootstrapInput = getAdminBootstrapInputFromEnvironment(),
): Promise<{
  adminUser: {
    email: string;
    role: UserRole;
    isActive: boolean;
  };
  wasExistingUser: boolean;
}> {
  const passwordHash = await passwordService.hashPassword(
    bootstrapInput.password,
  );
  const existingUser = await prisma.user.findUnique({
    where: { email: bootstrapInput.email },
  });

  const adminUser = await prisma.user.upsert({
    where: { email: bootstrapInput.email },
    update: {
      name: bootstrapInput.name,
      passwordHash,
      role: UserRole.ADMIN,
      isActive: true,
    },
    create: {
      name: bootstrapInput.name,
      email: bootstrapInput.email,
      passwordHash,
      role: UserRole.ADMIN,
      isActive: true,
    },
  });

  return {
    adminUser: {
      email: adminUser.email,
      role: adminUser.role,
      isActive: adminUser.isActive,
    },
    wasExistingUser: Boolean(existingUser),
  };
}

export function getAdminBootstrapInputFromEnvironment(): AdminBootstrapInput {
  const name = process.env.ADMIN_BOOTSTRAP_NAME?.trim();
  const email = process.env.ADMIN_BOOTSTRAP_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_BOOTSTRAP_PASSWORD?.trim();

  if (!name || !email || !password) {
    throw new Error(
      'Missing admin bootstrap environment variables. Fill ADMIN_BOOTSTRAP_NAME, ADMIN_BOOTSTRAP_EMAIL, and ADMIN_BOOTSTRAP_PASSWORD before running prisma:admin:bootstrap.',
    );
  }

  return { name, email, password };
}

export function hasAdminBootstrapEnvironment(): boolean {
  return Boolean(
    process.env.ADMIN_BOOTSTRAP_NAME?.trim() &&
    process.env.ADMIN_BOOTSTRAP_EMAIL?.trim() &&
    process.env.ADMIN_BOOTSTRAP_PASSWORD?.trim(),
  );
}
