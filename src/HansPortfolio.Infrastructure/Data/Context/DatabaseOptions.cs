namespace HansPortfolio.Infrastructure.Data.Context;

public sealed class DatabaseOptions
{
    public const string SectionName = "Database";

    public string? Host { get; init; }

    public int Port { get; init; } = 5432;

    public string? Name { get; init; }

    public string? Username { get; init; }

    public string? Password { get; init; }

    public string? SslMode { get; init; }

    public string? ChannelBinding { get; init; }

    public bool IncludeErrorDetail { get; init; } = true;
}
