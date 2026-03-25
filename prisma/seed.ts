import { cp, mkdir, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { Prisma, PrismaClient, TechnologyUsageContext } from '@prisma/client';
import { LegacyPortfolioImportService } from '../src/modules/legacy-import/services/legacy-portfolio-import.service';
import type {
  LegacyOptionsRecord,
  LegacyPortfolioImportInput,
  LegacyTranslationMap,
} from '../src/modules/legacy-import/types/legacy-portfolio-import.types';

const prisma = new PrismaClient();
const legacyPortfolioImportService = new LegacyPortfolioImportService();

async function main(): Promise<void> {
  const paths = resolveLegacyImportPaths();
  const availableAssetPaths = await collectRelativeFilePaths(paths.legacyAssetsRootPath);
  const input = await loadLegacyPortfolioImportInput(paths, availableAssetPaths);
  const seedData = legacyPortfolioImportService.buildSeedData(input);

  await copyLegacyAssets(paths.legacyAssetsRootPath, paths.frontendAssetsRootPath);
  await resetPortfolioData();
  await seedPortfolioData(seedData);

  console.log(
    [
      'Legacy portfolio import completed successfully.',
      `Projects: ${seedData.projects.length}`,
      `Experiences: ${seedData.experiences.length}`,
      `Technologies: ${seedData.technologies.length}`,
      `Frontend assets copied to: ${paths.frontendAssetsRootPath}`,
    ].join('\n'),
  );
}

async function loadLegacyPortfolioImportInput(
  paths: ReturnType<typeof resolveLegacyImportPaths>,
  availableAssetPaths: string[],
): Promise<LegacyPortfolioImportInput> {
  const [projectsPayload, experiencesPayload, skillsPayload, optionsPayload, ptLocalePayload, enLocalePayload] =
    await Promise.all([
      readJsonFile<{ projects: LegacyPortfolioImportInput['projects'] }>(paths.projectsJsonPath),
      readJsonFile<{
        experiences: {
          jobs: LegacyPortfolioImportInput['jobs'];
          customers: LegacyPortfolioImportInput['customers'];
        };
      }>(paths.experiencesJsonPath),
      readJsonFile<{
        skills: {
          technologies: LegacyPortfolioImportInput['technologies'];
          languages: LegacyPortfolioImportInput['spokenLanguages'];
          formations: LegacyPortfolioImportInput['formations'];
        };
      }>(paths.skillsJsonPath),
      readJsonFile<{ options: LegacyOptionsRecord }>(paths.optionsJsonPath),
      readJsonFile<{ translation: LegacyTranslationMap }>(paths.ptLocaleJsonPath),
      readJsonFile<{ translation: LegacyTranslationMap }>(paths.enLocaleJsonPath),
    ]);

  return {
    assetBaseUrl: paths.assetBaseUrl,
    availableAssetPaths,
    options: optionsPayload.options,
    projects: projectsPayload.projects,
    jobs: experiencesPayload.experiences.jobs,
    customers: experiencesPayload.experiences.customers,
    technologies: skillsPayload.skills.technologies,
    spokenLanguages: skillsPayload.skills.languages,
    formations: skillsPayload.skills.formations,
    translations: {
      pt: ptLocalePayload.translation,
      en: enLocalePayload.translation,
    },
  };
}

async function copyLegacyAssets(
  legacyAssetsRootPath: string,
  frontendAssetsRootPath: string,
): Promise<void> {
  await mkdir(path.dirname(frontendAssetsRootPath), { recursive: true });
  await cp(legacyAssetsRootPath, frontendAssetsRootPath, {
    force: true,
    recursive: true,
  });
}

async function resetPortfolioData(): Promise<void> {
  await prisma.$transaction([
    prisma.projectTechnology.deleteMany(),
    prisma.experienceTechnology.deleteMany(),
    prisma.formationTechnology.deleteMany(),
    prisma.projectExperience.deleteMany(),
    prisma.experienceCustomer.deleteMany(),
    prisma.experienceJob.deleteMany(),
    prisma.projectTag.deleteMany(),
    prisma.technologyTag.deleteMany(),
    prisma.projectLink.deleteMany(),
    prisma.experienceLink.deleteMany(),
    prisma.formationLink.deleteMany(),
    prisma.projectImageAsset.deleteMany(),
    prisma.experienceImageAsset.deleteMany(),
    prisma.formationImageAsset.deleteMany(),
    prisma.imageAsset.deleteMany(),
    prisma.link.deleteMany(),
    prisma.portfolioSetting.deleteMany(),
    prisma.project.deleteMany(),
    prisma.experience.deleteMany(),
    prisma.formation.deleteMany(),
    prisma.spokenLanguage.deleteMany(),
    prisma.customer.deleteMany(),
    prisma.job.deleteMany(),
    prisma.technology.deleteMany(),
    prisma.tag.deleteMany(),
  ]);
}

async function seedPortfolioData(
  seedData: ReturnType<LegacyPortfolioImportService['buildSeedData']>,
): Promise<void> {
  await prisma.tag.createMany({
    data: seedData.tags,
  });

  await prisma.technology.createMany({
    data: seedData.technologies.map((technology) => ({
      slug: technology.slug,
      name: technology.name,
      category: technology.category,
      icon: technology.icon,
      highlight: technology.highlight,
      sortOrder: technology.sortOrder,
      isPublished: true,
    })),
  });

  await prisma.spokenLanguage.createMany({
    data: seedData.spokenLanguages.map((language) => ({
      code: language.code,
      namePt: language.namePt,
      nameEn: language.nameEn,
      proficiency: language.proficiency,
      icon: language.icon,
      highlight: language.highlight,
      sortOrder: language.sortOrder,
    })),
  });

  await prisma.customer.createMany({
    data: seedData.customers,
  });

  await prisma.job.createMany({
    data: seedData.jobs,
  });

  await prisma.formation.createMany({
    data: seedData.formations.map((formation) => ({
      slug: formation.slug,
      institution: formation.institution,
      titlePt: formation.titlePt,
      titleEn: formation.titleEn,
      degreeType: formation.degreeType,
      summaryPt: formation.summaryPt,
      summaryEn: formation.summaryEn,
      icon: formation.icon,
      startDate: new Date(formation.startDate),
      endDate: toNullableDate(formation.endDate),
      highlight: formation.highlight,
      sortOrder: formation.sortOrder,
      isPublished: formation.isPublished,
    })),
  });

  await prisma.experience.createMany({
    data: seedData.experiences.map((experience) => ({
      slug: experience.slug,
      companyName: experience.companyName,
      titlePt: experience.titlePt,
      titleEn: experience.titleEn,
      summaryPt: experience.summaryPt,
      summaryEn: experience.summaryEn,
      descriptionPt: experience.descriptionPt,
      descriptionEn: experience.descriptionEn,
      icon: experience.icon,
      startDate: new Date(experience.startDate),
      endDate: toNullableDate(experience.endDate),
      isCurrent: experience.isCurrent,
      highlight: experience.highlight,
      sortOrder: experience.sortOrder,
      isPublished: experience.isPublished,
    })),
  });

  await prisma.project.createMany({
    data: seedData.projects.map((project) => ({
      slug: project.slug,
      titlePt: project.titlePt,
      titleEn: project.titleEn,
      shortDescriptionPt: project.shortDescriptionPt,
      shortDescriptionEn: project.shortDescriptionEn,
      fullDescriptionPt: project.fullDescriptionPt,
      fullDescriptionEn: project.fullDescriptionEn,
      context: project.context,
      status: project.status,
      environment: project.environment,
      repositoryUrl: project.repositoryUrl,
      deployUrl: project.deployUrl,
      docsUrl: project.docsUrl,
      npmUrl: project.npmUrl,
      icon: project.icon,
      featured: project.featured,
      highlight: project.highlight,
      startDate: toNullableDate(project.startDate),
      endDate: toNullableDate(project.endDate),
      sortOrder: project.sortOrder,
      isPublished: project.isPublished,
    })),
  });

  for (const portfolioSetting of seedData.portfolioSettings) {
    await prisma.portfolioSetting.create({
      data: {
        key: portfolioSetting.key,
        value: portfolioSetting.value as Prisma.InputJsonValue,
        description: portfolioSetting.description,
      },
    });
  }

  const [tags, technologies, customers, jobs, experiences, formations, projects] = await Promise.all([
    prisma.tag.findMany(),
    prisma.technology.findMany(),
    prisma.customer.findMany(),
    prisma.job.findMany(),
    prisma.experience.findMany(),
    prisma.formation.findMany(),
    prisma.project.findMany(),
  ]);

  const tagIdBySlug = toIdMap(tags);
  const technologyIdBySlug = toIdMap(technologies);
  const customerIdBySlug = toIdMap(customers);
  const jobIdBySlug = toIdMap(jobs);
  const experienceIdBySlug = toIdMap(experiences);
  const formationIdBySlug = toIdMap(formations);
  const projectIdBySlug = toIdMap(projects);

  await prisma.technologyTag.createMany({
    data: seedData.technologies.flatMap((technology) => [
      {
        technologyId: technologyIdBySlug.get(technology.slug) ?? fail(`Missing technology ${technology.slug}`),
        tagId: tagIdBySlug.get(technology.stackTagSlug) ?? fail(`Missing tag ${technology.stackTagSlug}`),
      },
      {
        technologyId: technologyIdBySlug.get(technology.slug) ?? fail(`Missing technology ${technology.slug}`),
        tagId: tagIdBySlug.get(technology.typeTagSlug) ?? fail(`Missing tag ${technology.typeTagSlug}`),
      },
    ]),
  });

  await prisma.projectTechnology.createMany({
    data: seedData.projects.flatMap((project) =>
      project.technologySlugs.map((technologySlug) => ({
        projectId: projectIdBySlug.get(project.slug) ?? fail(`Missing project ${project.slug}`),
        technologyId:
          technologyIdBySlug.get(technologySlug) ?? fail(`Missing technology ${technologySlug}`),
        level:
          seedData.technologies.find((technology) => technology.slug === technologySlug)?.legacyLevel ?? null,
        frequency:
          seedData.technologies.find((technology) => technology.slug === technologySlug)?.legacyFrequency ??
          null,
        contexts: [mapProjectContextToUsageContext(project.context)],
      })),
    ),
  });

  await prisma.experienceTechnology.createMany({
    data: seedData.experiences.flatMap((experience) =>
      experience.technologySlugs.map((technologySlug) => ({
        experienceId:
          experienceIdBySlug.get(experience.slug) ?? fail(`Missing experience ${experience.slug}`),
        technologyId:
          technologyIdBySlug.get(technologySlug) ?? fail(`Missing technology ${technologySlug}`),
        level:
          seedData.technologies.find((technology) => technology.slug === technologySlug)?.legacyLevel ?? null,
        frequency:
          seedData.technologies.find((technology) => technology.slug === technologySlug)?.legacyFrequency ??
          null,
        contexts: [TechnologyUsageContext.PROFESSIONAL],
      })),
    ),
  });

  await prisma.formationTechnology.createMany({
    data: seedData.formations.flatMap((formation) =>
      formation.technologySlugs.map((technologySlug) => ({
        formationId:
          formationIdBySlug.get(formation.slug) ?? fail(`Missing formation ${formation.slug}`),
        technologyId:
          technologyIdBySlug.get(technologySlug) ?? fail(`Missing technology ${technologySlug}`),
        level:
          seedData.technologies.find((technology) => technology.slug === technologySlug)?.legacyLevel ?? null,
        frequency:
          seedData.technologies.find((technology) => technology.slug === technologySlug)?.legacyFrequency ??
          null,
        contexts: [TechnologyUsageContext.ACADEMIC],
      })),
    ),
  });

  await prisma.experienceCustomer.createMany({
    data: seedData.experiences.flatMap((experience) =>
      experience.customerSlugs.map((customerSlug, index) => ({
        experienceId:
          experienceIdBySlug.get(experience.slug) ?? fail(`Missing experience ${experience.slug}`),
        customerId: customerIdBySlug.get(customerSlug) ?? fail(`Missing customer ${customerSlug}`),
        sortOrder: index + 1,
      })),
    ),
  });

  await prisma.experienceJob.createMany({
    data: seedData.experiences.flatMap((experience) =>
      experience.jobSlugs.map((jobSlug, index) => ({
        experienceId:
          experienceIdBySlug.get(experience.slug) ?? fail(`Missing experience ${experience.slug}`),
        jobId: jobIdBySlug.get(jobSlug) ?? fail(`Missing job ${jobSlug}`),
        sortOrder: index + 1,
      })),
    ),
  });

  await prisma.projectExperience.createMany({
    data: seedData.experiences.flatMap((experience) =>
      experience.projectSlugs.map((projectSlug, index) => ({
        experienceId:
          experienceIdBySlug.get(experience.slug) ?? fail(`Missing experience ${experience.slug}`),
        projectId: projectIdBySlug.get(projectSlug) ?? fail(`Missing project ${projectSlug}`),
        sortOrder: index + 1,
      })),
    ),
  });

  for (const project of seedData.projects) {
    const projectId = projectIdBySlug.get(project.slug) ?? fail(`Missing project ${project.slug}`);

    for (const link of project.links) {
      const createdLink = await prisma.link.create({
        data: {
          url: link.url,
          labelPt: link.labelPt,
          labelEn: link.labelEn,
          descriptionPt: null,
          descriptionEn: null,
          type: link.type,
          sortOrder: link.sortOrder,
          isPublished: true,
        },
      });

      await prisma.projectLink.create({
        data: {
          projectId,
          linkId: createdLink.id,
          sortOrder: link.sortOrder,
        },
      });
    }
  }
}

function resolveLegacyImportPaths() {
  const backendRootPath = process.cwd();
  const legacyProjectRootPath = process.env.LEGACY_PORTFOLIO_SOURCE_PATH
    ? path.resolve(backendRootPath, process.env.LEGACY_PORTFOLIO_SOURCE_PATH)
    : path.resolve(backendRootPath, '..', 'victor_hanszman_portfolio-old');
  const frontendAssetsBasePath = process.env.FRONTEND_ASSETS_TARGET_PATH
    ? path.resolve(backendRootPath, process.env.FRONTEND_ASSETS_TARGET_PATH)
    : path.resolve(backendRootPath, '..', 'hans-portfolio-app', 'src', 'assets');

  return {
    assetBaseUrl: process.env.ASSET_BASE_URL?.trim() || '/assets/img',
    legacyAssetsRootPath: path.join(legacyProjectRootPath, 'src', 'assets', 'img'),
    frontendAssetsRootPath: path.join(frontendAssetsBasePath, 'img'),
    projectsJsonPath: path.join(legacyProjectRootPath, 'src', 'db', 'projects.json'),
    experiencesJsonPath: path.join(legacyProjectRootPath, 'src', 'db', 'experiences.json'),
    skillsJsonPath: path.join(legacyProjectRootPath, 'src', 'db', 'skills.json'),
    optionsJsonPath: path.join(legacyProjectRootPath, 'src', 'db', 'options.json'),
    ptLocaleJsonPath: path.join(
      legacyProjectRootPath,
      'src',
      'assets',
      'i18n',
      'locales',
      'pt',
      'pt-br.json',
    ),
    enLocaleJsonPath: path.join(
      legacyProjectRootPath,
      'src',
      'assets',
      'i18n',
      'locales',
      'en',
      'en-us.json',
    ),
  };
}

async function readJsonFile<T>(filePath: string): Promise<T> {
  const fileContents = await readFile(filePath, 'utf8');
  return JSON.parse(fileContents) as T;
}

async function collectRelativeFilePaths(rootPath: string): Promise<string[]> {
  const relativeFilePaths: string[] = [];

  await walkDirectory(rootPath, rootPath, relativeFilePaths);

  return relativeFilePaths;
}

function toIdMap(records: Array<{ id: string; slug?: string; code?: string }>): Map<string, string> {
  return new Map(
    records.map((record) => [
      record.slug ?? record.code ?? fail('Unable to build identifier map for record.'),
      record.id,
    ]),
  );
}

function toNullableDate(value: string | null): Date | null {
  return value ? new Date(value) : null;
}

function mapProjectContextToUsageContext(projectContext: string): TechnologyUsageContext {
  switch (projectContext) {
    case 'PROFESSIONAL':
      return TechnologyUsageContext.PROFESSIONAL;
    case 'PERSONAL':
      return TechnologyUsageContext.PERSONAL;
    case 'ACADEMIC':
      return TechnologyUsageContext.ACADEMIC;
    default:
      return TechnologyUsageContext.STUDY;
  }
}

function fail(message: string): never {
  throw new Error(message);
}

async function walkDirectory(
  currentPath: string,
  rootPath: string,
  relativeFilePaths: string[],
): Promise<void> {
  const entries = await readdir(currentPath, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = path.join(currentPath, entry.name);

    if (entry.isDirectory()) {
      await walkDirectory(entryPath, rootPath, relativeFilePaths);
      continue;
    }

    if (entry.isFile()) {
      relativeFilePaths.push(path.relative(rootPath, entryPath).replaceAll(path.sep, '/'));
    }
  }
}

void main()
  .catch((error: unknown) => {
    console.error('Legacy portfolio import failed.', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
