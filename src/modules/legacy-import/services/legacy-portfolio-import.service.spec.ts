import {
  DegreeType,
  ProjectContext,
  ProjectEnvironment,
  SpokenLanguageProficiency,
  TagType,
  TechnologyCategory,
  TechnologyLevel,
  TechnologyUsageContext,
  TechnologyUsageFrequency,
} from '@prisma/client';
import { LegacyPortfolioImportService } from './legacy-portfolio-import.service';
import type { LegacyPortfolioImportInput } from '../types/legacy-portfolio-import.types';

describe('LegacyPortfolioImportService', () => {
  let service: LegacyPortfolioImportService;

  beforeEach(() => {
    service = new LegacyPortfolioImportService();
  });

  it('builds normalized seed data from the legacy portfolio payload', () => {
    const result = service.buildSeedData(buildLegacyImportInput());

    expect(result.tags).toEqual([
      {
        slug: 'type-frameworks',
        namePt: 'Frameworks',
        nameEn: 'Frameworks',
        type: TagType.DOMAIN,
      },
      {
        slug: 'stack-front-end',
        namePt: 'Front-End',
        nameEn: 'Front-End',
        type: TagType.STACK,
      },
    ]);

    expect(result.technologies).toEqual([
      {
        slug: 'nestjs',
        name: 'NestJS',
        category: TechnologyCategory.FRAMEWORK,
        icon: '/assets/img/skills/nestjs.png',
        highlight: true,
        sortOrder: 1,
        legacyLevel: TechnologyLevel.ADVANCED,
        legacyFrequency: TechnologyUsageFrequency.FREQUENT,
        legacyContexts: [
          TechnologyUsageContext.PROFESSIONAL,
          TechnologyUsageContext.PERSONAL,
        ],
        stackTagSlug: 'stack-front-end',
        typeTagSlug: 'type-frameworks',
      },
    ]);

    expect(result.spokenLanguages).toEqual([
      {
        code: 'pt-br',
        namePt: 'Português',
        nameEn: 'Portuguese',
        proficiency: SpokenLanguageProficiency.NATIVE,
        icon: '/assets/img/skills/brasil.png',
        highlight: true,
        sortOrder: 1,
      },
    ]);

    expect(result.customers[0]).toEqual({
      slug: 'ford',
      name: 'Ford',
      summaryPt: 'Cliente importado do portfólio legado de Victor Hanszman.',
      summaryEn: "Client imported from Victor Hanszman's legacy portfolio.",
      icon: '/assets/img/experiences/ford.jpg',
      highlight: true,
      sortOrder: 1,
      isPublished: true,
    });

    expect(result.jobs[0]).toEqual({
      slug: 'stefanini',
      namePt: 'Stefanini Group',
      nameEn: 'Stefanini Group',
      summaryPt:
        'Empresa e contexto profissional importados do portfólio legado.',
      summaryEn:
        'Company and professional context imported from the legacy portfolio.',
      icon: '/assets/img/experiences/stefanini.jpg',
      highlight: true,
      sortOrder: 1,
      isPublished: true,
    });

    expect(result.experiences[0]).toEqual({
      slug: 'stefanini-experience',
      companyName: 'Stefanini Group',
      titlePt: 'Experiência em Stefanini Group',
      titleEn: 'Experience at Stefanini Group',
      summaryPt:
        'Stefanini Group com 1 projeto(s) e 1 cliente(s) relacionados.',
      summaryEn: 'Stefanini Group with 1 related project(s) and 1 customer(s).',
      descriptionPt:
        'Stefanini Group com 1 projeto(s) e 1 cliente(s) relacionados. Tecnologias principais: NestJS.',
      descriptionEn:
        'Stefanini Group with 1 related project(s) and 1 customer(s). Main technologies: NestJS.',
      icon: '/assets/img/experiences/stefanini.jpg',
      startDate: '2021-09-23',
      endDate: null,
      isCurrent: true,
      highlight: true,
      sortOrder: 1,
      isPublished: true,
      technologySlugs: ['nestjs'],
      customerSlugs: ['ford'],
      jobSlugs: ['stefanini'],
      projectSlugs: ['github-consumer'],
    });

    expect(result.formations[0]).toEqual({
      slug: 'course-angular-node',
      institution: 'Udemy',
      titlePt: 'Programador FullStack Angular & Node',
      titleEn: 'FullStack Angular & Node Programmer',
      degreeType: DegreeType.COURSE,
      summaryPt: 'Curso em Programador FullStack Angular & Node pela Udemy.',
      summaryEn: 'Course in FullStack Angular & Node Programmer at Udemy.',
      icon: '/assets/img/skills/udemy.png',
      startDate: '2020-03-30',
      endDate: '2020-04-03',
      highlight: true,
      sortOrder: 1,
      isPublished: true,
      technologySlugs: ['nestjs'],
    });

    expect(result.projects[0]).toEqual({
      slug: 'github-consumer',
      titlePt: "Github's API Consumer",
      titleEn: "Github's API Consumer",
      shortDescriptionPt: 'Consumidor do GitHub em PT',
      shortDescriptionEn: 'GitHub consumer in EN',
      fullDescriptionPt: 'Consumidor do GitHub em PT',
      fullDescriptionEn: 'GitHub consumer in EN',
      context: ProjectContext.PERSONAL,
      status: 'IN_PROGRESS',
      environment: ProjectEnvironment.BACKEND,
      repositoryUrl: 'https://github.com/Hanszman/github-consumer-backend',
      deployUrl: 'https://github-consumer-backend.vercel.app/',
      docsUrl: null,
      npmUrl: null,
      icon: '/assets/img/projects/github-consumer.png',
      featured: false,
      highlight: true,
      startDate: '2023-06-14',
      endDate: null,
      sortOrder: 1,
      isPublished: true,
      technologySlugs: ['nestjs', 'node'],
      links: [
        {
          url: 'https://github-consumer-backend.vercel.app/',
          type: 'DEPLOY',
          labelPt: 'Deploy 1',
          labelEn: 'Deploy 1',
          sortOrder: 1,
        },
        {
          url: 'https://github.com/Hanszman/github-consumer-backend',
          type: 'GITHUB',
          labelPt: 'Repositório 1',
          labelEn: 'Repository 1',
          sortOrder: 2,
        },
      ],
    });

    expect(result.portfolioSettings).toEqual([
      {
        key: 'branding',
        value: {
          primaryLogoPath: '/assets/img/logo/vh_logo_blue.svg',
          lightLogoPath: '/assets/img/logo/vh_logo_white.svg',
          faviconPath: '/assets/img/logo/vh_logo_blue.ico',
        },
        description:
          'Legacy branding assets imported from the previous portfolio.',
      },
      {
        key: 'profile',
        value: {
          introPt: 'Intro em PT',
          introEn: 'Intro in EN',
          profileImagePath: '/assets/img/profile/vh_profile.jpeg',
        },
        description:
          'Legacy profile copy and media imported from the previous portfolio.',
      },
      {
        key: 'legacy-options',
        value: {
          level: [{ code: 'Advanced', name: 'Advanced', type: 'skills' }],
          type: [{ code: 'Frameworks', name: 'Frameworks' }],
          stack: [{ code: 'FrontEnd', name: 'FrontEnd' }],
          environment: [{ code: 'personal', name: 'personal' }],
        },
        description:
          'Legacy filter options imported from the previous portfolio dataset.',
      },
    ]);
  });

  it('falls back to default asset base path and omits inferred project icons when the file is missing', () => {
    const input = buildLegacyImportInput({
      assetBaseUrl: '',
      availableAssetPaths: [],
      projects: [
        {
          code: 'portfolio',
          name: 'Portfolio',
          environment: 'unknown',
          reference: '',
          description: 'UnknownDescription',
          imgIcon: '',
          prodLinks: [],
          gitLinks: [],
          startDate: '',
          endDate: '',
          customers: [],
          technologies: ['html'],
        },
      ],
    });

    const result = service.buildSeedData(input);

    expect(result.projects[0]?.icon).toBeNull();
    expect(result.projects[0]?.context).toBe(ProjectContext.STUDY);
    expect(result.projects[0]?.environment).toBe(ProjectEnvironment.FRONTEND);
    expect(result.projects[0]?.shortDescriptionPt).toBe('UnknownDescription');
    expect(result.projects[0]?.startDate).toBeNull();
  });

  it('keeps explicit project icons and returns null for empty legacy asset paths', () => {
    const input = buildLegacyImportInput({
      assetBaseUrl: '/assets/img',
      projects: [
        {
          code: 'portfolio',
          name: 'Portfolio',
          environment: 'personal',
          reference: '',
          description: 'Portfolio',
          imgIcon: 'projects/custom-icon.png',
          prodLinks: [],
          gitLinks: [],
          startDate: '2023-01-01',
          endDate: '2023-02-01',
          customers: [],
          technologies: ['nestjs'],
        },
      ],
      spokenLanguages: [
        {
          code: 'en-us',
          name: 'English',
          level: 'Fluent',
          imgIcon: 'skills/usa.png',
        },
      ],
      technologies: [
        {
          code: 'nestjs',
          name: 'NestJS',
          level: 'Advanced',
          imgIcon: '',
          type: 'Frameworks',
          stack: 'FrontEnd',
          intervalExperiencie: [],
        },
      ],
    });

    const result = service.buildSeedData(input);

    expect(result.projects[0]?.icon).toBe(
      '/assets/img/projects/custom-icon.png',
    );
    expect(result.projects[0]?.status).toBe('COMPLETED');
    expect(result.technologies[0]?.icon).toBeNull();
    expect(result.spokenLanguages[0]?.highlight).toBe(true);
  });

  it.each([
    ['professional', ProjectContext.PROFESSIONAL],
    ['personal', ProjectContext.PERSONAL],
    ['formation', ProjectContext.ACADEMIC],
    ['other', ProjectContext.STUDY],
  ])('maps project context %s to %s', (input, expected) => {
    expect(service.mapProjectContext(input)).toBe(expected);
  });

  it.each([
    [['reactnative'], ProjectEnvironment.MOBILE],
    [['node', 'postgresql'], ProjectEnvironment.BACKEND],
    [['angular', 'node'], ProjectEnvironment.FULLSTACK],
    [['html', 'css'], ProjectEnvironment.FRONTEND],
  ])(
    'maps technologies %j to project environment %s',
    (technologies, expected) => {
      expect(service.mapProjectEnvironment(technologies)).toBe(expected);
    },
  );

  it.each([
    ['ProgrammingLanguages', TechnologyCategory.LANGUAGE],
    ['Frameworks', TechnologyCategory.FRAMEWORK],
    ['Libraries', TechnologyCategory.LIBRARY],
    ['Relationals', TechnologyCategory.DATABASE],
    ['CloudHostingPlataforms', TechnologyCategory.CLOUD],
    ['DeploymentTools', TechnologyCategory.DEVOPS],
    ['Packages', TechnologyCategory.TOOL],
    ['PackageManagers', TechnologyCategory.TOOL],
    ['CodeEditors', TechnologyCategory.TOOL],
    ['DevelopmentPlataforms', TechnologyCategory.TOOL],
    ['Techniques', TechnologyCategory.OTHER],
    ['Unknown', TechnologyCategory.OTHER],
  ])('maps technology type %s to %s', (input, expected) => {
    expect(service.mapTechnologyCategory(input)).toBe(expected);
  });

  it.each([
    ['Advanced', TechnologyLevel.ADVANCED],
    ['Intermediate', TechnologyLevel.INTERMEDIATE],
    ['Beginner', TechnologyLevel.BASIC],
    ['Studing', null],
  ])('maps technology level %s to %s', (input, expected) => {
    expect(service.mapTechnologyLevel(input)).toBe(expected);
  });

  it.each([
    ['Advanced', TechnologyUsageFrequency.FREQUENT],
    ['Intermediate', TechnologyUsageFrequency.OCCASIONAL],
    ['Studing', TechnologyUsageFrequency.STUDYING],
    ['Beginner', TechnologyUsageFrequency.PREVIOUSLY_USED],
  ])('maps technology frequency %s to %s', (input, expected) => {
    expect(service.mapTechnologyFrequency(input)).toBe(expected);
  });

  it('maps unique technology usage contexts', () => {
    expect(
      service.mapTechnologyUsageContexts([
        { startDate: '2020-01-01', endDate: '', environment: 'professional' },
        { startDate: '2021-01-01', endDate: '', environment: 'personal' },
        { startDate: '2021-06-01', endDate: '', environment: 'formation' },
        { startDate: '2022-01-01', endDate: '', environment: 'professional' },
        { startDate: '2023-01-01', endDate: '', environment: 'unknown' },
      ]),
    ).toEqual([
      TechnologyUsageContext.PROFESSIONAL,
      TechnologyUsageContext.PERSONAL,
      TechnologyUsageContext.ACADEMIC,
      TechnologyUsageContext.STUDY,
    ]);
  });

  it.each([
    ['Native', SpokenLanguageProficiency.NATIVE],
    ['Fluent', SpokenLanguageProficiency.FLUENT],
    ['Advanced', SpokenLanguageProficiency.ADVANCED],
    ['Intermediate', SpokenLanguageProficiency.INTERMEDIATE],
    ['Beginner', SpokenLanguageProficiency.BASIC],
  ])('maps spoken language proficiency %s to %s', (input, expected) => {
    expect(service.mapSpokenLanguageProficiency(input)).toBe(expected);
  });

  it.each([
    ['Graduation', 'Bachelor', DegreeType.BACHELOR],
    ['PostGraduation', 'Especialist', DegreeType.POSTGRADUATE],
    ['Course', 'Certified', DegreeType.COURSE],
    ['Other', 'Unknown', DegreeType.OTHER],
  ])('maps degree type %s / %s to %s', (title, level, expected) => {
    expect(service.mapDegreeType(title, level)).toBe(expected);
  });
});

