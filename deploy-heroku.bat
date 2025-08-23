@echo off
echo 🚀 Attendance System - Heroku Deployment
echo ==========================================
echo.

REM Check if git is initialized
if not exist ".git" (
    echo Initializing git repository...
    git init
    git add .
    git commit -m "Initial commit"
)

echo Please enter your Heroku app name (e.g., my-attendance-2025):
set /p APP_NAME=App Name: 

echo.
echo 📝 Creating Heroku app: %APP_NAME%
heroku create %APP_NAME%

if %errorlevel% == 0 (
    echo ✅ Heroku app created successfully
    echo 🌐 Your backend URL will be: https://%APP_NAME%.herokuapp.com
    
    echo.
    echo 🚀 Deploying to Heroku...
    git add .
    git commit -m "Deploy to Heroku"
    git push heroku main
    
    if %errorlevel% == 0 (
        echo.
        echo ✅ Deployment successful!
        echo.
        echo 🎉 NEXT STEPS:
        echo 1. Update public/js/config.js with your backend URL:
        echo    BACKEND_URL: 'https://%APP_NAME%.herokuapp.com'
        echo.
        echo 2. Then run: deploy-frontend.bat
        echo.
        echo 3. Your website will be available at:
        echo    https://yourusername.github.io/Attendance
        
        echo.
        echo 🧪 Testing backend...
        timeout /t 10 /nobreak > nul
        curl -s "https://%APP_NAME%.herokuapp.com/health"
    ) else (
        echo ❌ Deployment failed. Check the errors above.
    )
) else (
    echo ❌ Failed to create Heroku app. It might already exist.
)

pause
