namespace HansPortfolio.Api.Contracts.Responses;

public sealed record HealthStatusResponse(
    string Status,
    double TotalDuration,
    IReadOnlyCollection<HealthCheckEntryResponse> Checks);
