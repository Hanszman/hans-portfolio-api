[CmdletBinding()]
param(
    [Parameter(Position = 0)]
    [string]$Command = "help"
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$apiProject = Join-Path $root "src\HansPortfolio.Api\HansPortfolio.Api.csproj"
$coverageSettings = Join-Path $root "coverage.runsettings"
$toolsManifest = Join-Path $root "dotnet-tools.json"

Push-Location $root

try {
    switch ($Command.ToLowerInvariant()) {
        "restore" {
            dotnet restore
            if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
        }
        "build" {
            dotnet build
            if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
        }
        "run" {
            dotnet run --project $apiProject --launch-profile http
            if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
        }
        "run:https" {
            dotnet run --project $apiProject --launch-profile https
            if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
        }
        "test" {
            dotnet test
            if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
        }
        "test:coverage" {
            dotnet test --settings $coverageSettings --collect:"XPlat Code Coverage"
            if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

            if (Test-Path $toolsManifest) {
                $coverageFile = Get-ChildItem -Path (Join-Path $root "tests") -Recurse -Filter "coverage.cobertura.xml" |
                    Sort-Object LastWriteTime -Descending |
                    Select-Object -First 1

                if ($null -ne $coverageFile) {
                    dotnet tool run reportgenerator "-reports:$($coverageFile.FullName)" "-targetdir:coverage-report" "-reporttypes:Html;TextSummary"
                    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

                    $summaryPath = Join-Path $root "coverage-report\Summary.txt"

                    if (Test-Path $summaryPath) {
                        Get-Content $summaryPath
                    }
                }
            }
        }
        default {
            @"
Available commands:
  .\dev.ps1 restore
  .\dev.ps1 build
  .\dev.ps1 run
  .\dev.ps1 run:https
  .\dev.ps1 test
  .\dev.ps1 test:coverage
"@ | Write-Host
        }
    }
}
finally {
    Pop-Location
}
