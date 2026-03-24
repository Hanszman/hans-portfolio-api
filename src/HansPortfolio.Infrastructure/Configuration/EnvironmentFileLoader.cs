namespace HansPortfolio.Infrastructure.Configuration;

public static class EnvironmentFileLoader
{
    public static void Load(string fileName = ".env")
    {
        var envFilePath = FindFile(fileName);

        if (envFilePath is null || !File.Exists(envFilePath))
        {
            return;
        }

        foreach (var rawLine in File.ReadAllLines(envFilePath))
        {
            var line = rawLine.Trim();

            if (string.IsNullOrWhiteSpace(line) || line.StartsWith('#'))
            {
                continue;
            }

            var separatorIndex = line.IndexOf('=');

            if (separatorIndex <= 0)
            {
                continue;
            }

            var key = line[..separatorIndex].Trim();
            var value = line[(separatorIndex + 1)..].Trim();

            if (string.IsNullOrWhiteSpace(key) || !string.IsNullOrEmpty(Environment.GetEnvironmentVariable(key)))
            {
                continue;
            }

            Environment.SetEnvironmentVariable(key, NormalizeValue(value));
        }
    }

    private static string? FindFile(string fileName)
    {
        foreach (var startDirectory in GetStartDirectories())
        {
            var currentDirectory = startDirectory;

            while (!string.IsNullOrWhiteSpace(currentDirectory))
            {
                var candidatePath = Path.Combine(currentDirectory, fileName);

                if (File.Exists(candidatePath))
                {
                    return candidatePath;
                }

                currentDirectory = Directory.GetParent(currentDirectory)?.FullName;
            }
        }

        return null;
    }

    private static IEnumerable<string> GetStartDirectories()
    {
        var directories = new[]
        {
            Directory.GetCurrentDirectory(),
            AppContext.BaseDirectory,
            Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..")
        };

        return directories
            .Select(Path.GetFullPath)
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .Where(Directory.Exists);
    }

    private static string NormalizeValue(string value)
    {
        if (value.Length >= 2)
        {
            var startsWithDoubleQuote = value.StartsWith('"');
            var endsWithDoubleQuote = value.EndsWith('"');
            var startsWithSingleQuote = value.StartsWith('\'');
            var endsWithSingleQuote = value.EndsWith('\'');

            if ((startsWithDoubleQuote && endsWithDoubleQuote) ||
                (startsWithSingleQuote && endsWithSingleQuote))
            {
                value = value[1..^1];
            }
        }

        return value;
    }
}
