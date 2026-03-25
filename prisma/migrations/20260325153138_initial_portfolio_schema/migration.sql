-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'EDITOR');

-- CreateEnum
CREATE TYPE "ProjectContext" AS ENUM ('PROFESSIONAL', 'PERSONAL', 'ACADEMIC', 'STUDY');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('COMPLETED', 'IN_PROGRESS', 'ARCHIVED', 'PLANNED');

-- CreateEnum
CREATE TYPE "ProjectEnvironment" AS ENUM ('FRONTEND', 'BACKEND', 'FULLSTACK', 'MOBILE', 'LIBRARY', 'DASHBOARD');

-- CreateEnum
CREATE TYPE "TechnologyCategory" AS ENUM ('LANGUAGE', 'FRAMEWORK', 'LIBRARY', 'TOOL', 'DATABASE', 'CLOUD', 'TESTING', 'DEVOPS', 'STYLING', 'ARCHITECTURE', 'OTHER');

-- CreateEnum
CREATE TYPE "TechnologyLevel" AS ENUM ('BASIC', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "TechnologyUsageFrequency" AS ENUM ('FREQUENT', 'OCCASIONAL', 'PREVIOUSLY_USED', 'STUDYING');

-- CreateEnum
CREATE TYPE "TechnologyUsageContext" AS ENUM ('PROFESSIONAL', 'PERSONAL', 'ACADEMIC', 'STUDY');

-- CreateEnum
CREATE TYPE "DegreeType" AS ENUM ('TECHNICAL', 'BACHELOR', 'POSTGRADUATE', 'MBA', 'MASTER', 'DOCTORATE', 'BOOTCAMP', 'CERTIFICATION', 'COURSE', 'OTHER');

-- CreateEnum
CREATE TYPE "SpokenLanguageProficiency" AS ENUM ('NATIVE', 'FLUENT', 'ADVANCED', 'INTERMEDIATE', 'BASIC');

-- CreateEnum
CREATE TYPE "LinkType" AS ENUM ('GITHUB', 'DEPLOY', 'NPM', 'DOCS', 'LINKEDIN', 'WEBSITE', 'ARTICLE', 'FIGMA', 'OTHER');

-- CreateEnum
CREATE TYPE "TagType" AS ENUM ('STACK', 'DOMAIN', 'PLATFORM', 'HIGHLIGHT', 'METHODOLOGY', 'INDUSTRY', 'OTHER');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'ADMIN',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "titlePt" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "shortDescriptionPt" TEXT NOT NULL,
    "shortDescriptionEn" TEXT NOT NULL,
    "fullDescriptionPt" TEXT NOT NULL,
    "fullDescriptionEn" TEXT NOT NULL,
    "context" "ProjectContext" NOT NULL,
    "status" "ProjectStatus" NOT NULL,
    "environment" "ProjectEnvironment" NOT NULL,
    "repositoryUrl" TEXT,
    "deployUrl" TEXT,
    "docsUrl" TEXT,
    "npmUrl" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "highlight" BOOLEAN NOT NULL DEFAULT false,
    "startDate" DATE,
    "endDate" DATE,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experiences" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "titlePt" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "summaryPt" TEXT NOT NULL,
    "summaryEn" TEXT NOT NULL,
    "descriptionPt" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE,
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "highlight" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "experiences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "technologies" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "TechnologyCategory" NOT NULL,
    "icon" TEXT,
    "officialUrl" TEXT,
    "highlight" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "technologies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "formations" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "titlePt" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "degreeType" "DegreeType" NOT NULL,
    "summaryPt" TEXT NOT NULL,
    "summaryEn" TEXT NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE,
    "highlight" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "formations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spoken_languages" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "namePt" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "proficiency" "SpokenLanguageProficiency" NOT NULL,
    "highlight" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spoken_languages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "summaryPt" TEXT NOT NULL,
    "summaryEn" TEXT NOT NULL,
    "highlight" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobs" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "namePt" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "summaryPt" TEXT NOT NULL,
    "summaryEn" TEXT NOT NULL,
    "highlight" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "links" (
    "id" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "labelPt" TEXT NOT NULL,
    "labelEn" TEXT NOT NULL,
    "descriptionPt" TEXT,
    "descriptionEn" TEXT,
    "type" "LinkType" NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "image_assets" (
    "id" UUID NOT NULL,
    "fileName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "altPt" TEXT,
    "altEn" TEXT,
    "captionPt" TEXT,
    "captionEn" TEXT,
    "mimeType" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "image_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "namePt" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "type" "TagType" NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portfolio_settings" (
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "portfolio_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_technologies" (
    "projectId" UUID NOT NULL,
    "technologyId" UUID NOT NULL,
    "level" "TechnologyLevel",
    "frequency" "TechnologyUsageFrequency",
    "contexts" "TechnologyUsageContext"[] DEFAULT ARRAY[]::"TechnologyUsageContext"[],

    CONSTRAINT "project_technologies_pkey" PRIMARY KEY ("projectId","technologyId")
);

-- CreateTable
CREATE TABLE "experience_technologies" (
    "experienceId" UUID NOT NULL,
    "technologyId" UUID NOT NULL,
    "level" "TechnologyLevel",
    "frequency" "TechnologyUsageFrequency",
    "contexts" "TechnologyUsageContext"[] DEFAULT ARRAY[]::"TechnologyUsageContext"[],

    CONSTRAINT "experience_technologies_pkey" PRIMARY KEY ("experienceId","technologyId")
);

-- CreateTable
CREATE TABLE "formation_technologies" (
    "formationId" UUID NOT NULL,
    "technologyId" UUID NOT NULL,
    "level" "TechnologyLevel",
    "frequency" "TechnologyUsageFrequency",
    "contexts" "TechnologyUsageContext"[] DEFAULT ARRAY[]::"TechnologyUsageContext"[],

    CONSTRAINT "formation_technologies_pkey" PRIMARY KEY ("formationId","technologyId")
);

-- CreateTable
CREATE TABLE "project_experiences" (
    "projectId" UUID NOT NULL,
    "experienceId" UUID NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "project_experiences_pkey" PRIMARY KEY ("projectId","experienceId")
);

-- CreateTable
CREATE TABLE "experience_customers" (
    "experienceId" UUID NOT NULL,
    "customerId" UUID NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "experience_customers_pkey" PRIMARY KEY ("experienceId","customerId")
);

-- CreateTable
CREATE TABLE "experience_jobs" (
    "experienceId" UUID NOT NULL,
    "jobId" UUID NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "experience_jobs_pkey" PRIMARY KEY ("experienceId","jobId")
);

-- CreateTable
CREATE TABLE "project_tags" (
    "projectId" UUID NOT NULL,
    "tagId" UUID NOT NULL,

    CONSTRAINT "project_tags_pkey" PRIMARY KEY ("projectId","tagId")
);

-- CreateTable
CREATE TABLE "technology_tags" (
    "technologyId" UUID NOT NULL,
    "tagId" UUID NOT NULL,

    CONSTRAINT "technology_tags_pkey" PRIMARY KEY ("technologyId","tagId")
);

-- CreateTable
CREATE TABLE "project_links" (
    "projectId" UUID NOT NULL,
    "linkId" UUID NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "project_links_pkey" PRIMARY KEY ("projectId","linkId")
);

-- CreateTable
CREATE TABLE "experience_links" (
    "experienceId" UUID NOT NULL,
    "linkId" UUID NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "experience_links_pkey" PRIMARY KEY ("experienceId","linkId")
);

-- CreateTable
CREATE TABLE "formation_links" (
    "formationId" UUID NOT NULL,
    "linkId" UUID NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "formation_links_pkey" PRIMARY KEY ("formationId","linkId")
);

-- CreateTable
CREATE TABLE "project_image_assets" (
    "projectId" UUID NOT NULL,
    "imageAssetId" UUID NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "project_image_assets_pkey" PRIMARY KEY ("projectId","imageAssetId")
);

-- CreateTable
CREATE TABLE "experience_image_assets" (
    "experienceId" UUID NOT NULL,
    "imageAssetId" UUID NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "experience_image_assets_pkey" PRIMARY KEY ("experienceId","imageAssetId")
);

-- CreateTable
CREATE TABLE "formation_image_assets" (
    "formationId" UUID NOT NULL,
    "imageAssetId" UUID NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "formation_image_assets_pkey" PRIMARY KEY ("formationId","imageAssetId")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "projects_slug_key" ON "projects"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "experiences_slug_key" ON "experiences"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "technologies_slug_key" ON "technologies"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "formations_slug_key" ON "formations"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "spoken_languages_code_key" ON "spoken_languages"("code");

-- CreateIndex
CREATE UNIQUE INDEX "customers_slug_key" ON "customers"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "jobs_slug_key" ON "jobs"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "image_assets_filePath_key" ON "image_assets"("filePath");

-- CreateIndex
CREATE UNIQUE INDEX "tags_slug_key" ON "tags"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "portfolio_settings_key_key" ON "portfolio_settings"("key");

-- AddForeignKey
ALTER TABLE "project_technologies" ADD CONSTRAINT "project_technologies_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_technologies" ADD CONSTRAINT "project_technologies_technologyId_fkey" FOREIGN KEY ("technologyId") REFERENCES "technologies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experience_technologies" ADD CONSTRAINT "experience_technologies_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "experiences"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experience_technologies" ADD CONSTRAINT "experience_technologies_technologyId_fkey" FOREIGN KEY ("technologyId") REFERENCES "technologies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formation_technologies" ADD CONSTRAINT "formation_technologies_formationId_fkey" FOREIGN KEY ("formationId") REFERENCES "formations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formation_technologies" ADD CONSTRAINT "formation_technologies_technologyId_fkey" FOREIGN KEY ("technologyId") REFERENCES "technologies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_experiences" ADD CONSTRAINT "project_experiences_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_experiences" ADD CONSTRAINT "project_experiences_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "experiences"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experience_customers" ADD CONSTRAINT "experience_customers_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "experiences"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experience_customers" ADD CONSTRAINT "experience_customers_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experience_jobs" ADD CONSTRAINT "experience_jobs_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "experiences"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experience_jobs" ADD CONSTRAINT "experience_jobs_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_tags" ADD CONSTRAINT "project_tags_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_tags" ADD CONSTRAINT "project_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "technology_tags" ADD CONSTRAINT "technology_tags_technologyId_fkey" FOREIGN KEY ("technologyId") REFERENCES "technologies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "technology_tags" ADD CONSTRAINT "technology_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_links" ADD CONSTRAINT "project_links_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_links" ADD CONSTRAINT "project_links_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "links"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experience_links" ADD CONSTRAINT "experience_links_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "experiences"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experience_links" ADD CONSTRAINT "experience_links_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "links"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formation_links" ADD CONSTRAINT "formation_links_formationId_fkey" FOREIGN KEY ("formationId") REFERENCES "formations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formation_links" ADD CONSTRAINT "formation_links_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "links"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_image_assets" ADD CONSTRAINT "project_image_assets_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_image_assets" ADD CONSTRAINT "project_image_assets_imageAssetId_fkey" FOREIGN KEY ("imageAssetId") REFERENCES "image_assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experience_image_assets" ADD CONSTRAINT "experience_image_assets_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "experiences"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experience_image_assets" ADD CONSTRAINT "experience_image_assets_imageAssetId_fkey" FOREIGN KEY ("imageAssetId") REFERENCES "image_assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formation_image_assets" ADD CONSTRAINT "formation_image_assets_formationId_fkey" FOREIGN KEY ("formationId") REFERENCES "formations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "formation_image_assets" ADD CONSTRAINT "formation_image_assets_imageAssetId_fkey" FOREIGN KEY ("imageAssetId") REFERENCES "image_assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
