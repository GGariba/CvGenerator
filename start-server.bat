@echo off
title CV Generator - Local Server
cd /d "%~dp0"

set PORT=3456
set URL=http://localhost:%PORT%

echo.
echo  CV Generator - Local Server
echo  ===========================
echo  Folder: %CD%
echo  URL:    %URL%
echo.
echo  Press Ctrl+C to stop the server.
echo.

:: Open browser after a short delay
start "" cmd /c "timeout /t 2 /nobreak >nul && start %URL%"

:: Try Python (python / py launcher)
where python >nul 2>&1 && (
  python -m http.server %PORT%
  goto :done
)

where py >nul 2>&1 && (
  py -m http.server %PORT%
  goto :done
)

:: Try Node.js (npx serve)
where npx >nul 2>&1 && (
  npx --yes serve -l %PORT%
  goto :done
)

echo ERROR: Python or Node.js is required.
echo Install Python from https://python.org and run this file again.
echo.
pause

:done
