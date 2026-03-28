import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { ContentCollectionQueryRequest } from '../../contracts/shared/content-query.request';
import { ContentResourceRegistryService } from '../content-resource-registry/content-resource-registry.service';
import type {
  ContentDelegate,
  ContentFindManyArgs,
  PaginatedContentCollection,
  ContentResourceKey,
} from '../../types/content.types';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 12;
const MAX_PAGE_SIZE = 100;

@Injectable()
export class ContentReadService {
  /* c8 ignore next 4 */
  constructor(
    private readonly prisma: PrismaService,
    private readonly contentResourceRegistryService: ContentResourceRegistryService,
  ) {}

  async getPublicCollection(
    resource: ContentResourceKey,
    query: ContentCollectionQueryRequest,
  ): Promise<PaginatedContentCollection> {
    const config = this.contentResourceRegistryService.getConfig(resource);
    const delegate = this.getDelegate(config.delegateName);
    const page = Math.max(DEFAULT_PAGE, query.page ?? DEFAULT_PAGE);
    const pageSize = Math.min(
      MAX_PAGE_SIZE,
      Math.max(1, query.pageSize ?? DEFAULT_PAGE_SIZE),
    );
    const queryArgs: ContentFindManyArgs = {
      orderBy: config.defaultOrderBy,
      include: config.publicInclude,
      skip: (page - 1) * pageSize,
      take: pageSize,
    };

    if (config.hasPublishedFlag) {
      queryArgs.where = { isPublished: true };
    }

    const [data, totalItems] = await Promise.all([
      delegate.findMany(queryArgs),
      delegate.count({
        where: queryArgs.where,
      }),
    ]);
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

    return {
      data,
      pagination: {
        page,
        pageSize,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async getPublicItem(
    resource: ContentResourceKey,
    lookupValue: string,
  ): Promise<unknown> {
    const config = this.contentResourceRegistryService.getConfig(resource);
    const delegate = this.getDelegate(config.delegateName);
    const where: Record<string, unknown> = {
      [config.publicLookupField]: lookupValue,
    };

    if (config.hasPublishedFlag) {
      where.isPublished = true;
    }

    const item = await delegate.findFirst({
      where,
      include: config.publicInclude,
    });

    if (!item) {
      throw new NotFoundException(
        `Public ${config.tag.toLowerCase()} item not found.`,
      );
    }

    return item;
  }

  private getDelegate(delegateName: string): ContentDelegate {
    return (this.prisma as unknown as Record<string, ContentDelegate>)[
      delegateName
    ];
  }
}
