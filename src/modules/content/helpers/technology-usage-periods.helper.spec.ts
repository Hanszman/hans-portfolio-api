import { TechnologyUsageContext } from '@prisma/client';
import type { PortfolioSeedSnapshot } from '../../../../prisma/seed-snapshot.types';
import { normalizePortfolioSeedSnapshotTechnologyUsagePeriods } from './technology-usage-periods.helper';

function createBaseSnapshot(): PortfolioSeedSnapshot {
  return {
    tags: [],
    technologies: [],
    spokenLanguages: [],
    customers: [],
    jobs: [],
    formations: [
      {
        id: 'formation-1',
        slug: 'fatec',
        institution: 'Fatec',
        degreeType: 'BACHELOR',
        startDate: '2017-01-01',
        endDate: '2019-12-01',
        titlePt: 'Curso',
        titleEn: 'Course',
        shortDescriptionPt: '',
        shortDescriptionEn: '',
        fullDescriptionPt: '',
        fullDescriptionEn: '',
        icon: null,
        sortOrder: 0,
        isPublished: true,
      },
    ],
    experiences: [
      {
        id: 'experience-1',
        slug: 'pagbank',
        companyName: 'PagBank',
        titlePt: 'Dev',
        titleEn: 'Dev',
        shortDescriptionPt: '',
        shortDescriptionEn: '',
        fullDescriptionPt: '',
        fullDescriptionEn: '',
        startDate: '2020-01-01',
        endDate: '2024-04-01',
        isCurrent: false,
        context: 'PROFESSIONAL',
        icon: null,
        sortOrder: 0,
        isPublished: true,
      },
    ],
    projects: [
      {
        id: 'project-1',
        slug: 'portfolio-remake',
        titlePt: 'Portfolio',
        titleEn: 'Portfolio',
        shortDescriptionPt: '',
        shortDescriptionEn: '',
        fullDescriptionPt: '',
        fullDescriptionEn: '',
        context: 'PERSONAL',
        status: 'COMPLETED',
        environment: 'FULLSTACK',
        repositoryUrl: null,
        demoUrl: null,
        startDate: '2025-01-01',
        endDate: '2025-04-01',
        featured: false,
        highlight: false,
        icon: null,
        sortOrder: 0,
        isPublished: true,
      },
    ],
    links: [],
    imageAssets: [],
    portfolioSettings: [],
    technologyTags: [],
    projectTags: [],
    formationTechnologies: [
      {
        formationId: 'formation-1',
        technologyId: 'technology-1',
        level: null,
        frequency: null,
        contexts: [],
        startedAt: null,
        endedAt: null,
      },
    ],
    experienceTechnologies: [
      {
        experienceId: 'experience-1',
        technologyId: 'technology-1',
        level: null,
        frequency: null,
        contexts: [],
        startedAt: null,
        endedAt: null,
      },
    ],
    projectTechnologies: [
      {
        projectId: 'project-1',
        technologyId: 'technology-1',
        level: null,
        frequency: null,
        contexts: [],
        startedAt: null,
        endedAt: null,
      },
    ],
    experienceCustomers: [],
    experienceJobs: [],
    projectExperiences: [],
    formationLinks: [],
    experienceLinks: [],
    projectLinks: [],
    formationImageAssets: [],
    experienceImageAssets: [],
    projectImageAssets: [],
    technologyImageAssets: [],
    spokenLanguageImageAssets: [],
    customerImageAssets: [],
    jobImageAssets: [],
  };
}

