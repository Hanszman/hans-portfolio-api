-- Drop the Job<->ImageAsset join table and the Formation/Technology/Experience
-- <->Link join tables. Project.links (project_link) is not in scope and stays.

DROP TABLE "job_image_asset";
DROP TABLE "formation_link";
DROP TABLE "technology_link";
DROP TABLE "experience_link";
