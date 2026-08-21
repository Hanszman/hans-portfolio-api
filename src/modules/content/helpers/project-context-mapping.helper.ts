import { ProjectContext, TechnologyUsageContext } from '@prisma/client';

export const mapProjectContextToTechnologyUsageContext = (
  context: ProjectContext,
): TechnologyUsageContext => {
  switch (context) {
    case ProjectContext.PROFESSIONAL:
      return TechnologyUsageContext.PROFESSIONAL;
    case ProjectContext.PERSONAL:
      return TechnologyUsageContext.PERSONAL;
    case ProjectContext.ACADEMIC:
      return TechnologyUsageContext.ACADEMIC;
    case ProjectContext.STUDY:
      return TechnologyUsageContext.STUDY;
  }
};
