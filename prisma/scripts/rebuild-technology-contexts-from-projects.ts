// One-off data migration: wipe `technology_context` and repopulate it from
// today's Project <-> Technology relations, using each Project's own
// startDate/endDate/context. Must be run manually with the API already
// running locally (npm run start:dev), since it exercises the real
// `POST /admin/technology-contexts` endpoint rather than writing to the
// database directly.
//
// Usage: npm run prisma:scripts:rebuild-technology-contexts

import { PrismaClient } from '@prisma/client';
import { mapProjectContextToTechnologyUsageContext } from '../../src/modules/content/helpers/project-context-mapping.helper';
import { ApiRoutes } from '../../src/routing/api-routes';

const prisma = new PrismaClient();

const API_BASE_URL =
  process.env.PORTFOLIO_API_BASE_URL ?? 'http://localhost:3000';
const ADMIN_EMAIL = process.env.ADMIN_BOOTSTRAP_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_BOOTSTRAP_PASSWORD;

type LoginResponse = { accessToken: string };

async function main(): Promise<void> {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error(
      'ADMIN_BOOTSTRAP_EMAIL and ADMIN_BOOTSTRAP_PASSWORD must be set to authenticate against the live API.',
    );
  }

  const accessToken = await login(ADMIN_EMAIL, ADMIN_PASSWORD);

  const deleted = await prisma.technologyContext.deleteMany();
  console.log(`Deleted ${deleted.count} existing technology_context rows.`);

  const projects = await prisma.project.findMany({
    include: { technologies: { select: { technologyId: true } } },
  });

  let created = 0;
  let skippedProjects = 0;
  const errors: string[] = [];

  for (const project of projects) {
    if (project.technologies.length === 0) {
      skippedProjects += 1;
      continue;
    }

    const context = mapProjectContextToTechnologyUsageContext(project.context);

    for (const { technologyId } of project.technologies) {
      try {
        await createTechnologyContext(accessToken, {
          technologyId,
          projectId: project.id,
          context,
          startedAt: toIsoDate(project.startDate),
          endedAt: project.endDate ? toIsoDate(project.endDate) : null,
        });
        created += 1;
      } catch (error) {
        errors.push(
          `project=${project.slug} technology=${technologyId}: ${(error as Error).message}`,
        );
      }
    }
  }

  console.log(
    [
      'Technology context rebuild finished.',
      `Projects scanned: ${projects.length}`,
      `Technology contexts created: ${created}`,
      `Projects skipped (no related technologies): ${skippedProjects}`,
      `Errors: ${errors.length}`,
      ...errors,
    ].join('\n'),
  );

  if (errors.length > 0) {
    process.exitCode = 1;
  }
}

function toIsoDate(value: Date): string {
  return `${value.toISOString().slice(0, 10)}T00:00:00.000Z`;
}

async function login(email: string, password: string): Promise<string> {
  const response = await fetch(
    `${API_BASE_URL}/${ApiRoutes.auth.base}/${ApiRoutes.auth.login}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    },
  );

  if (!response.ok) {
    throw new Error(`Admin login failed with status ${response.status}.`);
  }

  const body = (await response.json()) as LoginResponse;

  return body.accessToken;
}

async function createTechnologyContext(
  accessToken: string,
  payload: {
    technologyId: string;
    projectId: string;
    context: string;
    startedAt: string;
    endedAt: string | null;
  },
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/${ApiRoutes.admin.base}/${ApiRoutes.content.technologyContexts}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HTTP ${response.status}: ${text}`);
  }
}

void main()
  .catch((error: unknown) => {
    console.error('Technology context rebuild failed.', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
