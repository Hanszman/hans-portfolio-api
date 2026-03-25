import {
  DegreeType,
  LinkType,
  ProjectContext,
  ProjectEnvironment,
  ProjectStatus,
  SpokenLanguageProficiency,
  TagType,
  TechnologyCategory,
  TechnologyLevel,
  TechnologyUsageContext,
  TechnologyUsageFrequency,
} from '@prisma/client';
import type {
  LegacyCustomerSeedRecord,
  LegacyExperienceSeedRecord,
  LegacyFormationSeedRecord,
  LegacyPortfolioImportInput,
  LegacyPortfolioImportResult,
  LegacyPortfolioSettingSeedRecord,
  LegacyProjectLinkSeedRecord,
  LegacyProjectSeedRecord,
  LegacySpokenLanguageSeedRecord,
  LegacyTagSeedRecord,
  LegacyTechnologySeedRecord,
  LegacyTranslationMap,
} from '../types/legacy-portfolio-import.types';

const DEFAULT_ASSET_BASE_URL = '/assets/img';

export class LegacyPortfolioImportService {
  buildSeedData(
    input: LegacyPortfolioImportInput,
  ): LegacyPortfolioImportResult {
    const assetBaseUrl = this.normalizeAssetBaseUrl(input.assetBaseUrl);
    const typeTags = input.options.type.map((option) =>
      this.buildTagSeedRecord({
        slug: `type-${this.toSlug(option.code)}`,
        key: option.code,
        fallbackName: option.name,
        type: TagType.DOMAIN,
        translations: input.translations,
      }),
    );
    const stackTags = input.options.stack.map((option) =>
      this.buildTagSeedRecord({
        slug: `stack-${this.toSlug(option.code)}`,
        key: option.code,
        fallbackName: option.name,
        type: TagType.STACK,
        translations: input.translations,
      }),
    );

    const technologies = input.technologies.map((technology, index) =>
      this.buildTechnologySeedRecord(technology, index, assetBaseUrl),
    );

    const spokenLanguages = input.spokenLanguages.map((language, index) =>
      this.buildSpokenLanguageSeedRecord(
        language,
        index,
        assetBaseUrl,
        input.translations,
      ),
    );

    const customers = input.customers.map((customer, index) =>
      this.buildCustomerSeedRecord(customer, index, assetBaseUrl),
    );

    const jobs = input.jobs.map((job, index) =>
      this.buildJobSeedRecord(job, index, assetBaseUrl),
    );

    const experiences = input.jobs.map((job, index) =>
      this.buildExperienceSeedRecord(
        job,
        index,
        assetBaseUrl,
        input.translations,
      ),
    );

    const formations = input.formations.map((formation, index) =>
      this.buildFormationSeedRecord(
        formation,
        index,
        assetBaseUrl,
        input.translations,
      ),
    );

    const projects = input.projects.map((project, index) =>
      this.buildProjectSeedRecord(
        project,
        index,
        assetBaseUrl,
        input.availableAssetPaths,
        input.translations,
      ),
    );

    const portfolioSettings = this.buildPortfolioSettingSeedRecords(
      input,
      assetBaseUrl,
    );

    return {
      tags: [...typeTags, ...stackTags],
      technologies,
      spokenLanguages,
      formations,
      customers,
      jobs,
      experiences,
      projects,
      portfolioSettings,
    };
  }

  private buildTagSeedRecord(input: {
    slug: string;
    key: string;
    fallbackName: string;
    type: TagType;
    translations: LegacyPortfolioImportInput['translations'];
  }): LegacyTagSeedRecord {
    return {
      slug: input.slug,
      namePt: this.translate(
        input.key,
        input.translations.pt,
        input.fallbackName,
      ),
      nameEn: this.translate(
        input.key,
        input.translations.en,
        input.fallbackName,
      ),
      type: input.type,
    };
  }

