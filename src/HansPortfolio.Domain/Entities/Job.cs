namespace HansPortfolio.Domain.Entities;

public sealed class Job : BaseEntity
{
    public required string Slug { get; set; }

    public required string NamePt { get; set; }

    public required string NameEn { get; set; }

    public required string SummaryPt { get; set; }

    public required string SummaryEn { get; set; }

    public bool Highlight { get; set; }

    public int SortOrder { get; set; }

    public bool IsPublished { get; set; }

    public ICollection<ExperienceJob> ExperienceJobs { get; set; } = [];
}
