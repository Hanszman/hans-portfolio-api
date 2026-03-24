using HansPortfolio.Application.DTOs;
using HansPortfolio.Application.Interfaces;

namespace HansPortfolio.Api.Tests.Support;

public sealed class FakeDatabaseDiagnosticsService(DatabaseDiagnosticsDto diagnostics) : IDatabaseDiagnosticsService
{
    public Task<DatabaseDiagnosticsDto> GetDiagnosticsAsync(CancellationToken cancellationToken = default)
    {
        return Task.FromResult(diagnostics);
    }
}
