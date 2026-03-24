using HansPortfolio.Application.DTOs;

namespace HansPortfolio.Application.Interfaces;

public interface IDatabaseDiagnosticsService
{
    Task<DatabaseDiagnosticsDto> GetDiagnosticsAsync(CancellationToken cancellationToken = default);
}
