using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HansPortfolio.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialPortfolioSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "portfolio");

            migrationBuilder.CreateTable(
                name: "customers",
                schema: "portfolio",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Slug = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    SummaryPt = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    SummaryEn = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    Highlight = table.Column<bool>(type: "boolean", nullable: false),
                    SortOrder = table.Column<int>(type: "integer", nullable: false),
                    IsPublished = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_customers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "experiences",
                schema: "portfolio",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Slug = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    CompanyName = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    TitlePt = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    TitleEn = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    SummaryPt = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    SummaryEn = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    DescriptionPt = table.Column<string>(type: "text", nullable: true),
                    DescriptionEn = table.Column<string>(type: "text", nullable: true),
                    StartDate = table.Column<DateOnly>(type: "date", nullable: false),
                    EndDate = table.Column<DateOnly>(type: "date", nullable: true),
                    IsCurrent = table.Column<bool>(type: "boolean", nullable: false),
                    Highlight = table.Column<bool>(type: "boolean", nullable: false),
                    SortOrder = table.Column<int>(type: "integer", nullable: false),
                    IsPublished = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_experiences", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "formations",
                schema: "portfolio",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Slug = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Institution = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    TitlePt = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    TitleEn = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    DegreeType = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    SummaryPt = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    SummaryEn = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    StartDate = table.Column<DateOnly>(type: "date", nullable: false),
                    EndDate = table.Column<DateOnly>(type: "date", nullable: true),
                    Highlight = table.Column<bool>(type: "boolean", nullable: false),
                    SortOrder = table.Column<int>(type: "integer", nullable: false),
                    IsPublished = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_formations", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "image_assets",
                schema: "portfolio",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    FileName = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    FilePath = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    AltPt = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    AltEn = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    CaptionPt = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    CaptionEn = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    MimeType = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Width = table.Column<int>(type: "integer", nullable: false),
                    Height = table.Column<int>(type: "integer", nullable: false),
                    SortOrder = table.Column<int>(type: "integer", nullable: false),
                    IsPublished = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_image_assets", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "jobs",
                schema: "portfolio",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Slug = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    NamePt = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    NameEn = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    SummaryPt = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    SummaryEn = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    Highlight = table.Column<bool>(type: "boolean", nullable: false),
                    SortOrder = table.Column<int>(type: "integer", nullable: false),
                    IsPublished = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_jobs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "links",
                schema: "portfolio",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Url = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    LabelPt = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    LabelEn = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    DescriptionPt = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    DescriptionEn = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    Type = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    SortOrder = table.Column<int>(type: "integer", nullable: false),
                    IsPublished = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_links", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "portfolio_settings",
                schema: "portfolio",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Key = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Value = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_portfolio_settings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "projects",
                schema: "portfolio",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Slug = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    TitlePt = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    TitleEn = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    ShortDescriptionPt = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    ShortDescriptionEn = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    FullDescriptionPt = table.Column<string>(type: "text", nullable: true),
                    FullDescriptionEn = table.Column<string>(type: "text", nullable: true),
                    Context = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Environment = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    RepositoryUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    DeployUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    DocsUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    NpmUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    Featured = table.Column<bool>(type: "boolean", nullable: false),
                    Highlight = table.Column<bool>(type: "boolean", nullable: false),
                    StartDate = table.Column<DateOnly>(type: "date", nullable: true),
                    EndDate = table.Column<DateOnly>(type: "date", nullable: true),
                    SortOrder = table.Column<int>(type: "integer", nullable: false),
                    IsPublished = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_projects", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "spoken_languages",
                schema: "portfolio",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Code = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    NamePt = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    NameEn = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Proficiency = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Highlight = table.Column<bool>(type: "boolean", nullable: false),
                    SortOrder = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_spoken_languages", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "tags",
                schema: "portfolio",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Slug = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    NamePt = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    NameEn = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Type = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    SortOrder = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tags", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "technologies",
                schema: "portfolio",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Slug = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Name = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Category = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Icon = table.Column<string>(type: "character varying(250)", maxLength: 250, nullable: true),
                    OfficialUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    Highlight = table.Column<bool>(type: "boolean", nullable: false),
                    Level = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    UsageFrequency = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    UsageContexts = table.Column<int>(type: "integer", nullable: false),
                    SortOrder = table.Column<int>(type: "integer", nullable: false),
                    IsPublished = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_technologies", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "users",
                schema: "portfolio",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Email = table.Column<string>(type: "character varying(320)", maxLength: 320, nullable: false),
                    PasswordHash = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    Role = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "experience_customers",
                schema: "portfolio",
                columns: table => new
                {
                    ExperienceId = table.Column<Guid>(type: "uuid", nullable: false),
                    CustomerId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_experience_customers", x => new { x.ExperienceId, x.CustomerId });
                    table.ForeignKey(
                        name: "FK_experience_customers_customers_CustomerId",
                        column: x => x.CustomerId,
                        principalSchema: "portfolio",
                        principalTable: "customers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_experience_customers_experiences_ExperienceId",
                        column: x => x.ExperienceId,
                        principalSchema: "portfolio",
                        principalTable: "experiences",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "experience_image_assets",
                schema: "portfolio",
                columns: table => new
                {
                    ExperienceId = table.Column<Guid>(type: "uuid", nullable: false),
                    ImageAssetId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_experience_image_assets", x => new { x.ExperienceId, x.ImageAssetId });
                    table.ForeignKey(
                        name: "FK_experience_image_assets_experiences_ExperienceId",
                        column: x => x.ExperienceId,
                        principalSchema: "portfolio",
                        principalTable: "experiences",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_experience_image_assets_image_assets_ImageAssetId",
                        column: x => x.ImageAssetId,
                        principalSchema: "portfolio",
                        principalTable: "image_assets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "formation_image_assets",
                schema: "portfolio",
                columns: table => new
                {
                    FormationId = table.Column<Guid>(type: "uuid", nullable: false),
                    ImageAssetId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_formation_image_assets", x => new { x.FormationId, x.ImageAssetId });
                    table.ForeignKey(
                        name: "FK_formation_image_assets_formations_FormationId",
                        column: x => x.FormationId,
                        principalSchema: "portfolio",
                        principalTable: "formations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_formation_image_assets_image_assets_ImageAssetId",
                        column: x => x.ImageAssetId,
                        principalSchema: "portfolio",
                        principalTable: "image_assets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "experience_jobs",
                schema: "portfolio",
                columns: table => new
                {
                    ExperienceId = table.Column<Guid>(type: "uuid", nullable: false),
                    JobId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_experience_jobs", x => new { x.ExperienceId, x.JobId });
                    table.ForeignKey(
                        name: "FK_experience_jobs_experiences_ExperienceId",
                        column: x => x.ExperienceId,
                        principalSchema: "portfolio",
                        principalTable: "experiences",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_experience_jobs_jobs_JobId",
                        column: x => x.JobId,
                        principalSchema: "portfolio",
                        principalTable: "jobs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "experience_links",
                schema: "portfolio",
                columns: table => new
                {
                    ExperienceId = table.Column<Guid>(type: "uuid", nullable: false),
                    LinkId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_experience_links", x => new { x.ExperienceId, x.LinkId });
                    table.ForeignKey(
                        name: "FK_experience_links_experiences_ExperienceId",
                        column: x => x.ExperienceId,
                        principalSchema: "portfolio",
                        principalTable: "experiences",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_experience_links_links_LinkId",
                        column: x => x.LinkId,
                        principalSchema: "portfolio",
                        principalTable: "links",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "formation_links",
                schema: "portfolio",
                columns: table => new
                {
                    FormationId = table.Column<Guid>(type: "uuid", nullable: false),
                    LinkId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_formation_links", x => new { x.FormationId, x.LinkId });
                    table.ForeignKey(
                        name: "FK_formation_links_formations_FormationId",
                        column: x => x.FormationId,
                        principalSchema: "portfolio",
                        principalTable: "formations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_formation_links_links_LinkId",
                        column: x => x.LinkId,
                        principalSchema: "portfolio",
                        principalTable: "links",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "project_experiences",
                schema: "portfolio",
                columns: table => new
                {
                    ProjectId = table.Column<Guid>(type: "uuid", nullable: false),
                    ExperienceId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_project_experiences", x => new { x.ProjectId, x.ExperienceId });
                    table.ForeignKey(
                        name: "FK_project_experiences_experiences_ExperienceId",
                        column: x => x.ExperienceId,
                        principalSchema: "portfolio",
                        principalTable: "experiences",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_project_experiences_projects_ProjectId",
                        column: x => x.ProjectId,
                        principalSchema: "portfolio",
                        principalTable: "projects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "project_image_assets",
                schema: "portfolio",
                columns: table => new
                {
                    ProjectId = table.Column<Guid>(type: "uuid", nullable: false),
                    ImageAssetId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_project_image_assets", x => new { x.ProjectId, x.ImageAssetId });
                    table.ForeignKey(
                        name: "FK_project_image_assets_image_assets_ImageAssetId",
                        column: x => x.ImageAssetId,
                        principalSchema: "portfolio",
                        principalTable: "image_assets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_project_image_assets_projects_ProjectId",
                        column: x => x.ProjectId,
                        principalSchema: "portfolio",
                        principalTable: "projects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "project_links",
                schema: "portfolio",
                columns: table => new
                {
                    ProjectId = table.Column<Guid>(type: "uuid", nullable: false),
                    LinkId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_project_links", x => new { x.ProjectId, x.LinkId });
                    table.ForeignKey(
                        name: "FK_project_links_links_LinkId",
                        column: x => x.LinkId,
                        principalSchema: "portfolio",
                        principalTable: "links",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_project_links_projects_ProjectId",
                        column: x => x.ProjectId,
                        principalSchema: "portfolio",
                        principalTable: "projects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "project_tags",
                schema: "portfolio",
                columns: table => new
                {
                    ProjectId = table.Column<Guid>(type: "uuid", nullable: false),
                    TagId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_project_tags", x => new { x.ProjectId, x.TagId });
                    table.ForeignKey(
                        name: "FK_project_tags_projects_ProjectId",
                        column: x => x.ProjectId,
                        principalSchema: "portfolio",
                        principalTable: "projects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_project_tags_tags_TagId",
                        column: x => x.TagId,
                        principalSchema: "portfolio",
                        principalTable: "tags",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "experience_technologies",
                schema: "portfolio",
                columns: table => new
                {
                    ExperienceId = table.Column<Guid>(type: "uuid", nullable: false),
                    TechnologyId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_experience_technologies", x => new { x.ExperienceId, x.TechnologyId });
                    table.ForeignKey(
                        name: "FK_experience_technologies_experiences_ExperienceId",
                        column: x => x.ExperienceId,
                        principalSchema: "portfolio",
                        principalTable: "experiences",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_experience_technologies_technologies_TechnologyId",
                        column: x => x.TechnologyId,
                        principalSchema: "portfolio",
                        principalTable: "technologies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "formation_technologies",
                schema: "portfolio",
                columns: table => new
                {
                    FormationId = table.Column<Guid>(type: "uuid", nullable: false),
                    TechnologyId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_formation_technologies", x => new { x.FormationId, x.TechnologyId });
                    table.ForeignKey(
                        name: "FK_formation_technologies_formations_FormationId",
                        column: x => x.FormationId,
                        principalSchema: "portfolio",
                        principalTable: "formations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_formation_technologies_technologies_TechnologyId",
                        column: x => x.TechnologyId,
                        principalSchema: "portfolio",
                        principalTable: "technologies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "project_technologies",
                schema: "portfolio",
                columns: table => new
                {
                    ProjectId = table.Column<Guid>(type: "uuid", nullable: false),
                    TechnologyId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_project_technologies", x => new { x.ProjectId, x.TechnologyId });
                    table.ForeignKey(
                        name: "FK_project_technologies_projects_ProjectId",
                        column: x => x.ProjectId,
                        principalSchema: "portfolio",
                        principalTable: "projects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_project_technologies_technologies_TechnologyId",
                        column: x => x.TechnologyId,
                        principalSchema: "portfolio",
                        principalTable: "technologies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "technology_tags",
                schema: "portfolio",
                columns: table => new
                {
                    TechnologyId = table.Column<Guid>(type: "uuid", nullable: false),
                    TagId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_technology_tags", x => new { x.TechnologyId, x.TagId });
                    table.ForeignKey(
                        name: "FK_technology_tags_tags_TagId",
                        column: x => x.TagId,
                        principalSchema: "portfolio",
                        principalTable: "tags",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_technology_tags_technologies_TechnologyId",
                        column: x => x.TechnologyId,
                        principalSchema: "portfolio",
                        principalTable: "technologies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_customers_Slug",
                schema: "portfolio",
                table: "customers",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_experience_customers_CustomerId",
                schema: "portfolio",
                table: "experience_customers",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_experience_image_assets_ImageAssetId",
                schema: "portfolio",
                table: "experience_image_assets",
                column: "ImageAssetId");

            migrationBuilder.CreateIndex(
                name: "IX_experience_jobs_JobId",
                schema: "portfolio",
                table: "experience_jobs",
                column: "JobId");

            migrationBuilder.CreateIndex(
                name: "IX_experience_links_LinkId",
                schema: "portfolio",
                table: "experience_links",
                column: "LinkId");

            migrationBuilder.CreateIndex(
                name: "IX_experience_technologies_TechnologyId",
                schema: "portfolio",
                table: "experience_technologies",
                column: "TechnologyId");

            migrationBuilder.CreateIndex(
                name: "IX_experiences_Slug",
                schema: "portfolio",
                table: "experiences",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_formation_image_assets_ImageAssetId",
                schema: "portfolio",
                table: "formation_image_assets",
                column: "ImageAssetId");

            migrationBuilder.CreateIndex(
                name: "IX_formation_links_LinkId",
                schema: "portfolio",
                table: "formation_links",
                column: "LinkId");

            migrationBuilder.CreateIndex(
                name: "IX_formation_technologies_TechnologyId",
                schema: "portfolio",
                table: "formation_technologies",
                column: "TechnologyId");

            migrationBuilder.CreateIndex(
                name: "IX_formations_Slug",
                schema: "portfolio",
                table: "formations",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_jobs_Slug",
                schema: "portfolio",
                table: "jobs",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_portfolio_settings_Key",
                schema: "portfolio",
                table: "portfolio_settings",
                column: "Key",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_project_experiences_ExperienceId",
                schema: "portfolio",
                table: "project_experiences",
                column: "ExperienceId");

            migrationBuilder.CreateIndex(
                name: "IX_project_image_assets_ImageAssetId",
                schema: "portfolio",
                table: "project_image_assets",
                column: "ImageAssetId");

            migrationBuilder.CreateIndex(
                name: "IX_project_links_LinkId",
                schema: "portfolio",
                table: "project_links",
                column: "LinkId");

            migrationBuilder.CreateIndex(
                name: "IX_project_tags_TagId",
                schema: "portfolio",
                table: "project_tags",
                column: "TagId");

            migrationBuilder.CreateIndex(
                name: "IX_project_technologies_TechnologyId",
                schema: "portfolio",
                table: "project_technologies",
                column: "TechnologyId");

            migrationBuilder.CreateIndex(
                name: "IX_projects_Slug",
                schema: "portfolio",
                table: "projects",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_spoken_languages_Code",
                schema: "portfolio",
                table: "spoken_languages",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_tags_Slug",
                schema: "portfolio",
                table: "tags",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_technologies_Slug",
                schema: "portfolio",
                table: "technologies",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_technology_tags_TagId",
                schema: "portfolio",
                table: "technology_tags",
                column: "TagId");

            migrationBuilder.CreateIndex(
                name: "IX_users_Email",
                schema: "portfolio",
                table: "users",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "experience_customers",
                schema: "portfolio");

            migrationBuilder.DropTable(
                name: "experience_image_assets",
                schema: "portfolio");

            migrationBuilder.DropTable(
                name: "experience_jobs",
                schema: "portfolio");

            migrationBuilder.DropTable(
                name: "experience_links",
                schema: "portfolio");

            migrationBuilder.DropTable(
                name: "experience_technologies",
                schema: "portfolio");

            migrationBuilder.DropTable(
                name: "formation_image_assets",
                schema: "portfolio");

            migrationBuilder.DropTable(
                name: "formation_links",
                schema: "portfolio");

            migrationBuilder.DropTable(
                name: "formation_technologies",
                schema: "portfolio");

            migrationBuilder.DropTable(
                name: "portfolio_settings",
                schema: "portfolio");

            migrationBuilder.DropTable(
                name: "project_experiences",
                schema: "portfolio");

            migrationBuilder.DropTable(
                name: "project_image_assets",
                schema: "portfolio");

            migrationBuilder.DropTable(
                name: "project_links",
                schema: "portfolio");

            migrationBuilder.DropTable(
                name: "project_tags",
                schema: "portfolio");

            migrationBuilder.DropTable(
                name: "project_technologies",
                schema: "portfolio");

            migrationBuilder.DropTable(
                name: "spoken_languages",
                schema: "portfolio");

            migrationBuilder.DropTable(
                name: "technology_tags",
                schema: "portfolio");

            migrationBuilder.DropTable(
                name: "users",
                schema: "portfolio");

            migrationBuilder.DropTable(
                name: "customers",
                schema: "portfolio");

            migrationBuilder.DropTable(
                name: "jobs",
                schema: "portfolio");

            migrationBuilder.DropTable(
                name: "formations",
                schema: "portfolio");

            migrationBuilder.DropTable(
                name: "experiences",
                schema: "portfolio");

            migrationBuilder.DropTable(
                name: "image_assets",
                schema: "portfolio");

            migrationBuilder.DropTable(
                name: "links",
                schema: "portfolio");

            migrationBuilder.DropTable(
                name: "projects",
                schema: "portfolio");

            migrationBuilder.DropTable(
                name: "tags",
                schema: "portfolio");

            migrationBuilder.DropTable(
                name: "technologies",
                schema: "portfolio");
        }
    }
}
