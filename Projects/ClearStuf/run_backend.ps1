# This script starts the backend from the root directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location (Join-Path $scriptDir "backend")
Write-Host "Starting Uvicorn server in reload mode..." -ForegroundColor Cyan
& .\venv\Scripts\python.exe -m uvicorn app.main:app --reload
