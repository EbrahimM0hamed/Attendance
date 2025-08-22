// Check admin authentication
if (!localStorage.getItem("adminAuthenticated")) {
    window.location.href = "../index.html";
}

// Teachers configuration (imported from login.js logic)
const teachers = {
    "ahmed.hassan": {
        password: "1234",
        name: "Ahmed Hassan",
        nameEn: "Ahmed Hassan"
    },
    "fatima.ali": {
        password: "5678", 
        name: "Fatima Ali",
        nameEn: "Fatima Ali"
    },
};

// Admin logout function
function adminLogout() {
    localStorage.removeItem("adminAuthenticated");
    window.location.href = "../index.html";
}

// Populate teachers grid
function populateTeachersGrid() {
    const grid = document.getElementById('teachersGrid');
    const teacherEntries = Object.entries(teachers);
    
    grid.innerHTML = '';
    
    teacherEntries.forEach(([username, teacher]) => {
        const card = document.createElement('div');
        card.className = 'teacher-card';
        
        card.innerHTML = `
            <div class="teacher-name">${teacher.name}</div>
            <div class="teacher-credentials">
                <div class="credential-row">
                    <span class="credential-label">Username:</span>
                    <span class="credential-value">${username}</span>
                </div>
                <div class="credential-row">
                    <span class="credential-label">Password:</span>
                    <span class="credential-value">${teacher.password}</span>
                </div>
                <div class="credential-row">
                    <span class="credential-label">English Name:</span>
                    <span class="credential-value">${teacher.nameEn}</span>
                </div>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

// Update statistics
function updateStatistics() {
    const totalTeachers = Object.keys(teachers).length;
    const lastUpdated = new Date().toLocaleString();
    
    document.getElementById('totalTeachers').textContent = totalTeachers;
    document.getElementById('lastUpdated').textContent = lastUpdated;
}

// Initialize admin panel
document.addEventListener('DOMContentLoaded', () => {
    populateTeachersGrid();
    updateStatistics();
});

// Add admin credentials info
console.log('Admin Panel Loaded');
console.log('Admin Credentials: admin / admin123');
