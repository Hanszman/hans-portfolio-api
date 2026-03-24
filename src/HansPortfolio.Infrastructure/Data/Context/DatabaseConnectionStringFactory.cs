using Microsoft.Extensions.Configuration;
using Npgsql;

namespace HansPortfolio.Infrastructure.Data.Context;

internal static class DatabaseConnectionStringFactory
{
    public static string Create(IConfiguration configuration)
    {
        var configuredConnectionString = configuration.GetConnectionString("PortfolioDatabase");

        if (!string.IsNullOrWhiteSpace(configuredConnectionString))
        {
            return configuredConnectionString;
        }

        var host = FirstValue(
            configuration[$"{DatabaseOptions.SectionName}:Host"],
            configuration["PGHOST"]);
        var databaseName = FirstValue(
            configuration[$"{DatabaseOptions.SectionName}:Name"],
            configuration["PGDATABASE"]);
        var username = FirstValue(
            configuration[$"{DatabaseOptions.SectionName}:Username"],
            configuration["PGUSER"]);
        var password = FirstValue(
            configuration[$"{DatabaseOptions.SectionName}:Password"],
            configuration["PGPASSWORD"]);
        var sslModeValue = FirstValue(
            configuration[$"{DatabaseOptions.SectionName}:SslMode"],
            configuration["PGSSLMODE"],
            "Require");
        var channelBindingValue = FirstValue(
            configuration[$"{DatabaseOptions.SectionName}:ChannelBinding"],
            configuration["PGCHANNELBINDING"]);
        var includeErrorDetail = TryParseBoolean(configuration[$"{DatabaseOptions.SectionName}:IncludeErrorDetail"]) ?? true;

        if (string.IsNullOrWhiteSpace(host) ||
            string.IsNullOrWhiteSpace(databaseName) ||
            string.IsNullOrWhiteSpace(username) ||
            string.IsNullOrWhiteSpace(password))
        {
            throw new InvalidOperationException(
                "Database configuration is missing. Configure ConnectionStrings__PortfolioDatabase or the PGHOST/PGDATABASE/PGUSER/PGPASSWORD variables.");
        }

        var port = FirstInt(
            configuration[$"{DatabaseOptions.SectionName}:Port"],
            configuration["PGPORT"]) ?? 5432;

        var builder = new NpgsqlConnectionStringBuilder
        {
            Host = host,
            Port = port <= 0 ? 5432 : port,
            Database = databaseName,
            Username = username,
            Password = password,
            IncludeErrorDetail = includeErrorDetail,
            SslMode = ParseSslMode(sslModeValue)
        };

        if (!string.IsNullOrWhiteSpace(channelBindingValue) &&
            Enum.TryParse<ChannelBinding>(channelBindingValue, ignoreCase: true, out var channelBinding))
        {
            builder.ChannelBinding = channelBinding;
        }

        return builder.ConnectionString;
    }

    private static string? FirstValue(params string?[] values)
    {
        return values.FirstOrDefault(value => !string.IsNullOrWhiteSpace(value));
    }

    private static bool? TryParseBoolean(string? value)
    {
        return bool.TryParse(value, out var parsedValue)
            ? parsedValue
            : null;
    }

    private static int? FirstInt(params string?[] values)
    {
        foreach (var value in values)
        {
            if (int.TryParse(value, out var parsedValue))
            {
                return parsedValue;
            }
        }

        return null;
    }

    private static SslMode ParseSslMode(string? value)
    {
        return Enum.TryParse<SslMode>(value, ignoreCase: true, out var sslMode)
            ? sslMode
            : SslMode.Require;
    }
}
