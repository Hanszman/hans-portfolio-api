import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../database/prisma.service';
import { ContentResourceRegistryService } from '../content-resource-registry/content-resource-registry.service';
import { ContentMutationPayloadService } from '../content-mutation-payload/content-mutation-payload.service';
import { TechnologyExperienceMetricsService } from '../technology-experience-metrics/technology-experience-metrics.service';
import type {
  ContentCreateArgs,
  ContentDelegate,
  ContentDeleteArgs,
  ContentResourceKey,
  ContentUpdateArgs,
} from '../../types/content.types';

@Injectable()
export class ContentAdminService {
  /* c8 ignore next 5 */
  constructor(
    private readonly prisma: PrismaService,
    private readonly contentResourceRegistryService: ContentResourceRegistryService,
    private readonly contentMutationPayloadService: ContentMutationPayloadService,
    private readonly technologyExperienceMetricsService: TechnologyExperienceMetricsService,
  ) {}

  async createAdminItem(
    resource: ContentResourceKey,
    payload: object,
  ): Promise<unknown> {
    const config = this.contentResourceRegistryService.getConfig(resource);
    const createArgs: ContentCreateArgs = {
      data: this.contentMutationPayloadService.buildCreateData(
        resource,
        payload,
      ),
      include: config.adminInclude,
    };

    try {
      return this.presentResourceItem(
        resource,
        await this.prisma.$transaction(async (transaction) =>
          this.createAndReorder(
            transaction,
            config.delegateName,
            createArgs,
            this.resolveRequestedSortOrder(payload),
          ),
        ),
      );
    } catch (error: unknown) {
      this.rethrowMutationError(error, config.tag);
      throw error;
    }
  }

  async updateAdminItem(
    resource: ContentResourceKey,
    id: string,
    payload: object,
  ): Promise<unknown> {
    const config = this.contentResourceRegistryService.getConfig(resource);
    const updateArgs: ContentUpdateArgs = {
      where: { id },
      data: this.contentMutationPayloadService.buildUpdateData(
        resource,
        payload,
      ),
      include: config.adminInclude,
    };

    try {
      return this.presentResourceItem(
        resource,
        await this.prisma.$transaction(async (transaction) =>
          this.updateAndReorder(
            transaction,
            config.delegateName,
            updateArgs,
            this.resolveRequestedSortOrder(payload),
          ),
        ),
      );
    } catch (error: unknown) {
      this.rethrowMutationError(error, config.tag);
      throw error;
    }
  }

  async deleteAdminItem(
    resource: ContentResourceKey,
    id: string,
  ): Promise<unknown> {
    const config = this.contentResourceRegistryService.getConfig(resource);
    const deleteArgs: ContentDeleteArgs = {
      where: { id },
      include: config.adminInclude,
    };

    try {
      return this.presentResourceItem(
        resource,
        await this.prisma.$transaction(async (transaction) =>
          this.deleteAndReorder(transaction, config.delegateName, deleteArgs),
        ),
      );
    } catch (error: unknown) {
      this.rethrowMutationError(error, config.tag);
      throw error;
    }
  }

  private getDelegate(
    delegateName: string,
    client: Prisma.TransactionClient,
  ): ContentDelegate {
    return (client as unknown as Record<string, ContentDelegate>)[delegateName];
  }

  private async createAndReorder(
    transaction: Prisma.TransactionClient,
    delegateName: string,
    args: ContentCreateArgs,
    requestedSortOrder: number | undefined,
  ): Promise<Record<string, unknown>> {
    const delegate = this.getDelegate(delegateName, transaction);
    const orderedIds = await this.getOrderedIds(delegate);
    const targetIndex = this.clampSortOrder(
      requestedSortOrder ?? orderedIds.length,
      orderedIds.length,
    );
    const created = await delegate.create({
      ...args,
      data: { ...args.data, sortOrder: orderedIds.length },
    });
    orderedIds.splice(targetIndex, 0, String(created.id));
    await this.persistSortOrder(delegate, orderedIds);

    return (
      (await delegate.findUnique({
        where: { id: created.id },
        include: args.include,
      })) ?? created
    );
  }

  private async updateAndReorder(
    transaction: Prisma.TransactionClient,
    delegateName: string,
    args: ContentUpdateArgs,
    requestedSortOrder: number | undefined,
  ): Promise<Record<string, unknown>> {
    const delegate = this.getDelegate(delegateName, transaction);
    const orderedIds = await this.getOrderedIds(delegate);
    const id = String(args.where.id);
    const currentIndex = orderedIds.indexOf(id);
    const data = { ...args.data };
    delete data.sortOrder;
    await delegate.update({ ...args, data });

    if (currentIndex >= 0) {
      orderedIds.splice(currentIndex, 1);
      orderedIds.splice(
        this.clampSortOrder(
          requestedSortOrder ?? currentIndex,
          orderedIds.length,
        ),
        0,
        id,
      );
      await this.persistSortOrder(delegate, orderedIds);
    }

    return (
      (await delegate.findUnique({
        where: args.where,
        include: args.include,
      })) ?? { id }
    );
  }

  private async deleteAndReorder(
    transaction: Prisma.TransactionClient,
    delegateName: string,
    args: ContentDeleteArgs,
  ): Promise<Record<string, unknown>> {
    const delegate = this.getDelegate(delegateName, transaction);
    const deleted = await delegate.delete(args);
    const orderedIds = (await this.getOrderedIds(delegate)).filter(
      (id) => id !== String(args.where.id),
    );
    await this.persistSortOrder(delegate, orderedIds);

    return deleted;
  }

  private async getOrderedIds(delegate: ContentDelegate): Promise<string[]> {
    const items = await delegate.findMany({
      select: { id: true },
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    });

    return (items as Array<{ id: unknown }>).map((item) => String(item.id));
  }

  private async persistSortOrder(
    delegate: ContentDelegate,
    orderedIds: string[],
  ): Promise<void> {
    await Promise.all(
      orderedIds.map((id, sortOrder) =>
        delegate.update({ where: { id }, data: { sortOrder } }),
      ),
    );
  }

  private resolveRequestedSortOrder(payload: object): number | undefined {
    const value = (payload as { sortOrder?: unknown }).sortOrder;

    return typeof value === 'number' && Number.isFinite(value)
      ? Math.trunc(value)
      : undefined;
  }

  private clampSortOrder(value: number, maximum: number): number {
    return Math.min(Math.max(value, 0), maximum);
  }

  private rethrowMutationError(error: unknown, tag: string): never | void {
    if (!(error instanceof PrismaClientKnownRequestError)) {
      return;
    }

    if (error.code === 'P2002') {
      throw new ConflictException(`${tag} already exists.`);
    }

    if (error.code === 'P2003') {
      throw new ConflictException(
        `${tag} cannot be deleted because it is still referenced.`,
      );
    }

    if (error.code === 'P2025') {
      throw new NotFoundException(`${tag} item was not found.`);
    }
  }

  private presentResourceItem(
    resource: ContentResourceKey,
    item: unknown,
  ): unknown {
    if (resource !== 'technologies') {
      return item;
    }

    return this.technologyExperienceMetricsService.enrichTechnologyItem(item);
  }
}
