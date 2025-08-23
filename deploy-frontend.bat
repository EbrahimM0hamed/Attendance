@echo off
echo 🌐 Attendance System - Frontend Deployment
echo ==========================================
echo.

echo Please enter your backend URL (from Step 1):
echo Example: https://my-attendance-2025.herokuapp.com
set /p BACKEND_URL=Backend URL: 

echo.
echo 📝 Updating configuration...

REM Update config.js with the new backend URL
powershell -Command "(Get-Content 'public\js\config.js') -replace 'https://YOUR-BACKEND-URL-HERE.herokuapp.com', '%BACKEND_URL%' | Set-Content 'public\js\config.js'"

echo ✅ Configuration updated!

echo.
echo 🚀 Pushing to GitHub...
git add .
git commit -m "Update backend URL for production: %BACKEND_URL%"
git push origin main

if %errorlevel% == 0 (
    echo ✅ Pushed to GitHub successfully!
    echo.
    echo 📖 FINAL STEP - Enable GitHub Pages:
    echo 1. Go to your repository on GitHub
    echo 2. Click Settings → Pages
    echo 3. Select "Deploy from a branch"
    echo 4. Choose "main" branch and "/ (root)" folder
    echo 5. Click Save
    echo.
    echo 🌐 Your website will be available at:
    echo https://EbrahimM0hamed.github.io/Attendance
    echo.
    echo 🎉 Test your system:
    echo - Admin login: admin / admin123
    echo - Teacher login: fatima.ali / 5678
    echo.
    echo ✅ Your attendance system is now live worldwide!
) else (
    echo ❌ Failed to push to GitHub. Check the errors above.
)

pause
