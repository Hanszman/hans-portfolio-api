using System.Diagnostics.CodeAnalysis;

namespace HansPortfolio.Api.Contracts.Responses;

[ExcludeFromCodeCoverage]
public sealed record HealthCheckEntryResponse(
    string Name,
    string Status,
    string? Description,
    double Duration,
    string? Error);
