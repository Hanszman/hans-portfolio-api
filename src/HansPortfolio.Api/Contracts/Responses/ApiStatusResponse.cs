using System.Diagnostics.CodeAnalysis;

namespace HansPortfolio.Api.Contracts.Responses;

[ExcludeFromCodeCoverage]
public sealed record ApiStatusResponse(
    string Name,
    string Environment,
    string Status,
    DateTimeOffset UtcNow);
