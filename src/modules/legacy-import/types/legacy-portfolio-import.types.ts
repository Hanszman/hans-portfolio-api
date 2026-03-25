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

export interface LegacyProjectRecord {
  code: string;
  name: string;
  environment: string;
  reference: string;
  description: string;
  imgIcon: string;
  prodLinks: string[];
  gitLinks: string[];
  startDate: string;
  endDate: string;
  customers: string[];
  technologies: string[];
}

export interface LegacyJobRecord {
  code: string;
  name: string;
  imgIcon: string;
  startDate: string;
  endDate: string;
  technologies: string[];
  customers: string[];
  projects: string[];
}

export interface LegacyCustomerRecord {
  code: string;
  name: string;
  imgIcon: string;
}

export interface LegacyTechnologyIntervalRecord {
  startDate: string;
  endDate: string;
  environment: string;
}

export interface LegacyTechnologyRecord {
  code: string;
  name: string;
  level: string;
  imgIcon: string;
  type: string;
  stack: string;
  intervalExperiencie: LegacyTechnologyIntervalRecord[];
}

export interface LegacyLanguageRecord {
  code: string;
  name: string;
  level: string;
  imgIcon: string;
}

export interface LegacyFormationRecord {
  code: string;
  name: string;
  title: string;
  level: string;
  institution: string;
  imgIcon: string;
  certificate: string;
  startDate: string;
  endDate: string;
  technologies: string[];
  projects: string[];
}

export interface LegacyOptionsRecord {
  level: Array<{ code: string; name: string; type?: string }>;
  type: Array<{ code: string; name: string }>;
  stack: Array<{ code: string; name: string }>;
  environment: Array<{ code: string; name: string }>;
}

export interface LegacyTranslationMap {
  [key: string]: string;
}

export interface LegacyPortfolioImportInput {
  assetBaseUrl: string;
  availableAssetPaths: string[];
  options: LegacyOptionsRecord;
  projects: LegacyProjectRecord[];
  jobs: LegacyJobRecord[];
  customers: LegacyCustomerRecord[];
  technologies: LegacyTechnologyRecord[];
  spokenLanguages: LegacyLanguageRecord[];
  formations: LegacyFormationRecord[];
  translations: {
    en: LegacyTranslationMap;
    pt: LegacyTranslationMap;
  };
}

export interface LegacyTagSeedRecord {
  slug: string;
  namePt: string;
  nameEn: string;
  type: TagType;
}

export interface LegacyTechnologySeedRecord {
  slug: string;
  name: string;
  category: TechnologyCategory;
  icon: string | null;
  highlight: boolean;
  sortOrder: number;
  legacyLevel: TechnologyLevel | null;
  legacyFrequency: TechnologyUsageFrequency;
  legacyContexts: TechnologyUsageContext[];
  stackTagSlug: string;
  typeTagSlug: string;
}

export interface LegacyProjectLinkSeedRecord {
  url: string;
  type: LinkType;
  labelPt: string;
  labelEn: string;
  sortOrder: number;
}

export interface LegacyProjectSeedRecord {
  slug: string;
  titlePt: string;
  titleEn: string;
  shortDescriptionPt: string;
  shortDescriptionEn: string;
  fullDescriptionPt: string;
  fullDescriptionEn: string;
  context: ProjectContext;
  status: ProjectStatus;
  environment: ProjectEnvironment;
  repositoryUrl: string | null;
  deployUrl: string | null;
  docsUrl: string | null;
  npmUrl: string | null;
  icon: string | null;
  featured: boolean;
  highlight: boolean;
  startDate: string | null;
  endDate: string | null;
  sortOrder: number;
  isPublished: boolean;
  technologySlugs: string[];
  links: LegacyProjectLinkSeedRecord[];
}

export interface LegacyCustomerSeedRecord {
  slug: string;
  name: string;
  summaryPt: string;
  summaryEn: string;
  icon: string | null;
  highlight: boolean;
  sortOrder: number;
  isPublished: boolean;
}

export interface LegacyJobSeedRecord {
  slug: string;
  namePt: string;
  nameEn: string;
  summaryPt: string;
  summaryEn: string;
  icon: string | null;
  highlight: boolean;
  sortOrder: number;
  isPublished: boolean;
}

export interface LegacyExperienceSeedRecord {
  slug: string;
  companyName: string;
  titlePt: string;
  titleEn: string;
  summaryPt: string;
  summaryEn: string;
  descriptionPt: string;
  descriptionEn: string;
  icon: string | null;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  highlight: boolean;
  sortOrder: number;
  isPublished: boolean;
  technologySlugs: string[];
  customerSlugs: string[];
  jobSlugs: string[];
  projectSlugs: string[];
}

export interface LegacyFormationSeedRecord {
  slug: string;
  institution: string;
  titlePt: string;
  titleEn: string;
  degreeType: DegreeType;
  summaryPt: string;
  summaryEn: string;
  icon: string | null;
  startDate: string;
  endDate: string | null;
  highlight: boolean;
  sortOrder: number;
  isPublished: boolean;
  technologySlugs: string[];
}

export interface LegacySpokenLanguageSeedRecord {
  code: string;
  namePt: string;
  nameEn: string;
  proficiency: SpokenLanguageProficiency;
  icon: string | null;
  highlight: boolean;
  sortOrder: number;
}

export interface LegacyPortfolioSettingSeedRecord {
  key: string;
  value: Record<string, unknown>;
  description: string;
}

export interface LegacyPortfolioImportResult {
  tags: LegacyTagSeedRecord[];
  technologies: LegacyTechnologySeedRecord[];
  spokenLanguages: LegacySpokenLanguageSeedRecord[];
  formations: LegacyFormationSeedRecord[];
  customers: LegacyCustomerSeedRecord[];
  jobs: LegacyJobSeedRecord[];
  experiences: LegacyExperienceSeedRecord[];
  projects: LegacyProjectSeedRecord[];
  portfolioSettings: LegacyPortfolioSettingSeedRecord[];
}
