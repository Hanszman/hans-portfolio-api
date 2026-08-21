import { Injectable } from '@nestjs/common';
import type { Prisma, ProjectContext } from '@prisma/client';
import { mapProjectContextToTechnologyUsageContext } from '../../helpers/project-context-mapping.helper';

export type ProjectTechnologyContextSyncInput = {
  id: string;
  context: ProjectContext;
  startDate: Date | string;
  endDate: Date | string | null;
  technologies: ReadonlyArray<{ technologyId: string }>;
};

const PROJECT_TECHNOLOGY_CONTEXT_SYNC_TRIGGER_FIELDS = [
  'technologyRelations',
  'startDate',
  'endDate',
  'context',
] as const;

@Injectable()
export class ProjectTechnologyContextSyncService {
  async syncOnCreate(
    transaction: Prisma.TransactionClient,
    project: ProjectTechnologyContextSyncInput,
  ): Promise<void> {
    await this.recreateContexts(transaction, project);
  }

  async syncOnUpdate(
    transaction: Prisma.TransactionClient,
    project: ProjectTechnologyContextSyncInput,
    rawPayload: object,
  ): Promise<void> {
    if (!this.shouldSync(rawPayload)) {
      return;
    }

    await transaction.technologyContext.deleteMany({
      where: { projectId: project.id },
    });
    await this.recreateContexts(transaction, project);
  }

  private shouldSync(rawPayload: object): boolean {
    return PROJECT_TECHNOLOGY_CONTEXT_SYNC_TRIGGER_FIELDS.some(
      (field) => field in rawPayload,
    );
  }

  private async recreateContexts(
    transaction: Prisma.TransactionClient,
    project: ProjectTechnologyContextSyncInput,
  ): Promise<void> {
    if (project.technologies.length === 0) {
      return;
    }

    const context = mapProjectContextToTechnologyUsageContext(project.context);

    await transaction.technologyContext.createMany({
      data: project.technologies.map(({ technologyId }) => ({
        technologyId,
        projectId: project.id,
        context,
        startedAt: project.startDate,
        endedAt: project.endDate,
      })),
    });
  }
}
