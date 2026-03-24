using HansPortfolio.Domain.Enums;

namespace HansPortfolio.Domain.Entities;

public sealed class Technology : AuditableEntity
{
    public required string Slug { get; set; }

    public required string Name { get; set; }

    public TechnologyCategory Category { get; set; }

    public string? Icon { get; set; }

    public string? OfficialUrl { get; set; }

    public bool Highlight { get; set; }

    public ProficiencyLevel Level { get; set; }

    public UsageFrequency UsageFrequency { get; set; }

    public UsageContext UsageContexts { get; set; }

    public int SortOrder { get; set; }

    public bool IsPublished { get; set; }

    public ICollection<ProjectTechnology> ProjectTechnologies { get; set; } = [];

    public ICollection<ExperienceTechnology> ExperienceTechnologies { get; set; } = [];

    public ICollection<FormationTechnology> FormationTechnologies { get; set; } = [];

    public ICollection<TechnologyTag> TechnologyTags { get; set; } = [];
}
