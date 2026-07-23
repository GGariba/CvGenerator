@echo off
title Build CV Generator Server EXE
cd /d "%~dp0"

where dotnet >nul 2>&1 || (
  echo .NET SDK not found. Use start-server.bat instead ^(requires Python^).
  echo Install .NET from https://dotnet.microsoft.com/download
  pause
  exit /b 1
)

echo Building StartCvGeneratorServer.exe ...
dotnet publish server\CvServer.csproj -c Release -o . --nologo

if exist StartCvGeneratorServer.exe (
  echo.
  echo Success! Double-click StartCvGeneratorServer.exe to run the server.
) else (
  echo Build failed.
)

pause
