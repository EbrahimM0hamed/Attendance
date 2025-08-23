# Railway Deployment Guide

## 🚄 Deploy to Railway (Super Easy)

1. **Go to https://railway.app**
2. **Click "Start a New Project"**
3. **Select "Deploy from GitHub repo"**
4. **Choose your Attendance repository**
5. **Railway automatically detects Python and deploys!**

### Your backend URL will be:

`https://your-app-name.railway.app`

### After deployment:

1. Copy your Railway URL
2. Update `public/js/config.js`:
   ```javascript
   BACKEND_URL: "https://your-app-name.railway.app";
   ```
3. Run: `deploy-frontend.bat`

That's it! Railway handles everything automatically. 🎉
