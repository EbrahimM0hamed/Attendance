// Python backend configuration
const PYTHON_BACKEND_URL = 'http://localhost:5000';

// Check authentication and get teacher info
if (!localStorage.getItem("authenticated")) {
  window.location.href = "../index.html";
}

const teacherUsername = localStorage.getItem("teacherUsername") || "unknown";
const teacherName = localStorage.getItem("teacherName") || "Teacher";
const teacherNameEn = localStorage.getItem("teacherNameEn") || "Teacher";

let currentDate = new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD format
let students = [];

// Load existing students from Google Sheets on page load
async function loadStudentsFromSheet() {
  try {
    const response = await fetch(`${PYTHON_BACKEND_URL}/get-students`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        teacherUsername: teacherUsername,
        teacherName: teacherNameEn
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('Loaded students from sheet:', data);
      
      // Update students array with existing names
      if (data.students && data.students.length > 0) {
        students = data.students.map(s => s.name);
        
        // Populate the table with existing students
        const tbody = document.querySelector("#studentsTable tbody");
        tbody.innerHTML = ''; // Clear existing rows
        
        data.students.forEach(student => {
          addStudentToTable(student.name);
        });
      }
    }
  } catch (error) {
    console.log('Could not load students from sheet:', error.message);
    // Load from localStorage as fallback
    loadStudentsFromLocalStorage();
  }
}

// Fallback: Load students from localStorage
function loadStudentsFromLocalStorage() {
  const savedStudents = JSON.parse(localStorage.getItem('students') || '[]');
  students = savedStudents;
  const tbody = document.querySelector("#studentsTable tbody");
  tbody.innerHTML = '';
  savedStudents.forEach(name => addStudentToTable(name));
}

// Check backend status and load students
async function checkBackendStatus() {
  const statusElement = document.getElementById('backendStatus');
  try {
    const response = await fetch(`${PYTHON_BACKEND_URL}/health`, { 
      method: 'GET',
      timeout: 3000 
    });
    
    if (response.ok) {
      statusElement.textContent = 'Backend: Online ✓';
      statusElement.style.backgroundColor = '#10b981';
      statusElement.style.color = 'white';
      
      // Load students from sheet when backend is online
      await loadStudentsFromSheet();
    } else {
      throw new Error('Backend not responding');
    }
  } catch (error) {
    statusElement.textContent = 'Backend: Offline (Local storage)';
    statusElement.style.backgroundColor = '#f59e0b';
    statusElement.style.color = 'white';
    
    // Load from localStorage when backend is offline
    loadStudentsFromLocalStorage();
  }
}

// Check backend status on page load
document.addEventListener('DOMContentLoaded', () => {
  // Display teacher welcome message
  const welcomeElement = document.querySelector('h2');
  if (welcomeElement && teacherName) {
    welcomeElement.textContent = `Attendance Dashboard - ${teacherName}`;
  }
  
  // Set up date picker with current date
  const dateInput = document.getElementById('attendanceDate');
  if (dateInput) {
    dateInput.value = currentDate;
    dateInput.addEventListener('change', (e) => {
      currentDate = e.target.value;
      console.log('Date changed to:', currentDate);
      // Reload attendance data for the new date
      loadAttendanceForDate(currentDate);
    });
  }
  
  checkBackendStatus();
  // Recheck every 30 seconds
  setInterval(checkBackendStatus, 30000);
});

