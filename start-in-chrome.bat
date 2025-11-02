@echo off
echo ========================================
echo   ImageToolsPro - Starting in Chrome
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo [1/3] Installing dependencies...
    echo This may take 2-3 minutes on first run...
    echo.
    call npm install
    if errorlevel 1 (
        echo.
        echo ERROR: Failed to install dependencies
        echo Please run this in Command Prompt, not PowerShell
        pause
        exit /b 1
    )
    echo.
    echo ✓ Dependencies installed!
    echo.
)

echo [2/3] Starting development server...
echo.

REM Start dev server in background
start /B cmd /c "npm run dev > server.log 2>&1"

echo Waiting for server to start...
timeout /t 5 /nobreak > nul

echo.
echo [3/3] Opening Chrome...
echo.

REM Open Chrome
start chrome http://localhost:5173

echo.
echo ========================================
echo   ✓ ImageToolsPro is running!
echo ========================================
echo.
echo Chrome should open automatically
echo If not, open: http://localhost:5173
echo.
echo To stop the server:
echo   - Close this window, or
echo   - Press Ctrl+C
echo.
echo ========================================

REM Keep window open and show server logs
echo.
echo Server logs:
echo ----------------------------------------
type server.log 2>nul
timeout /t 3 /nobreak > nul
echo.
echo Server is running... (Keep this window open)
echo.

REM Wait indefinitely
pause

