// ==========================================
// AUTHENTICATION SYSTEM
// ==========================================

// Demo admin credentials
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123',
    name: 'Admin User',
    email: 'admin@companypro.com',
    role: 'System Administrator'
};

// Check if user is already logged in
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentPage = window.location.pathname;
    
    if (isLoggedIn === 'true') {
        // If on login page and already logged in, redirect to dashboard
        if (currentPage.includes('login.html')) {
            window.location.href = 'dashboard.html';
        }
    } else {
        // If not logged in and trying to access admin pages
        if (currentPage.includes('dashboard.html') || 
            currentPage.includes('employees.html') || 
            currentPage.includes('departments.html') || 
            currentPage.includes('reports.html') ||
            currentPage.includes('profile.html')) {
            window.location.href = 'login.html';
        }
    }
}

// Login form handler
if (document.getElementById('loginForm')) {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const rememberMeCheckbox = document.getElementById('rememberMe');
    const loginMessage = document.getElementById('loginMessage');
    const togglePassword = document.getElementById('togglePassword');

    // Toggle password visibility
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });

    // Handle form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        const rememberMe = rememberMeCheckbox.checked;

        // Clear previous messages
        loginMessage.className = 'message';
        loginMessage.textContent = '';

        // Validate credentials
        if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
            // Success
            loginMessage.className = 'message success';
            loginMessage.textContent = 'Login successful! Redirecting...';

            // Store login state
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('adminUser', JSON.stringify({
                username: ADMIN_CREDENTIALS.username,
                name: ADMIN_CREDENTIALS.name,
                email: ADMIN_CREDENTIALS.email,
                role: ADMIN_CREDENTIALS.role
            }));
            localStorage.setItem('loginTime', new Date().toISOString());
            localStorage.setItem('lastLogin', new Date().toISOString());

            if (rememberMe) {
                localStorage.setItem('rememberMe', 'true');
            }

            // Redirect after 1 second
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);

        } else {
            // Failed login
            loginMessage.className = 'message error';
            loginMessage.textContent = 'Invalid username or password. Please try again.';
            
            // Shake animation
            loginForm.style.animation = 'shake 0.5s';
            setTimeout(() => {
                loginForm.style.animation = '';
            }, 500);
        }
    });

    // Auto-fill if remembered
    const rememberMe = localStorage.getItem('rememberMe');
    if (rememberMe === 'true') {
        rememberMeCheckbox.checked = true;
    }
}

// Logout function (available globally)
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('loginTime');
        window.location.href = 'login.html';
    }
}

// Initialize auth check on page load
document.addEventListener('DOMContentLoaded', checkAuth);