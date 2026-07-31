import { Injectable } from '@nestjs/common';
import { TagType } from '@prisma/client';
import { PrismaService } from '../../../../prisma/prisma.service';
import type {
  DashboardCustomerHighlightRecord,
  DashboardDistributionEntry,
  DashboardExperienceHighlightRecord,
  DashboardFormationHighlightRecord,
  DashboardHighlightItem,
  DashboardJobHighlightRecord,
  DashboardProjectContextRecord,
  DashboardProjectHighlightRecord,
  DashboardSpokenLanguageHighlightRecord,
  DashboardStackRecord,
  DashboardTechnologyHighlightRecord,
  DashboardTechnologyRecord,
  DashboardTechnologyUsageRecord,
  DashboardTimelineExperienceRecord,
  DashboardTopTechnologyEntry,
} from '../../types/dashboard.types';
import type {
  DashboardHighlightsResponse,
  DashboardOverviewResponse,
  DashboardProfessionalTimelineResponse,
  DashboardProjectContextsResponse,
  DashboardStackDistributionResponse,
  DashboardTechnologyUsageResponse,
} from '../../contracts/dashboard/dashboard.response';

@Injectable()
export class DashboardService {
  /* c8 ignore next */
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardOverview(): Promise<DashboardOverviewResponse> {
    const [
      stackDistribution,
      projectContexts,
      technologyUsage,
      professionalTimeline,
      highlights,
      summary,
    ] = await Promise.all([
      this.getStackDistribution(),
      this.getProjectContexts(),
      this.getTechnologyUsage(),
      this.getProfessionalTimeline(),
      this.getHighlights(),
      this.getSummaryCounters(),
    ]);

    return {
      generatedAtUtc: new Date().toISOString(),
      summary,
      stackDistribution,
      projectContexts,
      technologyUsage,
      professionalTimeline,
      highlights,
    };
  }

  async getStackDistribution(): Promise<DashboardStackDistributionResponse> {
    const stacks = (await this.prisma.tag.findMany({
      where: {
        type: TagType.STACK,
      },
      orderBy: [{ sortOrder: 'asc' }, { slug: 'asc' }],
      include: {
        projects: {
          select: {
            projectId: true,
          },
        },
        technologies: {
          select: {
            technologyId: true,
          },
        },
      },
    })) as DashboardStackRecord[];

    return {
      generatedAtUtc: new Date().toISOString(),
      stacks: stacks.map((stack) => ({
        slug: stack.slug,
        namePt: stack.namePt,
        nameEn: stack.nameEn,
        nameEs: stack.nameEs,
        projectCount: this.countUniqueIds(stack.projects, 'projectId'),
        technologyCount: this.countUniqueIds(
          stack.technologies,
          'technologyId',
        ),
      })),
    };
  }

  async getProjectContexts(): Promise<DashboardProjectContextsResponse> {
    const projects = (await this.prisma.project.findMany({
      select: {
        id: true,
        context: true,
        environment: true,
        featured: true,
        highlight: true,
      },
    })) as DashboardProjectContextRecord[];

    return {
      generatedAtUtc: new Date().toISOString(),
      totalProjects: projects.length,
      featuredProjects: projects.filter((project) => project.featured).length,
      highlightedProjects: projects.filter((project) => project.highlight)
        .length,
      contexts: this.buildDistribution(
        projects.map((project) => project.context),
      ),
      environments: this.buildDistribution(
        projects.map((project) => project.environment),
      ),
    };
  }

