import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import {
  ProjectContext,
  ProjectEnvironment,
  ProjectStatus,
} from '@prisma/client';
import { CreateProjectRequest, UpdateProjectRequest } from './projects.request';

describe('project request contracts', () => {
  it('accepts a valid create payload', () => {
    const instance = plainToInstance(CreateProjectRequest, {
      slug: 'project-slug',
      titlePt: 'Projeto',
      titleEn: 'Project',
      titleEs: 'Proyecto',
      summaryPt: 'Curta PT',
      summaryEn: 'Short EN',
      summaryEs: 'Breve ES',
      descriptionPt: 'Completa PT',
      descriptionEn: 'Full EN',
      descriptionEs: 'Completa ES',
      context: ProjectContext.PERSONAL,
      status: ProjectStatus.COMPLETED,
      environment: ProjectEnvironment.FULLSTACK,
      featured: true,
      highlight: true,
      startDate: '2020-01-01',
      endDate: '2021-01-01',
      sortOrder: '6',
      technologyRelations: [
        { technologyId: '11111111-1111-4111-8111-111111111111' },
      ],
      experienceIds: ['22222222-2222-4222-8222-222222222222'],
      linkIds: ['44444444-4444-4444-8444-444444444444'],
      imageAssetIds: ['eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee'],
    });

    expect(validateSync(instance)).toEqual([]);
    expect(instance.sortOrder).toBe(6);
  });

  it('rejects invalid enums, nested relations and image asset identifiers', () => {
    const instance = plainToInstance(CreateProjectRequest, {
      slug: '',
      titlePt: '',
      titleEn: '',
      titleEs: '',
      summaryPt: '',
      summaryEn: '',
      summaryEs: '',
      descriptionPt: '',
      descriptionEn: '',
      descriptionEs: '',
      context: 'INVALID',
      status: 'INVALID',
      environment: 'INVALID',
      technologyRelations: [{ technologyId: 'invalid' }],
      imageAssetIds: ['invalid'],
    });

    const errors = validateSync(instance);

    expect(errors.find((error) => error.property === 'context')).toBeDefined();
    expect(errors.find((error) => error.property === 'status')).toBeDefined();
    expect(
      errors.find((error) => error.property === 'environment'),
    ).toBeDefined();
    expect(
      errors.find((error) => error.property === 'technologyRelations'),
    ).toBeDefined();
    expect(
      errors.find((error) => error.property === 'imageAssetIds'),
    ).toBeDefined();
    expect(
      errors.find((error) => error.property === 'startDate'),
    ).toBeDefined();
  });

  it('rejects a create payload with a missing startDate', () => {
    const instance = plainToInstance(CreateProjectRequest, {
      slug: 'project-slug',
      titlePt: 'Projeto',
      titleEn: 'Project',
      titleEs: 'Proyecto',
      summaryPt: 'Curta PT',
      summaryEn: 'Short EN',
      summaryEs: 'Breve ES',
      descriptionPt: 'Completa PT',
      descriptionEn: 'Full EN',
      descriptionEs: 'Completa ES',
      context: ProjectContext.PERSONAL,
      status: ProjectStatus.COMPLETED,
      environment: ProjectEnvironment.FULLSTACK,
    });

    const errors = validateSync(instance);

    expect(
      errors.find((error) => error.property === 'startDate'),
    ).toBeDefined();
  });

  it('allows partial update payloads', () => {
    const instance = plainToInstance(UpdateProjectRequest, {
      featured: false,
    });

    expect(validateSync(instance)).toEqual([]);
  });

  it('rejects update payloads whose end date is earlier than the start date', () => {
    const instance = plainToInstance(UpdateProjectRequest, {
      startDate: '2026-07-03',
      endDate: '2026-07-01',
    });
    const errors = validateSync(instance);

    expect(errors.find((error) => error.property === 'endDate')).toBeDefined();
  });
});
