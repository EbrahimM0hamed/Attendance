# Attendance Web App (Google Sheets backend)

## Overview
2-page app: teacher login + attendance. Each submit creates the next week column in a sheet and writes P/A per student.

## Requirements
- Node.js (v16+ recommended)
- Google Cloud service account `credentials.json`

## Steps

1. Clone/copy project files.
2. `npm install`
3. Create a Google Sheets document. Rename the sheet tab to: **Attendance**.
   - Add an initial header row if you want, but server will handle when empty.
4. Google Cloud:
   - Create a project in Google Cloud Console.
   - Enable **Google Sheets API**.
   - Create a **Service Account** and download **credentials.json**.
   - Share the Google Sheet with the service account email (Editor permission).
   - Place the `credentials.json` file in the project root (DO NOT commit).
5. Create `.env` from `.env.example`:
   - Set `SPREADSHEET_ID` to your sheet ID (from URL)
   - Set `TEACHER_USER` and `TEACHER_PASS`.
   - Set `SESSION_SECRET` to a long random string.
6. Run:
