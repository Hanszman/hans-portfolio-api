import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { ContentCollectionQueryRequest } from './content-query.request';

describe('ContentCollectionQueryRequest', () => {
  it('normalizes optional strings and booleans across supported fields', () => {
    const instance = plainToInstance(ContentCollectionQueryRequest, {
      sortBy: '  titleEn  ',
      sortDirection: ' DESC ',
      search: '  portfolio  ',
      slug: ' slug ',
      name: ' name ',
      code: ' code ',
      type: ' type ',
      context: ' context ',
      status: ' status ',
      environment: ' environment ',
      degreeType: ' degreeType ',
      proficiency: ' proficiency ',
      kind: ' kind ',
      companyName: ' companyName ',
      institution: ' institution ',
      url: ' https://example.com ',
      fileName: ' fileName ',
      featured: 'true',
      highlight: 'false',
      isCurrent: true,
      page: '2',
      pageSize: '20',
    });

    expect(instance.sortBy).toBe('titleEn');
    expect(instance.sortDirection).toBe('desc');
    expect(instance.search).toBe('portfolio');
    expect(instance.slug).toBe('slug');
    expect(instance.name).toBe('name');
    expect(instance.code).toBe('code');
    expect(instance.type).toBe('type');
    expect(instance.context).toBe('context');
    expect(instance.status).toBe('status');
    expect(instance.environment).toBe('environment');
    expect(instance.degreeType).toBe('degreeType');
    expect(instance.proficiency).toBe('proficiency');
    expect(instance.type).toBe('type');
    expect(instance.kind).toBe('kind');
    expect(instance.companyName).toBe('companyName');
    expect(instance.institution).toBe('institution');
    expect(instance.url).toBe('https://example.com');
    expect(instance.fileName).toBe('fileName');
    expect(instance.featured).toBe(true);
    expect(instance.highlight).toBe(false);
    expect(instance.isCurrent).toBe(true);
    expect(instance.page).toBe(2);
    expect(instance.pageSize).toBe(20);
  });

  it('treats empty and nullish booleans as undefined', () => {
    const instance = plainToInstance(ContentCollectionQueryRequest, {
      featured: '',
      highlight: null,
      isCurrent: undefined,
    });

    expect(instance.featured).toBeUndefined();
    expect(instance.highlight).toBeUndefined();
    expect(instance.isCurrent).toBeUndefined();
    expect(validateSync(instance)).toEqual([]);
  });

  it('keeps unsupported boolean-like strings for validator feedback', () => {
    const instance = plainToInstance(ContentCollectionQueryRequest, {
      featured: 'maybe',
      highlight: 'sometimes',
      isCurrent: 'eventually',
    });

    const errors = validateSync(instance);

    expect(errors.find((error) => error.property === 'featured')).toBeDefined();
    expect(
      errors.find((error) => error.property === 'highlight'),
    ).toBeDefined();
    expect(
      errors.find((error) => error.property === 'isCurrent'),
    ).toBeDefined();
  });

  it('validates pagination and sorting constraints', () => {
    const instance = plainToInstance(ContentCollectionQueryRequest, {
      page: 0,
      pageSize: 101,
      sortDirection: 'sideways',
    });

    const errors = validateSync(instance);

    expect(errors.find((error) => error.property === 'page')).toBeDefined();
    expect(errors.find((error) => error.property === 'pageSize')).toBeDefined();
    expect(
      errors.find((error) => error.property === 'sortDirection'),
    ).toBeDefined();
  });

  it('drops unsupported optional string values', () => {
    const instance = plainToInstance(ContentCollectionQueryRequest, {
      name: 123,
      code: null,
      institution: undefined,
      slug: '   ',
    });

    expect(instance.name).toBeUndefined();
    expect(instance.code).toBeUndefined();
    expect(instance.institution).toBeUndefined();
    expect(instance.slug).toBeUndefined();
    expect(validateSync(instance)).toEqual([]);
  });
});
