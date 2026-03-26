import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { ContentResourceRegistryService } from '../content-resource-registry/content-resource-registry.service';
import type {
  ContentDelegate,
  ContentFindManyArgs,
  ContentResourceKey,
} from '../../types/content.types';

@Injectable()
export class ContentReadService {
  /* c8 ignore next 4 */
  constructor(
    private readonly prisma: PrismaService,
    private readonly contentResourceRegistryService: ContentResourceRegistryService,
  ) {}

  async getPublicCollection(resource: ContentResourceKey): Promise<unknown[]> {
    const config = this.contentResourceRegistryService.getConfig(resource);
    const delegate = this.getDelegate(config.delegateName);
    const queryArgs: ContentFindManyArgs = {
      orderBy: config.defaultOrderBy,
      include: config.publicInclude,
    };

    if (config.hasPublishedFlag) {
      queryArgs.where = { isPublished: true };
    }

    return delegate.findMany(queryArgs);
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
