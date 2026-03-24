namespace HansPortfolio.Api.Contracts.Responses;

public sealed record DatabaseConnectionResponse(
    bool IsConnected,
    int Probe,
    string DatabaseName,
    string CurrentSchema,
    string ServerVersion,
    DateTimeOffset ExecutedAtUtc);
