import { PrismaClient } from '@prisma/client';
import { ensureRuntimeEnvironment } from '../src/config/runtime-env';
import { bootstrapAdminUser } from './admin-bootstrap';

ensureRuntimeEnvironment();

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const { adminUser, wasExistingUser } = await bootstrapAdminUser(prisma);

  console.log(
    [
      wasExistingUser
        ? 'Admin bootstrap updated an existing user.'
        : 'Admin bootstrap created the first admin user.',
      `Email: ${adminUser.email}`,
      `Role: ${adminUser.role}`,
      `Active: ${adminUser.isActive}`,
    ].join('\n'),
  );
}

void main()
  .catch((error: unknown) => {
    console.error('Admin bootstrap failed.', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
