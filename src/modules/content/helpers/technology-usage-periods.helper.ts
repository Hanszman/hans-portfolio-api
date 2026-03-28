import { TechnologyUsageContext } from '@prisma/client';
import type { PortfolioSeedSnapshot } from '../../../../prisma/seed-snapshot.types';

export function normalizePortfolioSeedSnapshotTechnologyUsagePeriods(
  snapshot: PortfolioSeedSnapshot,
): PortfolioSeedSnapshot {
  const projectById = new Map(
    snapshot.projects.map((project) => [project.id, project] as const),
  );
  const experienceById = new Map(
    snapshot.experiences.map(
      (experience) => [experience.id, experience] as const,
    ),
  );
  const formationById = new Map(
    snapshot.formations.map((formation) => [formation.id, formation] as const),
  );

  return {
    ...snapshot,
    projectTechnologies: snapshot.projectTechnologies.map((usage) => {
      const project = projectById.get(usage.projectId);

      return {
        ...usage,
        contexts:
          Array.isArray(usage.contexts) && usage.contexts.length > 0
            ? usage.contexts
            : project?.context
              ? [project.context as TechnologyUsageContext]
              : [],
        startedAt: usage.startedAt ?? project?.startDate ?? null,
        endedAt: usage.endedAt ?? project?.endDate ?? null,
      };
    }),
    experienceTechnologies: snapshot.experienceTechnologies.map((usage) => {
      const experience = experienceById.get(usage.experienceId);

      return {
        ...usage,
        contexts:
          Array.isArray(usage.contexts) && usage.contexts.length > 0
            ? usage.contexts
            : [TechnologyUsageContext.PROFESSIONAL],
        startedAt: usage.startedAt ?? experience?.startDate ?? null,
        endedAt: usage.endedAt ?? experience?.endDate ?? null,
      };
    }),
    formationTechnologies: snapshot.formationTechnologies.map((usage) => {
      const formation = formationById.get(usage.formationId);

      return {
        ...usage,
        contexts:
          Array.isArray(usage.contexts) && usage.contexts.length > 0
            ? usage.contexts
            : [TechnologyUsageContext.ACADEMIC],
        startedAt: usage.startedAt ?? formation?.startDate ?? null,
        endedAt: usage.endedAt ?? formation?.endDate ?? null,
      };
    }),
  };
}
