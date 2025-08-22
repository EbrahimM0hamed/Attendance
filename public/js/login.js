// Multiple teachers configuration
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

document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const errEl = document.getElementById("err");
  errEl.textContent = "";

  // Check for admin login first
  if (username === "admin" && password === "admin123") {
    // Store admin authentication
    localStorage.setItem("adminAuthenticated", "true");
    // Redirect to admin page
    window.location.href = "./views/admin.html";
    return;
  }

  // Check if teacher exists and password matches
  const teacher = teachers[username];
  if (teacher && teacher.password === password) {
    // Store authentication and teacher info in localStorage
    localStorage.setItem("authenticated", "true");
    localStorage.setItem("teacherUsername", username);
    localStorage.setItem("teacherName", teacher.name);
    localStorage.setItem("teacherNameEn", teacher.nameEn);
    
    // Redirect to attendance page
    window.location.href = "./views/attendance.html";
  } else {
    errEl.textContent = "Invalid credentials. Please check username and password.";
  }
});
