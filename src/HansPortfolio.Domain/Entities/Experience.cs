namespace HansPortfolio.Domain.Entities;

public sealed class Experience : AuditableEntity
{
    public required string Slug { get; set; }

    public required string CompanyName { get; set; }

    public required string TitlePt { get; set; }

    public required string TitleEn { get; set; }

    public required string SummaryPt { get; set; }

    public required string SummaryEn { get; set; }

    public string? DescriptionPt { get; set; }

    public string? DescriptionEn { get; set; }

    public DateOnly StartDate { get; set; }

    public DateOnly? EndDate { get; set; }

    public bool IsCurrent { get; set; }

    public bool Highlight { get; set; }

    public int SortOrder { get; set; }

    public bool IsPublished { get; set; }

    public ICollection<ExperienceTechnology> ExperienceTechnologies { get; set; } = [];

    public ICollection<ProjectExperience> ProjectExperiences { get; set; } = [];

    public ICollection<ExperienceCustomer> ExperienceCustomers { get; set; } = [];

    public ICollection<ExperienceJob> ExperienceJobs { get; set; } = [];

    public ICollection<ExperienceLink> ExperienceLinks { get; set; } = [];

    public ICollection<ExperienceImageAsset> ExperienceImageAssets { get; set; } = [];
}
