@echo off
echo ========================================
echo   ImageToolsPro - Starting Project
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    echo This may take 2-3 minutes...
    echo.
    call npm install
    echo.
    echo Dependencies installed!
    echo.
)

echo Starting development server...
echo.
echo The app will open at: http://localhost:5173
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

call npm run dev

pause

