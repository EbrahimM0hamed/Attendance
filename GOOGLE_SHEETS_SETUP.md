# Google Sheets Service Account Setup (Email-Based Editor Access)

## Secure Setup for Your Email Only:

### Step 1: Create Service Account in Google Cloud Console

1. **Go to Google Cloud Console:**

   - Visit: https://console.cloud.google.com/

2. **Create or Select a Project:**

   - Click "Select a project" → "New Project"
   - Name it "Attendance System" → Create

3. **Enable Google Sheets API:**

   - Go to "APIs & Services" → "Library"
   - Search for "Google Sheets API"
   - Click on it and press "Enable"

4. **Create Service Account:**

   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "Service Account"
   - Name: "attendance-system"
   - Email will be: `attendance-system@your-project-id.iam.gserviceaccount.com`
   - Click "Create and Continue"
   - Skip roles → "Done"

5. **Create Service Account Key:**
   - Click on your service account email
   - Go to "Keys" tab → "Add Key" → "Create New Key"
   - Choose "JSON" → Create
   - Download the JSON file

### Step 2: Share Google Sheet with Service Account ONLY

1. **Open your Google Sheet**
2. **Click "Share"**
3. **Add the service account email** (from the JSON file):
   ```
   attendance-system@your-project-id.iam.gserviceaccount.com
   ```
4. **Give "Editor" permission**
5. **DO NOT make sheet public** - only you and the service account have access

### Step 3: Update Your Code

From your downloaded `credentials.json` file, copy:

1. **Service Account Email** (client_email field)
2. **Private Key** (private_key field)

Update in `attendance.js`:

```javascript
const SERVICE_ACCOUNT_EMAIL =
  "attendance-system@your-project-id.iam.gserviceaccount.com";
const PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
[paste your private key here]
-----END PRIVATE KEY-----`;
```

### Step 4: Test Your System

1. **Right-click `index.html`** → "Open with Live Server"
2. **Login** and add students
3. **Submit attendance** - should save directly to your private sheet
4. **Only you and the service account** can access the data

## Security Benefits:

- ✅ **Only your email** has access to edit the sheet
- ✅ **Service account** has limited permissions
- ✅ **No public access** - sheet remains private
- ✅ **Full control** over who can view/edit
- ✅ **No OAuth popups** needed

## Your Current Sheet ID:

```
1cavwLatmG70zkhRpgZ1uyqGJtrPJRSSN1YRZPeq0ves
```

## Troubleshooting:

- **403 Error**: Make sure service account email has editor access
- **Auth Error**: Check private key format in attendance.js
- **Not Found**: Verify spreadsheet ID is correct

Your attendance data will be saved securely to your private Google Sheet!
