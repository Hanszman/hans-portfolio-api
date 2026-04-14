const DEFAULT_LOCAL_APP_BASE_URL = 'http://localhost:4200';
const DEFAULT_LOCAL_API_BASE_URL = 'http://localhost:3000';
const DEFAULT_PRODUCTION_APP_BASE_URL = 'https://hans-portfolio-app.vercel.app';
const DEFAULT_PRODUCTION_API_BASE_URL = 'https://hans-portfolio-api.vercel.app';

const normalizeUrl = (url: string): string => url.replace(/\/+$/, '');

const parseOptionalOrigins = (origins: string | undefined): string[] =>
  origins
    ?.split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0)
    .map(normalizeUrl) ?? [];

const buildLoopbackAlias = (url: string): string[] => {
  if (url.includes('://localhost:')) {
    return [url.replace('://localhost:', '://127.0.0.1:')];
  }

  if (url.includes('://127.0.0.1:')) {
    return [url.replace('://127.0.0.1:', '://localhost:')];
  }

  return [];
};

const buildUniqueOrigins = (origins: string[]): string[] => [
  ...new Set(origins),
];

export const readAppEnvironment = (
  runtimeEnvironment: NodeJS.ProcessEnv = process.env,
) => {
  const isProduction = runtimeEnvironment.NODE_ENV === 'production';
  const portfolioAppBaseUrl = normalizeUrl(
    runtimeEnvironment.PORTFOLIO_APP_BASE_URL ??
      (isProduction
        ? DEFAULT_PRODUCTION_APP_BASE_URL
        : DEFAULT_LOCAL_APP_BASE_URL),
  );
  const portfolioApiBaseUrl = normalizeUrl(
    runtimeEnvironment.PORTFOLIO_API_BASE_URL ??
      (isProduction
        ? DEFAULT_PRODUCTION_API_BASE_URL
        : DEFAULT_LOCAL_API_BASE_URL),
  );
  const additionalCorsAllowedOrigins = parseOptionalOrigins(
    runtimeEnvironment.CORS_ALLOWED_ORIGINS,
  );

  return {
    portfolioAppBaseUrl,
    portfolioApiBaseUrl,
    corsAllowedOrigins: buildUniqueOrigins([
      portfolioAppBaseUrl,
      ...buildLoopbackAlias(portfolioAppBaseUrl),
      ...additionalCorsAllowedOrigins,
    ]),
  } as const;
};

export const appEnvironment = readAppEnvironment();
