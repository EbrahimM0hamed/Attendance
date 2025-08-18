// Python backend configuration
const PYTHON_BACKEND_URL = 'http://localhost:5000';

// Check authentication
if (!localStorage.getItem("authenticated")) {
  window.location.href = "../index.html";
}

let currentWeek = 1;
let students = [];

// Check backend status
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
    } else {
      throw new Error('Backend not responding');
    }
  } catch (error) {
    statusElement.textContent = 'Backend: Offline (Local storage)';
    statusElement.style.backgroundColor = '#f59e0b';
    statusElement.style.color = 'white';
  }
}

// Check backend status on page load
document.addEventListener('DOMContentLoaded', () => {
  checkBackendStatus();
  // Recheck every 30 seconds
  setInterval(checkBackendStatus, 30000);
});

// Function to save data to Google Sheets via Python backend
async function saveToGoogleSheets(data) {
  try {
    console.log('Attempting to save to Google Sheets via Python backend...');
    
    const response = await fetch(`${PYTHON_BACKEND_URL}/save-attendance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        attendanceData: data
      })
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('Data saved to Google Sheets successfully:', result.message);
      return;
    }
    
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to save to Google Sheets');
    
  } catch (error) {
    console.error('Error saving to Google Sheets:', error);
    
    // Fallback to localStorage on any error
    const existingData = JSON.parse(localStorage.getItem('attendanceData') || '[]');
    const newData = data.map(row => ({
      name: row[0],
      date: row[1], 
      status: row[2],
      week: row[3],
      timestamp: new Date().toISOString()
    }));
    existingData.push(...newData);
    localStorage.setItem('attendanceData', JSON.stringify(existingData));
    
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
  }
});

// Add student to table
function addStudentToTable(name) {
  const tbody = document.querySelector("#studentsTable tbody");
  const row = tbody.insertRow();
  row.innerHTML = `
    <td>${name}</td>
    <td>
      <select>
        <option value="Present">Present</option>
        <option value="Absent">Absent</option>
        <option value="Late">Late</option>
      </select>
    </td>
    <td><button onclick="removeStudent(this)">Remove</button></td>
  `;
}

// Remove student
function removeStudent(btn) {
  const row = btn.closest("tr");
  const name = row.cells[0].textContent;
  students = students.filter(s => s !== name);
  row.remove();
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
  const attendanceData = [];
  
  rows.forEach(row => {
    const name = row.cells[0].textContent;
    const status = row.querySelector("select").value;
    attendanceData.push([name, new Date().toLocaleDateString(), status, currentWeek]);
  });

  try {
    await saveToGoogleSheets(attendanceData);
    alert("Attendance saved successfully!");
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
