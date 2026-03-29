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
  DashboardPublishedTechnologyRecord,
  DashboardProjectContextRecord,
  DashboardProjectHighlightRecord,
  DashboardSpokenLanguageHighlightRecord,
  DashboardStackRecord,
  DashboardTechnologyHighlightRecord,
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
            project: {
              select: {
                isPublished: true,
              },
            },
          },
        },
        technologies: {
          select: {
            technologyId: true,
            technology: {
              select: {
                isPublished: true,
              },
            },
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
        projectCount: this.countPublishedLinks(
          stack.projects.map((entry) => ({
            id: entry.projectId,
            isPublished: entry.project.isPublished,
          })),
        ),
        technologyCount: this.countPublishedLinks(
          stack.technologies.map((entry) => ({
            id: entry.technologyId,
            isPublished: entry.technology.isPublished,
          })),
        ),
      })),
    };
  }

  async getProjectContexts(): Promise<DashboardProjectContextsResponse> {
    const projects = (await this.prisma.project.findMany({
      where: {
        isPublished: true,
      },
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
          project: {
            select: {
              isPublished: true,
            },
          },
        },
      }),
      this.prisma.experienceTechnology.findMany({
        select: {
          technologyId: true,
          experience: {
            select: {
              isPublished: true,
            },
          },
        },
      }),
      this.prisma.formationTechnology.findMany({
        select: {
          technologyId: true,
          formation: {
            select: {
              isPublished: true,
            },
          },
        },
      }),
      this.prisma.technology.findMany({
        where: {
          isPublished: true,
        },
        select: {
          id: true,
          slug: true,
          name: true,
          category: true,
          level: true,
          frequency: true,
          isPublished: true,
          technologyContexts: {
            select: {
              context: true,
            },
          },
        },
      }),
    ]);
    const publishedTechnologies =
      (technologies as DashboardPublishedTechnologyRecord[] | undefined) ?? [];
    const technologyMap = new Map(
      publishedTechnologies.map((technology) => [technology.id, technology]),
    );
    const normalizedRows = [
      ...(
        projectUsageRows as Array<{
          technologyId: string;
          project?: { isPublished: boolean };
        }>
      ).map((row) => ({
        technologyId: row.technologyId,
        technology: technologyMap.get(row.technologyId),
        parentIsPublished: row.project?.isPublished ?? true,
        source: 'project' as const,
      })),
      ...(
        experienceUsageRows as Array<{
          technologyId: string;
          experience?: { isPublished: boolean };
        }>
      ).map((row) => ({
        technologyId: row.technologyId,
        technology: technologyMap.get(row.technologyId),
        parentIsPublished: row.experience?.isPublished ?? true,
        source: 'experience' as const,
      })),
      ...(
        formationUsageRows as Array<{
          technologyId: string;
          formation?: { isPublished: boolean };
        }>
      ).map((row) => ({
        technologyId: row.technologyId,
        technology: technologyMap.get(row.technologyId),
        parentIsPublished: row.formation?.isPublished ?? true,
        source: 'formation' as const,
      })),
    ].filter(
      (
        row,
      ): row is DashboardTechnologyUsageRecord & {
        parentIsPublished: boolean;
      } => row.parentIsPublished && row.technology !== undefined,
    );
    return {
      generatedAtUtc: new Date().toISOString(),
      totalUsageLinks: normalizedRows.length,
      levels: this.buildDistribution(
        publishedTechnologies
          .map((technology) => technology.level)
          .filter(
            (value): value is NonNullable<typeof value> => value !== null,
          ),
      ),
      frequencies: this.buildDistribution(
        publishedTechnologies
          .map((technology) => technology.frequency)
          .filter(
            (value): value is NonNullable<typeof value> => value !== null,
          ),
      ),
      contexts: this.buildDistribution(
        publishedTechnologies.flatMap((technology) =>
          technology.technologyContexts.map((context) => context.context),
        ),
      ),
      sources: this.buildDistribution(normalizedRows.map((row) => row.source)),
      topTechnologies: this.buildTopTechnologies(normalizedRows),
    };
  }

  async getProfessionalTimeline(): Promise<DashboardProfessionalTimelineResponse> {
    const experiences = (await this.prisma.experience.findMany({
      where: {
        isPublished: true,
      },
      orderBy: [{ startDate: 'desc' }, { sortOrder: 'asc' }],
      select: {
        id: true,
        slug: true,
        companyName: true,
        titlePt: true,
        titleEn: true,
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
        startDate: this.toDateOnly(experience.startDate),
        endDate: experience.endDate
          ? this.toDateOnly(experience.endDate)
          : null,
        isCurrent: experience.isCurrent,
        highlight: experience.highlight,
        jobs: experience.jobs.map((entry) => entry.job.nameEn),
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
          isPublished: true,
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
          shortDescriptionPt: true,
          shortDescriptionEn: true,
          icon: true,
          featured: true,
          highlight: true,
          imageAssets: {
            include: {
              imageAsset: {
                select: {
                  filePath: true,
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
          isPublished: true,
          highlight: true,
        },
        orderBy: [{ sortOrder: 'asc' }, { startDate: 'desc' }],
        select: {
          id: true,
          slug: true,
          companyName: true,
          titlePt: true,
          titleEn: true,
          summaryPt: true,
          summaryEn: true,
          icon: true,
          highlight: true,
          imageAssets: {
            include: {
              imageAsset: {
                select: {
                  filePath: true,
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
          isPublished: true,
          highlight: true,
        },
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
        select: {
          id: true,
          slug: true,
          name: true,
          category: true,
          icon: true,
          highlight: true,
          imageAssets: {
            include: {
              imageAsset: {
                select: {
                  filePath: true,
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
          isPublished: true,
          highlight: true,
        },
        orderBy: [{ sortOrder: 'asc' }, { startDate: 'desc' }],
        select: {
          id: true,
          slug: true,
          institution: true,
          titlePt: true,
          titleEn: true,
          icon: true,
          highlight: true,
          imageAssets: {
            include: {
              imageAsset: {
                select: {
                  filePath: true,
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
          isPublished: true,
          highlight: true,
        },
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
        select: {
          id: true,
          slug: true,
          name: true,
          summaryPt: true,
          summaryEn: true,
          icon: true,
          highlight: true,
          imageAssets: {
            include: {
              imageAsset: {
                select: {
                  filePath: true,
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
          isPublished: true,
          highlight: true,
        },
        orderBy: [{ sortOrder: 'asc' }, { slug: 'asc' }],
        select: {
          id: true,
          slug: true,
          namePt: true,
          nameEn: true,
          summaryPt: true,
          summaryEn: true,
          icon: true,
          highlight: true,
          imageAssets: {
            include: {
              imageAsset: {
                select: {
                  filePath: true,
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
          icon: true,
          highlight: true,
          imageAssets: {
            include: {
              imageAsset: {
                select: {
                  filePath: true,
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
      this.prisma.project.count({
        where: {
          isPublished: true,
        },
      }),
      this.prisma.experience.count({
        where: {
          isPublished: true,
        },
      }),
      this.prisma.technology.count({
        where: {
          isPublished: true,
        },
      }),
      this.prisma.formation.count({
        where: {
          isPublished: true,
        },
      }),
      this.prisma.customer.count({
        where: {
          isPublished: true,
        },
      }),
      this.prisma.job.count({
        where: {
          isPublished: true,
        },
      }),
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

  private countPublishedLinks(
    items: Array<{ id: string; isPublished: boolean }>,
  ): number {
    return new Set(
      items.filter((item) => item.isPublished).map((item) => item.id),
    ).size;
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
      subtitlePt: project.shortDescriptionPt,
      subtitleEn: project.shortDescriptionEn,
      icon: project.icon,
      imagePath: project.imageAssets[0]?.imageAsset.filePath ?? null,
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
      subtitlePt: experience.summaryPt,
      subtitleEn: experience.summaryEn,
      icon: experience.icon,
      imagePath: experience.imageAssets[0]?.imageAsset.filePath ?? null,
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
      subtitlePt: technology.category,
      subtitleEn: technology.category,
      icon: technology.icon,
      imagePath: technology.imageAssets[0]?.imageAsset.filePath ?? null,
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
      subtitlePt: formation.institution,
      subtitleEn: formation.institution,
      icon: formation.icon,
      imagePath: formation.imageAssets[0]?.imageAsset.filePath ?? null,
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
      subtitlePt: customer.summaryPt,
      subtitleEn: customer.summaryEn,
      icon: customer.icon,
      imagePath: customer.imageAssets[0]?.imageAsset.filePath ?? null,
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
      subtitlePt: job.summaryPt,
      subtitleEn: job.summaryEn,
      icon: job.icon,
      imagePath: job.imageAssets[0]?.imageAsset.filePath ?? null,
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
      icon: spokenLanguage.icon,
      imagePath: spokenLanguage.imageAssets[0]?.imageAsset.filePath ?? null,
    };
  }

  private toDateOnly(value: Date): string {
    return value.toISOString().slice(0, 10);
  }
}