  async getTechnologyUsage(): Promise<DashboardTechnologyUsageResponse> {
    const [
      projectUsageRows,
      experienceUsageRows,
      formationUsageRows,
      technologies,
    ] = await Promise.all([
      this.prisma.projectTechnology.findMany({
        select: {
          technologyId: true,
        },
      }),
      this.prisma.experienceTechnology.findMany({
        select: {
          technologyId: true,
        },
      }),
      this.prisma.formationTechnology.findMany({
        select: {
          technologyId: true,
        },
      }),
      this.prisma.technology.findMany({
        select: {
          id: true,
          slug: true,
          name: true,
          category: true,
          level: true,
          frequency: true,
          technologyContexts: {
            select: {
              context: true,
            },
          },
        },
      }),
    ]);
    const normalizedTechnologies =
      (technologies as DashboardTechnologyRecord[] | undefined) ?? [];
    const technologyMap = new Map(
      normalizedTechnologies.map((technology) => [technology.id, technology]),
    );
    const normalizedRows = [
      ...(projectUsageRows as Array<{ technologyId: string }>).map((row) => ({
        technologyId: row.technologyId,
        technology: technologyMap.get(row.technologyId),
        source: 'project' as const,
      })),
      ...(experienceUsageRows as Array<{ technologyId: string }>).map(
        (row) => ({
          technologyId: row.technologyId,
          technology: technologyMap.get(row.technologyId),
          source: 'experience' as const,
        }),
      ),
      ...(formationUsageRows as Array<{ technologyId: string }>).map((row) => ({
        technologyId: row.technologyId,
        technology: technologyMap.get(row.technologyId),
        source: 'formation' as const,
      })),
    ].filter(
      (row): row is DashboardTechnologyUsageRecord =>
        row.technology !== undefined,
    );

    return {
      generatedAtUtc: new Date().toISOString(),
      totalUsageLinks: normalizedRows.length,
      levels: this.buildDistribution(
        normalizedTechnologies
          .map((technology) => technology.level)
          .filter(
            (value): value is NonNullable<typeof value> => value !== null,
          ),
      ),
      frequencies: this.buildDistribution(
        normalizedTechnologies
          .map((technology) => technology.frequency)
          .filter(
            (value): value is NonNullable<typeof value> => value !== null,
          ),
      ),
      contexts: this.buildDistribution(
        normalizedTechnologies.flatMap((technology) =>
          technology.technologyContexts.map((context) => context.context),
        ),
      ),
      sources: this.buildDistribution(normalizedRows.map((row) => row.source)),
      topTechnologies: this.buildTopTechnologies(normalizedRows),
    };
  }

