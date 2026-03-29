import { Injectable } from '@nestjs/common';
import { TechnologyUsageContext } from '@prisma/client';
import type {
  TechnologyExperienceDuration,
  TechnologyExperienceMetrics,
  TechnologyRecordWithExperienceMetrics,
  TechnologyRecordWithUsageRelations,
  TechnologyUsagePeriodRecord,
} from '../../types/technology-experience-metrics.types';

type MonthRange = {
  startIndex: number;
  endIndex: number;
  startedAt: Date;
  endedAt: Date | null;
};

@Injectable()
export class TechnologyExperienceMetricsService {
  enrichTechnologyCollection(items: unknown[]): unknown[] {
    return items.map((item) => this.enrichTechnologyItem(item));
  }

  enrichTechnologyItem(item: unknown): unknown {
    if (!this.isTechnologyRecordWithUsageRelations(item)) {
      return item;
    }

    return {
      ...item,
      experienceMetrics: this.buildExperienceMetrics(item),
    } satisfies TechnologyRecordWithExperienceMetrics;
  }

  private buildExperienceMetrics(
    technology: TechnologyRecordWithUsageRelations,
  ): TechnologyExperienceMetrics {
    const usagePeriods = this.collectUsagePeriods(technology);

    return {
      total: this.buildDuration(usagePeriods),
      byContext: {
        PROFESSIONAL: this.buildDuration(
          usagePeriods.filter(
            (period) => period.context === TechnologyUsageContext.PROFESSIONAL,
          ),
        ),
        PERSONAL: this.buildDuration(
          usagePeriods.filter(
            (period) => period.context === TechnologyUsageContext.PERSONAL,
          ),
        ),
        ACADEMIC: this.buildDuration(
          usagePeriods.filter(
            (period) => period.context === TechnologyUsageContext.ACADEMIC,
          ),
        ),
        STUDY: this.buildDuration(
          usagePeriods.filter(
            (period) => period.context === TechnologyUsageContext.STUDY,
          ),
        ),
      },
    };
  }

  private collectUsagePeriods(
    technology: TechnologyRecordWithUsageRelations,
  ): TechnologyUsagePeriodRecord[] {
    return Array.isArray(technology.technologyContexts)
      ? technology.technologyContexts
      : [];
  }

  private buildDuration(
    usagePeriods: TechnologyUsagePeriodRecord[],
  ): TechnologyExperienceDuration {
    const monthRanges = usagePeriods
      .map((period) => this.toMonthRange(period))
      .filter((range): range is MonthRange => range !== null);

    if (monthRanges.length === 0) {
      return {
        totalMonths: 0,
        years: 0,
        months: 0,
        label: '0 months',
        startedAt: null,
        endedAt: null,
      };
    }

    const mergedRanges = this.mergeMonthRanges(monthRanges);
    const totalMonths = mergedRanges.reduce(
      (sum, range) => sum + (range.endIndex - range.startIndex + 1),
      0,
    );
    const earliestRange = mergedRanges[0];
    const latestRange = mergedRanges[mergedRanges.length - 1];
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    return {
      totalMonths,
      years,
      months,
      label: this.formatDurationLabel(years, months),
      startedAt: this.toDateOnly(earliestRange.startedAt),
      endedAt:
        latestRange.endedAt === null
          ? null
          : this.toDateOnly(latestRange.endedAt),
    };
  }

  private toMonthRange(period: TechnologyUsagePeriodRecord): MonthRange | null {
    const startedAt = this.toDate(period.startedAt);

    if (!startedAt) {
      return null;
    }

    const endedAt = this.toDate(period.endedAt);
    const resolvedEndedAt = endedAt ?? new Date();
    const startIndex = this.toMonthIndex(startedAt);
    const endIndex = Math.max(startIndex, this.toMonthIndex(resolvedEndedAt));

    return {
      startIndex,
      endIndex,
      startedAt,
      endedAt,
    };
  }

  private mergeMonthRanges(ranges: MonthRange[]): MonthRange[] {
    const sortedRanges = [...ranges].sort(
      (left, right) => left.startIndex - right.startIndex,
    );
    const firstRange = sortedRanges[0];
    const remainingRanges = sortedRanges.slice(1);
    const mergedRanges = [firstRange];

    for (const range of remainingRanges) {
      const lastRange = mergedRanges[mergedRanges.length - 1];

      if (range.startIndex <= lastRange.endIndex + 1) {
        lastRange.endIndex = Math.max(lastRange.endIndex, range.endIndex);
        lastRange.startedAt =
          range.startedAt < lastRange.startedAt
            ? range.startedAt
            : lastRange.startedAt;
        lastRange.endedAt =
          lastRange.endedAt === null || range.endedAt === null
            ? null
            : range.endedAt > lastRange.endedAt
              ? range.endedAt
              : lastRange.endedAt;
        continue;
      }

      mergedRanges.push({ ...range });
    }

    return mergedRanges;
  }

  private formatDurationLabel(years: number, months: number): string {
    const parts: string[] = [];

    if (years > 0) {
      parts.push(`${years} ${years === 1 ? 'year' : 'years'}`);
    }

    if (months > 0 || parts.length === 0) {
      parts.push(`${months} ${months === 1 ? 'month' : 'months'}`);
    }

    return parts.join(' ');
  }

  private toDate(value: Date | string | null): Date | null {
    if (!value) {
      return null;
    }

    return value instanceof Date ? value : new Date(value);
  }

  private toMonthIndex(value: Date): number {
    return value.getUTCFullYear() * 12 + value.getUTCMonth();
  }

  private toDateOnly(value: Date): string {
    return value.toISOString().slice(0, 10);
  }

  private isTechnologyRecordWithUsageRelations(
    value: unknown,
  ): value is TechnologyRecordWithUsageRelations {
    if (!value || typeof value !== 'object') {
      return false;
    }

    const record = value as Record<string, unknown>;

    return 'technologyContexts' in record;
  }
}