  private buildTechnologySeedRecord(
    technology: LegacyPortfolioImportInput['technologies'][number],
    index: number,
    assetBaseUrl: string,
  ): LegacyTechnologySeedRecord {
    return {
      slug: technology.code,
      name: technology.name,
      category: this.mapTechnologyCategory(technology.type),
      icon: this.toAssetPath(assetBaseUrl, technology.imgIcon),
      highlight: technology.level === 'Advanced',
      sortOrder: index + 1,
      legacyLevel: this.mapTechnologyLevel(technology.level),
      legacyFrequency: this.mapTechnologyFrequency(technology.level),
      legacyContexts: this.mapTechnologyUsageContexts(
        technology.intervalExperiencie,
      ),
      stackTagSlug: `stack-${this.toSlug(technology.stack)}`,
      typeTagSlug: `type-${this.toSlug(technology.type)}`,
    };
  }

  private buildSpokenLanguageSeedRecord(
    language: LegacyPortfolioImportInput['spokenLanguages'][number],
    index: number,
    assetBaseUrl: string,
    translations: LegacyPortfolioImportInput['translations'],
  ): LegacySpokenLanguageSeedRecord {
    return {
      code: language.code,
      namePt: this.translate(language.name, translations.pt, language.name),
      nameEn: this.translate(language.name, translations.en, language.name),
      proficiency: this.mapSpokenLanguageProficiency(language.level),
      icon: this.toAssetPath(assetBaseUrl, language.imgIcon),
      highlight: language.level === 'Native' || language.level === 'Fluent',
      sortOrder: index + 1,
    };
  }

  private buildCustomerSeedRecord(
    customer: LegacyPortfolioImportInput['customers'][number],
    index: number,
    assetBaseUrl: string,
  ): LegacyCustomerSeedRecord {
    return {
      slug: customer.code,
      name: customer.name,
      summaryPt: `Cliente importado do portfólio legado de Victor Hanszman.`,
      summaryEn: `Client imported from Victor Hanszman's legacy portfolio.`,
      icon: this.toAssetPath(assetBaseUrl, customer.imgIcon),
      highlight: index < 4,
      sortOrder: index + 1,
      isPublished: true,
    };
  }

  private buildJobSeedRecord(
    job: LegacyPortfolioImportInput['jobs'][number],
    index: number,
    assetBaseUrl: string,
  ) {
    return {
      slug: job.code,
      namePt: job.name,
      nameEn: job.name,
      summaryPt: `Empresa e contexto profissional importados do portfólio legado.`,
      summaryEn: `Company and professional context imported from the legacy portfolio.`,
      icon: this.toAssetPath(assetBaseUrl, job.imgIcon),
      highlight: index < 3,
      sortOrder: index + 1,
      isPublished: true,
    };
  }

  private buildExperienceSeedRecord(
    job: LegacyPortfolioImportInput['jobs'][number],
    index: number,
    assetBaseUrl: string,
    translations: LegacyPortfolioImportInput['translations'],
  ): LegacyExperienceSeedRecord {
    const projectCount = job.projects.length;
    const customerCount = job.customers.length;
    const titlePt = `Experiência em ${job.name}`;
    const titleEn = `Experience at ${job.name}`;
    const summaryPt = `${job.name} com ${projectCount} projeto(s) e ${customerCount} cliente(s) relacionados.`;
    const summaryEn = `${job.name} with ${projectCount} related project(s) and ${customerCount} customer(s).`;
    const descriptionPt = `${summaryPt} Tecnologias principais: ${this.joinLabels(job.technologies, translations.pt)}.`;
    const descriptionEn = `${summaryEn} Main technologies: ${this.joinLabels(job.technologies, translations.en)}.`;

    return {
      slug: `${job.code}-experience`,
      companyName: job.name,
      titlePt,
      titleEn,
      summaryPt,
      summaryEn,
      descriptionPt,
      descriptionEn,
      icon: this.toAssetPath(assetBaseUrl, job.imgIcon),
      startDate: job.startDate,
      endDate: this.normalizeDate(job.endDate),
      isCurrent: job.endDate.trim() === '',
      highlight: index === 0,
      sortOrder: index + 1,
      isPublished: true,
      technologySlugs: job.technologies,
      customerSlugs: job.customers,
      jobSlugs: [job.code],
      projectSlugs: job.projects,
    };
  }