  async getProfessionalTimeline(): Promise<DashboardProfessionalTimelineResponse> {
    const experiences = (await this.prisma.experience.findMany({
      orderBy: [{ startDate: 'desc' }, { sortOrder: 'asc' }],
      select: {
        id: true,
        slug: true,
        companyName: true,
        titlePt: true,
        titleEn: true,
        titleEs: true,
        startDate: true,
        endDate: true,
        isCurrent: true,
        highlight: true,
        jobs: {
          include: {
            job: {
              select: {
                namePt: true,
                nameEn: true,
                nameEs: true,
              },
            },
          },
          orderBy: {
            sortOrder: 'asc',
          },
        },
        customers: {
          include: {
            customer: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            sortOrder: 'asc',
          },
        },
        projects: {
          include: {
            project: {
              select: {
                slug: true,
                titlePt: true,
                titleEn: true,
                titleEs: true,
              },
            },
          },
          orderBy: {
            sortOrder: 'asc',
          },
        },
        technologies: {
          include: {
            technology: {
              select: {
                slug: true,
                name: true,
              },
            },
          },
        },
        imageAssets: {
          include: {
            imageAsset: {
              select: {
                filePath: true,
                kind: true,
              },
            },
          },
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },
    })) as DashboardTimelineExperienceRecord[];

    return {
      generatedAtUtc: new Date().toISOString(),
      totalItems: experiences.length,
      items: experiences.map((experience) => ({
        id: experience.id,
        slug: experience.slug,
        companyName: experience.companyName,
        titlePt: experience.titlePt,
        titleEn: experience.titleEn,
        titleEs: experience.titleEs,
        startDate: this.toDateOnly(experience.startDate),
        endDate: experience.endDate
          ? this.toDateOnly(experience.endDate)
          : null,
        isCurrent: experience.isCurrent,
        highlight: experience.highlight,
        jobs: experience.jobs.map((entry) => entry.job.nameEn),
        jobsPt: experience.jobs.map((entry) => entry.job.namePt),
        jobsEn: experience.jobs.map((entry) => entry.job.nameEn),
        jobsEs: experience.jobs.map((entry) => entry.job.nameEs),
        customers: experience.customers.map((entry) => entry.customer.name),
        projects: experience.projects.map((entry) => entry.project.slug),
        technologies: experience.technologies.map(
          (entry) => entry.technology.name,
        ),
        imagePath: experience.imageAssets[0]?.imageAsset.filePath ?? null,
      })),
    };
  }

  async getHighlights(): Promise<DashboardHighlightsResponse> {
    const [
      projects,
      experiences,
      technologies,
      formations,
      customers,
      jobs,
      spokenLanguages,
    ] = await Promise.all([
      this.prisma.project.findMany({
        where: {
          OR: [{ highlight: true }, { featured: true }],
        },
        orderBy: [
          { featured: 'desc' },
          { highlight: 'desc' },
          { sortOrder: 'asc' },
        ],
        select: {
          id: true,
          slug: true,
          titlePt: true,
          titleEn: true,
          titleEs: true,
          shortDescriptionPt: true,
          shortDescriptionEn: true,
          shortDescriptionEs: true,
          featured: true,
          highlight: true,
          imageAssets: {
            include: {
              imageAsset: {
                select: {
                  filePath: true,
                  kind: true,
                },
              },
            },
            orderBy: {
              sortOrder: 'asc',
            },
          },
        },
      }),
      this.prisma.experience.findMany({
        where: {
          highlight: true,
        },
        orderBy: [{ sortOrder: 'asc' }, { startDate: 'desc' }],
        select: {
          id: true,
          slug: true,
          companyName: true,
          titlePt: true,
          titleEn: true,
          titleEs: true,
          summaryPt: true,
          summaryEn: true,
          summaryEs: true,
          highlight: true,
          imageAssets: {
            include: {
              imageAsset: {
                select: {
                  filePath: true,
                  kind: true,
                },
              },
            },
            orderBy: {
              sortOrder: 'asc',
            },
          },
        },
      }),
      this.prisma.technology.findMany({
        where: {
          highlight: true,
        },
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
        select: {
          id: true,
          slug: true,
          name: true,
          category: true,
          highlight: true,
          imageAssets: {
            include: {
              imageAsset: {
                select: {
                  filePath: true,
                  kind: true,
                },
              },
            },
            orderBy: {
              sortOrder: 'asc',
            },
          },
        },
      }),
      this.prisma.formation.findMany({
        where: {
          highlight: true,
        },
        orderBy: [{ sortOrder: 'asc' }, { startDate: 'desc' }],
        select: {
          id: true,
          slug: true,
          institution: true,
          titlePt: true,
          titleEn: true,
          titleEs: true,
          highlight: true,
          imageAssets: {
            include: {
              imageAsset: {
                select: {
                  filePath: true,
                  kind: true,
                },
              },
            },
            orderBy: {
              sortOrder: 'asc',
            },
          },
        },
      }),
      this.prisma.customer.findMany({
        where: {
          highlight: true,
        },
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
        select: {
          id: true,
          slug: true,
          name: true,
          summaryPt: true,
          summaryEn: true,
          summaryEs: true,
          highlight: true,
          imageAssets: {
            include: {
              imageAsset: {
                select: {
                  filePath: true,
                  kind: true,
                },
              },
            },
            orderBy: {
              sortOrder: 'asc',
            },
          },
        },
      }),
      this.prisma.job.findMany({
        where: {
          highlight: true,
        },
        orderBy: [{ sortOrder: 'asc' }, { slug: 'asc' }],
        select: {
          id: true,
          slug: true,
          namePt: true,
          nameEn: true,
          nameEs: true,
          summaryPt: true,
          summaryEn: true,
          summaryEs: true,
          highlight: true,
          imageAssets: {
            include: {
              imageAsset: {
                select: {
                  filePath: true,
                  kind: true,
                },
              },
            },
            orderBy: {
              sortOrder: 'asc',
            },
          },
        },
      }),
      this.prisma.spokenLanguage.findMany({
        where: {
          highlight: true,
        },
        orderBy: [{ sortOrder: 'asc' }, { code: 'asc' }],
        select: {
          id: true,
          code: true,
          namePt: true,
          nameEn: true,
          nameEs: true,
          highlight: true,
          imageAssets: {
            include: {
              imageAsset: {
                select: {
                  filePath: true,
                  kind: true,
                },
              },
            },
            orderBy: {
              sortOrder: 'asc',
            },
          },
        },
      }),
    ]);

    const items = [
      ...(projects as DashboardProjectHighlightRecord[]).map((project) =>
        this.toProjectHighlight(project),
      ),
      ...(experiences as DashboardExperienceHighlightRecord[]).map(
        (experience) => this.toExperienceHighlight(experience),
      ),
      ...(technologies as DashboardTechnologyHighlightRecord[]).map(
        (technology) => this.toTechnologyHighlight(technology),
      ),
      ...(formations as DashboardFormationHighlightRecord[]).map((formation) =>
        this.toFormationHighlight(formation),
      ),
      ...(customers as DashboardCustomerHighlightRecord[]).map((customer) =>
        this.toCustomerHighlight(customer),
      ),
      ...(jobs as DashboardJobHighlightRecord[]).map((job) =>
        this.toJobHighlight(job),
      ),
      ...(spokenLanguages as DashboardSpokenLanguageHighlightRecord[]).map(
        (spokenLanguage) => this.toSpokenLanguageHighlight(spokenLanguage),
      ),
    ];

    return {
      generatedAtUtc: new Date().toISOString(),
      totalItems: items.length,
      items,
    };
  }

  private async getSummaryCounters(): Promise<
    DashboardOverviewResponse['summary']
  > {
    const [
      projects,
      experiences,
      technologies,
      formations,
      customers,
      jobs,
      spokenLanguages,
    ] = await Promise.all([
      this.prisma.project.count(),
      this.prisma.experience.count(),
      this.prisma.technology.count(),
      this.prisma.formation.count(),
      this.prisma.customer.count(),
      this.prisma.job.count(),
      this.prisma.spokenLanguage.count(),
    ]);

    return {
      projects,
      experiences,
      technologies,
      formations,
      customers,
      jobs,
      spokenLanguages,
    };
  }

  private countUniqueIds<
    TItem extends Record<TKey, string>,
    TKey extends string,
  >(items: TItem[], key: TKey): number {
    return new Set(items.map((item) => item[key])).size;
  }

  private buildDistribution(values: string[]): DashboardDistributionEntry[] {
    const counts = new Map<string, number>();

    for (const value of values) {
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }

    return [...counts.entries()]
      .map(([key, count]) => ({
        key,
        count,
      }))
      .sort((left, right) => {
        if (right.count !== left.count) {
          return right.count - left.count;
        }

        return left.key.localeCompare(right.key);
      });
  }

  private buildTopTechnologies(
    rows: DashboardTechnologyUsageRecord[],
  ): DashboardTopTechnologyEntry[] {
    const technologies = new Map<string, DashboardTopTechnologyEntry>();

    for (const row of rows) {
      const existing = technologies.get(row.technology.id);

      if (existing) {
        existing.usageCount += 1;
        continue;
      }

      technologies.set(row.technology.id, {
        technologyId: row.technology.id,
        slug: row.technology.slug,
        name: row.technology.name,
        category: row.technology.category,
        usageCount: 1,
      });
    }

    return [...technologies.values()]
      .sort((left, right) => {
        if (right.usageCount !== left.usageCount) {
          return right.usageCount - left.usageCount;
        }

        return left.name.localeCompare(right.name);
      })
      .slice(0, 10);
  }

  private toProjectHighlight(
    project: DashboardProjectHighlightRecord,
  ): DashboardHighlightItem {
    return {
      entity: 'project',
      id: project.id,
      slug: project.slug,
      titlePt: project.titlePt,
      titleEn: project.titleEn,
      titleEs: project.titleEs,
      subtitlePt: project.shortDescriptionPt,
      subtitleEn: project.shortDescriptionEn,
      subtitleEs: project.shortDescriptionEs,
      icon: this.pickIconPath(project.imageAssets),
      imagePath: this.pickPreviewImagePath(project.imageAssets),
      featured: project.featured,
    };
  }

  private toExperienceHighlight(
    experience: DashboardExperienceHighlightRecord,
  ): DashboardHighlightItem {
    return {
      entity: 'experience',
      id: experience.id,
      slug: experience.slug,
      titlePt: experience.titlePt,
      titleEn: experience.titleEn,
      titleEs: experience.titleEs,
      subtitlePt: experience.summaryPt,
      subtitleEn: experience.summaryEn,
      subtitleEs: experience.summaryEs,
      icon: this.pickIconPath(experience.imageAssets),
      imagePath: this.pickPreviewImagePath(experience.imageAssets),
    };
  }

  private toTechnologyHighlight(
    technology: DashboardTechnologyHighlightRecord,
  ): DashboardHighlightItem {
    return {
      entity: 'technology',
      id: technology.id,
      slug: technology.slug,
      titlePt: technology.name,
      titleEn: technology.name,
      titleEs: technology.name,
      subtitlePt: technology.category,
      subtitleEn: technology.category,
      subtitleEs: technology.category,
      icon: this.pickIconPath(technology.imageAssets),
      imagePath: this.pickPreviewImagePath(technology.imageAssets),
    };
  }

  private toFormationHighlight(
    formation: DashboardFormationHighlightRecord,
  ): DashboardHighlightItem {
    return {
      entity: 'formation',
      id: formation.id,
      slug: formation.slug,
      titlePt: formation.titlePt,
      titleEn: formation.titleEn,
      titleEs: formation.titleEs,
      subtitlePt: formation.institution,
      subtitleEn: formation.institution,
      subtitleEs: formation.institution,
      icon: this.pickIconPath(formation.imageAssets),
      imagePath: this.pickPreviewImagePath(formation.imageAssets),
    };
  }

  private toCustomerHighlight(
    customer: DashboardCustomerHighlightRecord,
  ): DashboardHighlightItem {
    return {
      entity: 'customer',
      id: customer.id,
      slug: customer.slug,
      titlePt: customer.name,
      titleEn: customer.name,
      titleEs: customer.name,
      subtitlePt: customer.summaryPt,
      subtitleEn: customer.summaryEn,
      subtitleEs: customer.summaryEs,
      icon: this.pickIconPath(customer.imageAssets),
      imagePath: this.pickPreviewImagePath(customer.imageAssets),
    };
  }

  private toJobHighlight(
    job: DashboardJobHighlightRecord,
  ): DashboardHighlightItem {
    return {
      entity: 'job',
      id: job.id,
      slug: job.slug,
      titlePt: job.namePt,
      titleEn: job.nameEn,
      titleEs: job.nameEs,
      subtitlePt: job.summaryPt,
      subtitleEn: job.summaryEn,
      subtitleEs: job.summaryEs,
      icon: this.pickIconPath(job.imageAssets),
      imagePath: this.pickPreviewImagePath(job.imageAssets),
    };
  }

  private toSpokenLanguageHighlight(
    spokenLanguage: DashboardSpokenLanguageHighlightRecord,
  ): DashboardHighlightItem {
    return {
      entity: 'spokenLanguage',
      id: spokenLanguage.id,
      slug: spokenLanguage.code,
      titlePt: spokenLanguage.namePt,
      titleEn: spokenLanguage.nameEn,
      titleEs: spokenLanguage.nameEs,
      icon: this.pickIconPath(spokenLanguage.imageAssets),
      imagePath: this.pickPreviewImagePath(spokenLanguage.imageAssets),
    };
  }

  private pickIconPath(
    imageAssets: Array<{ imageAsset: { filePath: string; kind: string } }>,
  ): string | null {
    return (
      imageAssets.find((entry) =>
        ['ICON', 'LOGO', 'PROFILE'].includes(entry.imageAsset.kind),
      )?.imageAsset.filePath ?? null
    );
  }

  private pickPreviewImagePath(
    imageAssets: Array<{ imageAsset: { filePath: string; kind: string } }>,
  ): string | null {
    return (
      imageAssets.find((entry) =>
        ['SCREENSHOT', 'OTHER'].includes(entry.imageAsset.kind),
      )?.imageAsset.filePath ?? null
    );
  }

  private toDateOnly(value: Date): string {
    return value.toISOString().slice(0, 10);
  }
}
