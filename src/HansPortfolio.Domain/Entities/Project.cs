using HansPortfolio.Domain.Enums;

namespace HansPortfolio.Domain.Entities;

public sealed class Project : AuditableEntity
{
    public required string Slug { get; set; }

    public required string TitlePt { get; set; }

    public required string TitleEn { get; set; }

    public required string ShortDescriptionPt { get; set; }

    public required string ShortDescriptionEn { get; set; }

    public string? FullDescriptionPt { get; set; }

    public string? FullDescriptionEn { get; set; }

    public ProjectContext Context { get; set; }

    public ProjectStatus Status { get; set; }

    public ProjectEnvironment Environment { get; set; }

    public string? RepositoryUrl { get; set; }

    public string? DeployUrl { get; set; }

    public string? DocsUrl { get; set; }

    public string? NpmUrl { get; set; }

    public bool Featured { get; set; }

    public bool Highlight { get; set; }

    public DateOnly? StartDate { get; set; }

    public DateOnly? EndDate { get; set; }

    public int SortOrder { get; set; }

    public bool IsPublished { get; set; }

    public ICollection<ProjectTechnology> ProjectTechnologies { get; set; } = [];

    public ICollection<ProjectExperience> ProjectExperiences { get; set; } = [];

    public ICollection<ProjectTag> ProjectTags { get; set; } = [];

    public ICollection<ProjectLink> ProjectLinks { get; set; } = [];

    public ICollection<ProjectImageAsset> ProjectImageAssets { get; set; } = [];
}
