import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import {
  CONTENT_END_DATE_AFTER_START_DATE_MESSAGE,
  IsContentEndDateOnOrAfterStartDate,
} from './content-date-range-validation';

class ContentDateRangeValidationFixture {
  startDate!: string;

  @IsContentEndDateOnOrAfterStartDate()
  endDate?: string;
}

describe('content date range validation', () => {
  it('accepts empty or chronological end dates', () => {
    const emptyEndDate = plainToInstance(ContentDateRangeValidationFixture, {
      startDate: '2026-07-01',
    });
    const chronologicalRange = plainToInstance(
      ContentDateRangeValidationFixture,
      {
        startDate: '2026-07-01',
        endDate: '2026-07-03',
      },
    );

    expect(validateSync(emptyEndDate)).toEqual([]);
    expect(validateSync(chronologicalRange)).toEqual([]);
  });

  it('ignores malformed date strings so field-level validators can report them separately', () => {
    const malformedRange = plainToInstance(ContentDateRangeValidationFixture, {
      startDate: 'invalid-date',
      endDate: '2026-07-03',
    });

    expect(validateSync(malformedRange)).toEqual([]);
  });

  it('rejects end dates earlier than the start date', () => {
    const instance = plainToInstance(ContentDateRangeValidationFixture, {
      startDate: '2026-07-03',
      endDate: '2026-07-01',
    });
    const errors = validateSync(instance);

    expect(errors).toHaveLength(1);
    expect(errors[0]?.property).toBe('endDate');
    expect(errors[0]?.constraints).toEqual({
      isContentEndDateOnOrAfterStartDate:
        CONTENT_END_DATE_AFTER_START_DATE_MESSAGE,
    });
  });
});
