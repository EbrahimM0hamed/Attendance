// Google OAuth2 Configuration
// Replace these values with your actual credentials from Google Cloud Console

const GOOGLE_CONFIG = {
  CLIENT_ID: 'YOUR_CLIENT_ID.googleusercontent.com',
  API_KEY: 'YOUR_API_KEY',
  SPREADSHEET_ID: '1cavwLatmG70zkhRpgZ1uyqGJtrPJRSSN1YRZPeq0ves'
};

// Instructions:
// 1. Go to https://console.cloud.google.com/
// 2. Create new project or select existing one
// 3. Enable Google Sheets API
// 4. Create OAuth 2.0 Client ID credentials
// 5. Add your domain (e.g., http://localhost:5500) to authorized origins
// 6. Copy CLIENT_ID and API_KEY here
// 7. Update the values in attendance.js

// Example of what your CLIENT_ID should look like:
// '123456789-abcdefg.apps.googleusercontent.com'

// Example of what your API_KEY should look like:
// 'AIzaSyABC123DEF456GHI789JKL'