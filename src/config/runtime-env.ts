import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const DEFAULT_APP_NAME = 'Hans Portfolio API';
const DEFAULT_PORT = '3000';
const DEFAULT_SWAGGER_PATH = 'swagger';
const DEFAULT_SCHEMA = 'portfolio';

export function ensureRuntimeEnvironment(
  envFilePaths = ['.env.local', '.env'],
): void {
  loadEnvironmentFiles(envFilePaths);

  process.env.APP_NAME ??= DEFAULT_APP_NAME;
  process.env.NODE_ENV ??= 'development';
  process.env.PORT ??= DEFAULT_PORT;
  process.env.SWAGGER_PATH ??= DEFAULT_SWAGGER_PATH;

  const databaseUrl =
    process.env.DATABASE_URL ??
    buildDatabaseUrlFromLegacyEnvironment(process.env);

  if (databaseUrl) {
    process.env.DATABASE_URL ??= databaseUrl;
    process.env.DIRECT_URL ??= databaseUrl;
  }
}

export function buildDatabaseUrlFromLegacyEnvironment(
  env: NodeJS.ProcessEnv,
): string | undefined {
  if (env.DATABASE_URL) {
    return env.DATABASE_URL;
  }

  const host = env.PGHOST;
  const database = env.PGDATABASE;
  const user = env.PGUSER;
  const password = env.PGPASSWORD;
  const port = env.PGPORT ?? '5432';

  if (!host || !database || !user || !password) {
    return undefined;
  }

  const schema = env.PGSCHEMA ?? DEFAULT_SCHEMA;
  const parameters = new URLSearchParams({
    schema,
  });

  if (env.PGSSLMODE) {
    parameters.set('sslmode', env.PGSSLMODE);
  }

  if (env.PGCHANNELBINDING) {
    parameters.set('channel_binding', env.PGCHANNELBINDING);
  }

  return `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${database}?${parameters.toString()}`;
}

function loadEnvironmentFiles(envFilePaths: string[]): void {
  for (const envFilePath of envFilePaths) {
    const absolutePath = resolve(process.cwd(), envFilePath);

    if (!existsSync(absolutePath)) {
      continue;
    }

    const content = readFileSync(absolutePath, 'utf8');
    const lines = content.split(/\r?\n/);

    for (const line of lines) {
      const trimmedLine = line.trim();

      if (!trimmedLine || trimmedLine.startsWith('#')) {
        continue;
      }

      const separatorIndex = trimmedLine.indexOf('=');

      if (separatorIndex <= 0) {
        continue;
      }

      const key = trimmedLine.slice(0, separatorIndex).trim();
      const rawValue = trimmedLine.slice(separatorIndex + 1).trim();
      const normalizedValue = stripWrappingQuotes(rawValue);

      process.env[key] ??= normalizedValue;
    }
  }
}

function stripWrappingQuotes(value: string): string {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}