function buildLegacyImportInput(
  overrides: Partial<LegacyPortfolioImportInput> = {},
): LegacyPortfolioImportInput {
  return {
    assetBaseUrl: '/assets/img/',
    availableAssetPaths: ['projects/github-consumer.png'],
    options: {
      level: [{ code: 'Advanced', name: 'Advanced', type: 'skills' }],
      type: [{ code: 'Frameworks', name: 'Frameworks' }],
      stack: [{ code: 'FrontEnd', name: 'FrontEnd' }],
      environment: [{ code: 'personal', name: 'personal' }],
    },
    projects: [
      {
        code: 'github-consumer',
        name: "Github's API Consumer",
        environment: 'personal',
        reference: '',
        description: 'GithubsConsumer',
        imgIcon: '',
        prodLinks: ['https://github-consumer-backend.vercel.app/'],
        gitLinks: ['https://github.com/Hanszman/github-consumer-backend'],
        startDate: '2023-06-14',
        endDate: '',
        customers: [],
        technologies: ['nestjs', 'node'],
      },
    ],
    jobs: [
      {
        code: 'stefanini',
        name: 'Stefanini Group',
        imgIcon: 'experiences/stefanini.jpg',
        startDate: '2021-09-23',
        endDate: '',
        technologies: ['nestjs'],
        customers: ['ford'],
        projects: ['github-consumer'],
      },
    ],
    customers: [
      {
        code: 'ford',
        name: 'Ford',
        imgIcon: 'experiences/ford.jpg',
      },
    ],
    technologies: [
      {
        code: 'nestjs',
        name: 'NestJS',
        level: 'Advanced',
        imgIcon: 'skills/nestjs.png',
        type: 'Frameworks',
        stack: 'FrontEnd',
        intervalExperiencie: [
          {
            startDate: '2024-01-01',
            endDate: '',
            environment: 'professional',
          },
          {
            startDate: '2025-01-01',
            endDate: '',
            environment: 'personal',
          },
        ],
      },
    ],
    spokenLanguages: [
      {
        code: 'pt-br',
        name: 'Portuguese',
        level: 'Native',
        imgIcon: 'skills/brasil.png',
      },
    ],
    formations: [
      {
        code: 'course-angular-node',
        name: 'FullStackAngularNodeProgrammer',
        title: 'Course',
        level: 'Certified',
        institution: 'Udemy',
        imgIcon: 'skills/udemy.png',
        certificate: '',
        startDate: '2020-03-30',
        endDate: '2020-04-03',
        technologies: ['nestjs'],
        projects: ['github-consumer'],
      },
    ],
    translations: {
      en: {
        Frameworks: 'Frameworks',
        FrontEnd: 'Front-End',
        Portuguese: 'Portuguese',
        FullStackAngularNodeProgrammer: 'FullStack Angular & Node Programmer',
        Course: 'Course',
        GithubsConsumer: 'GitHub consumer in EN',
        IntroText: 'Intro in EN',
        nestjs: 'NestJS',
      },
      pt: {
        Frameworks: 'Frameworks',
        FrontEnd: 'Front-End',
        Portuguese: 'Português',
        FullStackAngularNodeProgrammer: 'Programador FullStack Angular & Node',
        Course: 'Curso',
        GithubsConsumer: 'Consumidor do GitHub em PT',
        IntroText: 'Intro em PT',
        nestjs: 'NestJS',
      },
    },
    ...overrides,
  };
}
