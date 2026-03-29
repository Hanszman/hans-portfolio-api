import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';
import type { PortfolioSeedSnapshot } from './seed-snapshot.types';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const snapshot = await loadPortfolioSeedSnapshot();
  const outputPath = path.resolve(
    process.cwd(),
    'prisma',
    'data',
    'portfolio-seed.snapshot.json',
  );

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, JSON.stringify(snapshot, null, 2), 'utf8');

  console.log(`Portfolio seed snapshot exported to: ${outputPath}`);
}

async function loadPortfolioSeedSnapshot(): Promise<PortfolioSeedSnapshot> {
  const [
    tags,
    technologies,
    spokenLanguages,
    customers,
    jobs,
    formations,
    experiences,
    projects,
    links,
    imageAssets,
    portfolioSettings,
    technologyTags,
    projectTags,
    technologyContexts,
    formationTechnologies,
    experienceTechnologies,
    projectTechnologies,
    experienceCustomers,
    experienceJobs,
    projectExperiences,
    formationLinks,
    experienceLinks,
    projectLinks,
    formationImageAssets,
    experienceImageAssets,
    projectImageAssets,
    technologyImageAssets,
    spokenLanguageImageAssets,
    customerImageAssets,
    jobImageAssets,
  ] = await Promise.all([
    prisma.tag.findMany({ orderBy: [{ sortOrder: 'asc' }, { slug: 'asc' }] }),
    prisma.technology.findMany({
      orderBy: [{ sortOrder: 'asc' }, { slug: 'asc' }],
    }),
    prisma.spokenLanguage.findMany({
      orderBy: [{ sortOrder: 'asc' }, { code: 'asc' }],
    }),
    prisma.customer.findMany({
      orderBy: [{ sortOrder: 'asc' }, { slug: 'asc' }],
    }),
    prisma.job.findMany({ orderBy: [{ sortOrder: 'asc' }, { slug: 'asc' }] }),
    prisma.formation.findMany({
      orderBy: [{ sortOrder: 'asc' }, { slug: 'asc' }],
    }),
    prisma.experience.findMany({
      orderBy: [{ sortOrder: 'asc' }, { slug: 'asc' }],
    }),
    prisma.project.findMany({
      orderBy: [{ sortOrder: 'asc' }, { slug: 'asc' }],
    }),
    prisma.link.findMany({ orderBy: [{ sortOrder: 'asc' }, { url: 'asc' }] }),
    prisma.imageAsset.findMany({
      orderBy: [{ sortOrder: 'asc' }, { filePath: 'asc' }],
    }),
    prisma.portfolioSetting.findMany({ orderBy: { key: 'asc' } }),
    prisma.technologyTag.findMany({
      orderBy: [{ technologyId: 'asc' }, { tagId: 'asc' }],
    }),
    prisma.projectTag.findMany({
      orderBy: [{ projectId: 'asc' }, { tagId: 'asc' }],
    }),
    prisma.technologyContext.findMany({
      orderBy: [
        { technologyId: 'asc' },
        { context: 'asc' },
        { startedAt: 'asc' },
      ],
    }),
    prisma.formationTechnology.findMany({
      orderBy: [{ formationId: 'asc' }, { technologyId: 'asc' }],
    }),
    prisma.experienceTechnology.findMany({
      orderBy: [{ experienceId: 'asc' }, { technologyId: 'asc' }],
    }),
    prisma.projectTechnology.findMany({
      orderBy: [{ projectId: 'asc' }, { technologyId: 'asc' }],
    }),
    prisma.experienceCustomer.findMany({
      orderBy: [{ experienceId: 'asc' }, { customerId: 'asc' }],
    }),
    prisma.experienceJob.findMany({
      orderBy: [{ experienceId: 'asc' }, { jobId: 'asc' }],
    }),
    prisma.projectExperience.findMany({
      orderBy: [{ projectId: 'asc' }, { experienceId: 'asc' }],
    }),
    prisma.formationLink.findMany({
      orderBy: [{ formationId: 'asc' }, { linkId: 'asc' }],
    }),
    prisma.experienceLink.findMany({
      orderBy: [{ experienceId: 'asc' }, { linkId: 'asc' }],
    }),
    prisma.projectLink.findMany({
      orderBy: [{ projectId: 'asc' }, { linkId: 'asc' }],
    }),
    prisma.formationImageAsset.findMany({
      orderBy: [{ formationId: 'asc' }, { imageAssetId: 'asc' }],
    }),
    prisma.experienceImageAsset.findMany({
      orderBy: [{ experienceId: 'asc' }, { imageAssetId: 'asc' }],
    }),
    prisma.projectImageAsset.findMany({
      orderBy: [{ projectId: 'asc' }, { imageAssetId: 'asc' }],
    }),
    prisma.technologyImageAsset.findMany({
      orderBy: [{ technologyId: 'asc' }, { imageAssetId: 'asc' }],
    }),
    prisma.spokenLanguageImageAsset.findMany({
      orderBy: [{ spokenLanguageId: 'asc' }, { imageAssetId: 'asc' }],
    }),
    prisma.customerImageAsset.findMany({
      orderBy: [{ customerId: 'asc' }, { imageAssetId: 'asc' }],
    }),
    prisma.jobImageAsset.findMany({
      orderBy: [{ jobId: 'asc' }, { imageAssetId: 'asc' }],
    }),
  ]);

  return {
    tags,
    technologies,
    spokenLanguages,
    customers,
    jobs,
    formations,
    experiences,
    projects,
    links,
    imageAssets,
    portfolioSettings,
    technologyTags,
    projectTags,
    technologyContexts,
    formationTechnologies,
    experienceTechnologies,
    projectTechnologies,
    experienceCustomers,
    experienceJobs,
    projectExperiences,
    formationLinks,
    experienceLinks,
    projectLinks,
    formationImageAssets,
    experienceImageAssets,
    projectImageAssets,
    technologyImageAssets,
    spokenLanguageImageAssets,
    customerImageAssets,
    jobImageAssets,
  };
}

void main()
  .catch((error: unknown) => {
    console.error('Portfolio seed snapshot export failed.', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
