import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from '../../../../prisma/prisma.service';
import { ContentResourceRegistryService } from '../content-resource-registry/content-resource-registry.service';
import { ContentMutationPayloadService } from '../content-mutation-payload/content-mutation-payload.service';
import type {
  ContentCreateArgs,
  ContentDelegate,
  ContentDeleteArgs,
  ContentResourceKey,
  ContentUpdateArgs,
} from '../../types/content.types';

@Injectable()
export class ContentAdminService {
  /* c8 ignore next 4 */
  constructor(
    private readonly prisma: PrismaService,
    private readonly contentResourceRegistryService: ContentResourceRegistryService,
    private readonly contentMutationPayloadService: ContentMutationPayloadService,
  ) {}

  async createAdminItem(
    resource: ContentResourceKey,
    payload: object,
  ): Promise<unknown> {
    const config = this.contentResourceRegistryService.getConfig(resource);
    const delegate = this.getDelegate(config.delegateName);
    const createArgs: ContentCreateArgs = {
      data: this.contentMutationPayloadService.buildCreateData(
        resource,
        payload,
      ),
      include: config.adminInclude,
    };

    try {
      return await delegate.create(createArgs);
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
    const delegate = this.getDelegate(config.delegateName);
    const updateArgs: ContentUpdateArgs = {
      where: { id },
      data: this.contentMutationPayloadService.buildUpdateData(
        resource,
        payload,
      ),
      include: config.adminInclude,
    };

    try {
      return await delegate.update(updateArgs);
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
    const delegate = this.getDelegate(config.delegateName);
    const deleteArgs: ContentDeleteArgs = {
      where: { id },
      include: config.adminInclude,
    };

    try {
      return await delegate.delete(deleteArgs);
    } catch (error: unknown) {
      this.rethrowMutationError(error, config.tag);
      throw error;
    }
  }

  private getDelegate(delegateName: string): ContentDelegate {
    return (this.prisma as unknown as Record<string, ContentDelegate>)[
      delegateName
    ];
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
}
