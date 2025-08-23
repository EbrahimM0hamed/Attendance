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
  const loginBtn = document.querySelector('button[type="submit"]');
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const errEl = document.getElementById("err");
  errEl.textContent = "";

  // Show loading state
  loginBtn.classList.add('submitting');
  loginBtn.textContent = '🔐 Logging in...';

  // Simulate network delay for better UX
  setTimeout(() => {
    // Check for admin login first
    if (username === "admin" && password === "admin123") {
      // Success state for admin
      loginBtn.classList.remove('submitting');
      loginBtn.classList.add('success');
      loginBtn.textContent = '✅ Admin Access Granted';
      
      // Store admin authentication
      localStorage.setItem("adminAuthenticated", "true");
      
      // Redirect after short delay
      setTimeout(() => {
        window.location.href = "./views/admin.html";
      }, 1000);
      return;
    }

    // Check if teacher exists and password matches
    const teacher = teachers[username];
    if (teacher && teacher.password === password) {
      // Success state for teacher
      loginBtn.classList.remove('submitting');
      loginBtn.classList.add('success');
      loginBtn.textContent = `✅ Welcome ${teacher.name}`;
      
      // Store authentication and teacher info in localStorage
      localStorage.setItem("authenticated", "true");
      localStorage.setItem("teacherUsername", username);
      localStorage.setItem("teacherName", teacher.name);
      localStorage.setItem("teacherNameEn", teacher.nameEn);
      
      // Redirect after short delay
      setTimeout(() => {
        window.location.href = "./views/attendance.html";
      }, 1000);
    } else {
      // Error state
      loginBtn.classList.remove('submitting');
      loginBtn.classList.add('error');
      loginBtn.textContent = '❌ Invalid Credentials';
      errEl.textContent = "Invalid credentials. Please check username and password.";
      errEl.classList.add('show');
      
      // Reset button and hide error after 3 seconds
      setTimeout(() => {
        loginBtn.classList.remove('error');
        loginBtn.textContent = '🔐 Sign In';
        errEl.classList.remove('show');
      }, 3000);
    }
  }, 800); // Small delay to show loading state
});
