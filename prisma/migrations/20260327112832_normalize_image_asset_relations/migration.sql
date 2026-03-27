/*
  Warnings:

  - Added the required column `folder` to the `image_asset` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ImageAssetKind" AS ENUM ('ICON', 'SCREENSHOT', 'LOGO', 'PROFILE', 'OTHER');

-- AlterTable
ALTER TABLE "customer" RENAME CONSTRAINT "customers_pkey" TO "customer_pkey";

-- AlterTable
ALTER TABLE "experience" RENAME CONSTRAINT "experiences_pkey" TO "experience_pkey";

-- AlterTable
ALTER TABLE "experience_customer" RENAME CONSTRAINT "experience_customers_pkey" TO "experience_customer_pkey";

-- AlterTable
ALTER TABLE "experience_image_asset" RENAME CONSTRAINT "experience_image_assets_pkey" TO "experience_image_asset_pkey";

-- AlterTable
ALTER TABLE "experience_job" RENAME CONSTRAINT "experience_jobs_pkey" TO "experience_job_pkey";

-- AlterTable
ALTER TABLE "experience_link" RENAME CONSTRAINT "experience_links_pkey" TO "experience_link_pkey";

-- AlterTable
ALTER TABLE "experience_technology" RENAME CONSTRAINT "experience_technologies_pkey" TO "experience_technology_pkey";

-- AlterTable
ALTER TABLE "formation" RENAME CONSTRAINT "formations_pkey" TO "formation_pkey";

-- AlterTable
ALTER TABLE "formation_image_asset" RENAME CONSTRAINT "formation_image_assets_pkey" TO "formation_image_asset_pkey";

-- AlterTable
ALTER TABLE "formation_link" RENAME CONSTRAINT "formation_links_pkey" TO "formation_link_pkey";

-- AlterTable
ALTER TABLE "formation_technology" RENAME CONSTRAINT "formation_technologies_pkey" TO "formation_technology_pkey";

-- AlterTable
ALTER TABLE "image_asset" RENAME CONSTRAINT "image_assets_pkey" TO "image_asset_pkey";

-- AlterTable
ALTER TABLE "image_asset"
ADD COLUMN     "folder" TEXT NOT NULL,
ADD COLUMN     "kind" "ImageAssetKind" NOT NULL DEFAULT 'OTHER';

-- AlterTable
ALTER TABLE "job" RENAME CONSTRAINT "jobs_pkey" TO "job_pkey";

-- AlterTable
ALTER TABLE "link" RENAME CONSTRAINT "links_pkey" TO "link_pkey";

-- AlterTable
ALTER TABLE "portfolio_setting" RENAME CONSTRAINT "portfolio_settings_pkey" TO "portfolio_setting_pkey";

-- AlterTable
ALTER TABLE "project" RENAME CONSTRAINT "projects_pkey" TO "project_pkey";

-- AlterTable
ALTER TABLE "project_experience" RENAME CONSTRAINT "project_experiences_pkey" TO "project_experience_pkey";

-- AlterTable
ALTER TABLE "project_image_asset" RENAME CONSTRAINT "project_image_assets_pkey" TO "project_image_asset_pkey";

-- AlterTable
ALTER TABLE "project_link" RENAME CONSTRAINT "project_links_pkey" TO "project_link_pkey";

-- AlterTable
ALTER TABLE "project_tag" RENAME CONSTRAINT "project_tags_pkey" TO "project_tag_pkey";

-- AlterTable
ALTER TABLE "project_technology" RENAME CONSTRAINT "project_technologies_pkey" TO "project_technology_pkey";

-- AlterTable
ALTER TABLE "spoken_language" RENAME CONSTRAINT "spoken_languages_pkey" TO "spoken_language_pkey";

-- AlterTable
ALTER TABLE "tag" RENAME CONSTRAINT "tags_pkey" TO "tag_pkey";

-- AlterTable
ALTER TABLE "technology" RENAME CONSTRAINT "technologies_pkey" TO "technology_pkey";

-- AlterTable
ALTER TABLE "technology_tag" RENAME CONSTRAINT "technology_tags_pkey" TO "technology_tag_pkey";

-- AlterTable
ALTER TABLE "user" RENAME CONSTRAINT "users_pkey" TO "user_pkey";

-- CreateTable
CREATE TABLE "technology_image_asset" (
    "technologyId" UUID NOT NULL,
    "imageAssetId" UUID NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "technology_image_asset_pkey" PRIMARY KEY ("technologyId","imageAssetId")
);

-- CreateTable
CREATE TABLE "spoken_language_image_asset" (
    "spokenLanguageId" UUID NOT NULL,
    "imageAssetId" UUID NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "spoken_language_image_asset_pkey" PRIMARY KEY ("spokenLanguageId","imageAssetId")
);

-- CreateTable
CREATE TABLE "customer_image_asset" (
    "customerId" UUID NOT NULL,
    "imageAssetId" UUID NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "customer_image_asset_pkey" PRIMARY KEY ("customerId","imageAssetId")
);

-- CreateTable
CREATE TABLE "job_image_asset" (
    "jobId" UUID NOT NULL,
    "imageAssetId" UUID NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "job_image_asset_pkey" PRIMARY KEY ("jobId","imageAssetId")
);

-- RenameForeignKey
ALTER TABLE "experience_customer" RENAME CONSTRAINT "experience_customers_customerId_fkey" TO "experience_customer_customerId_fkey";

-- RenameForeignKey
ALTER TABLE "experience_customer" RENAME CONSTRAINT "experience_customers_experienceId_fkey" TO "experience_customer_experienceId_fkey";

-- RenameForeignKey
ALTER TABLE "experience_image_asset" RENAME CONSTRAINT "experience_image_assets_experienceId_fkey" TO "experience_image_asset_experienceId_fkey";

-- RenameForeignKey
ALTER TABLE "experience_image_asset" RENAME CONSTRAINT "experience_image_assets_imageAssetId_fkey" TO "experience_image_asset_imageAssetId_fkey";

-- RenameForeignKey
ALTER TABLE "experience_job" RENAME CONSTRAINT "experience_jobs_experienceId_fkey" TO "experience_job_experienceId_fkey";

-- RenameForeignKey
ALTER TABLE "experience_job" RENAME CONSTRAINT "experience_jobs_jobId_fkey" TO "experience_job_jobId_fkey";

-- RenameForeignKey
ALTER TABLE "experience_link" RENAME CONSTRAINT "experience_links_experienceId_fkey" TO "experience_link_experienceId_fkey";

-- RenameForeignKey
ALTER TABLE "experience_link" RENAME CONSTRAINT "experience_links_linkId_fkey" TO "experience_link_linkId_fkey";

-- RenameForeignKey
ALTER TABLE "experience_technology" RENAME CONSTRAINT "experience_technologies_experienceId_fkey" TO "experience_technology_experienceId_fkey";

-- RenameForeignKey
ALTER TABLE "experience_technology" RENAME CONSTRAINT "experience_technologies_technologyId_fkey" TO "experience_technology_technologyId_fkey";

-- RenameForeignKey
ALTER TABLE "formation_image_asset" RENAME CONSTRAINT "formation_image_assets_formationId_fkey" TO "formation_image_asset_formationId_fkey";

-- RenameForeignKey
ALTER TABLE "formation_image_asset" RENAME CONSTRAINT "formation_image_assets_imageAssetId_fkey" TO "formation_image_asset_imageAssetId_fkey";

-- RenameForeignKey
ALTER TABLE "formation_link" RENAME CONSTRAINT "formation_links_formationId_fkey" TO "formation_link_formationId_fkey";

-- RenameForeignKey
ALTER TABLE "formation_link" RENAME CONSTRAINT "formation_links_linkId_fkey" TO "formation_link_linkId_fkey";

-- RenameForeignKey
ALTER TABLE "formation_technology" RENAME CONSTRAINT "formation_technologies_formationId_fkey" TO "formation_technology_formationId_fkey";

-- RenameForeignKey
ALTER TABLE "formation_technology" RENAME CONSTRAINT "formation_technologies_technologyId_fkey" TO "formation_technology_technologyId_fkey";

-- RenameForeignKey
ALTER TABLE "project_experience" RENAME CONSTRAINT "project_experiences_experienceId_fkey" TO "project_experience_experienceId_fkey";

-- RenameForeignKey
ALTER TABLE "project_experience" RENAME CONSTRAINT "project_experiences_projectId_fkey" TO "project_experience_projectId_fkey";

-- RenameForeignKey
ALTER TABLE "project_image_asset" RENAME CONSTRAINT "project_image_assets_imageAssetId_fkey" TO "project_image_asset_imageAssetId_fkey";

-- RenameForeignKey
ALTER TABLE "project_image_asset" RENAME CONSTRAINT "project_image_assets_projectId_fkey" TO "project_image_asset_projectId_fkey";

-- RenameForeignKey
ALTER TABLE "project_link" RENAME CONSTRAINT "project_links_linkId_fkey" TO "project_link_linkId_fkey";

-- RenameForeignKey
ALTER TABLE "project_link" RENAME CONSTRAINT "project_links_projectId_fkey" TO "project_link_projectId_fkey";

-- RenameForeignKey
ALTER TABLE "project_tag" RENAME CONSTRAINT "project_tags_projectId_fkey" TO "project_tag_projectId_fkey";

-- RenameForeignKey
ALTER TABLE "project_tag" RENAME CONSTRAINT "project_tags_tagId_fkey" TO "project_tag_tagId_fkey";

-- RenameForeignKey
ALTER TABLE "project_technology" RENAME CONSTRAINT "project_technologies_projectId_fkey" TO "project_technology_projectId_fkey";

-- RenameForeignKey
ALTER TABLE "project_technology" RENAME CONSTRAINT "project_technologies_technologyId_fkey" TO "project_technology_technologyId_fkey";

-- RenameForeignKey
ALTER TABLE "technology_tag" RENAME CONSTRAINT "technology_tags_tagId_fkey" TO "technology_tag_tagId_fkey";

-- RenameForeignKey
ALTER TABLE "technology_tag" RENAME CONSTRAINT "technology_tags_technologyId_fkey" TO "technology_tag_technologyId_fkey";

-- AddForeignKey
ALTER TABLE "technology_image_asset" ADD CONSTRAINT "technology_image_asset_technologyId_fkey" FOREIGN KEY ("technologyId") REFERENCES "technology"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "technology_image_asset" ADD CONSTRAINT "technology_image_asset_imageAssetId_fkey" FOREIGN KEY ("imageAssetId") REFERENCES "image_asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spoken_language_image_asset" ADD CONSTRAINT "spoken_language_image_asset_spokenLanguageId_fkey" FOREIGN KEY ("spokenLanguageId") REFERENCES "spoken_language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spoken_language_image_asset" ADD CONSTRAINT "spoken_language_image_asset_imageAssetId_fkey" FOREIGN KEY ("imageAssetId") REFERENCES "image_asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_image_asset" ADD CONSTRAINT "customer_image_asset_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_image_asset" ADD CONSTRAINT "customer_image_asset_imageAssetId_fkey" FOREIGN KEY ("imageAssetId") REFERENCES "image_asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_image_asset" ADD CONSTRAINT "job_image_asset_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_image_asset" ADD CONSTRAINT "job_image_asset_imageAssetId_fkey" FOREIGN KEY ("imageAssetId") REFERENCES "image_asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "customers_slug_key" RENAME TO "customer_slug_key";

-- RenameIndex
ALTER INDEX "experiences_slug_key" RENAME TO "experience_slug_key";

-- RenameIndex
ALTER INDEX "formations_slug_key" RENAME TO "formation_slug_key";

-- RenameIndex
ALTER INDEX "image_assets_filePath_key" RENAME TO "image_asset_filePath_key";

-- RenameIndex
ALTER INDEX "jobs_slug_key" RENAME TO "job_slug_key";

-- RenameIndex
ALTER INDEX "portfolio_settings_key_key" RENAME TO "portfolio_setting_key_key";

-- RenameIndex
ALTER INDEX "projects_slug_key" RENAME TO "project_slug_key";

-- RenameIndex
ALTER INDEX "spoken_languages_code_key" RENAME TO "spoken_language_code_key";

-- RenameIndex
ALTER INDEX "tags_slug_key" RENAME TO "tag_slug_key";

-- RenameIndex
ALTER INDEX "technologies_slug_key" RENAME TO "technology_slug_key";

-- RenameIndex
ALTER INDEX "users_email_key" RENAME TO "user_email_key";
