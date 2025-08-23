# Render Deployment Guide

## 🎨 Deploy to Render (Free & Easy)

1. **Go to https://render.com**
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub repository**
4. **Configure:**
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `python python_backend.py`
   - **Environment:** Python 3

### Your backend URL will be:

`https://your-app-name.onrender.com`

### After deployment:

1. Copy your Render URL
2. Update `public/js/config.js`:
   ```javascript
   BACKEND_URL: "https://your-app-name.onrender.com";
   ```
3. Run: `deploy-frontend.bat`

Render is reliable and has good free tier! 🎉
