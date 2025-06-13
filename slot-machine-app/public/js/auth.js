// Store JWT token in localStorage
function storeAuthToken(token) {
  localStorage.setItem('token', token);
}

// Get stored JWT token
function getAuthToken() {
  return localStorage.getItem('token');
}

// Remove JWT token (logout)
function removeAuthToken() {
  localStorage.removeItem('token');
}

// Check if user is authenticated
function isAuthenticated() {
  return !!getAuthToken();
}

// Handle login form submission
async function handleLogin(e) {
  e.preventDefault();
  
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  
  submitBtn.disabled = true;
  submitBtn.textContent = 'Logging in...';

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: form.username.value,
        password: form.password.value
      })
    });

    const data = await response.json();

    if (data.success) {
      storeAuthToken(data.token);
      window.location.href = '/';
    } else {
      showError(data.error || 'Login failed');
    }

  } catch (err) {
    showError('Network error. Please try again.');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
}

// Handle registration form submission
async function handleRegister(e) {
  e.preventDefault();
  
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  
  submitBtn.disabled = true;
  submitBtn.textContent = 'Registering...';

  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: form.username.value,
        email: form.email.value,
        password: form.password.value
      })
    });

    const data = await response.json();

    if (data.success) {
      storeAuthToken(data.token);
      window.location.href = '/';
    } else {
      showError(data.error || 'Registration failed');
    }

  } catch (err) {
    showError('Network error. Please try again.');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
}

// Show error message
function showError(message) {
  const errorEl = document.createElement('div');
  errorEl.className = 'error-message';
  errorEl.textContent = message;
  errorEl.style.color = '#f44336';
  errorEl.style.marginTop = '10px';
  errorEl.style.textAlign = 'center';
  errorEl.style.opacity = '0';
  errorEl.style.transition = 'opacity 0.3s ease';

  const existingError = document.querySelector('.error-message');
  if (existingError) existingError.remove();

  const form = document.querySelector('.auth-card form');
  form.appendChild(errorEl);

  setTimeout(() => {
    errorEl.style.opacity = '1';
  }, 10);
}

// Initialize auth forms
function initAuthForms() {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  if (loginForm) loginForm.addEventListener('submit', handleLogin);
  if (registerForm) registerForm.addEventListener('submit', handleRegister);
}

// Auto-initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  // Check if we're on an auth page
  if (document.querySelector('.auth-card')) {
    initAuthForms();
  }
});