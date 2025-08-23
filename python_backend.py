from flask import Flask, request, jsonify
from flask_cors import CORS
import gspread
from google.oauth2.service_account import Credentials
import json
import os

app = Flask(__name__)
# Enable CORS for all domains and origins (GitHub Pages, localhost, etc.)
CORS(app, origins=['*'], supports_credentials=True)

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

def get_google_sheet(teacher_username=None, teacher_name=None):
    """Initialize and return Google Sheets client with teacher-specific sheet"""
    try:
        credentials = Credentials.from_service_account_info(SERVICE_ACCOUNT_INFO, scopes=SCOPES)
        client = gspread.authorize(credentials)
        spreadsheet = client.open_by_key(SPREADSHEET_ID)
        
        # Create teacher-specific sheet name
        if teacher_name:
            sheet_name = f"{teacher_name.replace(' ', '_')}"
        elif teacher_username:
            sheet_name = f"{teacher_username}"
        else:
            sheet_name = "Attendance_General"
        
        # Try to get existing sheet or create new one
        try:
            sheet = spreadsheet.worksheet(sheet_name)
            print(f"Found existing sheet: {sheet_name}")
        except gspread.WorksheetNotFound:
            sheet = spreadsheet.add_worksheet(title=sheet_name, rows="100", cols="20")
            print(f"Created new sheet: {sheet_name}")
            # Initialize with headers
            sheet.update('A1:B1', [['Student Name', 'Date']])
        
        return sheet
    except Exception as e:
        print(f"Error connecting to Google Sheets: {e}")
        return None

@app.route('/save-attendance', methods=['POST'])
def save_attendance():
    """Save attendance data to Google Sheets with students as rows and dates as columns"""
    try:
        data = request.json
        students = data.get('students', [])
        current_date = data.get('currentDate', '')
        teacher_username = data.get('teacherUsername', '')
        teacher_name = data.get('teacherName', '')
        
        if not students:
            return jsonify({'error': 'No student data provided'}), 400
        
        if not current_date:
            return jsonify({'error': 'No date provided'}), 400
        
        # Get teacher-specific Google Sheet
        sheet = get_google_sheet(teacher_username, teacher_name)
        if not sheet:
            return jsonify({'error': 'Could not connect to Google Sheets'}), 500
        
        # Get all existing data
        try:
            all_values = sheet.get_all_values()
        except:
            all_values = []
        
        # Initialize sheet structure if empty
        if not all_values:
            headers = ['Student Name', current_date]
            sheet.append_row(headers)
            all_values = [headers]
        
        # Ensure we have the date column
        headers = all_values[0] if all_values else ['Student Name']
        
        if current_date not in headers:
            # Add new date column (sorted insertion)
            date_columns = [h for h in headers[1:] if h != 'Student Name']
            date_columns.append(current_date)
            # Sort dates chronologically
            date_columns.sort()
            headers = ['Student Name'] + date_columns
            
            # Update sheet headers
            sheet.update(f'A1:{chr(65 + len(headers) - 1)}1', [headers])
        
        date_col_index = headers.index(current_date)
        
        # Process each student
        updated_students = []
        for student_data in students:
            student_name = student_data.get('name', '')
            attendance_status = student_data.get('status', 'A')  # Default to Absent
            
            if not student_name:
                continue
            
            # Find if student already exists
            student_row = None
            for i, row in enumerate(all_values[1:], start=2):  # Skip header row
                if row and row[0] == student_name:
                    student_row = i
                    break
            
            if student_row:
                # Update existing student's attendance for this date
                sheet.update_cell(student_row, date_col_index + 1, attendance_status)
            else:
                # Add new student
                new_row = [student_name] + [''] * (len(headers) - 1)
                new_row[date_col_index] = attendance_status
                sheet.append_row(new_row)
            
            updated_students.append(student_name)
        
        return jsonify({
            'success': True, 
            'message': f'Successfully saved attendance for {current_date}',
            'studentsUpdated': updated_students,
            'date': current_date
        })
        
    except Exception as e:
        print(f"Error saving attendance: {e}")
        return jsonify({'error': f'Failed to save attendance: {str(e)}'}), 500

@app.route('/get-attendance', methods=['POST'])
def get_attendance():
    """Get attendance data for a specific date from teacher-specific sheet"""
    try:
        data = request.json
        target_date = data.get('date', '')
        teacher_username = data.get('teacherUsername', '')
        teacher_name = data.get('teacherName', '')
        
        if not target_date:
            return jsonify({'error': 'No date provided'}), 400
        
        sheet = get_google_sheet(teacher_username, teacher_name)
        if not sheet:
            return jsonify({'error': 'Could not connect to Google Sheets'}), 500
        
        # Get all data
        all_values = sheet.get_all_values()
        
        if len(all_values) <= 1:  # Only headers or empty
            return jsonify({'attendance': []})
        
        headers = all_values[0] if all_values else []
        
        # Find the date column
        if target_date not in headers:
            return jsonify({'attendance': []})  # Date not found
        
        date_col_index = headers.index(target_date)
        attendance_data = []
        
        # Extract attendance for the target date
        for row in all_values[1:]:  # Skip header
            if row and row[0]:  # If student name exists
                student_name = row[0]
                status = row[date_col_index] if date_col_index < len(row) else 'A'
                attendance_data.append({
                    'name': student_name,
                    'status': status
                })
        
        return jsonify({'attendance': attendance_data})
        
    except Exception as e:
        print(f"Error getting attendance: {e}")
        return jsonify({'error': f'Failed to get attendance: {str(e)}'}), 500

@app.route('/get-students', methods=['POST'])
def get_students():
    """Get existing students from teacher-specific Google Sheet"""
    try:
        data = request.json or {}
        teacher_username = data.get('teacherUsername', '')
        teacher_name = data.get('teacherName', '')
        
        sheet = get_google_sheet(teacher_username, teacher_name)
        if not sheet:
            return jsonify({'error': 'Could not connect to Google Sheets'}), 500
        
        # Get all data
        all_values = sheet.get_all_values()
        
        if len(all_values) <= 1:  # Only headers or empty
            return jsonify({'students': [], 'dates': []})
        
        # Extract student names and available dates
        headers = all_values[0] if all_values else []
        students = []
        
        for row in all_values[1:]:  # Skip header
            if row and row[0]:  # If student name exists
                student_data = {'name': row[0]}
                # Get attendance for each date
                for i, date_header in enumerate(headers[1:], start=1):
                    if i < len(row):
                        student_data[f'date_{i}'] = row[i]
                students.append(student_data)
        
        # Extract dates from headers (skip first column which is student names)
        dates = [h for h in headers[1:] if h != 'Student Name']
        # Sort dates chronologically
        dates.sort()
        
        return jsonify({
            'students': students,
            'dates': dates,
            'headers': headers
        })
        
    except Exception as e:
        print(f"Error getting students: {e}")
        return jsonify({'error': f'Failed to get students: {str(e)}'}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'Python backend is running'})

@app.route('/admin/teachers', methods=['GET'])
def get_all_teachers():
    """Admin endpoint to get all teacher information"""
    # This could be expanded for admin functionality
    return jsonify({
        'message': 'Admin access required',
        'total_teachers': 20,
        'system_status': 'active'
    })

if __name__ == '__main__':
    print("Starting Python backend for Google Sheets...")
    print("Make sure you've shared your Google Sheet with:")
    print("resala-attendance@resala-469320.iam.gserviceaccount.com")
    
    # Use environment port for cloud deployment, default to 5000 for local
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)