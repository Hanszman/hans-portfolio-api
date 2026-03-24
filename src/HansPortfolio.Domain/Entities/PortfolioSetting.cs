namespace HansPortfolio.Domain.Entities;

public sealed class PortfolioSetting : BaseEntity
{
    public required string Key { get; set; }

    public required string Value { get; set; }

    public string? Description { get; set; }
}
