using System.Diagnostics.CodeAnalysis;

namespace HansPortfolio.Api.Contracts.Responses;

[ExcludeFromCodeCoverage]
public sealed record DatabaseConnectionResponse(
    bool IsConnected,
    int Probe,
    string DatabaseName,
    string CurrentSchema,
    string ServerVersion,
    DateTimeOffset ExecutedAtUtc);
