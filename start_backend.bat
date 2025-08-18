@echo off
echo Starting Attendance System...
echo.
echo Installing Python dependencies...
pip install -r requirements.txt
echo.
echo Starting Python backend...
echo Make sure you've shared your Google Sheet with:
echo resala-attendance@resala-469320.iam.gserviceaccount.com
echo.
python python_backend.py
pause