  private buildFormationSeedRecord(
    formation: LegacyPortfolioImportInput['formations'][number],
    index: number,
    assetBaseUrl: string,
    translations: LegacyPortfolioImportInput['translations'],
  ): LegacyFormationSeedRecord {
    const translatedTitlePt = this.translate(
      formation.name,
      translations.pt,
      formation.name,
    );
    const translatedTitleEn = this.translate(
      formation.name,
      translations.en,
      formation.name,
    );
    const degreeTitlePt = this.translate(
      formation.title,
      translations.pt,
      formation.title,
    );
    const degreeTitleEn = this.translate(
      formation.title,
      translations.en,
      formation.title,
    );

    return {
      slug: formation.code,
      institution: formation.institution,
      titlePt: translatedTitlePt,
      titleEn: translatedTitleEn,
      degreeType: this.mapDegreeType(formation.title, formation.level),
      summaryPt: `${degreeTitlePt} em ${translatedTitlePt} pela ${formation.institution}.`,
      summaryEn: `${degreeTitleEn} in ${translatedTitleEn} at ${formation.institution}.`,
      icon: this.toAssetPath(assetBaseUrl, formation.imgIcon),
      startDate: formation.startDate,
      endDate: this.normalizeDate(formation.endDate),
      highlight: index < 2,
      sortOrder: index + 1,
      isPublished: true,
      technologySlugs: formation.technologies,
    };
  }

  private buildProjectSeedRecord(
    project: LegacyPortfolioImportInput['projects'][number],
    index: number,
    assetBaseUrl: string,
    availableAssetPaths: string[],
    translations: LegacyPortfolioImportInput['translations'],
  ): LegacyProjectSeedRecord {
    const descriptionPt = this.translate(
      project.description,
      translations.pt,
      project.description,
    );
    const descriptionEn = this.translate(
      project.description,
      translations.en,
      project.description,
    );
    const icon = this.resolveProjectIcon(
      project.code,
      project.imgIcon,
      assetBaseUrl,
      availableAssetPaths,
    );
    const links = this.buildProjectLinkSeedRecords(project);

    return {
      slug: project.code,
      titlePt: project.name,
      titleEn: project.name,
      shortDescriptionPt: descriptionPt,
      shortDescriptionEn: descriptionEn,
      fullDescriptionPt: descriptionPt,
      fullDescriptionEn: descriptionEn,
      context: this.mapProjectContext(project.environment),
      status:
        project.endDate.trim() === ''
          ? ProjectStatus.IN_PROGRESS
          : ProjectStatus.COMPLETED,
      environment: this.mapProjectEnvironment(project.technologies),
      repositoryUrl: project.gitLinks[0] ?? null,
      deployUrl: project.prodLinks[0] ?? null,
      docsUrl: null,
      npmUrl: null,
      icon,
      featured: project.environment === 'professional',
      highlight: index < 6,
      startDate: this.normalizeDate(project.startDate),
      endDate: this.normalizeDate(project.endDate),
      sortOrder: index + 1,
      isPublished: true,
      technologySlugs: project.technologies,
      links,
    };
  }

  private buildProjectLinkSeedRecords(
    project: LegacyPortfolioImportInput['projects'][number],
  ): LegacyProjectLinkSeedRecord[] {
    const deployLinks = project.prodLinks.map((url, index) => ({
      url,
      type: LinkType.DEPLOY,
      labelPt: `Deploy ${index + 1}`,
      labelEn: `Deploy ${index + 1}`,
      sortOrder: index + 1,
    }));
    const gitLinks = project.gitLinks.map((url, index) => ({
      url,
      type: LinkType.GITHUB,
      labelPt: `Repositório ${index + 1}`,
      labelEn: `Repository ${index + 1}`,
      sortOrder: deployLinks.length + index + 1,
    }));

    return [...deployLinks, ...gitLinks];
  }