// Function to load attendance data for a specific date
async function loadAttendanceForDate(date) {
  try {
    const response = await fetch(`${PYTHON_BACKEND_URL}/get-attendance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        date: date,
        teacherUsername: teacherUsername,
        teacherName: teacherNameEn
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      // Update the attendance table with the loaded data
      if (data.attendance) {
        updateAttendanceTable(data.attendance);
      }
    }
  } catch (error) {
    console.log('Could not load attendance for date:', error.message);
  }
}

// Function to update attendance table with date-specific data
function updateAttendanceTable(attendanceData) {
  const tbody = document.querySelector("#studentsTable tbody");
  const rows = tbody.querySelectorAll('tr');
  
  rows.forEach(row => {
    const studentName = row.cells[0].textContent;
    const checkbox = row.querySelector('input[type="checkbox"]');
    const statusText = row.querySelector('.status-text');
    
    // Find attendance for this student on the selected date
    const studentAttendance = attendanceData.find(att => att.name === studentName);
    
    if (studentAttendance) {
      const isPresent = studentAttendance.status === 'P';
      checkbox.checked = isPresent;
      statusText.textContent = isPresent ? '✅ Present' : '❌ Absent';
    } else {
      // Default to absent if no data found
      checkbox.checked = false;
      statusText.textContent = '❌ Absent';
    }
  });
}

// Function to save data to Google Sheets via Python backend
async function saveToGoogleSheets(studentsData) {
  try {
    console.log('Attempting to save to Google Sheets via Python backend...');
    
    const response = await fetch(`${PYTHON_BACKEND_URL}/save-attendance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        students: studentsData,
        currentDate: currentDate,
        teacherUsername: teacherUsername,
        teacherName: teacherNameEn
      })
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('Data saved to Google Sheets successfully:', result.message);
      return result;
    }
    
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to save to Google Sheets');
    
  } catch (error) {
    console.error('Error saving to Google Sheets:', error);
    
    // Fallback to localStorage on any error
    const existingData = JSON.parse(localStorage.getItem('attendanceData') || '[]');
    const newData = studentsData.map(student => ({
      name: student.name,
      status: student.status,
      date: currentDate,
      timestamp: new Date().toISOString()
    }));
    existingData.push(...newData);
    localStorage.setItem('attendanceData', JSON.stringify(existingData));
    
    // Also save students list
    localStorage.setItem('students', JSON.stringify(students));
    
    // Show specific error message
    if (error.message.includes('fetch') || error.name === 'TypeError') {
      throw new Error('Python backend not running. Start it with: python python_backend.py. Data saved to localStorage as backup.');
    } else {
      throw new Error(`Google Sheets Error: ${error.message}. Data saved to localStorage as backup.`);
    }
  }
}

// Add student
document.getElementById("addStudentBtn").addEventListener("click", () => {
  const name = document.getElementById("studentName").value.trim();
  if (name && !students.includes(name)) {
    students.push(name);
    addStudentToTable(name);
    document.getElementById("studentName").value = "";
    
    // Save updated students list to localStorage
    localStorage.setItem('students', JSON.stringify(students));
  } else if (name && students.includes(name)) {
    alert("Student already exists in the list!");
  }
});

// Add student to table
function addStudentToTable(name) {
  const tbody = document.querySelector("#studentsTable tbody");
  const row = tbody.insertRow();
  row.innerHTML = `
    <td>${name}</td>
    <td>
      <input type="checkbox" checked> <span>✅ Present</span>
    </td>
  `;
  
  // Add event listener to checkbox to update the display text
  const checkbox = row.querySelector('input[type="checkbox"]');
  const statusText = row.querySelector('span');
  
  checkbox.addEventListener('change', function() {
    if (this.checked) {
      statusText.textContent = '✅ Present';
    } else {
      statusText.textContent = '❌ Absent';
    }
  });
}

// Submit attendance
document.getElementById("submitBtn").addEventListener("click", async () => {
  const rows = document.querySelectorAll("#studentsTable tbody tr");
  const studentsData = [];
  
  rows.forEach(row => {
    const name = row.cells[0].textContent;
    const isPresent = row.querySelector('input[type="checkbox"]').checked;
    const status = isPresent ? "✅" : "❌";
    studentsData.push({
      name: name,
      status: status
    });
  });

  if (studentsData.length === 0) {
    alert("No students to save attendance for!");
    return;
  }

  try {
    const result = await saveToGoogleSheets(studentsData);
    if (result && result.studentsUpdated) {
      alert(`Attendance saved successfully for ${currentDate}!\nUpdated: ${result.studentsUpdated.join(', ')}`);
    } else {
      alert(`Attendance saved successfully for ${currentDate}!`);
    }
  } catch (err) {
    console.error("Error saving attendance:", err);
    alert("Error saving attendance: " + err.message);
  }
});

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("authenticated");
  localStorage.removeItem("teacherUsername");
  localStorage.removeItem("teacherName");
  localStorage.removeItem("teacherNameEn");
  window.location.href = "../index.html";
});
