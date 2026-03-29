import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { ContentCollectionQueryRequest } from '../../contracts/shared/content-query.request';
import { ContentReadService } from '../content-read/content-read.service';
import type { PaginatedContentCollection } from '../../types/content.types';
import type {
  TechnologyContextGroupItem,
  TechnologyContextMutationRecord,
} from '../../types/technology-contexts.types';

@Injectable()
export class TechnologyContextsService {
  /* c8 ignore next 4 */
  constructor(
    private readonly prisma: PrismaService,
    private readonly contentReadService: ContentReadService,
  ) {}

  async getPublicCollection(
    query: ContentCollectionQueryRequest,
  ): Promise<PaginatedContentCollection> {
    const collection = await this.contentReadService.getPublicCollection(
      'technologies',
      query,
    );

    return {
      ...collection,
      data: collection.data.map((item) => this.toTechnologyContextGroup(item)),
    };
  }

  async getPublicItem(
    technologySlug: string,
  ): Promise<TechnologyContextGroupItem> {
    return this.toTechnologyContextGroup(
      await this.contentReadService.getPublicItem(
        'technologies',
        technologySlug,
      ),
    );
  }

  async create(payload: {
    technologyId: string;
    context: string;
    startedAt: string;
    endedAt?: string | null;
  }): Promise<TechnologyContextMutationRecord> {
    return (await this.prisma.technologyContext.create({
      data: {
        technology: {
          connect: {
            id: payload.technologyId,
          },
        },
        context: payload.context as never,
        startedAt: payload.startedAt,
        endedAt: payload.endedAt ?? null,
      },
      include: {
        technology: {
          select: {
            id: true,
            slug: true,
            name: true,
            category: true,
            level: true,
            frequency: true,
          },
        },
      },
    })) as TechnologyContextMutationRecord;
  }

  async update(
    id: string,
    payload: {
      technologyId?: string;
      context?: string;
      startedAt?: string;
      endedAt?: string | null;
    },
  ): Promise<TechnologyContextMutationRecord> {
    const data: Record<string, unknown> = {};

    if (payload.technologyId) {
      data.technology = {
        connect: {
          id: payload.technologyId,
        },
      };
    }

    if (payload.context) {
      data.context = payload.context;
    }

    if (payload.startedAt) {
      data.startedAt = payload.startedAt;
    }

    if ('endedAt' in payload) {
      data.endedAt = payload.endedAt ?? null;
    }

    return (await this.prisma.technologyContext.update({
      where: { id },
      data,
      include: {
        technology: {
          select: {
            id: true,
            slug: true,
            name: true,
            category: true,
            level: true,
            frequency: true,
          },
        },
      },
    })) as TechnologyContextMutationRecord;
  }

  async delete(id: string): Promise<TechnologyContextMutationRecord> {
    return (await this.prisma.technologyContext.delete({
      where: { id },
      include: {
        technology: {
          select: {
            id: true,
            slug: true,
            name: true,
            category: true,
            level: true,
            frequency: true,
          },
        },
      },
    })) as TechnologyContextMutationRecord;
  }

  private toTechnologyContextGroup(item: unknown): TechnologyContextGroupItem {
    if (!item || typeof item !== 'object') {
      throw new NotFoundException('Technology context group was not found.');
    }

    const technology = item as TechnologyContextGroupItem &
      Record<string, unknown>;
    const technologyId =
      typeof technology.technologyId === 'string'
        ? technology.technologyId
        : (technology.id as string);

    return {
      technologyId,
      slug: technology.slug,
      name: technology.name,
      category: technology.category,
      level: technology.level,
      frequency: technology.frequency,
      technologyContexts: technology.technologyContexts ?? [],
      experienceMetrics: technology.experienceMetrics,
    };
  }
}
