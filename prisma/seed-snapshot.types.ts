import type { Prisma } from '@prisma/client';

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

export type LegacyTechnologySnapshotRecord =
  Prisma.TechnologyCreateManyInput & {
    icon?: string | null;
    officialUrl?: string | null;
  };

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
  tags: Prisma.TagCreateManyInput[];
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
  technologyTags: Prisma.TechnologyTagCreateManyInput[];
  projectTags: Prisma.ProjectTagCreateManyInput[];
  technologyContexts: Prisma.TechnologyContextCreateManyInput[];
  formationTechnologies: Prisma.FormationTechnologyCreateManyInput[];
  experienceTechnologies: Prisma.ExperienceTechnologyCreateManyInput[];
  projectTechnologies: Prisma.ProjectTechnologyCreateManyInput[];
  experienceCustomers: Prisma.ExperienceCustomerCreateManyInput[];
  experienceJobs: Prisma.ExperienceJobCreateManyInput[];
  projectExperiences: Prisma.ProjectExperienceCreateManyInput[];
  formationLinks: Prisma.FormationLinkCreateManyInput[];
  experienceLinks: Prisma.ExperienceLinkCreateManyInput[];
  projectLinks: Prisma.ProjectLinkCreateManyInput[];
  technologyLinks: Prisma.TechnologyLinkCreateManyInput[];
  formationImageAssets: Prisma.FormationImageAssetCreateManyInput[];
  experienceImageAssets: Prisma.ExperienceImageAssetCreateManyInput[];
  projectImageAssets: Prisma.ProjectImageAssetCreateManyInput[];
  technologyImageAssets: Prisma.TechnologyImageAssetCreateManyInput[];
  spokenLanguageImageAssets: Prisma.SpokenLanguageImageAssetCreateManyInput[];
  customerImageAssets: Prisma.CustomerImageAssetCreateManyInput[];
  jobImageAssets: Prisma.JobImageAssetCreateManyInput[];
}

export interface RawPortfolioSeedSnapshot {
  tags: Prisma.TagCreateManyInput[];
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
  technologyTags: Prisma.TechnologyTagCreateManyInput[];
  projectTags: Prisma.ProjectTagCreateManyInput[];
  technologyContexts: Prisma.TechnologyContextCreateManyInput[];
  formationTechnologies: Prisma.FormationTechnologyCreateManyInput[];
  experienceTechnologies: Prisma.ExperienceTechnologyCreateManyInput[];
  projectTechnologies: Prisma.ProjectTechnologyCreateManyInput[];
  experienceCustomers: Prisma.ExperienceCustomerCreateManyInput[];
  experienceJobs: Prisma.ExperienceJobCreateManyInput[];
  projectExperiences: Prisma.ProjectExperienceCreateManyInput[];
  formationLinks: Prisma.FormationLinkCreateManyInput[];
  experienceLinks: Prisma.ExperienceLinkCreateManyInput[];
  projectLinks: Prisma.ProjectLinkCreateManyInput[];
  technologyLinks?: Prisma.TechnologyLinkCreateManyInput[];
  formationImageAssets: Prisma.FormationImageAssetCreateManyInput[];
  experienceImageAssets: Prisma.ExperienceImageAssetCreateManyInput[];
  projectImageAssets: Prisma.ProjectImageAssetCreateManyInput[];
  technologyImageAssets: Prisma.TechnologyImageAssetCreateManyInput[];
  spokenLanguageImageAssets: Prisma.SpokenLanguageImageAssetCreateManyInput[];
  customerImageAssets: Prisma.CustomerImageAssetCreateManyInput[];
  jobImageAssets: Prisma.JobImageAssetCreateManyInput[];
}
