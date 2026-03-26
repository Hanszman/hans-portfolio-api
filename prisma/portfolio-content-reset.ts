import type { PrismaClient } from '@prisma/client';

export async function resetPortfolioContent(prisma: PrismaClient): Promise<void> {
  await prisma.$transaction([
    prisma.projectTechnology.deleteMany(),
    prisma.experienceTechnology.deleteMany(),
    prisma.formationTechnology.deleteMany(),
    prisma.projectExperience.deleteMany(),
    prisma.experienceCustomer.deleteMany(),
    prisma.experienceJob.deleteMany(),
    prisma.projectTag.deleteMany(),
    prisma.technologyTag.deleteMany(),
    prisma.projectLink.deleteMany(),
    prisma.experienceLink.deleteMany(),
    prisma.formationLink.deleteMany(),
    prisma.projectImageAsset.deleteMany(),
    prisma.experienceImageAsset.deleteMany(),
    prisma.formationImageAsset.deleteMany(),
    prisma.imageAsset.deleteMany(),
    prisma.link.deleteMany(),
    prisma.portfolioSetting.deleteMany(),
    prisma.project.deleteMany(),
    prisma.experience.deleteMany(),
    prisma.formation.deleteMany(),
    prisma.spokenLanguage.deleteMany(),
    prisma.customer.deleteMany(),
    prisma.job.deleteMany(),
    prisma.technology.deleteMany(),
    prisma.tag.deleteMany(),
  ]);
}