  private buildPortfolioSettingSeedRecords(
    input: LegacyPortfolioImportInput,
    assetBaseUrl: string,
  ): LegacyPortfolioSettingSeedRecord[] {
    return [
      {
        key: 'branding',
        value: {
          primaryLogoPath: this.toAssetPath(
            assetBaseUrl,
            'logo/vh_logo_blue.svg',
          ),
          lightLogoPath: this.toAssetPath(
            assetBaseUrl,
            'logo/vh_logo_white.svg',
          ),
          faviconPath: this.toAssetPath(assetBaseUrl, 'logo/vh_logo_blue.ico'),
        },
        description:
          'Legacy branding assets imported from the previous portfolio.',
      },
      {
        key: 'profile',
        value: {
          introPt: this.translate(
            'IntroText',
            input.translations.pt,
            'Portfólio profissional importado do projeto anterior.',
          ),
          introEn: this.translate(
            'IntroText',
            input.translations.en,
            'Professional portfolio imported from the previous project.',
          ),
          profileImagePath: this.toAssetPath(
            assetBaseUrl,
            'profile/vh_profile.jpeg',
          ),
        },
        description:
          'Legacy profile copy and media imported from the previous portfolio.',
      },
      {
        key: 'legacy-options',
        value: {
          level: input.options.level,
          type: input.options.type,
          stack: input.options.stack,
          environment: input.options.environment,
        },
        description:
          'Legacy filter options imported from the previous portfolio dataset.',
      },
    ];
  }

  mapProjectContext(environment: string): ProjectContext {
    switch (environment) {
      case 'professional':
        return ProjectContext.PROFESSIONAL;
      case 'personal':
        return ProjectContext.PERSONAL;
      case 'formation':
        return ProjectContext.ACADEMIC;
      default:
        return ProjectContext.STUDY;
    }
  }

  mapProjectEnvironment(technologies: string[]): ProjectEnvironment {
    const loweredTechnologies = technologies.map((technology) =>
      technology.toLowerCase(),
    );
    const hasFrontend = loweredTechnologies.some((technology) =>
      [
        'angular',
        'react',
        'html',
        'css',
        'sass',
        'bootstrap',
        'jsx',
        'reactnative',
      ].includes(technology),
    );
    const hasBackend = loweredTechnologies.some((technology) =>
      [
        'node',
        'express',
        'laravel',
        'php',
        'java',
        'mysql',
        'postgresql',
        'sqlserver',
        'mongodb',
        'knex',
      ].includes(technology),
    );

    if (
      loweredTechnologies.includes('reactnative') ||
      loweredTechnologies.includes('expo')
    ) {
      return ProjectEnvironment.MOBILE;
    }

    if (hasFrontend && hasBackend) {
      return ProjectEnvironment.FULLSTACK;
    }

    if (hasBackend) {
      return ProjectEnvironment.BACKEND;
    }

    return ProjectEnvironment.FRONTEND;
  }

  mapTechnologyCategory(type: string): TechnologyCategory {
    switch (type) {
      case 'ProgrammingLanguages':
      case 'WebLanguages':
        return TechnologyCategory.LANGUAGE;
      case 'Frameworks':
        return TechnologyCategory.FRAMEWORK;
      case 'Libraries':
        return TechnologyCategory.LIBRARY;
      case 'Relationals':
      case 'NonRelationals':
      case 'DatabasesManagementSystems':
        return TechnologyCategory.DATABASE;
      case 'CloudHostingPlataforms':
        return TechnologyCategory.CLOUD;
      case 'DeploymentTools':
      case 'VersioningPlatforms':
        return TechnologyCategory.DEVOPS;
      case 'Packages':
      case 'PackageManagers':
      case 'CodeEditors':
      case 'DevelopmentPlataforms':
        return TechnologyCategory.TOOL;
      case 'Techniques':
      case 'Methodologies':
      case 'Protocols':
      case 'ObjectNotations':
        return TechnologyCategory.OTHER;
      default:
        return TechnologyCategory.OTHER;
    }
  }

