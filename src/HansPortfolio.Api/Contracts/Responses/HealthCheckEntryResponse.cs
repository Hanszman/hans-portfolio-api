namespace HansPortfolio.Api.Contracts.Responses;

public sealed record HealthCheckEntryResponse(
    string Name,
    string Status,
    string? Description,
    double Duration,
    string? Error);
