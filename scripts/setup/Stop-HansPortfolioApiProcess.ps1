$ErrorActionPreference = "Stop"

$knownProcessNames = @(
    "HansPortfolio.Api",
    "HansPortfolioApi"
)

$namedProcesses = @(Get-Process -Name $knownProcessNames -ErrorAction SilentlyContinue)
$hostedDotnetProcesses = @(
    Get-CimInstance Win32_Process -Filter "Name = 'dotnet.exe'" -ErrorAction SilentlyContinue |
        Where-Object {
            $_.ProcessId -ne $PID -and (
                $_.CommandLine -match '(\s|^)run(\s|$).*HansPortfolio\.Api' -or
                $_.CommandLine -match 'HansPortfolio\.Api\.dll'
            )
        } |
        ForEach-Object {
            Get-Process -Id $_.ProcessId -ErrorAction SilentlyContinue
        }
)

$runningProcesses = @($namedProcesses + $hostedDotnetProcesses) |
    Where-Object { $null -ne $_ } |
    Sort-Object Id -Unique

if ($runningProcesses.Count -eq 0) {
    Write-Host "No running Hans Portfolio API process was found."
    return
}

foreach ($process in $runningProcesses) {
    try {
        Write-Host "Stopping running process: $($process.ProcessName) ($($process.Id))"
        Stop-Process -Id $process.Id -Force -ErrorAction Stop
    }
    catch {
        Write-Warning "Could not stop process $($process.ProcessName) ($($process.Id)): $($_.Exception.Message)"
    }
}
