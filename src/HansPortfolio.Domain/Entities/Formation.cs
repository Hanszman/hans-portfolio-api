using HansPortfolio.Domain.Enums;

namespace HansPortfolio.Domain.Entities;

public sealed class Formation : AuditableEntity
{
    public required string Slug { get; set; }

    public required string Institution { get; set; }

    public required string TitlePt { get; set; }

    public required string TitleEn { get; set; }

    public DegreeType DegreeType { get; set; }

    public required string SummaryPt { get; set; }

    public required string SummaryEn { get; set; }

    public DateOnly StartDate { get; set; }

    public DateOnly? EndDate { get; set; }

    public bool Highlight { get; set; }

    public int SortOrder { get; set; }

    public bool IsPublished { get; set; }

    public ICollection<FormationTechnology> FormationTechnologies { get; set; } = [];

    public ICollection<FormationLink> FormationLinks { get; set; } = [];

    public ICollection<FormationImageAsset> FormationImageAssets { get; set; } = [];
}
