using HansPortfolio.Domain.Enums;

namespace HansPortfolio.Domain.Entities;

public sealed class Link : AuditableEntity
{
    public required string Url { get; set; }

    public required string LabelPt { get; set; }

    public required string LabelEn { get; set; }

    public string? DescriptionPt { get; set; }

    public string? DescriptionEn { get; set; }

    public LinkType Type { get; set; }

    public int SortOrder { get; set; }

    public bool IsPublished { get; set; }

    public ICollection<ProjectLink> ProjectLinks { get; set; } = [];

    public ICollection<ExperienceLink> ExperienceLinks { get; set; } = [];

    public ICollection<FormationLink> FormationLinks { get; set; } = [];
}
