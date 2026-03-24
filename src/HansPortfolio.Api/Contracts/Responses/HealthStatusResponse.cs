using System.Diagnostics.CodeAnalysis;

namespace HansPortfolio.Api.Contracts.Responses;

[ExcludeFromCodeCoverage]
public sealed record HealthStatusResponse(
    string Status,
    double TotalDuration,
    IReadOnlyCollection<HealthCheckEntryResponse> Checks);
