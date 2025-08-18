// Python backend configuration
const PYTHON_BACKEND_URL = 'http://localhost:5000';

// Check authentication
if (!localStorage.getItem("authenticated")) {
  window.location.href = "../index.html";
}

let currentWeek = 1;
let students = [];

// Load existing students from Google Sheets on page load
async function loadStudentsFromSheet() {
  try {
    const response = await fetch(`${PYTHON_BACKEND_URL}/get-students`, {
      method: 'GET'
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
  checkBackendStatus();
  // Recheck every 30 seconds
  setInterval(checkBackendStatus, 30000);
});

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
        currentWeek: currentWeek
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
      week: currentWeek,
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

// Week navigation
document.getElementById("prevWeek").addEventListener("click", () => {
  if (currentWeek > 1) {
    currentWeek--;
    document.getElementById("weekDisplay").textContent = `Week ${currentWeek}`;
  }
});

document.getElementById("nextWeek").addEventListener("click", () => {
  currentWeek++;
  document.getElementById("weekDisplay").textContent = `Week ${currentWeek}`;
});

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
      alert(`Attendance saved successfully for Week ${currentWeek}!\nUpdated: ${result.studentsUpdated.join(', ')}`);
    } else {
      alert(`Attendance saved successfully for Week ${currentWeek}!`);
    }
  } catch (err) {
    console.error("Error saving attendance:", err);
    alert("Error saving attendance: " + err.message);
  }
});

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("authenticated");
  window.location.href = "../index.html";
});
