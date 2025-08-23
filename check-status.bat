@echo off
echo 🧪 Testing Attendance System Status
echo ===================================
echo.

REM Check if backend URL is configured
findstr /C:"YOUR-BACKEND-URL-HERE" "public\js\config.js" > nul
if %errorlevel% == 0 (
    echo ⚠️  Backend URL not configured yet
    echo Please run deploy-heroku.bat or deploy-frontend.bat first
) else (
    echo ✅ Backend URL is configured
)

REM Check if git is set up
if exist ".git" (
    echo ✅ Git repository initialized
) else (
    echo ⚠️  Git not initialized
    echo Run: git init
)

REM Check required files
if exist "requirements.txt" (
    echo ✅ requirements.txt exists
) else (
    echo ❌ requirements.txt missing
)

if exist "Procfile" (
    echo ✅ Procfile exists
) else (
    echo ❌ Procfile missing
)

if exist "python_backend.py" (
    echo ✅ Backend file exists
) else (
    echo ❌ Backend file missing
)

if exist "public\js\config.js" (
    echo ✅ Configuration file exists
) else (
    echo ❌ Configuration file missing
)

echo.
echo 📋 Next steps:
echo 1. Choose deployment: deploy-heroku.bat OR Railway OR Render
echo 2. Update config: deploy-frontend.bat
echo 3. Enable GitHub Pages
echo.

pause
