# Python Backend Setup for Google Sheets

## Quick Setup Steps:

### 1. Install Python Dependencies
Open terminal in your project folder and run:
```bash
cd "d:\Attendance"
pip install -r requirements.txt
```

### 2. Share Google Sheet with Service Account
- Open your Google Sheet
- Click "Share"
- Add this email: `resala-attendance@resala-469320.iam.gserviceaccount.com`
- Give "Editor" permission
- Click "Send"

### 3. Start Python Backend
```bash
python python_backend.py
```

You should see:
```
Starting Python backend for Google Sheets...
Make sure you've shared your Google Sheet with:
resala-attendance@resala-469320.iam.gserviceaccount.com
* Running on http://127.0.0.1:5000
```

### 4. Start Live Server
- Right-click `index.html` → "Open with Live Server"
- Login and test attendance submission

## How It Works:

- **Frontend**: Live Server (HTML/CSS/JS)
- **Backend**: Python Flask (handles Google Sheets)
- **Security**: Service account credentials in Python (safe)
- **Fallback**: localStorage if Python backend is down

## Troubleshooting:

**"Python backend not running" error:**
- Make sure you ran `python python_backend.py`
- Check that it's running on http://localhost:5000

**"Permission denied" error:**
- Verify you shared the sheet with the service account email
- Check the email is exactly: `resala-attendance@resala-469320.iam.gserviceaccount.com`

**Python dependencies error:**
- Run: `pip install flask flask-cors gspread google-auth`

## Your Setup:
- Sheet ID: `1cavwLatmG70zkhRpgZ1uyqGJtrPJRSSN1YRZPeq0ves`
- Service Account: `resala-attendance@resala-469320.iam.gserviceaccount.com`
- Backend URL: `http://localhost:5000`

Your attendance data will save securely to Google Sheets via the Python backend!