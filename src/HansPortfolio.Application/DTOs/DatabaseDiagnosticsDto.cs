namespace HansPortfolio.Application.DTOs;

public sealed record DatabaseDiagnosticsDto(
    bool IsConnected,
    int Probe,
    string DatabaseName,
    string CurrentSchema,
    string ServerVersion,
    DateTimeOffset ExecutedAtUtc);
