document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const errEl = document.getElementById("err");
  errEl.textContent = "";

  // Simple client-side authentication (for demo purposes only)
  if (username === "teacher" && password === "1234") {
    // Store authentication in localStorage
    localStorage.setItem("authenticated", "true");
    // Redirect to attendance page
    window.location.href = "./views/attendance.html";
  } else {
    errEl.textContent = "Invalid credentials. Use username: teacher, password: 1234";
  }
});
