import {
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

export const CONTENT_END_DATE_AFTER_START_DATE_MESSAGE =
  'endDate must be greater than or equal to startDate';

const parseContentDateValue = (value: unknown): number | null => {
  if (typeof value !== 'string' || !value.trim()) {
    return null;
  }

  const timestamp = Date.parse(value);

  return Number.isNaN(timestamp) ? null : timestamp;
};

export function IsContentEndDateOnOrAfterStartDate(
  startDateProperty = 'startDate',
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return (target: object, propertyName: string | symbol) => {
    registerDecorator({
      name: 'isContentEndDateOnOrAfterStartDate',
      target: target.constructor,
      propertyName: propertyName.toString(),
      constraints: [startDateProperty],
      options: {
        message: CONTENT_END_DATE_AFTER_START_DATE_MESSAGE,
        ...validationOptions,
      },
      validator: {
        validate(value: unknown, args: ValidationArguments): boolean {
          const [resolvedStartDateProperty] = args.constraints as [string];
          const startValue = (args.object as Record<string, unknown>)[
            resolvedStartDateProperty
          ];
          const startTimestamp = parseContentDateValue(startValue);
          const endTimestamp = parseContentDateValue(value);

          if (startTimestamp === null || endTimestamp === null) {
            return true;
          }

          return endTimestamp >= startTimestamp;
        },
      },
    });
  };
}
