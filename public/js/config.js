// Backend configuration for different environments
const CONFIG = {
    // Development (local)
    DEVELOPMENT: {
        BACKEND_URL: 'http://localhost:5000'
    },
    
    // Production (cloud deployment)
    PRODUCTION: {
        // TODO: Replace with your actual deployed backend URL after deployment
        // Examples:
        // Heroku: 'https://your-app-name.herokuapp.com'
        // Railway: 'https://your-app-name.railway.app'
        // Render: 'https://your-app-name.onrender.com'
        // PythonAnywhere: 'https://yourusername.pythonanywhere.com'
        BACKEND_URL: 'https://YOUR-BACKEND-URL-HERE.herokuapp.com'  // ⚠️ UPDATE THIS!
    }
};

// Auto-detect environment and set backend URL
function getBackendUrl() {
    // Check if we're running on localhost (development)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return CONFIG.DEVELOPMENT.BACKEND_URL;
    }
    
    // Check if we're on GitHub Pages or any other domain (production)
    return CONFIG.PRODUCTION.BACKEND_URL;
}

// Export the backend URL for use in other scripts
const BACKEND_URL = getBackendUrl();

console.log('Backend URL configured:', BACKEND_URL);
