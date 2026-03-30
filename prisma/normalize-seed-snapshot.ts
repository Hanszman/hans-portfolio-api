import { randomUUID } from 'node:crypto';
import { LinkType, type Prisma } from '@prisma/client';
import type {
  LegacyProjectSnapshotRecord,
  LegacyTechnologySnapshotRecord,
  PortfolioSeedSnapshot,
  RawPortfolioSeedSnapshot,
} from './seed-snapshot.types';

export function normalizePortfolioSeedSnapshot(
  rawSnapshot: RawPortfolioSeedSnapshot,
): PortfolioSeedSnapshot {
  const links = [...rawSnapshot.links];
  const projectLinks = [...rawSnapshot.projectLinks];
  const technologyLinks = [...(rawSnapshot.technologyLinks ?? [])];
  const formationLinks = [...rawSnapshot.formationLinks];
  const experienceLinks = [...rawSnapshot.experienceLinks];
  const formationImageAssets = [...rawSnapshot.formationImageAssets];
  const experienceImageAssets = [...rawSnapshot.experienceImageAssets];
  const projectImageAssets = [...rawSnapshot.projectImageAssets];
  const technologyImageAssets = [...rawSnapshot.technologyImageAssets];
  const spokenLanguageImageAssets = [...rawSnapshot.spokenLanguageImageAssets];
  const customerImageAssets = [...rawSnapshot.customerImageAssets];
  const jobImageAssets = [...rawSnapshot.jobImageAssets];
  const imageAssetIdByPath = new Map(
    rawSnapshot.imageAssets.flatMap((imageAsset) => {
      const imageAssetId = ensureStringId(imageAsset.id);

      return imageAssetId ? [[imageAsset.filePath, imageAssetId] as const] : [];
    }),
  );
  const projectLinkKeys = new Set(
    projectLinks.map((link) => `${link.projectId}:${link.linkId}`),
  );
  const technologyLinkKeys = new Set(
    technologyLinks.map((link) => `${link.technologyId}:${link.linkId}`),
  );
  const projectImageKeys = new Set(
    projectImageAssets.map(
      (entry) => `${entry.projectId}:${entry.imageAssetId}`,
    ),
  );
  const experienceImageKeys = new Set(
    experienceImageAssets.map(
      (entry) => `${entry.experienceId}:${entry.imageAssetId}`,
    ),
  );
  const formationImageKeys = new Set(
    formationImageAssets.map(
      (entry) => `${entry.formationId}:${entry.imageAssetId}`,
    ),
  );
  const technologyImageKeys = new Set(
    technologyImageAssets.map(
      (entry) => `${entry.technologyId}:${entry.imageAssetId}`,
    ),
  );
  const spokenLanguageImageKeys = new Set(
    spokenLanguageImageAssets.map(
      (entry) => `${entry.spokenLanguageId}:${entry.imageAssetId}`,
    ),
  );
  const customerImageKeys = new Set(
    customerImageAssets.map(
      (entry) => `${entry.customerId}:${entry.imageAssetId}`,
    ),
  );
  const jobImageKeys = new Set(
    jobImageAssets.map((entry) => `${entry.jobId}:${entry.imageAssetId}`),
  );
  const projectLinkOrderByProjectId = buildSortOrderMap(
    projectLinks.map((entry) => ({
      ownerId: entry.projectId,
      sortOrder: entry.sortOrder ?? 0,
    })),
  );
  const technologyLinkOrderByTechnologyId = buildSortOrderMap(
    technologyLinks.map((entry) => ({
      ownerId: entry.technologyId,
      sortOrder: entry.sortOrder ?? 0,
    })),
  );
  const linkIdByCompositeKey = new Map(
    links.flatMap((link) => {
      const linkId = ensureStringId(link.id);

      return linkId ? [[`${link.type}:${link.url}`, linkId] as const] : [];
    }),
  );

  const projects = rawSnapshot.projects.map((project) => {
    const projectId = ensureStringId(project.id);

    attachProjectLinks(
      { ...project, id: projectId },
      links,
      projectLinks,
      projectLinkKeys,
      projectLinkOrderByProjectId,
      linkIdByCompositeKey,
    );
    attachImageRelation(
      projectId,
      project.icon,
      imageAssetIdByPath,
      projectImageKeys,
      projectImageAssets,
      'projectId',
    );

    return omitLegacyKeys(project, [
      'repositoryUrl',
      'deployUrl',
      'docsUrl',
      'npmUrl',
      'icon',
    ]);
  });

  const experiences = rawSnapshot.experiences.map((experience) => {
    const experienceId = ensureStringId(experience.id);

    attachImageRelation(
      experienceId,
      experience.icon,
      imageAssetIdByPath,
      experienceImageKeys,
      experienceImageAssets,
      'experienceId',
    );
    return omitLegacyKeys(experience, ['icon']);
  });

  const formations = rawSnapshot.formations.map((formation) => {
    const formationId = ensureStringId(formation.id);

    attachImageRelation(
      formationId,
      formation.icon,
      imageAssetIdByPath,
      formationImageKeys,
      formationImageAssets,
      'formationId',
    );
    return omitLegacyKeys(formation, ['icon']);
  });

  const technologies = rawSnapshot.technologies.map((technology) => {
    const technologyId = ensureStringId(technology.id);

    attachTechnologyLinks(
      { ...technology, id: technologyId },
      links,
      technologyLinks,
      technologyLinkKeys,
      technologyLinkOrderByTechnologyId,
      linkIdByCompositeKey,
    );
    attachImageRelation(
      technologyId,
      technology.icon,
      imageAssetIdByPath,
      technologyImageKeys,
      technologyImageAssets,
      'technologyId',
    );
    return omitLegacyKeys(technology, ['officialUrl', 'icon']);
  });

  const spokenLanguages = rawSnapshot.spokenLanguages.map((spokenLanguage) => {
    const spokenLanguageId = ensureStringId(spokenLanguage.id);

    attachImageRelation(
      spokenLanguageId,
      spokenLanguage.icon,
      imageAssetIdByPath,
      spokenLanguageImageKeys,
      spokenLanguageImageAssets,
      'spokenLanguageId',
    );
    return omitLegacyKeys(spokenLanguage, ['icon']);
  });

  const customers = rawSnapshot.customers.map((customer) => {
    const customerId = ensureStringId(customer.id);

    attachImageRelation(
      customerId,
      customer.icon,
      imageAssetIdByPath,
      customerImageKeys,
      customerImageAssets,
      'customerId',
    );
    return omitLegacyKeys(customer, ['icon']);
  });

  const jobs = rawSnapshot.jobs.map((job) => {
    const jobId = ensureStringId(job.id);

    attachImageRelation(
      jobId,
      job.icon,
      imageAssetIdByPath,
      jobImageKeys,
      jobImageAssets,
      'jobId',
    );
    return omitLegacyKeys(job, ['icon']);
  });

  return {
    ...rawSnapshot,
    projects,
    experiences,
    formations,
    technologies,
    spokenLanguages,
    customers,
    jobs,
    links,
    projectLinks,
    technologyLinks,
    formationLinks,
    experienceLinks,
    formationImageAssets,
    experienceImageAssets,
    projectImageAssets,
    technologyImageAssets,
    spokenLanguageImageAssets,
    customerImageAssets,
    jobImageAssets,
  };
}

