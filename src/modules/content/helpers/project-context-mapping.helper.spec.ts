import { ProjectContext, TechnologyUsageContext } from '@prisma/client';
import { mapProjectContextToTechnologyUsageContext } from './project-context-mapping.helper';

describe('mapProjectContextToTechnologyUsageContext', () => {
  it.each([
    [ProjectContext.PROFESSIONAL, TechnologyUsageContext.PROFESSIONAL],
    [ProjectContext.PERSONAL, TechnologyUsageContext.PERSONAL],
    [ProjectContext.ACADEMIC, TechnologyUsageContext.ACADEMIC],
    [ProjectContext.STUDY, TechnologyUsageContext.STUDY],
  ])('maps %s to %s', (projectContext, expected) => {
    expect(mapProjectContextToTechnologyUsageContext(projectContext)).toBe(
      expected,
    );
  });
});
