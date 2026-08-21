import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from '../../../../database/prisma.service';
import type {
  ContentCreateArgs,
  ContentDeleteArgs,
  ContentUpdateArgs,
} from '../../types/content.types';
import { ContentMutationPayloadService } from '../content-mutation-payload/content-mutation-payload.service';
import { ContentResourceRegistryService } from '../content-resource-registry/content-resource-registry.service';
import { TechnologyExperienceMetricsService } from '../technology-experience-metrics/technology-experience-metrics.service';
import { ProjectTechnologyContextSyncService } from '../project-technology-context-sync/project-technology-context-sync.service';
import { ContentAdminService } from './content-admin.service';

describe('ContentAdminService', () => {
  let service: ContentAdminService;
  let linkCreate: jest.Mock<Promise<Record<string, unknown>>>;
  let linkUpdate: jest.Mock<Promise<Record<string, unknown>>>;
  let linkDelete: jest.Mock<Promise<Record<string, unknown>>>;
  let linkFindMany: jest.Mock;
  let linkFindUnique: jest.Mock;
  let technologyCreate: jest.Mock<Promise<Record<string, unknown>>>;
  let technologyUpdate: jest.Mock<Promise<Record<string, unknown>>>;
  let technologyDelete: jest.Mock<Promise<Record<string, unknown>>>;
  let technologyFindMany: jest.Mock;
  let technologyFindUnique: jest.Mock;
  let projectCreate: jest.Mock<Promise<Record<string, unknown>>>;
  let projectUpdate: jest.Mock<Promise<Record<string, unknown>>>;
  let projectFindMany: jest.Mock;
  let projectFindUnique: jest.Mock;
  let projectTechnologyContextSyncService: {
    syncOnCreate: jest.Mock;
    syncOnUpdate: jest.Mock;
  };

  beforeEach(async () => {
    linkCreate = jest.fn<Promise<Record<string, unknown>>, []>();
    linkUpdate = jest.fn<Promise<Record<string, unknown>>, []>();
    linkDelete = jest.fn<Promise<Record<string, unknown>>, []>();
    linkFindMany = jest.fn().mockResolvedValue([]);
    linkFindUnique = jest.fn();
    technologyCreate = jest.fn<Promise<Record<string, unknown>>, []>();
    technologyUpdate = jest.fn<Promise<Record<string, unknown>>, []>();
    technologyDelete = jest.fn<Promise<Record<string, unknown>>, []>();
    technologyFindMany = jest.fn().mockResolvedValue([]);
    technologyFindUnique = jest.fn();
    projectCreate = jest.fn<Promise<Record<string, unknown>>, []>();
    projectUpdate = jest.fn<Promise<Record<string, unknown>>, []>();
    projectFindMany = jest.fn().mockResolvedValue([]);
    projectFindUnique = jest.fn();
    projectTechnologyContextSyncService = {
      syncOnCreate: jest.fn().mockResolvedValue(undefined),
      syncOnUpdate: jest.fn().mockResolvedValue(undefined),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        ContentAdminService,
        ContentResourceRegistryService,
        ContentMutationPayloadService,
        TechnologyExperienceMetricsService,
        {
          provide: ProjectTechnologyContextSyncService,
          useValue: projectTechnologyContextSyncService,
        },
        {
          provide: PrismaService,
          useValue: {
            $transaction: jest.fn((callback: (client: unknown) => unknown) =>
              Promise.resolve(
                callback({
                  link: {
                    create: linkCreate,
                    update: linkUpdate,
                    delete: linkDelete,
                    findMany: linkFindMany,
                    findUnique: linkFindUnique,
                  },
                  technology: {
                    create: technologyCreate,
                    update: technologyUpdate,
                    delete: technologyDelete,
                    findMany: technologyFindMany,
                    findUnique: technologyFindUnique,
                  },
                  project: {
                    create: projectCreate,
                    update: projectUpdate,
                    findMany: projectFindMany,
                    findUnique: projectFindUnique,
                  },
                }),
              ),
            ),
          },
        },
      ],
    }).compile();

    service = moduleRef.get(ContentAdminService);
  });
  it('creates an admin item', async () => {
    linkFindMany.mockResolvedValue([]);
    linkCreate.mockResolvedValue({ id: 'link-1', url: 'https://example.com' });
    linkFindUnique.mockResolvedValue({
      id: 'link-1',
      url: 'https://example.com',
    });

    const result = await service.createAdminItem('links', {
      url: 'https://example.com',
    });
    const [createArgs] = linkCreate.mock.calls[0] as [ContentCreateArgs];

    expect(result).toEqual({ id: 'link-1', url: 'https://example.com' });
    expect(createArgs.data).toEqual({
      url: 'https://example.com',
      sortOrder: 0,
    });
    expect(createArgs.include).toBeDefined();
  });

  it('maps unique constraint violations to conflict exceptions on create', async () => {
    linkFindMany.mockResolvedValue([]);
    linkCreate.mockRejectedValue(
      new PrismaClientKnownRequestError('duplicate', {
        code: 'P2002',
        clientVersion: '6.16.2',
      }),
    );

    await expect(
      service.createAdminItem('links', {
        url: 'https://example.com',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('rethrows non-prisma errors from create operations', async () => {
    const unexpectedError = new Error('Unexpected create failure.');

    linkFindMany.mockResolvedValue([]);
    linkCreate.mockRejectedValue(unexpectedError);

    await expect(
      service.createAdminItem('links', {
        url: 'https://example.com',
      }),
    ).rejects.toBe(unexpectedError);
  });

  it('enriches technology admin responses with experience metrics', async () => {
    technologyCreate.mockResolvedValue({
      id: 'technology-1',
      slug: 'typescript',
      technologyContexts: [
        {
          context: 'PERSONAL',
          startedAt: '2024-01-01',
          endedAt: '2024-03-01',
        },
      ],
    });
    technologyFindUnique.mockResolvedValue({
      id: 'technology-1',
      slug: 'typescript',
      technologyContexts: [
        {
          context: 'PERSONAL',
          startedAt: '2024-01-01',
          endedAt: '2024-03-01',
        },
      ],
    });

    const result = (await service.createAdminItem('technologies', {
      slug: 'typescript',
      name: 'TypeScript',
      type: 'PROGRAMMING_LANGUAGES',
    })) as {
      experienceMetrics: {
        total: {
          totalMonths: number;
          label: string;
        };
      };
    };

    expect(result.experienceMetrics.total).toEqual({
      totalMonths: 2,
      years: 0,
      months: 2,
      label: '2 months',
      labelPt: '2 meses',
      labelEn: '2 months',
      labelEs: '2 meses',
      startedAt: '2024-01-01',
      endedAt: '2024-03-01',
    });
  });

  it('returns the created sortable record when the follow-up read is empty', async () => {
    technologyFindMany.mockResolvedValue([{ id: 'technology-1' }]);
    technologyCreate.mockResolvedValue({
      id: 'technology-2',
      slug: 'typescript',
      technologyContexts: [],
    });
    technologyFindUnique.mockResolvedValue(null);

    const result = (await service.createAdminItem('technologies', {
      slug: 'typescript',
      name: 'TypeScript',
      type: 'PROGRAMMING_LANGUAGES',
      sortOrder: -4.7,
    })) as { id: string };

    expect(result.id).toBe('technology-2');
    expect(technologyUpdate.mock.calls).toEqual([
      [{ where: { id: 'technology-2' }, data: { sortOrder: 0 } }],
      [{ where: { id: 'technology-1' }, data: { sortOrder: 1 } }],
    ]);
  });

  it('syncs technology contexts when creating a project', async () => {
    projectFindMany.mockResolvedValue([]);
    const createdProject = {
      id: 'project-1',
      context: 'PROFESSIONAL',
      startDate: '2020-01-01',
      endDate: null,
      technologies: [{ technologyId: 'tech-1' }],
    };
    projectCreate.mockResolvedValue(createdProject);
    projectFindUnique.mockResolvedValue(createdProject);

    const payload = {
      context: 'PROFESSIONAL',
      startDate: '2020-01-01',
      technologyRelations: [{ technologyId: 'tech-1' }],
    };

    const result = await service.createAdminItem('projects', payload);

    expect(result).toEqual(createdProject);
    expect(
      projectTechnologyContextSyncService.syncOnCreate,
    ).toHaveBeenCalledWith(expect.anything(), createdProject);
  });

  it('does not sync technology contexts for non-project resources on create', async () => {
    linkFindMany.mockResolvedValue([]);
    linkCreate.mockResolvedValue({ id: 'link-1' });
    linkFindUnique.mockResolvedValue({ id: 'link-1' });

    await service.createAdminItem('links', { url: 'https://example.com' });

    expect(
      projectTechnologyContextSyncService.syncOnCreate,
    ).not.toHaveBeenCalled();
  });

  it('updates an admin item', async () => {
    linkFindMany.mockResolvedValue([{ id: 'link-1' }]);
    linkUpdate.mockResolvedValue({ id: 'link-1' });
    linkFindUnique.mockResolvedValue({
      id: 'link-1',
      url: 'https://example.com/updated',
    });

    const result = await service.updateAdminItem('links', 'link-1', {
      url: 'https://example.com/updated',
    });
    const [updateArgs] = linkUpdate.mock.calls[0] as [ContentUpdateArgs];

    expect(result).toEqual({
      id: 'link-1',
      url: 'https://example.com/updated',
    });
    expect(updateArgs.where).toEqual({ id: 'link-1' });
    expect(updateArgs.data).toEqual({ url: 'https://example.com/updated' });
    expect(updateArgs.include).toBeDefined();
  });

  it('enriches technology update responses with experience metrics', async () => {
    technologyUpdate.mockResolvedValue({
      id: 'technology-1',
      slug: 'typescript',
      technologyContexts: [
        {
          context: 'PROFESSIONAL',
          startedAt: '2020-01-01',
          endedAt: '2024-04-01',
        },
      ],
    });
    technologyFindUnique.mockResolvedValue({
      id: 'technology-1',
      slug: 'typescript',
      technologyContexts: [
        {
          context: 'PROFESSIONAL',
          startedAt: '2020-01-01',
          endedAt: '2024-04-01',
        },
      ],
    });

    const result = (await service.updateAdminItem(
      'technologies',
      'technology-1',
      {
        name: 'TypeScript',
      },
    )) as {
      experienceMetrics: {
        total: {
          totalMonths: number;
          label: string;
        };
      };
    };

    expect(result.experienceMetrics.total).toEqual({
      totalMonths: 51,
      years: 4,
      months: 3,
      label: '4 years 3 months',
      labelPt: '4 anos 3 meses',
      labelEn: '4 years 3 months',
      labelEs: '4 años 3 meses',
      startedAt: '2020-01-01',
      endedAt: '2024-04-01',
    });
  });

  it('moves sortable records transactionally and persists contiguous positions', async () => {
    technologyFindMany.mockResolvedValue([
      { id: 'technology-1' },
      { id: 'technology-2' },
      { id: 'technology-3' },
    ]);
    technologyUpdate.mockResolvedValue({ id: 'technology-2' });
    technologyFindUnique.mockResolvedValue({
      id: 'technology-2',
      slug: 'typescript',
      technologyContexts: [],
    });

    const result = (await service.updateAdminItem(
      'technologies',
      'technology-2',
      {
        name: 'TypeScript',
        sortOrder: 99.8,
      },
    )) as { id: string };
    const [firstUpdateArgs] = technologyUpdate.mock.calls[0] as [
      ContentUpdateArgs,
    ];

    expect(result.id).toBe('technology-2');
    expect(firstUpdateArgs.where).toEqual({ id: 'technology-2' });
    expect(firstUpdateArgs.data).toEqual({ name: 'TypeScript' });
    expect(firstUpdateArgs.include).toBeDefined();
    expect(technologyUpdate.mock.calls.slice(1)).toEqual([
      [{ where: { id: 'technology-1' }, data: { sortOrder: 0 } }],
      [{ where: { id: 'technology-3' }, data: { sortOrder: 1 } }],
      [{ where: { id: 'technology-2' }, data: { sortOrder: 2 } }],
    ]);
  });

  it('keeps the current sortable position and falls back to the record id', async () => {
    technologyFindMany.mockResolvedValue([
      { id: 'technology-1' },
      { id: 'technology-2' },
      { id: 'technology-3' },
    ]);
    technologyUpdate.mockResolvedValue({ id: 'technology-2' });
    technologyFindUnique.mockResolvedValue(null);

    const result = (await service.updateAdminItem(
      'technologies',
      'technology-2',
      { name: 'TypeScript' },
    )) as { id: string };

    expect(result.id).toBe('technology-2');
    expect(technologyUpdate.mock.calls.slice(1)).toEqual([
      [{ where: { id: 'technology-1' }, data: { sortOrder: 0 } }],
      [{ where: { id: 'technology-2' }, data: { sortOrder: 1 } }],
      [{ where: { id: 'technology-3' }, data: { sortOrder: 2 } }],
    ]);
  });

  it('syncs technology contexts when updating a project', async () => {
    projectFindMany.mockResolvedValue([{ id: 'project-1' }]);
    projectUpdate.mockResolvedValue({ id: 'project-1' });
    const updatedProject = {
      id: 'project-1',
      context: 'STUDY',
      startDate: '2020-01-01',
      endDate: '2021-01-01',
      technologies: [{ technologyId: 'tech-1' }],
    };
    projectFindUnique.mockResolvedValue(updatedProject);

    const payload = { context: 'STUDY' };

    const result = await service.updateAdminItem(
      'projects',
      'project-1',
      payload,
    );

    expect(result).toEqual(updatedProject);
    expect(
      projectTechnologyContextSyncService.syncOnUpdate,
    ).toHaveBeenCalledWith(expect.anything(), updatedProject, payload);
  });

  it('does not sync technology contexts for non-project resources on update', async () => {
    linkFindMany.mockResolvedValue([{ id: 'link-1' }]);
    linkUpdate.mockResolvedValue({ id: 'link-1' });
    linkFindUnique.mockResolvedValue({ id: 'link-1' });

    await service.updateAdminItem('links', 'link-1', {
      url: 'https://example.com/updated',
    });

    expect(
      projectTechnologyContextSyncService.syncOnUpdate,
    ).not.toHaveBeenCalled();
  });

  it('maps missing items to not found exceptions on update', async () => {
    linkFindMany.mockResolvedValue([]);
    linkUpdate.mockRejectedValue(
      new PrismaClientKnownRequestError('missing', {
        code: 'P2025',
        clientVersion: '6.16.2',
      }),
    );

    await expect(
      service.updateAdminItem('links', '4c00be28-b0d7-410f-90f8-0d88a8d15d2d', {
        url: 'https://example.com/updated',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('deletes an admin item', async () => {
    linkFindMany.mockResolvedValue([]);
    linkDelete.mockResolvedValue({ id: 'link-1' });

    const result = await service.deleteAdminItem('links', 'link-1');
    const [deleteArgs] = linkDelete.mock.calls[0] as [ContentDeleteArgs];

    expect(result).toEqual({ id: 'link-1' });
    expect(deleteArgs.where).toEqual({ id: 'link-1' });
    expect(deleteArgs.include).toBeDefined();
  });

  it('enriches technology delete responses with experience metrics', async () => {
    technologyFindMany.mockResolvedValue([]);
    technologyDelete.mockResolvedValue({
      id: 'technology-1',
      slug: 'typescript',
      technologyContexts: [
        {
          context: 'PERSONAL',
          startedAt: '2024-01-01',
          endedAt: '2024-03-01',
        },
      ],
    });

    const result = (await service.deleteAdminItem(
      'technologies',
      'technology-1',
    )) as {
      experienceMetrics: {
        total: {
          totalMonths: number;
          label: string;
        };
      };
    };

    expect(result.experienceMetrics.total).toEqual({
      totalMonths: 2,
      years: 0,
      months: 2,
      label: '2 months',
      labelPt: '2 meses',
      labelEn: '2 months',
      labelEs: '2 meses',
      startedAt: '2024-01-01',
      endedAt: '2024-03-01',
    });
  });

  it('maps foreign key violations to conflict exceptions on delete', async () => {
    linkDelete.mockRejectedValue(
      new PrismaClientKnownRequestError('referenced', {
        code: 'P2003',
        clientVersion: '6.16.2',
      }),
    );

    await expect(
      service.deleteAdminItem('links', '4c00be28-b0d7-410f-90f8-0d88a8d15d2d'),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('rethrows unhandled prisma errors from delete operations', async () => {
    const unhandledPrismaError = new PrismaClientKnownRequestError(
      'unhandled',
      {
        code: 'P9999',
        clientVersion: '6.16.2',
      },
    );

    linkDelete.mockRejectedValue(unhandledPrismaError);

    await expect(
      service.deleteAdminItem('links', '4c00be28-b0d7-410f-90f8-0d88a8d15d2d'),
    ).rejects.toBe(unhandledPrismaError);
  });
});
