from flask import Flask, request, jsonify
from flask_cors import CORS
import gspread
from google.oauth2.service_account import Credentials
import json
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for Live Server

# Google Sheets setup
SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
SPREADSHEET_ID = '1cavwLatmG70zkhRpgZ1uyqGJtrPJRSSN1YRZPeq0ves'

# Service account credentials
SERVICE_ACCOUNT_INFO = {
    "type": "service_account",
    "project_id": "resala-469320",
    "private_key_id": "your_private_key_id",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDXX+uJhqzE6qVX\np7ZaDkvk7d8kSp1G6TIvVbB0Vsk8sKNYDSJgmzUDG8Wuq9bv7s3WAK9s/xOB9eW7\nTUnujpYaSdqjh8M+mdFHfcWR74ykts0kWJ8lLqmvkxsLpY2DKryakeLfuz8rUB7y\nD5c7nsZuxvDSCBJ5NRhMwweexBkFZFTVkWfp78NDjhNRTjZBWSDDPZrOO93Yeke/\nVKf/guTb2Gx8izw4qy/f/4km2kRV3JsmGKeOuz4lD66DD2VN/Vq9B4XBFfR5DOjS\nQ3hYeTzkSLx/mIGFzrtYi7VATFfqMoan4TO97NZmuUrPYAF14x3Jmily4OHYOjj1\nZF9/qqLzAgMBAAECggEAIWEHUxghPJ+VIoGmnExs7L0FAU3jFDNeCMICB/XPWG2T\n0zit5EUJsUKjn4+YTzU2h30xsvXRYynmAeJXm/ZTQx3BGekXlGMocSkH7rcul/SQ\n1Jo7h/q0Z7an0WVGClccReRoQf52KtNPCHrsGFxiKpcAibygiFJ3QqZTTwLbUd9S\n78JlWIOlBvFuRW4Ad+jA074ysfyS9NIOdoR2N10UAXlVzvlBBcCEI3GT3q4KMsG2\nArxOtQB+HnH7EJO4hwimmn1fvqNjA1r3YDH3IWUlXfRPtAZBvtiWc8LtGeWdikGG\nBUoIfZv4ER6TkuFQURJ+apQyWcI4mrF25ajh9DQiCQKBgQD5eiAcwzsBSUb5hSGP\nOA+TgQoMUu1c0ysakd7wjy2sHatBeHQ65SzRcmiN+ltv2DiMWVsB+o4wxaUC8b6D\n2KN52JswSkHw7uMoGi58OEMSL4s5O5w1P6AyBw1ugWAg4JioQFGTNSjb9i4wFneA\n04avhWmmqDvoTnN9wcyKzDcuLQKBgQDdAYfMYDj3PqU7wFJPbaug2uNry8CBIwZa\nqCf+RGtq1cjFr9sE4TqfWviQc8z3Z2NDcLZAMwiakZiN6dBJJ7Ex/wOnjeME6EBR\nQvlnNbQxvEjTVMXJb6JrEHtbKm0ZRkQkWeYiPppZVODIEN/AaqOe28CuZWjadqT+\nN3R0KpbpnwKBgQDj0irRGVgg7JHr+y+SYleXFBfg+TnZst2B/gPhGl9S9iUWPLGn\ntvEes6PXQ/GMSaAaSt9ZBz4iO9tcvPaF4Kgo9S2DA80EAKNgU8hvl9FoIhK5yT31\nQo1AIkCZ0Xu/ilreCx5zl/AgLsgvEdU/x+sPDn5Uuv06P6ooBXqMpcEeYQKBgFMt\n8khvpsEXqOTWO6R9aG1ANPwrUabI4elZBMRkR/GLyObuiwZJJuE3QfpMO0aaePe3\nAkEjdAeI6Nvwtl3yPHTOwDdd5aXBLAPpqyi3Q7y8WsR/UXnBNGYLbAIh87HhimAM\nHduhqEIa+gcSosQu3qo5l0mMDWy73tl3UbMvHGGNAoGACzv8BDbmvushkjNfGk+l\nFt+ir7rioAv+4uxP+YNd5EhofkFkt90MsTZfBvBAM9G+RNrDtw9jCPzJ6ELn8iPz\nnWX0bTry8DyviCsbWg3ftZBBNnjL+4sH1hNAkz+ymeGSsx8bLdHCZENaUB/+myDa\n6/kGRv60bqQDgNcqPPChX6E=\n-----END PRIVATE KEY-----\n",
    "client_email": "resala-attendance@resala-469320.iam.gserviceaccount.com",
    "client_id": "your_client_id",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token"
}

def get_google_sheet():
    """Initialize and return Google Sheets client"""
    try:
        credentials = Credentials.from_service_account_info(SERVICE_ACCOUNT_INFO, scopes=SCOPES)
        client = gspread.authorize(credentials)
        sheet = client.open_by_key(SPREADSHEET_ID).sheet1
        return sheet
    except Exception as e:
        print(f"Error connecting to Google Sheets: {e}")
        return None

@app.route('/save-attendance', methods=['POST'])
def save_attendance():
    """Save attendance data to Google Sheets"""
    try:
        data = request.json
        attendance_data = data.get('attendanceData', [])
        
        if not attendance_data:
            return jsonify({'error': 'No attendance data provided'}), 400
        
        # Get Google Sheet
        sheet = get_google_sheet()
        if not sheet:
            return jsonify({'error': 'Could not connect to Google Sheets'}), 500
        
        # Check if sheet has headers
        try:
            existing_data = sheet.get_all_values()
        except:
            existing_data = []
        
        # Add headers if sheet is empty
        if not existing_data:
            headers = ['Student Name', 'Date', 'Status', 'Week']
            sheet.append_row(headers)
        
        # Append new attendance data
        for row in attendance_data:
            sheet.append_row(row)
        
        return jsonify({
            'success': True, 
            'message': f'Successfully saved {len(attendance_data)} attendance records'
        })
        
    except Exception as e:
        print(f"Error saving attendance: {e}")
        return jsonify({'error': f'Failed to save attendance: {str(e)}'}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'Python backend is running'})

if __name__ == '__main__':
    print("Starting Python backend for Google Sheets...")
    print("Make sure you've shared your Google Sheet with:")
    print("resala-attendance@resala-469320.iam.gserviceaccount.com")
    app.run(debug=True, port=5000)