function attachProjectLinks(
  project: LegacyProjectSnapshotRecord & { id: string },
  links: Prisma.LinkCreateManyInput[],
  projectLinks: Prisma.ProjectLinkCreateManyInput[],
  projectLinkKeys: Set<string>,
  projectLinkOrderByProjectId: Map<string, number>,
  linkIdByCompositeKey: Map<string, string>,
): void {
  const projectLinkDefinitions = [
    {
      url: project.repositoryUrl,
      type: resolveRepositoryLinkType(project.repositoryUrl),
      labelPt: 'Repositorio',
      labelEn: 'Repository',
    },
    {
      url: project.deployUrl,
      type: LinkType.DEPLOY,
      labelPt: 'Aplicacao',
      labelEn: 'Live application',
    },
    {
      url: project.docsUrl,
      type: LinkType.DOCS,
      labelPt: 'Documentacao',
      labelEn: 'Documentation',
    },
    {
      url: project.npmUrl,
      type: LinkType.NPM,
      labelPt: 'Pacote NPM',
      labelEn: 'NPM package',
    },
  ];

  for (const definition of projectLinkDefinitions) {
    const url = normalizeOptionalString(definition.url);

    if (!url) {
      continue;
    }

    const linkId = ensureLinkRecord(
      links,
      linkIdByCompositeKey,
      url,
      definition.type,
      definition.labelPt,
      definition.labelEn,
    );
    const relationKey = `${project.id}:${linkId}`;

    if (projectLinkKeys.has(relationKey)) {
      continue;
    }

    projectLinks.push({
      projectId: project.id,
      linkId,
      sortOrder: nextSortOrder(projectLinkOrderByProjectId, project.id),
    });
    projectLinkKeys.add(relationKey);
  }
}

