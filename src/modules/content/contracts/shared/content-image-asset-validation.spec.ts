import { plainToInstance } from 'class-transformer';
import { ValidationError, validateSync } from 'class-validator';
import {
  DegreeType,
  ProjectContext,
  ProjectEnvironment,
  ProjectStatus,
  SpokenLanguageProficiency,
  TechnologyType,
} from '@prisma/client';
import { CreateCustomerRequest } from '../customers/customers.request';
import { CreateExperienceRequest } from '../experiences/experiences.request';
import { CreateFormationRequest } from '../formations/formations.request';
import { CreateJobRequest } from '../jobs/jobs.request';
import { CreateProjectRequest } from '../projects/projects.request';
import { CreateSpokenLanguageRequest } from '../spoken-languages/spoken-languages.request';
import { CreateTechnologyRequest } from '../technologies/technologies.request';
import {
  CONTENT_IMAGE_ASSET_IDENTIFIER_MESSAGE,
  CONTENT_IMAGE_ASSET_IDENTIFIER_PATTERN,
  IsContentImageAssetIdArray,
} from './content-image-asset-validation';

class ImageAssetValidationHarness {
  @IsContentImageAssetIdArray()
  imageAssetIds!: string[];
}

type RequestCase = {
  readonly label: string;
  readonly requestClass: new () => object;
  readonly payload: Record<string, unknown>;
};

const NON_STANDARD_IMAGE_ASSET_ID = '9b8d8895-35fb-ecd8-30cd-d3f0df4f7927';
const INVALID_IMAGE_ASSET_ID = 'ajax.png';

function findImageAssetIdsError(
  errors: ValidationError[],
): ValidationError | undefined {
  return errors.find(
    (error: ValidationError) => error.property === 'imageAssetIds',
  );
}

describe('content image asset validation', () => {
  const requestCases: readonly RequestCase[] = [
    {
      label: 'customer',
      requestClass: CreateCustomerRequest,
      payload: {
        slug: 'customer-slug',
        name: 'Customer name',
        summaryPt: 'Resumo PT',
        summaryEn: 'Summary EN',
      },
    },
    {
      label: 'spoken language',
      requestClass: CreateSpokenLanguageRequest,
      payload: {
        code: 'pt-br',
        namePt: 'Portugues',
        nameEn: 'Portuguese',
        proficiency: SpokenLanguageProficiency.NATIVE,
      },
    },
    {
      label: 'project',
      requestClass: CreateProjectRequest,
      payload: {
        slug: 'project-slug',
        titlePt: 'Projeto',
        titleEn: 'Project',
        shortDescriptionPt: 'Curta PT',
        shortDescriptionEn: 'Short EN',
        fullDescriptionPt: 'Longa PT',
        fullDescriptionEn: 'Long EN',
        context: ProjectContext.PERSONAL,
        status: ProjectStatus.COMPLETED,
        environment: ProjectEnvironment.FULLSTACK,
      },
    },
    {
      label: 'experience',
      requestClass: CreateExperienceRequest,
      payload: {
        slug: 'experience-slug',
        companyName: 'Company',
        titlePt: 'Titulo PT',
        titleEn: 'Title EN',
        summaryPt: 'Resumo PT',
        summaryEn: 'Summary EN',
        descriptionPt: 'Descricao PT',
        descriptionEn: 'Description EN',
        startDate: '2026-01-01',
      },
    },
    {
      label: 'formation',
      requestClass: CreateFormationRequest,
      payload: {
        slug: 'formation-slug',
        institution: 'Institution',
        titlePt: 'Titulo PT',
        titleEn: 'Title EN',
        degreeType: DegreeType.BACHELOR,
        summaryPt: 'Resumo PT',
        summaryEn: 'Summary EN',
        startDate: '2026-01-01',
      },
    },
    {
      label: 'job',
      requestClass: CreateJobRequest,
      payload: {
        slug: 'job-slug',
        namePt: 'Cargo PT',
        nameEn: 'Role EN',
        summaryPt: 'Resumo PT',
        summaryEn: 'Summary EN',
      },
    },
    {
      label: 'technology',
      requestClass: CreateTechnologyRequest,
      payload: {
        slug: 'technology-slug',
        name: 'Technology',
        type: TechnologyType.OTHERS,
      },
    },
  ];

  it('matches the persisted identifier pattern', () => {
    expect(
      CONTENT_IMAGE_ASSET_IDENTIFIER_PATTERN.test(
        '9b8d8895-35fb-ecd8-30cd-d3f0df4f7927',
      ),
    ).toBe(true);
    expect(CONTENT_IMAGE_ASSET_IDENTIFIER_PATTERN.test('ajax.png')).toBe(false);
  });

  it('validates image asset arrays with the shared decorator', () => {
    const valid = plainToInstance(ImageAssetValidationHarness, {
      imageAssetIds: ['9b8d8895-35fb-ecd8-30cd-d3f0df4f7927'],
    });
    const invalid = plainToInstance(ImageAssetValidationHarness, {
      imageAssetIds: ['ajax.png'],
    });

    expect(validateSync(valid)).toEqual([]);
    expect(validateSync(invalid)[0]?.constraints?.matches).toBe(
      CONTENT_IMAGE_ASSET_IDENTIFIER_MESSAGE,
    );
  });

  it.each(requestCases)(
    'accepts persisted non-standard image asset identifiers for  payloads',
    ({ requestClass, payload }) => {
      const instance = plainToInstance(requestClass, {
        ...payload,
        imageAssetIds: [NON_STANDARD_IMAGE_ASSET_ID],
      });

      const errors = validateSync(instance);
      const imageAssetIdsError = findImageAssetIdsError(errors);

      expect(imageAssetIdsError).toBeUndefined();
    },
  );

  it.each(requestCases)(
    'still rejects malformed image asset identifiers for  payloads',
    ({ requestClass, payload }) => {
      const instance = plainToInstance(requestClass, {
        ...payload,
        imageAssetIds: [INVALID_IMAGE_ASSET_ID],
      });

      const errors = validateSync(instance);
      const imageAssetIdsError = findImageAssetIdsError(errors);

      expect(imageAssetIdsError?.constraints?.matches).toEqual(
        CONTENT_IMAGE_ASSET_IDENTIFIER_MESSAGE,
      );
    },
  );
});
