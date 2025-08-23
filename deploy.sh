#!/bin/bash

# Quick Deployment Script for Attendance System
# This script helps you deploy to Heroku quickly

echo "🚀 Attendance System Deployment Helper"
echo "======================================="

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo "❌ Heroku CLI not found. Please install from: https://devcenter.heroku.com/articles/heroku-cli"
    exit 1
fi

echo "✅ Heroku CLI found"

# Get app name from user
read -p "Enter your Heroku app name (e.g., my-attendance-app): " app_name

if [ -z "$app_name" ]; then
    echo "❌ App name cannot be empty"
    exit 1
fi

echo "📝 Creating Heroku app: $app_name"

# Create Heroku app
heroku create $app_name

if [ $? -eq 0 ]; then
    echo "✅ Heroku app created successfully"
    echo "🌐 Your backend URL will be: https://$app_name.herokuapp.com"
    
    echo "📁 Adding files to git..."
    git add .
    git commit -m "Deploy attendance system to Heroku"
    
    echo "🚀 Deploying to Heroku..."
    git push heroku main
    
    if [ $? -eq 0 ]; then
        echo "✅ Deployment successful!"
        echo ""
        echo "🎉 Next Steps:"
        echo "1. Update public/js/config.js with your backend URL:"
        echo "   BACKEND_URL: 'https://$app_name.herokuapp.com'"
        echo ""
        echo "2. Commit and push to GitHub:"
        echo "   git add public/js/config.js"
        echo "   git commit -m 'Update backend URL for production'"
        echo "   git push origin main"
        echo ""
        echo "3. Enable GitHub Pages in your repository settings"
        echo ""
        echo "4. Your frontend will be available at:"
        echo "   https://yourusername.github.io/repository-name"
        
        # Test the backend
        echo ""
        echo "🧪 Testing backend..."
        curl -s "https://$app_name.herokuapp.com/health" > /dev/null
        if [ $? -eq 0 ]; then
            echo "✅ Backend is responding!"
        else
            echo "⚠️  Backend might still be starting up. Wait a few minutes and test manually."
        fi
    else
        echo "❌ Deployment failed. Check the errors above."
    fi
else
    echo "❌ Failed to create Heroku app. It might already exist or there's an error."
fi
