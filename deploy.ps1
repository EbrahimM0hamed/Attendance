# Quick Deployment Script for Attendance System (PowerShell)
# This script helps you deploy to Heroku quickly

Write-Host "🚀 Attendance System Deployment Helper" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green

# Check if Heroku CLI is installed
try {
    heroku --version | Out-Null
    Write-Host "✅ Heroku CLI found" -ForegroundColor Green
}
catch {
    Write-Host "❌ Heroku CLI not found. Please install from: https://devcenter.heroku.com/articles/heroku-cli" -ForegroundColor Red
    exit 1
}

# Get app name from user
$app_name = Read-Host "Enter your Heroku app name (e.g., my-attendance-app)"

if ([string]::IsNullOrEmpty($app_name)) {
    Write-Host "❌ App name cannot be empty" -ForegroundColor Red
    exit 1
}

Write-Host "📝 Creating Heroku app: $app_name" -ForegroundColor Yellow

# Create Heroku app
try {
    heroku create $app_name
    Write-Host "✅ Heroku app created successfully" -ForegroundColor Green
    Write-Host "🌐 Your backend URL will be: https://$app_name.herokuapp.com" -ForegroundColor Cyan
    
    Write-Host "📁 Adding files to git..." -ForegroundColor Yellow
    git add .
    git commit -m "Deploy attendance system to Heroku"
    
    Write-Host "🚀 Deploying to Heroku..." -ForegroundColor Yellow
    git push heroku main
    
    Write-Host "✅ Deployment successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎉 Next Steps:" -ForegroundColor Magenta
    Write-Host "1. Update public/js/config.js with your backend URL:" -ForegroundColor White
    Write-Host "   BACKEND_URL: 'https://$app_name.herokuapp.com'" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "2. Commit and push to GitHub:" -ForegroundColor White
    Write-Host "   git add public/js/config.js" -ForegroundColor Gray
    Write-Host "   git commit -m 'Update backend URL for production'" -ForegroundColor Gray
    Write-Host "   git push origin main" -ForegroundColor Gray
    Write-Host ""
    Write-Host "3. Enable GitHub Pages in your repository settings" -ForegroundColor White
    Write-Host ""
    Write-Host "4. Your frontend will be available at:" -ForegroundColor White
    Write-Host "   https://yourusername.github.io/repository-name" -ForegroundColor Cyan
    
    # Test the backend
    Write-Host ""
    Write-Host "🧪 Testing backend..." -ForegroundColor Yellow
    try {
        Invoke-WebRequest -Uri "https://$app_name.herokuapp.com/health" -UseBasicParsing | Out-Null
        Write-Host "✅ Backend is responding!" -ForegroundColor Green
    }
    catch {
        Write-Host "⚠️  Backend might still be starting up. Wait a few minutes and test manually." -ForegroundColor Yellow
    }
}
catch {
    Write-Host "❌ Failed to create Heroku app. It might already exist or there's an error." -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
