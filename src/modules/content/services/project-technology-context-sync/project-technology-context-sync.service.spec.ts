import { Test } from '@nestjs/testing';
import { ProjectContext } from '@prisma/client';
import { ProjectTechnologyContextSyncService } from './project-technology-context-sync.service';

describe('ProjectTechnologyContextSyncService', () => {
  let service: ProjectTechnologyContextSyncService;
  let transaction: {
    technologyContext: {
      createMany: jest.Mock;
      deleteMany: jest.Mock;
    };
  };

  beforeEach(async () => {
    transaction = {
      technologyContext: {
        createMany: jest.fn(),
        deleteMany: jest.fn(),
      },
    };

    const moduleRef = await Test.createTestingModule({
      providers: [ProjectTechnologyContextSyncService],
    }).compile();

    service = moduleRef.get(ProjectTechnologyContextSyncService);
  });

  describe('syncOnCreate', () => {
    it('creates one technology context per related technology', async () => {
      await service.syncOnCreate(transaction as never, {
        id: 'project-1',
        context: ProjectContext.PROFESSIONAL,
        startDate: '2020-01-01',
        endDate: '2021-01-01',
        technologies: [{ technologyId: 'tech-1' }, { technologyId: 'tech-2' }],
      });

      expect(transaction.technologyContext.deleteMany).not.toHaveBeenCalled();
      expect(transaction.technologyContext.createMany).toHaveBeenCalledWith({
        data: [
          {
            technologyId: 'tech-1',
            projectId: 'project-1',
            context: 'PROFESSIONAL',
            startedAt: '2020-01-01',
            endedAt: '2021-01-01',
          },
          {
            technologyId: 'tech-2',
            projectId: 'project-1',
            context: 'PROFESSIONAL',
            startedAt: '2020-01-01',
            endedAt: '2021-01-01',
          },
        ],
      });
    });

    it('does nothing when the project has no related technologies', async () => {
      await service.syncOnCreate(transaction as never, {
        id: 'project-1',
        context: ProjectContext.PROFESSIONAL,
        startDate: '2020-01-01',
        endDate: null,
        technologies: [],
      });

      expect(transaction.technologyContext.createMany).not.toHaveBeenCalled();
    });

    it('passes through a null endDate for ongoing projects', async () => {
      await service.syncOnCreate(transaction as never, {
        id: 'project-1',
        context: ProjectContext.STUDY,
        startDate: '2024-01-01',
        endDate: null,
        technologies: [{ technologyId: 'tech-1' }],
      });

      expect(transaction.technologyContext.createMany).toHaveBeenCalledWith({
        data: [
          {
            technologyId: 'tech-1',
            projectId: 'project-1',
            context: 'STUDY',
            startedAt: '2024-01-01',
            endedAt: null,
          },
        ],
      });
    });
  });

  describe('syncOnUpdate', () => {
    const project = {
      id: 'project-1',
      context: ProjectContext.PERSONAL,
      startDate: '2020-01-01',
      endDate: '2021-01-01',
      technologies: [{ technologyId: 'tech-1' }],
    };

    it.each([
      ['technologyRelations', { technologyRelations: [] }],
      ['startDate', { startDate: '2020-02-01' }],
      ['endDate', { endDate: null }],
      ['context', { context: ProjectContext.STUDY }],
    ])('resyncs when the payload includes %s', async (_field, rawPayload) => {
      await service.syncOnUpdate(transaction as never, project, rawPayload);

      expect(transaction.technologyContext.deleteMany).toHaveBeenCalledWith({
        where: { projectId: 'project-1' },
      });
      expect(transaction.technologyContext.createMany).toHaveBeenCalledWith({
        data: [
          {
            technologyId: 'tech-1',
            projectId: 'project-1',
            context: 'PERSONAL',
            startedAt: '2020-01-01',
            endedAt: '2021-01-01',
          },
        ],
      });
    });

    it('does nothing when the payload touches none of the trigger fields', async () => {
      await service.syncOnUpdate(transaction as never, project, {
        titlePt: 'New title',
      });

      expect(transaction.technologyContext.deleteMany).not.toHaveBeenCalled();
      expect(transaction.technologyContext.createMany).not.toHaveBeenCalled();
    });

    it('deletes existing contexts and creates none when all technologies were removed', async () => {
      await service.syncOnUpdate(
        transaction as never,
        { ...project, technologies: [] },
        { technologyRelations: [] },
      );

      expect(transaction.technologyContext.deleteMany).toHaveBeenCalledWith({
        where: { projectId: 'project-1' },
      });
      expect(transaction.technologyContext.createMany).not.toHaveBeenCalled();
    });
  });
});
