import { PrismaClient } from '@prisma/client';
import { resetPortfolioContent } from './portfolio-content-reset';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  await resetPortfolioContent(prisma);
  console.log('Portfolio content reset completed successfully.');
}

void main()
  .catch((error: unknown) => {
    console.error('Portfolio content reset failed.', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
