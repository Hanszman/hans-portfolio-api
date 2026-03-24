namespace HansPortfolio.Api.Contracts.Responses;

public sealed record ApiStatusResponse(
    string Name,
    string Environment,
    string Status,
    DateTimeOffset UtcNow);
