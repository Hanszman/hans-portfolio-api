import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { Prisma, PrismaClient } from '@prisma/client';
import { resetPortfolioContent } from './portfolio-content-reset';
import type { PortfolioSeedSnapshot } from './seed-snapshot.types';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const snapshot = await loadPortfolioSeedSnapshot();

  await resetPortfolioContent(prisma);
  await seedPortfolioContent(snapshot);

  console.log(
    [
      'Portfolio seed snapshot applied successfully.',
      `Projects: ${snapshot.projects.length}`,
      `Experiences: ${snapshot.experiences.length}`,
      `Technologies: ${snapshot.technologies.length}`,
      `Portfolio settings: ${snapshot.portfolioSettings.length}`,
    ].join('\n'),
  );
}

async function loadPortfolioSeedSnapshot(): Promise<PortfolioSeedSnapshot> {
  const snapshotPath = path.resolve(
    process.cwd(),
    'prisma',
    'data',
    'portfolio-seed.snapshot.json',
  );
  const fileContents = await readFile(snapshotPath, 'utf8');

  return JSON.parse(fileContents) as PortfolioSeedSnapshot;
}

async function seedPortfolioContent(
  snapshot: PortfolioSeedSnapshot,
): Promise<void> {
  await prisma.tag.createMany({ data: snapshot.tags });
  await prisma.technology.createMany({ data: snapshot.technologies });
  await prisma.spokenLanguage.createMany({ data: snapshot.spokenLanguages });
  await prisma.customer.createMany({ data: snapshot.customers });
  await prisma.job.createMany({ data: snapshot.jobs });
  await prisma.formation.createMany({ data: snapshot.formations });
  await prisma.experience.createMany({ data: snapshot.experiences });
  await prisma.project.createMany({ data: snapshot.projects });
  await prisma.link.createMany({ data: snapshot.links });
  await prisma.imageAsset.createMany({ data: snapshot.imageAssets });
  await prisma.portfolioSetting.createMany({
    data: snapshot.portfolioSettings.map((portfolioSetting) => ({
      ...portfolioSetting,
      value: portfolioSetting.value as Prisma.InputJsonValue,
    })),
  });
  await prisma.technologyTag.createMany({ data: snapshot.technologyTags });
  await prisma.projectTag.createMany({ data: snapshot.projectTags });
  await prisma.formationTechnology.createMany({
    data: snapshot.formationTechnologies,
  });
  await prisma.experienceTechnology.createMany({
    data: snapshot.experienceTechnologies,
  });
  await prisma.projectTechnology.createMany({
    data: snapshot.projectTechnologies,
  });
  await prisma.experienceCustomer.createMany({
    data: snapshot.experienceCustomers,
  });
  await prisma.experienceJob.createMany({ data: snapshot.experienceJobs });
  await prisma.projectExperience.createMany({
    data: snapshot.projectExperiences,
  });
  await prisma.formationLink.createMany({ data: snapshot.formationLinks });
  await prisma.experienceLink.createMany({ data: snapshot.experienceLinks });
  await prisma.projectLink.createMany({ data: snapshot.projectLinks });
  await prisma.formationImageAsset.createMany({
    data: snapshot.formationImageAssets,
  });
  await prisma.experienceImageAsset.createMany({
    data: snapshot.experienceImageAssets,
  });
  await prisma.projectImageAsset.createMany({
    data: snapshot.projectImageAssets,
  });
  await prisma.technologyImageAsset.createMany({
    data: snapshot.technologyImageAssets,
  });
  await prisma.spokenLanguageImageAsset.createMany({
    data: snapshot.spokenLanguageImageAssets,
  });
  await prisma.customerImageAsset.createMany({
    data: snapshot.customerImageAssets,
  });
  await prisma.jobImageAsset.createMany({
    data: snapshot.jobImageAssets,
  });
}

void main()
  .catch((error: unknown) => {
    console.error('Portfolio seed snapshot failed.', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
