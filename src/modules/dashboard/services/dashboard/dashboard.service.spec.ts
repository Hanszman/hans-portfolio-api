import { Test } from '@nestjs/testing';
import {
  ProjectContext,
  ProjectEnvironment,
  TagType,
  TechnologyCategory,
  TechnologyLevel,
  TechnologyUsageContext,
  TechnologyUsageFrequency,
} from '@prisma/client';
import { PrismaService } from '../../../../prisma/prisma.service';
import { DashboardService } from './dashboard.service';

describe('DashboardService', () => {
  let service: DashboardService;
  let prismaService: {
    tag: { findMany: jest.Mock };
    project: { findMany: jest.Mock; count: jest.Mock };
    projectTechnology: { findMany: jest.Mock };
    experienceTechnology: { findMany: jest.Mock };
    formationTechnology: { findMany: jest.Mock };
    experience: { findMany: jest.Mock; count: jest.Mock };
    technology: { findMany: jest.Mock; count: jest.Mock };
    formation: { findMany: jest.Mock; count: jest.Mock };
    customer: { findMany: jest.Mock; count: jest.Mock };
    job: { findMany: jest.Mock; count: jest.Mock };
    spokenLanguage: { findMany: jest.Mock; count: jest.Mock };
  };

  beforeEach(async () => {
    prismaService = {
      tag: { findMany: jest.fn() },
      project: { findMany: jest.fn(), count: jest.fn() },
      projectTechnology: { findMany: jest.fn() },
      experienceTechnology: { findMany: jest.fn() },
      formationTechnology: { findMany: jest.fn() },
      experience: { findMany: jest.fn(), count: jest.fn() },
      technology: { findMany: jest.fn(), count: jest.fn() },
      formation: { findMany: jest.fn(), count: jest.fn() },
      customer: { findMany: jest.fn(), count: jest.fn() },
      job: { findMany: jest.fn(), count: jest.fn() },
      spokenLanguage: { findMany: jest.fn(), count: jest.fn() },
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        DashboardService,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
      ],
    }).compile();

    service = moduleRef.get(DashboardService);
  });

  it('builds the stack distribution from unique project and technology relations', async () => {
    prismaService.tag.findMany.mockResolvedValue([
      {
        id: 'tag-1',
        slug: 'stack-front-end',
        namePt: 'Front-End',
        nameEn: 'Front-End',
        type: TagType.STACK,
        projects: [
          { projectId: 'project-1' },
          { projectId: 'project-1' },
          { projectId: 'project-2' },
        ],
        technologies: [
          { technologyId: 'tech-1' },
          { technologyId: 'tech-2' },
          { technologyId: 'tech-2' },
        ],
      },
    ]);

    const result = await service.getStackDistribution();

    expect(result.generatedAtUtc).toEqual(expect.any(String));
    expect(result.stacks).toEqual([
      {
        slug: 'stack-front-end',
        namePt: 'Front-End',
        nameEn: 'Front-End',
        projectCount: 2,
        technologyCount: 2,
      },
    ]);
  });

  it('builds project contexts and environments distributions', async () => {
    prismaService.project.findMany.mockResolvedValue([
      {
        id: 'project-1',
        context: ProjectContext.PERSONAL,
        environment: ProjectEnvironment.FULLSTACK,
        featured: true,
        highlight: true,
      },
      {
        id: 'project-2',
        context: ProjectContext.PERSONAL,
        environment: ProjectEnvironment.FRONTEND,
        featured: false,
        highlight: false,
      },
      {
        id: 'project-3',
        context: ProjectContext.PROFESSIONAL,
        environment: ProjectEnvironment.FRONTEND,
        featured: false,
        highlight: true,
      },
    ]);

    const result = await service.getProjectContexts();

    expect(result.totalProjects).toBe(3);
    expect(result.featuredProjects).toBe(1);
    expect(result.highlightedProjects).toBe(2);
    expect(result.contexts).toEqual([
      { key: 'PERSONAL', count: 2 },
      { key: 'PROFESSIONAL', count: 1 },
    ]);
    expect(result.environments).toEqual([
      { key: 'FRONTEND', count: 2 },
      { key: 'FULLSTACK', count: 1 },
    ]);
  });

  it('builds technology usage analytics and ignores orphan relation rows', async () => {
    prismaService.projectTechnology.findMany.mockResolvedValue([
      { technologyId: 'tech-1' },
      { technologyId: 'tech-2' },
    ]);
    prismaService.experienceTechnology.findMany.mockResolvedValue([
      { technologyId: 'tech-1' },
    ]);
    prismaService.formationTechnology.findMany.mockResolvedValue([
      { technologyId: 'tech-3' },
    ]);
    prismaService.technology.findMany.mockResolvedValue([
      {
        id: 'tech-1',
        slug: 'typescript',
        name: 'TypeScript',
        category: TechnologyCategory.LANGUAGE,
        level: TechnologyLevel.ADVANCED,
        frequency: TechnologyUsageFrequency.FREQUENT,
        technologyContexts: [
          { context: TechnologyUsageContext.PERSONAL },
          { context: TechnologyUsageContext.PROFESSIONAL },
        ],
      },
      {
        id: 'tech-3',
        slug: 'nestjs',
        name: 'NestJS',
        category: TechnologyCategory.FRAMEWORK,
        level: TechnologyLevel.INTERMEDIATE,
        frequency: TechnologyUsageFrequency.STUDYING,
        technologyContexts: [{ context: TechnologyUsageContext.STUDY }],
      },
    ]);

    const result = await service.getTechnologyUsage();

    expect(result.totalUsageLinks).toBe(3);
    expect(result.levels).toEqual([
      { key: 'ADVANCED', count: 1 },
      { key: 'INTERMEDIATE', count: 1 },
    ]);
    expect(result.frequencies).toEqual([
      { key: 'FREQUENT', count: 1 },
      { key: 'STUDYING', count: 1 },
    ]);
    expect(result.contexts).toEqual([
      { key: 'PERSONAL', count: 1 },
      { key: 'PROFESSIONAL', count: 1 },
      { key: 'STUDY', count: 1 },
    ]);
    expect(result.sources).toEqual([
      { key: 'experience', count: 1 },
      { key: 'formation', count: 1 },
      { key: 'project', count: 1 },
    ]);
    expect(result.topTechnologies).toEqual([
      {
        technologyId: 'tech-1',
        slug: 'typescript',
        name: 'TypeScript',
        category: TechnologyCategory.LANGUAGE,
        usageCount: 2,
      },
      {
        technologyId: 'tech-3',
        slug: 'nestjs',
        name: 'NestJS',
        category: TechnologyCategory.FRAMEWORK,
        usageCount: 1,
      },
    ]);
  });

  it('sorts top technologies alphabetically when usage counts are tied and handles undefined technology queries', async () => {
    prismaService.projectTechnology.findMany.mockResolvedValue([
      { technologyId: 'tech-2' },
      { technologyId: 'tech-1' },
    ]);
    prismaService.experienceTechnology.findMany.mockResolvedValue([]);
    prismaService.formationTechnology.findMany.mockResolvedValue([]);
    prismaService.technology.findMany
      .mockResolvedValueOnce([
        {
          id: 'tech-2',
          slug: 'zod',
          name: 'Zod',
          category: TechnologyCategory.LIBRARY,
          level: TechnologyLevel.ADVANCED,
          frequency: TechnologyUsageFrequency.FREQUENT,
          technologyContexts: [{ context: TechnologyUsageContext.PERSONAL }],
        },
        {
          id: 'tech-1',
          slug: 'angular',
          name: 'Angular',
          category: TechnologyCategory.FRAMEWORK,
          level: TechnologyLevel.ADVANCED,
          frequency: TechnologyUsageFrequency.FREQUENT,
          technologyContexts: [{ context: TechnologyUsageContext.PERSONAL }],
        },
      ])
      .mockResolvedValueOnce(undefined);

    const tiedResult = await service.getTechnologyUsage();
    const emptyResult = await service.getTechnologyUsage();

    expect(tiedResult.topTechnologies).toEqual([
      {
        technologyId: 'tech-1',
        slug: 'angular',
        name: 'Angular',
        category: TechnologyCategory.FRAMEWORK,
        usageCount: 1,
      },
      {
        technologyId: 'tech-2',
        slug: 'zod',
        name: 'Zod',
        category: TechnologyCategory.LIBRARY,
        usageCount: 1,
      },
    ]);
    expect(emptyResult.totalUsageLinks).toBe(0);
    expect(emptyResult.levels).toEqual([]);
    expect(emptyResult.frequencies).toEqual([]);
    expect(emptyResult.contexts).toEqual([]);
    expect(emptyResult.sources).toEqual([]);
    expect(emptyResult.topTechnologies).toEqual([]);
  });

  it('builds the professional timeline with derived labels and null-safe images', async () => {
    prismaService.experience.findMany.mockResolvedValue([
      {
        id: 'experience-1',
        slug: 'pagbank',
        companyName: 'PagBank',
        titlePt: 'Engenheiro de Software',
        titleEn: 'Software Engineer',
        startDate: new Date('2023-01-01T00:00:00.000Z'),
        endDate: null,
        isCurrent: true,
        highlight: true,
        jobs: [{ job: { namePt: 'Frontend', nameEn: 'Frontend Engineer' } }],
        customers: [{ customer: { name: 'PagBank' } }],
        projects: [
          {
            project: {
              slug: 'portfolio-remake',
              titlePt: 'Remake',
              titleEn: 'Remake',
            },
          },
        ],
        technologies: [
          {
            technology: {
              slug: 'typescript',
              name: 'TypeScript',
            },
          },
        ],
        imageAssets: [
          {
            imageAsset: {
              filePath: '/assets/img/experiences/pagbank.png',
              kind: 'LOGO',
            },
          },
        ],
      },
      {
        id: 'experience-2',
        slug: 'legacy-bank',
        companyName: 'Legacy Bank',
        titlePt: 'Desenvolvedor Frontend',
        titleEn: 'Frontend Developer',
        startDate: new Date('2021-01-01T00:00:00.000Z'),
        endDate: new Date('2022-01-01T00:00:00.000Z'),
        isCurrent: false,
        highlight: false,
        jobs: [],
        customers: [],
        projects: [],
        technologies: [],
        imageAssets: [],
      },
    ]);

    const result = await service.getProfessionalTimeline();

    expect(result.totalItems).toBe(2);
    expect(result.items).toEqual([
      {
        id: 'experience-1',
        slug: 'pagbank',
        companyName: 'PagBank',
        titlePt: 'Engenheiro de Software',
        titleEn: 'Software Engineer',
        startDate: '2023-01-01',
        endDate: null,
        isCurrent: true,
        highlight: true,
        jobs: ['Frontend Engineer'],
        customers: ['PagBank'],
        projects: ['portfolio-remake'],
        technologies: ['TypeScript'],
        imagePath: '/assets/img/experiences/pagbank.png',
      },
      {
        id: 'experience-2',
        slug: 'legacy-bank',
        companyName: 'Legacy Bank',
        titlePt: 'Desenvolvedor Frontend',
        titleEn: 'Frontend Developer',
        startDate: '2021-01-01',
        endDate: '2022-01-01',
        isCurrent: false,
        highlight: false,
        jobs: [],
        customers: [],
        projects: [],
        technologies: [],
        imagePath: null,
      },
    ]);
  });

  it('builds normalized highlight cards across all entities and keeps icon/image paths null-safe', async () => {
    prismaService.project.findMany
      .mockResolvedValueOnce([
        {
          id: 'project-1',
          slug: 'portfolio-remake',
          titlePt: 'Remake do Portfolio',
          titleEn: 'Portfolio Remake',
          shortDescriptionPt: 'Projeto full stack.',
          shortDescriptionEn: 'Full-stack project.',
          featured: true,
          highlight: true,
          imageAssets: [
            {
              imageAsset: {
                filePath: '/assets/img/logo/angular.svg',
                kind: 'LOGO',
              },
            },
            {
              imageAsset: {
                filePath: '/assets/img/projects/portfolio-remake.png',
                kind: 'SCREENSHOT',
              },
            },
          ],
        },
      ])
      .mockResolvedValueOnce([
        {
          id: 'project-2',
          slug: 'dashboard-admin',
          titlePt: 'Dashboard Admin',
          titleEn: 'Dashboard Admin',
          shortDescriptionPt: 'Projeto sem imagem relacionada.',
          shortDescriptionEn: 'Project without related image.',
          featured: false,
          highlight: true,
          imageAssets: [],
        },
      ]);
    prismaService.experience.findMany
      .mockResolvedValueOnce([
        {
          id: 'experience-1',
          slug: 'pagbank',
          companyName: 'PagBank',
          titlePt: 'Engenheiro de Software',
          titleEn: 'Software Engineer',
          summaryPt: 'Experiencia em produtos financeiros.',
          summaryEn: 'Experience in financial products.',
          highlight: true,
          imageAssets: [],
        },
      ])
      .mockResolvedValueOnce([
        {
          id: 'experience-2',
          slug: 'acme',
          companyName: 'Acme',
          titlePt: 'Consultor',
          titleEn: 'Consultant',
          summaryPt: 'Resumo.',
          summaryEn: 'Summary.',
          highlight: true,
          imageAssets: [
            {
              imageAsset: {
                filePath: '/assets/img/experiences/acme.png',
                kind: 'SCREENSHOT',
              },
            },
          ],
        },
      ]);
    prismaService.technology.findMany
      .mockResolvedValueOnce([
        {
          id: 'technology-1',
          slug: 'typescript',
          name: 'TypeScript',
          category: TechnologyCategory.LANGUAGE,
          highlight: true,
          imageAssets: [
            {
              imageAsset: {
                filePath: '/assets/img/skills/typescript.svg',
                kind: 'ICON',
              },
            },
          ],
        },
      ])
      .mockResolvedValueOnce([
        {
          id: 'technology-2',
          slug: 'nestjs',
          name: 'NestJS',
          category: TechnologyCategory.FRAMEWORK,
          highlight: true,
          imageAssets: [
            {
              imageAsset: {
                filePath: '/assets/img/skills/nestjs.svg',
                kind: 'SCREENSHOT',
              },
            },
          ],
        },
      ]);
    prismaService.formation.findMany
      .mockResolvedValueOnce([
        {
          id: 'formation-1',
          slug: 'fatec',
          institution: 'FATEC',
          titlePt: 'ADS',
          titleEn: 'Systems Analysis',
          highlight: true,
          imageAssets: [],
        },
      ])
      .mockResolvedValueOnce([
        {
          id: 'formation-2',
          slug: 'mba-tech',
          institution: 'MBA Tech',
          titlePt: 'MBA',
          titleEn: 'MBA',
          highlight: true,
          imageAssets: [
            {
              imageAsset: {
                filePath: '/assets/img/skills/mba.png',
                kind: 'SCREENSHOT',
              },
            },
          ],
        },
      ]);
    prismaService.customer.findMany
      .mockResolvedValueOnce([
        {
          id: 'customer-1',
          slug: 'pagbank',
          name: 'PagBank',
          summaryPt: 'Cliente.',
          summaryEn: 'Client.',
          highlight: true,
          imageAssets: [],
        },
      ])
      .mockResolvedValueOnce([
        {
          id: 'customer-2',
          slug: 'acme',
          name: 'Acme',
          summaryPt: 'Cliente Acme.',
          summaryEn: 'Acme client.',
          highlight: true,
          imageAssets: [
            {
              imageAsset: {
                filePath: '/assets/img/logo/acme.png',
                kind: 'SCREENSHOT',
              },
            },
          ],
        },
      ]);
    prismaService.job.findMany
      .mockResolvedValueOnce([
        {
          id: 'job-1',
          slug: 'frontend-engineer',
          namePt: 'Engenheiro Frontend',
          nameEn: 'Frontend Engineer',
          summaryPt: 'Cargo.',
          summaryEn: 'Role.',
          highlight: true,
          imageAssets: [],
        },
      ])
      .mockResolvedValueOnce([
        {
          id: 'job-2',
          slug: 'architect',
          namePt: 'Arquiteto',
          nameEn: 'Architect',
          summaryPt: 'Cargo de arquitetura.',
          summaryEn: 'Architecture role.',
          highlight: true,
          imageAssets: [
            {
              imageAsset: {
                filePath: '/assets/img/logo/architect.png',
                kind: 'SCREENSHOT',
              },
            },
          ],
        },
      ]);
    prismaService.spokenLanguage.findMany
      .mockResolvedValueOnce([
        {
          id: 'spoken-language-1',
          code: 'en',
          namePt: 'Ingles',
          nameEn: 'English',
          highlight: true,
          imageAssets: [],
        },
      ])
      .mockResolvedValueOnce([
        {
          id: 'spoken-language-2',
          code: 'es',
          namePt: 'Espanhol',
          nameEn: 'Spanish',
          highlight: true,
          imageAssets: [
            {
              imageAsset: {
                filePath: '/assets/img/skills/spanish.svg',
                kind: 'SCREENSHOT',
              },
            },
          ],
        },
      ]);

    const firstResult = await service.getHighlights();
    const secondResult = await service.getHighlights();

    expect(firstResult.totalItems).toBe(7);
    expect(firstResult.items[0]).toEqual({
      entity: 'project',
      id: 'project-1',
      slug: 'portfolio-remake',
      titlePt: 'Remake do Portfolio',
      titleEn: 'Portfolio Remake',
      subtitlePt: 'Projeto full stack.',
      subtitleEn: 'Full-stack project.',
      icon: '/assets/img/logo/angular.svg',
      imagePath: '/assets/img/projects/portfolio-remake.png',
      featured: true,
    });
    expect(secondResult.items).toEqual([
      {
        entity: 'project',
        id: 'project-2',
        slug: 'dashboard-admin',
        titlePt: 'Dashboard Admin',
        titleEn: 'Dashboard Admin',
        subtitlePt: 'Projeto sem imagem relacionada.',
        subtitleEn: 'Project without related image.',
        icon: null,
        imagePath: null,
        featured: false,
      },
      {
        entity: 'experience',
        id: 'experience-2',
        slug: 'acme',
        titlePt: 'Consultor',
        titleEn: 'Consultant',
        subtitlePt: 'Resumo.',
        subtitleEn: 'Summary.',
        icon: null,
        imagePath: '/assets/img/experiences/acme.png',
      },
      {
        entity: 'technology',
        id: 'technology-2',
        slug: 'nestjs',
        titlePt: 'NestJS',
        titleEn: 'NestJS',
        subtitlePt: 'FRAMEWORK',
        subtitleEn: 'FRAMEWORK',
        icon: null,
        imagePath: '/assets/img/skills/nestjs.svg',
      },
      {
        entity: 'formation',
        id: 'formation-2',
        slug: 'mba-tech',
        titlePt: 'MBA',
        titleEn: 'MBA',
        subtitlePt: 'MBA Tech',
        subtitleEn: 'MBA Tech',
        icon: null,
        imagePath: '/assets/img/skills/mba.png',
      },
      {
        entity: 'customer',
        id: 'customer-2',
        slug: 'acme',
        titlePt: 'Acme',
        titleEn: 'Acme',
        subtitlePt: 'Cliente Acme.',
        subtitleEn: 'Acme client.',
        icon: null,
        imagePath: '/assets/img/logo/acme.png',
      },
      {
        entity: 'job',
        id: 'job-2',
        slug: 'architect',
        titlePt: 'Arquiteto',
        titleEn: 'Architect',
        subtitlePt: 'Cargo de arquitetura.',
        subtitleEn: 'Architecture role.',
        icon: null,
        imagePath: '/assets/img/logo/architect.png',
      },
      {
        entity: 'spokenLanguage',
        id: 'spoken-language-2',
        slug: 'es',
        titlePt: 'Espanhol',
        titleEn: 'Spanish',
        icon: null,
        imagePath: '/assets/img/skills/spanish.svg',
      },
    ]);
  });

  it('builds the aggregated dashboard overview from segmented analytics', async () => {
    prismaService.tag.findMany.mockResolvedValue([]);
    prismaService.project.findMany
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([]);
    prismaService.project.count.mockResolvedValue(0);
    prismaService.projectTechnology.findMany.mockResolvedValue([]);
    prismaService.experienceTechnology.findMany.mockResolvedValue([]);
    prismaService.formationTechnology.findMany.mockResolvedValue([]);
    prismaService.experience.findMany
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([]);
    prismaService.experience.count.mockResolvedValue(0);
    prismaService.technology.findMany.mockResolvedValue([]);
    prismaService.technology.count.mockResolvedValue(0);
    prismaService.formation.findMany.mockResolvedValue([]);
    prismaService.formation.count.mockResolvedValue(0);
    prismaService.customer.findMany.mockResolvedValue([]);
    prismaService.customer.count.mockResolvedValue(0);
    prismaService.job.findMany.mockResolvedValue([]);
    prismaService.job.count.mockResolvedValue(0);
    prismaService.spokenLanguage.findMany.mockResolvedValue([]);
    prismaService.spokenLanguage.count.mockResolvedValue(0);

    const result = await service.getDashboardOverview();

    expect(result.generatedAtUtc).toEqual(expect.any(String));
    expect(result.summary).toEqual({
      projects: 0,
      experiences: 0,
      technologies: 0,
      formations: 0,
      customers: 0,
      jobs: 0,
      spokenLanguages: 0,
    });
    expect(result.stackDistribution.stacks).toEqual([]);
    expect(result.projectContexts.totalProjects).toBe(0);
    expect(result.technologyUsage.totalUsageLinks).toBe(0);
    expect(result.professionalTimeline.items).toEqual([]);
    expect(result.highlights.items).toEqual([]);
  });
});