function attachTechnologyLinks(
  technology: LegacyTechnologySnapshotRecord & { id: string },
  links: Prisma.LinkCreateManyInput[],
  technologyLinks: Prisma.TechnologyLinkCreateManyInput[],
  technologyLinkKeys: Set<string>,
  technologyLinkOrderByTechnologyId: Map<string, number>,
  linkIdByCompositeKey: Map<string, string>,
): void {
  const officialUrl = normalizeOptionalString(technology.officialUrl);

  if (!officialUrl) {
    return;
  }

  const linkId = ensureLinkRecord(
    links,
    linkIdByCompositeKey,
    officialUrl,
    LinkType.WEBSITE,
    'Site oficial',
    'Official website',
  );
  const relationKey = `${technology.id}:${linkId}`;

  if (technologyLinkKeys.has(relationKey)) {
    return;
  }

  technologyLinks.push({
    technologyId: technology.id,
    linkId,
    sortOrder: nextSortOrder(technologyLinkOrderByTechnologyId, technology.id),
  });
  technologyLinkKeys.add(relationKey);
}

function attachImageRelation<
  TForeignKey extends
    | 'projectId'
    | 'experienceId'
    | 'formationId'
    | 'technologyId'
    | 'spokenLanguageId'
    | 'customerId'
    | 'jobId',
>(
  ownerId: string,
  filePath: string | null | undefined,
  imageAssetIdByPath: Map<string, string>,
  relationKeys: Set<string>,
  relations: Array<
    Record<TForeignKey | 'imageAssetId', string> & {
      sortOrder?: number;
    }
  >,
  foreignKey: TForeignKey,
): void {
  const normalizedFilePath = normalizeOptionalString(filePath);

  if (!normalizedFilePath) {
    return;
  }

  const imageAssetId = imageAssetIdByPath.get(normalizedFilePath);

  if (!imageAssetId) {
    return;
  }

  const relationKey = `${ownerId}:${imageAssetId}`;

  if (relationKeys.has(relationKey)) {
    return;
  }

  relations.push({
    [foreignKey]: ownerId,
    imageAssetId,
    sortOrder: 0,
  } as Record<TForeignKey | 'imageAssetId', string> & {
    sortOrder?: number;
  });
  relationKeys.add(relationKey);
}

function ensureLinkRecord(
  links: Prisma.LinkCreateManyInput[],
  linkIdByCompositeKey: Map<string, string>,
  url: string,
  type: LinkType,
  labelPt: string,
  labelEn: string,
): string {
  const compositeKey = `${type}:${url}`;
  const existingLinkId = linkIdByCompositeKey.get(compositeKey);

  if (existingLinkId) {
    return existingLinkId;
  }

  const linkId = randomUUID();

  links.push({
    id: linkId,
    url,
    labelPt,
    labelEn,
    descriptionPt: null,
    descriptionEn: null,
    type,
    sortOrder: 0,
    isPublished: true,
  });
  linkIdByCompositeKey.set(compositeKey, linkId);

  return linkId;
}

function buildSortOrderMap(
  entries: Array<{ ownerId: string; sortOrder: number }>,
): Map<string, number> {
  const sortOrderMap = new Map<string, number>();

  for (const entry of entries) {
    const currentMax = sortOrderMap.get(entry.ownerId) ?? -1;
    sortOrderMap.set(entry.ownerId, Math.max(currentMax, entry.sortOrder));
  }

  return sortOrderMap;
}

function nextSortOrder(
  sortOrderMap: Map<string, number>,
  ownerId: string,
): number {
  const nextOrder = (sortOrderMap.get(ownerId) ?? -1) + 1;
  sortOrderMap.set(ownerId, nextOrder);
  return nextOrder;
}

function resolveRepositoryLinkType(url: string | null | undefined): LinkType {
  return normalizeOptionalString(url)?.includes('github.com')
    ? LinkType.GITHUB
    : LinkType.WEBSITE;
}

function normalizeOptionalString(
  value: string | null | undefined,
): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const normalizedValue = value.trim();
  return normalizedValue.length > 0 ? normalizedValue : null;
}

function ensureStringId(value: string | undefined): string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error('Seed snapshot entities must include stable string ids.');
  }

  return value;
}

function omitLegacyKeys<
  TInput extends Record<string, unknown>,
  TKey extends keyof TInput,
>(record: TInput, keys: TKey[]): Omit<TInput, TKey> {
  const normalizedRecord = { ...record };

  for (const key of keys) {
    delete normalizedRecord[key];
  }

  return normalizedRecord as Omit<TInput, TKey>;
}
