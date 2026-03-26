import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from '../../../../prisma/prisma.service';
import type {
  ContentCreateArgs,
  ContentDeleteArgs,
  ContentUpdateArgs,
} from '../../types/content.types';
import { ContentResourceRegistryService } from '../content-resource-registry/content-resource-registry.service';
import { ContentAdminService } from './content-admin.service';

describe('ContentAdminService', () => {
  let service: ContentAdminService;
  let tagCreate: jest.Mock<Promise<Record<string, unknown>>>;
  let tagUpdate: jest.Mock<Promise<Record<string, unknown>>>;
  let tagDelete: jest.Mock<Promise<Record<string, unknown>>>;

  beforeEach(async () => {
    tagCreate = jest.fn<Promise<Record<string, unknown>>, []>();
    tagUpdate = jest.fn<Promise<Record<string, unknown>>, []>();
    tagDelete = jest.fn<Promise<Record<string, unknown>>, []>();

    const moduleRef = await Test.createTestingModule({
      providers: [
        ContentAdminService,
        ContentResourceRegistryService,
        {
          provide: PrismaService,
          useValue: {
            tag: {
              create: tagCreate,
              update: tagUpdate,
              delete: tagDelete,
            },
          },
        },
      ],
    }).compile();

    service = moduleRef.get(ContentAdminService);
  });
  it('creates an admin item', async () => {
    tagCreate.mockResolvedValue({ id: 'tag-1', slug: 'nestjs' });

    const result = await service.createAdminItem('tags', {
      slug: 'nestjs',
      namePt: 'NestJS',
      nameEn: 'NestJS',
      type: 'FRAMEWORK',
    });
    const [createArgs] = tagCreate.mock.calls[0] as [ContentCreateArgs];

    expect(result).toEqual({ id: 'tag-1', slug: 'nestjs' });
    expect(createArgs.data).toEqual({
      slug: 'nestjs',
      namePt: 'NestJS',
      nameEn: 'NestJS',
      type: 'FRAMEWORK',
    });
    expect(createArgs.include).toBeDefined();
    expect(createArgs.include).not.toBeNull();
    expect('technologies' in (createArgs.include ?? {})).toBe(true);
  });

  it('maps unique constraint violations to conflict exceptions on create', async () => {
    tagCreate.mockRejectedValue(
      new PrismaClientKnownRequestError('duplicate', {
        code: 'P2002',
        clientVersion: '6.16.2',
      }),
    );

    await expect(
      service.createAdminItem('tags', {
        slug: 'nestjs',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('rethrows non-prisma errors from create operations', async () => {
    const unexpectedError = new Error('Unexpected create failure.');

    tagCreate.mockRejectedValue(unexpectedError);

    await expect(
      service.createAdminItem('tags', {
        slug: 'nestjs',
      }),
    ).rejects.toBe(unexpectedError);
  });

  it('updates an admin item', async () => {
    tagUpdate.mockResolvedValue({ id: 'tag-1', namePt: 'Nest' });

    const result = await service.updateAdminItem(
      'tags',
      '4c00be28-b0d7-410f-90f8-0d88a8d15d2d',
      {
        namePt: 'Nest',
      },
    );
    const [updateArgs] = tagUpdate.mock.calls[0] as [ContentUpdateArgs];

    expect(result).toEqual({ id: 'tag-1', namePt: 'Nest' });
    expect(updateArgs.where).toEqual({
      id: '4c00be28-b0d7-410f-90f8-0d88a8d15d2d',
    });
    expect(updateArgs.data).toEqual({ namePt: 'Nest' });
    expect(updateArgs.include).toBeDefined();
    expect(updateArgs.include).not.toBeNull();
    expect('technologies' in (updateArgs.include ?? {})).toBe(true);
  });

  it('maps missing items to not found exceptions on update', async () => {
    tagUpdate.mockRejectedValue(
      new PrismaClientKnownRequestError('missing', {
        code: 'P2025',
        clientVersion: '6.16.2',
      }),
    );

    await expect(
      service.updateAdminItem('tags', '4c00be28-b0d7-410f-90f8-0d88a8d15d2d', {
        namePt: 'Nest',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('deletes an admin item', async () => {
    tagDelete.mockResolvedValue({ id: 'tag-1' });

    const result = await service.deleteAdminItem(
      'tags',
      '4c00be28-b0d7-410f-90f8-0d88a8d15d2d',
    );
    const [deleteArgs] = tagDelete.mock.calls[0] as [ContentDeleteArgs];

    expect(result).toEqual({ id: 'tag-1' });
    expect(deleteArgs.where).toEqual({
      id: '4c00be28-b0d7-410f-90f8-0d88a8d15d2d',
    });
    expect(deleteArgs.include).toBeDefined();
    expect(deleteArgs.include).not.toBeNull();
    expect('technologies' in (deleteArgs.include ?? {})).toBe(true);
  });

  it('maps foreign key violations to conflict exceptions on delete', async () => {
    tagDelete.mockRejectedValue(
      new PrismaClientKnownRequestError('referenced', {
        code: 'P2003',
        clientVersion: '6.16.2',
      }),
    );

    await expect(
      service.deleteAdminItem('tags', '4c00be28-b0d7-410f-90f8-0d88a8d15d2d'),
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

    tagDelete.mockRejectedValue(unhandledPrismaError);

    await expect(
      service.deleteAdminItem('tags', '4c00be28-b0d7-410f-90f8-0d88a8d15d2d'),
    ).rejects.toBe(unhandledPrismaError);
  });
});