  mapTechnologyLevel(level: string): TechnologyLevel | null {
    switch (level) {
      case 'Advanced':
        return TechnologyLevel.ADVANCED;
      case 'Intermediate':
        return TechnologyLevel.INTERMEDIATE;
      case 'Beginner':
        return TechnologyLevel.BASIC;
      default:
        return null;
    }
  }

  mapTechnologyFrequency(level: string): TechnologyUsageFrequency {
    switch (level) {
      case 'Advanced':
        return TechnologyUsageFrequency.FREQUENT;
      case 'Intermediate':
        return TechnologyUsageFrequency.OCCASIONAL;
      case 'Studing':
        return TechnologyUsageFrequency.STUDYING;
      default:
        return TechnologyUsageFrequency.PREVIOUSLY_USED;
    }
  }

  mapTechnologyUsageContexts(
    intervals: LegacyPortfolioImportInput['technologies'][number]['intervalExperiencie'],
  ): TechnologyUsageContext[] {
    return [
      ...new Set(
        intervals.map((interval) =>
          this.mapTechnologyUsageContext(interval.environment),
        ),
      ),
    ];
  }

  mapTechnologyUsageContext(environment: string): TechnologyUsageContext {
    switch (environment) {
      case 'professional':
        return TechnologyUsageContext.PROFESSIONAL;
      case 'personal':
        return TechnologyUsageContext.PERSONAL;
      case 'formation':
        return TechnologyUsageContext.ACADEMIC;
      default:
        return TechnologyUsageContext.STUDY;
    }
  }

  mapSpokenLanguageProficiency(level: string): SpokenLanguageProficiency {
    switch (level) {
      case 'Native':
        return SpokenLanguageProficiency.NATIVE;
      case 'Fluent':
        return SpokenLanguageProficiency.FLUENT;
      case 'Advanced':
        return SpokenLanguageProficiency.ADVANCED;
      case 'Intermediate':
        return SpokenLanguageProficiency.INTERMEDIATE;
      default:
        return SpokenLanguageProficiency.BASIC;
    }
  }

  mapDegreeType(title: string, level: string): DegreeType {
    if (title === 'Graduation' || level === 'Bachelor') {
      return DegreeType.BACHELOR;
    }

    if (title === 'PostGraduation' || level === 'Especialist') {
      return DegreeType.POSTGRADUATE;
    }

    if (title === 'Course' || level === 'Certified') {
      return DegreeType.COURSE;
    }

    return DegreeType.OTHER;
  }

  private resolveProjectIcon(
    projectCode: string,
    explicitIcon: string,
    assetBaseUrl: string,
    availableAssetPaths: string[],
  ): string | null {
    if (explicitIcon.trim() !== '') {
      return this.toAssetPath(assetBaseUrl, explicitIcon);
    }

    const inferredRelativePath = `projects/${projectCode}.png`;

    if (!availableAssetPaths.includes(inferredRelativePath)) {
      return null;
    }

    return this.toAssetPath(assetBaseUrl, inferredRelativePath);
  }

  private normalizeAssetBaseUrl(assetBaseUrl: string): string {
    const normalized = assetBaseUrl.trim();

    if (normalized === '') {
      return DEFAULT_ASSET_BASE_URL;
    }

    return normalized.endsWith('/') ? normalized.slice(0, -1) : normalized;
  }

  private normalizeDate(value: string): string | null {
    const normalizedValue = value.trim();
    return normalizedValue === '' ? null : normalizedValue;
  }

  private translate(
    key: string,
    dictionary: LegacyTranslationMap,
    fallback: string,
  ): string {
    return dictionary[key] ?? fallback;
  }

  private toSlug(value: string): string {
    return value
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .toLowerCase();
  }

  private toAssetPath(
    assetBaseUrl: string,
    relativePath: string,
  ): string | null {
    const normalizedPath = relativePath.trim();

    if (normalizedPath === '') {
      return null;
    }

    return `${assetBaseUrl}/${normalizedPath}`.replace(/\/{2,}/g, '/');
  }

  private joinLabels(
    codes: string[],
    dictionary: LegacyTranslationMap,
  ): string {
    return codes
      .map((code) => this.translate(code, dictionary, code))
      .join(', ');
  }
}
