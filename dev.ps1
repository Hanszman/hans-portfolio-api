[CmdletBinding()]
param(
    [Parameter(Position = 0)]
    [string]$Command = "help"
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$apiProject = Join-Path $root "src\HansPortfolio.Api\HansPortfolio.Api.csproj"
$testProject = Join-Path $root "tests\HansPortfolio.Api.Tests\HansPortfolio.Api.Tests.csproj"
$testResultsDirectory = Join-Path $root "tests\HansPortfolio.Api.Tests\TestResults"
$coverageReportDirectory = Join-Path $root "coverage-report"
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

function Reset-TestArtifacts {
    if (Test-Path $testResultsDirectory) {
        Remove-Item -Path $testResultsDirectory -Recurse -Force
    }

    if (Test-Path $coverageReportDirectory) {
        Remove-Item -Path $coverageReportDirectory -Recurse -Force
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

            Invoke-Step { dotnet build $testProject }
            Invoke-Step { dotnet test $testProject --no-build }
        }
        "test:coverage" {
            if (Test-Path $stopScript) {
                & $stopScript
            }

            Reset-TestArtifacts
            Invoke-Step { dotnet build-server shutdown }
            Invoke-Step { dotnet clean $testProject --nologo --verbosity minimal }
            Invoke-Step { dotnet build $testProject }
            $coverageOutputBase = Join-Path $testResultsDirectory "coverage"

            Invoke-Step {
                dotnet test $testProject --no-build `
                    "/p:CollectCoverage=true" `
                    "/p:CoverletOutput=$coverageOutputBase" `
                    "/p:CoverletOutputFormat=cobertura" `
                    "/p:Include=[HansPortfolio.Api]*" `
                    "/p:Exclude=[*.Tests]*" `
                    "/p:ExcludeByFile=**/Program.cs" `
                    "/p:ExcludeByAttribute=CompilerGeneratedAttribute%2cGeneratedCodeAttribute%2cExcludeFromCodeCoverageAttribute"
            }

            if (Test-Path $toolsManifest) {
                $coverageFilePath = "$coverageOutputBase.cobertura.xml"

                if (Test-Path $coverageFilePath) {
                    Invoke-Step { dotnet tool run reportgenerator "-reports:$coverageFilePath" "-targetdir:$coverageReportDirectory" "-reporttypes:Html;TextSummary" }

                    $summaryPath = Join-Path $coverageReportDirectory "Summary.txt"

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
