export type MutationMode = 'create' | 'update';

export type TechnologyContextMutationPayload = {
  context: string;
  startedAt: string;
  endedAt?: string;
};

export type ContentRelationBy<TKey extends string> = Record<TKey, string>;

export type TechnologyRelationByTechnologyId =
  ContentRelationBy<'technologyId'>;

export type TechnologyRelationByProjectId = ContentRelationBy<'projectId'>;

export type TechnologyRelationByExperienceId =
  ContentRelationBy<'experienceId'>;

export type TechnologyRelationByFormationId = ContentRelationBy<'formationId'>;

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
  level?: string;
  frequency?: string;
  projectRelations?: TechnologyRelationByProjectId[];
  experienceRelations?: TechnologyRelationByExperienceId[];
  formationRelations?: TechnologyRelationByFormationId[];
  technologyContexts?: TechnologyContextMutationPayload[];
  tagIds?: string[];
  linkIds?: string[];
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
  technologyIds?: string[];
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
