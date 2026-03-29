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
  type: TagType;
  projects: Array<{
    projectId: string;
    project: {
      isPublished: boolean;
    };
  }>;
  technologies: Array<{
    technologyId: string;
    technology: {
      isPublished: boolean;
    };
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
  technology: DashboardPublishedTechnologyRecord;
};

export type DashboardTechnologyUsageSource =
  | 'project'
  | 'experience'
  | 'formation';

export type DashboardPublishedTechnologyRecord = {
  id: string;
  slug: string;
  name: string;
  category: TechnologyCategory;
  level: TechnologyLevel | null;
  frequency: TechnologyUsageFrequency | null;
  isPublished: boolean;
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
  startDate: Date;
  endDate: Date | null;
  isCurrent: boolean;
  highlight: boolean;
  jobs: Array<{
    job: {
      namePt: string;
      nameEn: string;
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
  shortDescriptionPt: string;
  shortDescriptionEn: string;
  icon: string | null;
  featured: boolean;
  highlight: boolean;
  imageAssets: Array<{
    imageAsset: {
      filePath: string;
    };
  }>;
};

export type DashboardExperienceHighlightRecord = {
  id: string;
  slug: string;
  companyName: string;
  titlePt: string;
  titleEn: string;
  summaryPt: string;
  summaryEn: string;
  icon: string | null;
  highlight: boolean;
  imageAssets: Array<{
    imageAsset: {
      filePath: string;
    };
  }>;
};

export type DashboardTechnologyHighlightRecord = {
  id: string;
  slug: string;
  name: string;
  category: TechnologyCategory;
  icon: string | null;
  highlight: boolean;
  imageAssets: Array<{
    imageAsset: {
      filePath: string;
    };
  }>;
};

export type DashboardFormationHighlightRecord = {
  id: string;
  slug: string;
  institution: string;
  titlePt: string;
  titleEn: string;
  icon: string | null;
  highlight: boolean;
  imageAssets: Array<{
    imageAsset: {
      filePath: string;
    };
  }>;
};

export type DashboardCustomerHighlightRecord = {
  id: string;
  slug: string;
  name: string;
  summaryPt: string;
  summaryEn: string;
  icon: string | null;
  highlight: boolean;
  imageAssets: Array<{
    imageAsset: {
      filePath: string;
    };
  }>;
};

export type DashboardJobHighlightRecord = {
  id: string;
  slug: string;
  namePt: string;
  nameEn: string;
  summaryPt: string;
  summaryEn: string;
  icon: string | null;
  highlight: boolean;
  imageAssets: Array<{
    imageAsset: {
      filePath: string;
    };
  }>;
};

export type DashboardSpokenLanguageHighlightRecord = {
  id: string;
  code: string;
  namePt: string;
  nameEn: string;
  icon: string | null;
  highlight: boolean;
  imageAssets: Array<{
    imageAsset: {
      filePath: string;
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
  subtitlePt?: string;
  subtitleEn?: string;
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