describe('normalizePortfolioSeedSnapshotTechnologyUsagePeriods', () => {
  it('fills missing contexts and dates from the owning entities', () => {
    const result =
      normalizePortfolioSeedSnapshotTechnologyUsagePeriods(
        createBaseSnapshot(),
      );

    expect(result.projectTechnologies[0]).toEqual({
      projectId: 'project-1',
      technologyId: 'technology-1',
      level: null,
      frequency: null,
      contexts: [TechnologyUsageContext.PERSONAL],
      startedAt: '2025-01-01',
      endedAt: '2025-04-01',
    });
    expect(result.experienceTechnologies[0]).toEqual({
      experienceId: 'experience-1',
      technologyId: 'technology-1',
      level: null,
      frequency: null,
      contexts: [TechnologyUsageContext.PROFESSIONAL],
      startedAt: '2020-01-01',
      endedAt: '2024-04-01',
    });
    expect(result.formationTechnologies[0]).toEqual({
      formationId: 'formation-1',
      technologyId: 'technology-1',
      level: null,
      frequency: null,
      contexts: [TechnologyUsageContext.ACADEMIC],
      startedAt: '2017-01-01',
      endedAt: '2019-12-01',
    });
  });

  it('preserves explicit contexts and explicit dates when they already exist', () => {
    const snapshot = createBaseSnapshot();
    snapshot.projectTechnologies[0] = {
      ...snapshot.projectTechnologies[0],
      contexts: [TechnologyUsageContext.STUDY],
      startedAt: '2025-02-01',
      endedAt: '2025-03-01',
    };

    const result =
      normalizePortfolioSeedSnapshotTechnologyUsagePeriods(snapshot);

    expect(result.projectTechnologies[0]).toEqual({
      projectId: 'project-1',
      technologyId: 'technology-1',
      level: null,
      frequency: null,
      contexts: [TechnologyUsageContext.STUDY],
      startedAt: '2025-02-01',
      endedAt: '2025-03-01',
    });
  });

  it('falls back to empty project context and null dates when the owning records are missing', () => {
    const snapshot = createBaseSnapshot();
    snapshot.projectTechnologies[0] = {
      ...snapshot.projectTechnologies[0],
      projectId: 'missing-project',
    };
    snapshot.experienceTechnologies[0] = {
      ...snapshot.experienceTechnologies[0],
      experienceId: 'missing-experience',
    };
    snapshot.formationTechnologies[0] = {
      ...snapshot.formationTechnologies[0],
      formationId: 'missing-formation',
    };

    const result =
      normalizePortfolioSeedSnapshotTechnologyUsagePeriods(snapshot);

    expect(result.projectTechnologies[0]).toEqual({
      projectId: 'missing-project',
      technologyId: 'technology-1',
      level: null,
      frequency: null,
      contexts: [],
      startedAt: null,
      endedAt: null,
    });
    expect(result.experienceTechnologies[0]).toEqual({
      experienceId: 'missing-experience',
      technologyId: 'technology-1',
      level: null,
      frequency: null,
      contexts: [TechnologyUsageContext.PROFESSIONAL],
      startedAt: null,
      endedAt: null,
    });
    expect(result.formationTechnologies[0]).toEqual({
      formationId: 'missing-formation',
      technologyId: 'technology-1',
      level: null,
      frequency: null,
      contexts: [TechnologyUsageContext.ACADEMIC],
      startedAt: null,
      endedAt: null,
    });
  });

  it('preserves explicit contexts for experience and formation usage rows too', () => {
    const snapshot = createBaseSnapshot();
    snapshot.experienceTechnologies[0] = {
      ...snapshot.experienceTechnologies[0],
      contexts: [TechnologyUsageContext.STUDY],
      startedAt: '2021-02-01',
      endedAt: '2021-05-01',
    };
    snapshot.formationTechnologies[0] = {
      ...snapshot.formationTechnologies[0],
      contexts: [TechnologyUsageContext.PERSONAL],
      startedAt: '2018-01-01',
      endedAt: '2018-03-01',
    };

    const result =
      normalizePortfolioSeedSnapshotTechnologyUsagePeriods(snapshot);

    expect(result.experienceTechnologies[0]).toEqual({
      experienceId: 'experience-1',
      technologyId: 'technology-1',
      level: null,
      frequency: null,
      contexts: [TechnologyUsageContext.STUDY],
      startedAt: '2021-02-01',
      endedAt: '2021-05-01',
    });
    expect(result.formationTechnologies[0]).toEqual({
      formationId: 'formation-1',
      technologyId: 'technology-1',
      level: null,
      frequency: null,
      contexts: [TechnologyUsageContext.PERSONAL],
      startedAt: '2018-01-01',
      endedAt: '2018-03-01',
    });
  });
});
