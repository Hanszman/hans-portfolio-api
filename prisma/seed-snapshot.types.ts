import type { Prisma, TechnologyStack, TechnologyType } from '@prisma/client';

export interface PortfolioSettingSnapshotRecord extends Omit<
  Prisma.PortfolioSettingCreateManyInput,
  'value'
> {
  value: Prisma.JsonValue;
}

export type LegacyProjectSnapshotRecord = Prisma.ProjectCreateManyInput & {
  repositoryUrl?: string | null;
  deployUrl?: string | null;
  docsUrl?: string | null;
  npmUrl?: string | null;
  icon?: string | null;
};

export type LegacyExperienceSnapshotRecord =
  Prisma.ExperienceCreateManyInput & {
    icon?: string | null;
  };

export type LegacyTechnologySnapshotRecord = Omit<
  Prisma.TechnologyCreateManyInput,
  'stack' | 'type'
> & {
  category?: string;
  icon?: string | null;
  officialUrl?: string | null;
  stack?: TechnologyStack;
  type?: TechnologyType;
};

export interface LegacyTagSnapshotRecord {
  id: string;
  slug: string;
}

export interface LegacyTechnologyTagSnapshotRecord {
  technologyId: string;
  tagId: string;
}

export type LegacyFormationSnapshotRecord = Prisma.FormationCreateManyInput & {
  icon?: string | null;
};

export type LegacySpokenLanguageSnapshotRecord =
  Prisma.SpokenLanguageCreateManyInput & {
    icon?: string | null;
  };

export type LegacyCustomerSnapshotRecord = Prisma.CustomerCreateManyInput & {
  icon?: string | null;
};

export type LegacyJobSnapshotRecord = Prisma.JobCreateManyInput & {
  icon?: string | null;
};

export interface PortfolioSeedSnapshot {
  technologies: Prisma.TechnologyCreateManyInput[];
  spokenLanguages: Prisma.SpokenLanguageCreateManyInput[];
  customers: Prisma.CustomerCreateManyInput[];
  jobs: Prisma.JobCreateManyInput[];
  formations: Prisma.FormationCreateManyInput[];
  experiences: Prisma.ExperienceCreateManyInput[];
  projects: Prisma.ProjectCreateManyInput[];
  links: Prisma.LinkCreateManyInput[];
  imageAssets: Prisma.ImageAssetCreateManyInput[];
  portfolioSettings: PortfolioSettingSnapshotRecord[];
  technologyContexts: Prisma.TechnologyContextCreateManyInput[];
  formationTechnologies: Prisma.FormationTechnologyCreateManyInput[];
  experienceTechnologies: Prisma.ExperienceTechnologyCreateManyInput[];
  projectTechnologies: Prisma.ProjectTechnologyCreateManyInput[];
  experienceCustomers: Prisma.ExperienceCustomerCreateManyInput[];
  experienceJobs: Prisma.ExperienceJobCreateManyInput[];
  projectExperiences: Prisma.ProjectExperienceCreateManyInput[];
  projectLinks: Prisma.ProjectLinkCreateManyInput[];
  formationImageAssets: Prisma.FormationImageAssetCreateManyInput[];
  experienceImageAssets: Prisma.ExperienceImageAssetCreateManyInput[];
  projectImageAssets: Prisma.ProjectImageAssetCreateManyInput[];
  technologyImageAssets: Prisma.TechnologyImageAssetCreateManyInput[];
  spokenLanguageImageAssets: Prisma.SpokenLanguageImageAssetCreateManyInput[];
  customerImageAssets: Prisma.CustomerImageAssetCreateManyInput[];
}

export interface RawPortfolioSeedSnapshot {
  tags?: LegacyTagSnapshotRecord[];
  technologies: LegacyTechnologySnapshotRecord[];
  spokenLanguages: LegacySpokenLanguageSnapshotRecord[];
  customers: LegacyCustomerSnapshotRecord[];
  jobs: LegacyJobSnapshotRecord[];
  formations: LegacyFormationSnapshotRecord[];
  experiences: LegacyExperienceSnapshotRecord[];
  projects: LegacyProjectSnapshotRecord[];
  links: Prisma.LinkCreateManyInput[];
  imageAssets: Prisma.ImageAssetCreateManyInput[];
  portfolioSettings: PortfolioSettingSnapshotRecord[];
  technologyTags?: LegacyTechnologyTagSnapshotRecord[];
  projectTags?: unknown[];
  technologyContexts: Prisma.TechnologyContextCreateManyInput[];
  formationTechnologies: Prisma.FormationTechnologyCreateManyInput[];
  experienceTechnologies: Prisma.ExperienceTechnologyCreateManyInput[];
  projectTechnologies: Prisma.ProjectTechnologyCreateManyInput[];
  experienceCustomers: Prisma.ExperienceCustomerCreateManyInput[];
  experienceJobs: Prisma.ExperienceJobCreateManyInput[];
  projectExperiences: Prisma.ProjectExperienceCreateManyInput[];
  projectLinks: Prisma.ProjectLinkCreateManyInput[];
  formationImageAssets: Prisma.FormationImageAssetCreateManyInput[];
  experienceImageAssets: Prisma.ExperienceImageAssetCreateManyInput[];
  projectImageAssets: Prisma.ProjectImageAssetCreateManyInput[];
  technologyImageAssets: Prisma.TechnologyImageAssetCreateManyInput[];
  spokenLanguageImageAssets: Prisma.SpokenLanguageImageAssetCreateManyInput[];
  customerImageAssets: Prisma.CustomerImageAssetCreateManyInput[];
}
