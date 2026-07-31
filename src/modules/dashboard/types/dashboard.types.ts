import type {
  ImageAssetKind,
  ProjectContext,
  ProjectEnvironment,
  TagType,
  TechnologyCategory,
  TechnologyLevel,
  TechnologyUsageContext,
  TechnologyUsageFrequency,
} from '@prisma/client';

export type DashboardDistributionEntry = {
  key: string;
  count: number;
};

export type DashboardStackRecord = {
  id: string;
  slug: string;
  namePt: string;
  nameEn: string;
  nameEs: string;
  type: TagType;
  projects: Array<{
    projectId: string;
  }>;
  technologies: Array<{
    technologyId: string;
  }>;
};

export type DashboardProjectContextRecord = {
  id: string;
  context: ProjectContext;
  environment: ProjectEnvironment;
  featured: boolean;
  highlight: boolean;
};

export type DashboardTechnologyUsageRecord = {
  technologyId: string;
  source: DashboardTechnologyUsageSource;
  technology: DashboardTechnologyRecord;
};

export type DashboardTechnologyUsageSource =
  | 'project'
  | 'experience'
  | 'formation';

export type DashboardTechnologyRecord = {
  id: string;
  slug: string;
  name: string;
  category: TechnologyCategory;
  level: TechnologyLevel | null;
  frequency: TechnologyUsageFrequency | null;
  technologyContexts: Array<{
    context: TechnologyUsageContext;
  }>;
};

export type DashboardTimelineExperienceRecord = {
  id: string;
  slug: string;
  companyName: string;
  titlePt: string;
  titleEn: string;
  titleEs: string;
  startDate: Date;
  endDate: Date | null;
  isCurrent: boolean;
  highlight: boolean;
  jobs: Array<{
    job: {
      namePt: string;
      nameEn: string;
      nameEs: string;
    };
  }>;
  customers: Array<{
    customer: {
      name: string;
    };
  }>;
  projects: Array<{
    project: {
      slug: string;
      titlePt: string;
      titleEn: string;
      titleEs: string;
    };
  }>;
  technologies: Array<{
    technology: {
      slug: string;
      name: string;
    };
  }>;
  imageAssets: Array<{
    imageAsset: {
      filePath: string;
      kind: ImageAssetKind;
    };
  }>;
};

export type DashboardProjectHighlightRecord = {
  id: string;
  slug: string;
  titlePt: string;
  titleEn: string;
  titleEs: string;
  shortDescriptionPt: string;
  shortDescriptionEn: string;
  shortDescriptionEs: string;
  featured: boolean;
  highlight: boolean;
  imageAssets: Array<{
    imageAsset: {
      filePath: string;
      kind: ImageAssetKind;
    };
  }>;
};

export type DashboardExperienceHighlightRecord = {
  id: string;
  slug: string;
  companyName: string;
  titlePt: string;
  titleEn: string;
  titleEs: string;
  summaryPt: string;
  summaryEn: string;
  summaryEs: string;
  highlight: boolean;
  imageAssets: Array<{
    imageAsset: {
      filePath: string;
      kind: ImageAssetKind;
    };
  }>;
};

export type DashboardTechnologyHighlightRecord = {
  id: string;
  slug: string;
  name: string;
  category: TechnologyCategory;
  highlight: boolean;
  imageAssets: Array<{
    imageAsset: {
      filePath: string;
      kind: ImageAssetKind;
    };
  }>;
};

export type DashboardFormationHighlightRecord = {
  id: string;
  slug: string;
  institution: string;
  titlePt: string;
  titleEn: string;
  titleEs: string;
  highlight: boolean;
  imageAssets: Array<{
    imageAsset: {
      filePath: string;
      kind: ImageAssetKind;
    };
  }>;
};

export type DashboardCustomerHighlightRecord = {
  id: string;
  slug: string;
  name: string;
  summaryPt: string;
  summaryEn: string;
  summaryEs: string;
  highlight: boolean;
  imageAssets: Array<{
    imageAsset: {
      filePath: string;
      kind: ImageAssetKind;
    };
  }>;
};

export type DashboardJobHighlightRecord = {
  id: string;
  slug: string;
  namePt: string;
  nameEn: string;
  nameEs: string;
  summaryPt: string;
  summaryEn: string;
  summaryEs: string;
  highlight: boolean;
  imageAssets: Array<{
    imageAsset: {
      filePath: string;
      kind: ImageAssetKind;
    };
  }>;
};

export type DashboardSpokenLanguageHighlightRecord = {
  id: string;
  code: string;
  namePt: string;
  nameEn: string;
  nameEs: string;
  highlight: boolean;
  imageAssets: Array<{
    imageAsset: {
      filePath: string;
      kind: ImageAssetKind;
    };
  }>;
};

export type DashboardHighlightItem = {
  entity:
    | 'project'
    | 'experience'
    | 'technology'
    | 'formation'
    | 'customer'
    | 'job'
    | 'spokenLanguage';
  id: string;
  slug: string;
  titlePt: string;
  titleEn: string;
  titleEs: string;
  subtitlePt?: string;
  subtitleEn?: string;
  subtitleEs?: string;
  icon?: string | null;
  imagePath?: string | null;
  featured?: boolean;
};

export type DashboardTopTechnologyEntry = {
  technologyId: string;
  slug: string;
  name: string;
  category: TechnologyCategory;
  usageCount: number;
};
