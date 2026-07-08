@echo off
:: This script starts the backend from the root directory
cd /d "%~dp0backend"
echo Starting Uvicorn server in reload mode...
venv\Scripts\python.exe -m uvicorn app.main:app --reload
pause
