import type { TechnologyUsageContext } from '@prisma/client';

export type TechnologyUsagePeriodRecord = {
  startedAt: Date | string | null;
  endedAt: Date | string | null;
  context: TechnologyUsageContext;
};

export type TechnologyRecordWithUsageRelations = Record<string, unknown> & {
  technologyContexts?: TechnologyUsagePeriodRecord[];
};

export type TechnologyExperienceDuration = {
  totalMonths: number;
  years: number;
  months: number;
  label: string;
  labelPt: string;
  labelEn: string;
  labelEs: string;
  startedAt: string | null;
  endedAt: string | null;
};

export type TechnologyExperienceDurationLanguage = 'pt' | 'en' | 'es';

export type TechnologyExperienceMetrics = {
  total: TechnologyExperienceDuration;
  byContext: Record<TechnologyUsageContext, TechnologyExperienceDuration>;
};

export type TechnologyRecordWithExperienceMetrics =
  TechnologyRecordWithUsageRelations & {
    experienceMetrics: TechnologyExperienceMetrics;
  };
