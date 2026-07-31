import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { Prisma, PrismaClient } from '@prisma/client';
import type { PortfolioSeedSnapshot } from './seed-snapshot.types';

const prisma = new PrismaClient();

const REQUIRED_SPANISH_FIELDS = {
  tags: ['nameEs'],
  spokenLanguages: ['nameEs'],
  customers: ['summaryEs'],
  jobs: ['nameEs', 'summaryEs'],
  formations: ['titleEs', 'summaryEs'],
  experiences: ['titleEs', 'summaryEs', 'descriptionEs'],
  projects: ['titleEs', 'shortDescriptionEs', 'fullDescriptionEs'],
  links: ['labelEs'],
} as const;

const snapshotPath = path.resolve(
  process.cwd(),
  'prisma',
  'data',
  'portfolio-seed.snapshot.json',
);

async function loadSnapshot(): Promise<PortfolioSeedSnapshot> {
  return JSON.parse(
    await readFile(snapshotPath, 'utf8'),
  ) as PortfolioSeedSnapshot;
}

export function validateSpanishSnapshot(snapshot: PortfolioSeedSnapshot): void {
  for (const [collectionName, fields] of Object.entries(
    REQUIRED_SPANISH_FIELDS,
  )) {
    const records = snapshot[
      collectionName as keyof typeof REQUIRED_SPANISH_FIELDS
    ] as unknown as Array<Record<string, unknown>>;

    for (const record of records) {
      for (const field of fields) {
        const value = record[field];

        if (typeof value !== 'string' || value.trim().length === 0) {
          throw new Error(
            `Missing ${field} in ${collectionName} record ${String(record['id'])}.`,
          );
        }
      }
    }
  }

  const profile = snapshot.portfolioSettings.find(
    (setting) => setting.key === 'profile',
  );
  const profileValue = profile?.value;

  if (
    !profile ||
    !profileValue ||
    typeof profileValue !== 'object' ||
    Array.isArray(profileValue) ||
    typeof profileValue['introEs'] !== 'string' ||
    profileValue['introEs'].trim().length === 0
  ) {
    throw new Error('Missing introEs in the profile portfolio setting.');
  }
}

async function main(): Promise<void> {
  const snapshot = await loadSnapshot();
  validateSpanishSnapshot(snapshot);
  const profile = snapshot.portfolioSettings.find(
    (setting) => setting.key === 'profile',
  );

  if (!profile) {
    throw new Error('Profile portfolio setting was not found.');
  }

  const operations: Prisma.PrismaPromise<unknown>[] = [
    ...snapshot.tags.map((record) =>
      prisma.tag.updateMany({
        where: { slug: record.slug },
        data: { nameEs: record.nameEs },
      }),
    ),
    ...snapshot.spokenLanguages.map((record) =>
      prisma.spokenLanguage.updateMany({
        where: { code: record.code },
        data: { nameEs: record.nameEs },
      }),
    ),
    ...snapshot.customers.map((record) =>
      prisma.customer.updateMany({
        where: { slug: record.slug },
        data: { summaryEs: record.summaryEs },
      }),
    ),
    ...snapshot.jobs.map((record) =>
      prisma.job.updateMany({
        where: { slug: record.slug },
        data: { nameEs: record.nameEs, summaryEs: record.summaryEs },
      }),
    ),
    ...snapshot.formations.map((record) =>
      prisma.formation.updateMany({
        where: { slug: record.slug },
        data: { titleEs: record.titleEs, summaryEs: record.summaryEs },
      }),
    ),
    ...snapshot.experiences.map((record) =>
      prisma.experience.updateMany({
        where: { slug: record.slug },
        data: {
          titleEs: record.titleEs,
          summaryEs: record.summaryEs,
          descriptionEs: record.descriptionEs,
        },
      }),
    ),
    ...snapshot.projects.map((record) =>
      prisma.project.updateMany({
        where: { slug: record.slug },
        data: {
          titleEs: record.titleEs,
          shortDescriptionEs: record.shortDescriptionEs,
          fullDescriptionEs: record.fullDescriptionEs,
        },
      }),
    ),
    ...snapshot.links.map((record) =>
      prisma.link.updateMany({
        where: { url: record.url },
        data: {
          labelEs: record.labelEs,
          descriptionEs: record.descriptionEs,
        },
      }),
    ),
    ...snapshot.imageAssets.map((record) =>
      prisma.imageAsset.updateMany({
        where: { filePath: record.filePath },
        data: { altEs: record.altEs, captionEs: record.captionEs },
      }),
    ),
    prisma.portfolioSetting.updateMany({
      where: { key: profile.key },
      data: { value: profile.value as Prisma.InputJsonValue },
    }),
  ];

  const results = await prisma.$transaction(operations);
  const updatedRecords = results.reduce<number>(
    (total, result) =>
      total +
      (typeof result === 'object' &&
      result !== null &&
      'count' in result &&
      typeof result.count === 'number'
        ? result.count
        : 0),
    0,
  );

  console.log(
    `Spanish content backfill completed: ${updatedRecords} records updated from ${operations.length} snapshot entries.`,
  );
}

void main()
  .catch((error: unknown) => {
    console.error('Spanish content backfill failed.', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
