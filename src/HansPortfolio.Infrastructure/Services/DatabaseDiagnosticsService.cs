using HansPortfolio.Application.DTOs;
using HansPortfolio.Application.Interfaces;
using HansPortfolio.Infrastructure.Data.Context;
using Microsoft.EntityFrameworkCore;

namespace HansPortfolio.Infrastructure.Services;

public sealed class DatabaseDiagnosticsService(PortfolioDbContext dbContext) : IDatabaseDiagnosticsService
{
    public async Task<DatabaseDiagnosticsDto> GetDiagnosticsAsync(CancellationToken cancellationToken = default)
    {
        var connection = dbContext.Database.GetDbConnection();

        var shouldCloseConnection = connection.State != System.Data.ConnectionState.Open;

        if (shouldCloseConnection)
        {
            await connection.OpenAsync(cancellationToken);
        }

        try
        {
            await using var command = connection.CreateCommand();
            command.CommandText = """
                SELECT
                    1 AS probe,
                    current_database() AS database_name,
                    current_schema() AS current_schema,
                    current_setting('server_version') AS server_version,
                    CURRENT_TIMESTAMP AT TIME ZONE 'UTC' AS executed_at_utc
                """;

            await using var reader = await command.ExecuteReaderAsync(cancellationToken);

            if (!await reader.ReadAsync(cancellationToken))
            {
                throw new InvalidOperationException("The database diagnostics query returned no rows.");
            }

            return new DatabaseDiagnosticsDto(
                IsConnected: true,
                Probe: reader.GetInt32(0),
                DatabaseName: reader.GetString(1),
                CurrentSchema: reader.GetString(2),
                ServerVersion: reader.GetString(3),
                ExecutedAtUtc: DateTime.SpecifyKind(reader.GetDateTime(4), DateTimeKind.Utc));
        }
        finally
        {
            if (shouldCloseConnection)
            {
                await connection.CloseAsync();
            }
        }
    }
}
