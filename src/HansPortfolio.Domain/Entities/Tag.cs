namespace HansPortfolio.Domain.Entities;

public sealed class Tag : BaseEntity
{
    public required string Slug { get; set; }

    public required string NamePt { get; set; }

    public required string NameEn { get; set; }

    public required string Type { get; set; }

    public int SortOrder { get; set; }

    public ICollection<ProjectTag> ProjectTags { get; set; } = [];

    public ICollection<TechnologyTag> TechnologyTags { get; set; } = [];
}
