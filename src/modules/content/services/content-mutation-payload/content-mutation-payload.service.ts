import { Injectable } from '@nestjs/common';
import type { ContentResourceKey } from '../../types/content.types';
import type {
  CustomerMutationPayload,
  ExperienceMutationPayload,
  FormationMutationPayload,
  ImageAssetMutationPayload,
  JobMutationPayload,
  LinkMutationPayload,
  MutationMode,
  ProjectMutationPayload,
  SpokenLanguageMutationPayload,
  TagMutationPayload,
  TechnologyContextMutationPayload,
  TechnologyMutationPayload,
} from '../../types/content-mutation-payload.types';

@Injectable()
export class ContentMutationPayloadService {
  buildCreateData(
    resource: ContentResourceKey,
    payload: object,
  ): Record<string, unknown> {
    return this.buildMutationData(resource, payload, 'create');
  }

  buildUpdateData(
    resource: ContentResourceKey,
    payload: object,
  ): Record<string, unknown> {
    return this.buildMutationData(resource, payload, 'update');
  }

  private buildMutationData(
    resource: ContentResourceKey,
    payload: object,
    mode: MutationMode,
  ): Record<string, unknown> {
    switch (resource) {
      case 'projects':
        return this.buildProjectData(payload, mode);
      case 'experiences':
        return this.buildExperienceData(payload, mode);
      case 'technologies':
        return this.buildTechnologyData(payload, mode);
      case 'formations':
        return this.buildFormationData(payload, mode);
      case 'spokenLanguages':
        return this.buildSpokenLanguageData(payload, mode);
      case 'customers':
        return this.buildCustomerData(payload, mode);
      case 'jobs':
        return this.buildJobData(payload, mode);
      case 'links':
        return this.buildLinkData(payload, mode);
      case 'imageAssets':
        return this.buildImageAssetData(payload, mode);
      case 'tags':
        return this.buildTagData(payload, mode);
      case 'portfolioSettings':
        return payload as Record<string, unknown>;
    }
  }

  private buildProjectData(
    payload: object,
    mode: MutationMode,
  ): Record<string, unknown> {
    const {
      technologyRelations,
      experienceIds,
      tagIds,
      linkIds,
      imageAssetIds,
      ...base
    } = payload as ProjectMutationPayload;

    return {
      ...base,
      ...this.buildTechnologyRelationMutation(
        'technologies',
        technologyRelations,
        'technology',
        mode,
      ),
      ...this.buildOrderedIdRelation(
        'experiences',
        experienceIds,
        'experience',
        mode,
      ),
      ...this.buildIdRelation('tags', tagIds, 'tag', mode),
      ...this.buildOrderedIdRelation('links', linkIds, 'link', mode),
      ...this.buildOrderedIdRelation(
        'imageAssets',
        imageAssetIds,
        'imageAsset',
        mode,
      ),
    };
  }

  private buildExperienceData(
    payload: object,
    mode: MutationMode,
  ): Record<string, unknown> {
    const {
      technologyRelations,
      projectIds,
      customerIds,
      jobIds,
      linkIds,
      imageAssetIds,
      ...base
    } = payload as ExperienceMutationPayload;

    return {
      ...base,
      ...this.buildTechnologyRelationMutation(
        'technologies',
        technologyRelations,
        'technology',
        mode,
      ),
      ...this.buildOrderedIdRelation('projects', projectIds, 'project', mode),
      ...this.buildOrderedIdRelation(
        'customers',
        customerIds,
        'customer',
        mode,
      ),
      ...this.buildOrderedIdRelation('jobs', jobIds, 'job', mode),
      ...this.buildOrderedIdRelation('links', linkIds, 'link', mode),
      ...this.buildOrderedIdRelation(
        'imageAssets',
        imageAssetIds,
        'imageAsset',
        mode,
      ),
    };
  }

  private buildTechnologyData(
    payload: object,
    mode: MutationMode,
  ): Record<string, unknown> {
    const {
      projectRelations,
      experienceRelations,
      formationRelations,
      technologyContexts,
      tagIds,
      imageAssetIds,
      ...base
    } = payload as TechnologyMutationPayload;

    return {
      ...base,
      ...this.buildTechnologyRelationMutation(
        'projectUsages',
        projectRelations,
        'project',
        mode,
      ),
      ...this.buildTechnologyRelationMutation(
        'experienceUses',
        experienceRelations,
        'experience',
        mode,
      ),
      ...this.buildTechnologyRelationMutation(
        'formationUses',
        formationRelations,
        'formation',
        mode,
      ),
      ...this.buildTechnologyContextMutation(technologyContexts, mode),
      ...this.buildIdRelation('tags', tagIds, 'tag', mode),
      ...this.buildOrderedIdRelation(
        'imageAssets',
        imageAssetIds,
        'imageAsset',
        mode,
      ),
    };
  }

  private buildFormationData(
    payload: object,
    mode: MutationMode,
  ): Record<string, unknown> {
    const { technologyRelations, linkIds, imageAssetIds, ...base } =
      payload as FormationMutationPayload;

    return {
      ...base,
      ...this.buildTechnologyRelationMutation(
        'technologies',
        technologyRelations,
        'technology',
        mode,
      ),
      ...this.buildOrderedIdRelation('links', linkIds, 'link', mode),
      ...this.buildOrderedIdRelation(
        'imageAssets',
        imageAssetIds,
        'imageAsset',
        mode,
      ),
    };
  }

