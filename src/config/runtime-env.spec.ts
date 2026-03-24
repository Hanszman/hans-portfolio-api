import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildDatabaseUrlFromLegacyEnvironment, ensureRuntimeEnvironment } from './runtime-env';

describe('runtime-env', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.APP_NAME;
    delete process.env.NODE_ENV;
    delete process.env.PORT;
    delete process.env.SWAGGER_PATH;
    delete process.env.DATABASE_URL;
    delete process.env.DIRECT_URL;
    delete process.env.PGHOST;
    delete process.env.PGDATABASE;
    delete process.env.PGUSER;
    delete process.env.PGPASSWORD;
    delete process.env.PGPORT;
    delete process.env.PGSSLMODE;
    delete process.env.PGCHANNELBINDING;
    delete process.env.PGSCHEMA;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('loads defaults and derives DATABASE_URL from legacy PG variables', () => {
    process.env.PGHOST = 'example.neon.tech';
    process.env.PGDATABASE = 'hans-portfolio-db';
    process.env.PGUSER = 'portfolio_user';
    process.env.PGPASSWORD = 'p@ss word';
    process.env.PGPORT = '5432';
    process.env.PGSSLMODE = 'require';
    process.env.PGCHANNELBINDING = 'require';

    ensureRuntimeEnvironment([]);

    expect(process.env.APP_NAME).toBe('Hans Portfolio API');
    expect(process.env.NODE_ENV).toBe('development');
    expect(process.env.PORT).toBe('3000');
    expect(process.env.SWAGGER_PATH).toBe('swagger');
    expect(process.env.DATABASE_URL).toBe(
      'postgresql://portfolio_user:p%40ss%20word@example.neon.tech:5432/hans-portfolio-db?schema=portfolio&sslmode=require&channel_binding=require',
    );
    expect(process.env.DIRECT_URL).toBe(process.env.DATABASE_URL);
  });

  it('keeps the explicit DATABASE_URL and loads values from a local env file', () => {
    const temporaryDirectory = mkdtempSync(join(tmpdir(), 'hans-portfolio-api-'));
    const envFilePath = join(temporaryDirectory, '.env.test');

    writeFileSync(
      envFilePath,
      [
        'APP_NAME="Hans Portfolio API Local"',
        'PORT=4100',
        'SWAGGER_PATH=docs',
        'DATABASE_URL=postgresql://custom-user:custom-pass@localhost:5432/custom-db?schema=portfolio',
      ].join('\n'),
    );

    ensureRuntimeEnvironment([envFilePath]);

    expect(process.env.APP_NAME).toBe('Hans Portfolio API Local');
    expect(process.env.PORT).toBe('4100');
    expect(process.env.SWAGGER_PATH).toBe('docs');
    expect(process.env.DATABASE_URL).toBe(
      'postgresql://custom-user:custom-pass@localhost:5432/custom-db?schema=portfolio',
    );
    expect(process.env.DIRECT_URL).toBe(process.env.DATABASE_URL);

    rmSync(temporaryDirectory, { recursive: true, force: true });
  });

  it('returns the explicit DATABASE_URL when it is already provided', () => {
    expect(
      buildDatabaseUrlFromLegacyEnvironment({
        DATABASE_URL: 'postgresql://already-defined',
      }),
    ).toBe('postgresql://already-defined');
  });

  it('ignores missing files, comments, and invalid entries while preserving explicit values', () => {
    const temporaryDirectory = mkdtempSync(join(tmpdir(), 'hans-portfolio-api-'));
    const envFilePath = join(temporaryDirectory, '.env.test');

    process.env.DATABASE_URL = 'postgresql://already-defined';

    writeFileSync(
      envFilePath,
      [
        '# comment',
        '',
        'INVALID_LINE',
        "NODE_ENV='test'",
      ].join('\n'),
    );

    ensureRuntimeEnvironment([join(temporaryDirectory, '.missing'), envFilePath]);

    expect(process.env.NODE_ENV).toBe('test');
    expect(process.env.DATABASE_URL).toBe('postgresql://already-defined');
    expect(process.env.DIRECT_URL).toBe('postgresql://already-defined');

    rmSync(temporaryDirectory, { recursive: true, force: true });
  });

  it('returns undefined when there is not enough information to build a legacy connection string', () => {
    expect(buildDatabaseUrlFromLegacyEnvironment({ PGHOST: 'localhost' })).toBeUndefined();
  });
});
