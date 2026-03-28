export type MutationMode = 'create' | 'update';

export type TechnologyUsageRelationMetadata = {
  level?: string;
  frequency?: string;
  contexts?: string[];
};

export type TechnologyUsageRelationBy<TKey extends string> =
  TechnologyUsageRelationMetadata & Record<TKey, string>;

export type TechnologyRelationByTechnologyId =
  TechnologyUsageRelationBy<'technologyId'>;

export type TechnologyRelationByProjectId =
  TechnologyUsageRelationBy<'projectId'>;

export type TechnologyRelationByExperienceId =
  TechnologyUsageRelationBy<'experienceId'>;

export type TechnologyRelationByFormationId =
  TechnologyUsageRelationBy<'formationId'>;

export type ProjectMutationPayload = Record<string, unknown> & {
  technologyRelations?: TechnologyRelationByTechnologyId[];
  experienceIds?: string[];
  tagIds?: string[];
  linkIds?: string[];
  imageAssetIds?: string[];
};

export type ExperienceMutationPayload = Record<string, unknown> & {
  technologyRelations?: TechnologyRelationByTechnologyId[];
  projectIds?: string[];
  customerIds?: string[];
  jobIds?: string[];
  linkIds?: string[];
  imageAssetIds?: string[];
};

export type TechnologyMutationPayload = Record<string, unknown> & {
  projectRelations?: TechnologyRelationByProjectId[];
  experienceRelations?: TechnologyRelationByExperienceId[];
  formationRelations?: TechnologyRelationByFormationId[];
  tagIds?: string[];
  imageAssetIds?: string[];
};

export type FormationMutationPayload = Record<string, unknown> & {
  technologyRelations?: TechnologyRelationByTechnologyId[];
  linkIds?: string[];
  imageAssetIds?: string[];
};

export type SpokenLanguageMutationPayload = Record<string, unknown> & {
  imageAssetIds?: string[];
};

export type CustomerMutationPayload = Record<string, unknown> & {
  experienceIds?: string[];
  imageAssetIds?: string[];
};

export type JobMutationPayload = Record<string, unknown> & {
  experienceIds?: string[];
  imageAssetIds?: string[];
};

export type LinkMutationPayload = Record<string, unknown> & {
  projectIds?: string[];
  experienceIds?: string[];
  formationIds?: string[];
};

export type ImageAssetMutationPayload = Record<string, unknown> & {
  projectIds?: string[];
  experienceIds?: string[];
  formationIds?: string[];
  technologyIds?: string[];
  spokenLanguageIds?: string[];
  customerIds?: string[];
  jobIds?: string[];
};

export type TagMutationPayload = Record<string, unknown> & {
  projectIds?: string[];
  technologyIds?: string[];
};
