import { PrismaClient, UserRole } from '@prisma/client';
import { ensureRuntimeEnvironment } from '../src/config/runtime-env';
import { PasswordService } from '../src/modules/auth/services/password/password.service';

ensureRuntimeEnvironment();

const prisma = new PrismaClient();
const passwordService = new PasswordService();

async function main(): Promise<void> {
  const bootstrapInput = getBootstrapInputFromEnvironment();
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

  console.log(
    [
      existingUser
        ? 'Admin bootstrap updated an existing user.'
        : 'Admin bootstrap created the first admin user.',
      `Email: ${adminUser.email}`,
      `Role: ${adminUser.role}`,
      `Active: ${adminUser.isActive}`,
    ].join('\n'),
  );
}

function getBootstrapInputFromEnvironment(): {
  name: string;
  email: string;
  password: string;
} {
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

void main()
  .catch((error: unknown) => {
    console.error('Admin bootstrap failed.', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
