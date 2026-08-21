import type {
  TechnologyLevel,
  TechnologyType,
  TechnologyUsageContext,
  TechnologyUsageFrequency,
} from '@prisma/client';
import type { TechnologyExperienceMetrics } from './technology-experience-metrics.types';

export type TechnologyContextGroupItem = {
  technologyId: string;
  slug: string;
  name: string;
  type: TechnologyType;
  level: TechnologyLevel | null;
  frequency: TechnologyUsageFrequency | null;
  technologyContexts: Array<{
    id: string;
    context: TechnologyUsageContext;
    startedAt: string | Date;
    endedAt: string | Date | null;
  }>;
  experienceMetrics?: TechnologyExperienceMetrics;
};

export type TechnologyContextMutationRecord = {
  id: string;
  technologyId: string;
  projectId: string | null;
  context: TechnologyUsageContext;
  startedAt: string | Date;
  endedAt: string | Date | null;
  technology: {
    id: string;
    slug: string;
    name: string;
    type: TechnologyType;
    level: TechnologyLevel | null;
    frequency: TechnologyUsageFrequency | null;
  };
};
