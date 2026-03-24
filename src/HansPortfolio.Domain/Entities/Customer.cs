namespace HansPortfolio.Domain.Entities;

public sealed class Customer : BaseEntity
{
    public required string Slug { get; set; }

    public required string Name { get; set; }

    public required string SummaryPt { get; set; }

    public required string SummaryEn { get; set; }

    public bool Highlight { get; set; }

    public int SortOrder { get; set; }

    public bool IsPublished { get; set; }

    public ICollection<ExperienceCustomer> ExperienceCustomers { get; set; } = [];
}
