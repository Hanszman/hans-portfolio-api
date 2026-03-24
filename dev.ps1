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
$stopScript = Join-Path $root "scripts\setup\Stop-HansPortfolioApiProcess.ps1"

Push-Location $root

function Invoke-Step {
    param(
        [Parameter(Mandatory = $true)]
        [scriptblock]$Script
    )

    & $Script

    if ($LASTEXITCODE -ne 0) {
        exit $LASTEXITCODE
    }
}

try {
    switch ($Command.ToLowerInvariant()) {
        "restore" {
            Invoke-Step { dotnet restore }
        }
        "build" {
            if (Test-Path $stopScript) {
                & $stopScript
            }

            Invoke-Step { dotnet build }
        }
        "run" {
            if (Test-Path $stopScript) {
                & $stopScript
            }

            Invoke-Step { dotnet build }
            Invoke-Step { dotnet run --no-build --project $apiProject --launch-profile http }
        }
        "run:https" {
            if (Test-Path $stopScript) {
                & $stopScript
            }

            Invoke-Step { dotnet build }
            Invoke-Step { dotnet run --no-build --project $apiProject --launch-profile https }
        }
        "test" {
            if (Test-Path $stopScript) {
                & $stopScript
            }

            Invoke-Step { dotnet build }
            Invoke-Step { dotnet test --no-build }
        }
        "test:coverage" {
            if (Test-Path $stopScript) {
                & $stopScript
            }

            Invoke-Step { dotnet build }
            Invoke-Step { dotnet test --no-build --settings $coverageSettings --collect:"XPlat Code Coverage" }

            if (Test-Path $toolsManifest) {
                $coverageFile = Get-ChildItem -Path (Join-Path $root "tests") -Recurse -Filter "coverage.cobertura.xml" |
                    Sort-Object LastWriteTime -Descending |
                    Select-Object -First 1

                if ($null -ne $coverageFile) {
                    Invoke-Step { dotnet tool run reportgenerator "-reports:$($coverageFile.FullName)" "-targetdir:coverage-report" "-reporttypes:Html;TextSummary" }

                    $summaryPath = Join-Path $root "coverage-report\Summary.txt"

                    if (Test-Path $summaryPath) {
                        Get-Content $summaryPath
                    }
                }
            }
        }
        "stop" {
            if (Test-Path $stopScript) {
                & $stopScript
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
  .\dev.ps1 stop
"@ | Write-Host
        }
    }
}
finally {
    Pop-Location
}