  private buildSpokenLanguageData(
    payload: object,
    mode: MutationMode,
  ): Record<string, unknown> {
    const { imageAssetIds, ...base } = payload as SpokenLanguageMutationPayload;

    return {
      ...base,
      ...this.buildOrderedIdRelation(
        'imageAssets',
        imageAssetIds,
        'imageAsset',
        mode,
      ),
    };
  }

  private buildCustomerData(
    payload: object,
    mode: MutationMode,
  ): Record<string, unknown> {
    const { experienceIds, imageAssetIds, ...base } =
      payload as CustomerMutationPayload;

    return {
      ...base,
      ...this.buildOrderedIdRelation(
        'experiences',
        experienceIds,
        'experience',
        mode,
      ),
      ...this.buildOrderedIdRelation(
        'imageAssets',
        imageAssetIds,
        'imageAsset',
        mode,
      ),
    };
  }

  private buildJobData(
    payload: object,
    mode: MutationMode,
  ): Record<string, unknown> {
    const { experienceIds, imageAssetIds, ...base } =
      payload as JobMutationPayload;

    return {
      ...base,
      ...this.buildOrderedIdRelation(
        'experiences',
        experienceIds,
        'experience',
        mode,
      ),
      ...this.buildOrderedIdRelation(
        'imageAssets',
        imageAssetIds,
        'imageAsset',
        mode,
      ),
    };
  }

  private buildLinkData(
    payload: object,
    mode: MutationMode,
  ): Record<string, unknown> {
    const { projectIds, experienceIds, formationIds, ...base } =
      payload as LinkMutationPayload;

    return {
      ...base,
      ...this.buildOrderedIdRelation('projects', projectIds, 'project', mode),
      ...this.buildOrderedIdRelation(
        'experiences',
        experienceIds,
        'experience',
        mode,
      ),
      ...this.buildOrderedIdRelation(
        'formations',
        formationIds,
        'formation',
        mode,
      ),
    };
  }

  private buildImageAssetData(
    payload: object,
    mode: MutationMode,
  ): Record<string, unknown> {
    const {
      projectIds,
      experienceIds,
      formationIds,
      technologyIds,
      spokenLanguageIds,
      customerIds,
      jobIds,
      ...base
    } = payload as ImageAssetMutationPayload;

    return {
      ...base,
      ...this.buildOrderedIdRelation('projects', projectIds, 'project', mode),
      ...this.buildOrderedIdRelation(
        'experiences',
        experienceIds,
        'experience',
        mode,
      ),
      ...this.buildOrderedIdRelation(
        'formations',
        formationIds,
        'formation',
        mode,
      ),
      ...this.buildOrderedIdRelation(
        'technologies',
        technologyIds,
        'technology',
        mode,
      ),
      ...this.buildOrderedIdRelation(
        'spokenLanguages',
        spokenLanguageIds,
        'spokenLanguage',
        mode,
      ),
      ...this.buildOrderedIdRelation(
        'customers',
        customerIds,
        'customer',
        mode,
      ),
      ...this.buildOrderedIdRelation('jobs', jobIds, 'job', mode),
    };
  }

  private buildTagData(
    payload: object,
    mode: MutationMode,
  ): Record<string, unknown> {
    const { projectIds, technologyIds, ...base } =
      payload as TagMutationPayload;

    return {
      ...base,
      ...this.buildIdRelation('projects', projectIds, 'project', mode),
      ...this.buildIdRelation(
        'technologies',
        technologyIds,
        'technology',
        mode,
      ),
    };
  }

  private buildTechnologyRelationMutation<
    TRelation extends Record<string, unknown>,
  >(
    relationField: string,
    relations: TRelation[] | undefined,
    connectField: string,
    mode: MutationMode,
  ): Record<string, unknown> {
    if (relations === undefined) {
      return {};
    }

    const create = relations.map((relation) => {
      const idKey = `${connectField}Id`;

      return {
        [connectField]: {
          connect: {
            id: relation[idKey] as string,
          },
        },
      };
    });

    return {
      [relationField]:
        mode === 'create'
          ? { create }
          : {
              deleteMany: {},
              create,
            },
    };
  }

  private buildTechnologyContextMutation(
    technologyContexts: TechnologyContextMutationPayload[] | undefined,
    mode: MutationMode,
  ): Record<string, unknown> {
    if (technologyContexts === undefined) {
      return {};
    }

    const create = technologyContexts.map((technologyContext) => ({
      context: technologyContext.context,
      startedAt: technologyContext.startedAt,
      endedAt: technologyContext.endedAt,
    }));

    return {
      technologyContexts:
        mode === 'create'
          ? { create }
          : {
              deleteMany: {},
              create,
            },
    };
  }

  private buildOrderedIdRelation(
    relationField: string,
    ids: string[] | undefined,
    connectField: string,
    mode: MutationMode,
  ): Record<string, unknown> {
    if (ids === undefined) {
      return {};
    }

    const create = ids.map((id, index) => ({
      sortOrder: index,
      [connectField]: {
        connect: { id },
      },
    }));

    return {
      [relationField]:
        mode === 'create'
          ? { create }
          : {
              deleteMany: {},
              create,
            },
    };
  }

  private buildIdRelation(
    relationField: string,
    ids: string[] | undefined,
    connectField: string,
    mode: MutationMode,
  ): Record<string, unknown> {
    if (ids === undefined) {
      return {};
    }

    const create = ids.map((id) => ({
      [connectField]: {
        connect: { id },
      },
    }));

    return {
      [relationField]:
        mode === 'create'
          ? { create }
          : {
              deleteMany: {},
              create,
            },
    };
  }
}
