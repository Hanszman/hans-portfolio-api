import type { TechnologyUsageContext } from '@prisma/client';

export type TechnologyUsageIntervalSource =
  | 'project'
  | 'experience'
  | 'formation';

export type TechnologyUsagePeriodRecord = {
  startedAt: Date | string | null;
  endedAt: Date | string | null;
  contexts: TechnologyUsageContext[];
  source: TechnologyUsageIntervalSource;
};

export type TechnologyUsageRelationWithPeriod = {
  startedAt: Date | string | null;
  endedAt: Date | string | null;
  contexts?: TechnologyUsageContext[];
};

export type TechnologyRecordWithUsageRelations = Record<string, unknown> & {
  projectUsages?: TechnologyUsageRelationWithPeriod[];
  experienceUses?: TechnologyUsageRelationWithPeriod[];
  formationUses?: TechnologyUsageRelationWithPeriod[];
};

export type TechnologyExperienceDuration = {
  totalMonths: number;
  years: number;
  months: number;
  label: string;
  startedAt: string | null;
  endedAt: string | null;
};

export type TechnologyExperienceMetrics = {
  total: TechnologyExperienceDuration;
  byContext: Record<TechnologyUsageContext, TechnologyExperienceDuration>;
};

export type TechnologyRecordWithExperienceMetrics =
  TechnologyRecordWithUsageRelations & {
    experienceMetrics: TechnologyExperienceMetrics;
  };
