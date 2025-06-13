document.addEventListener('DOMContentLoaded', () => {
  // Check if we're on a auth page
  if (document.querySelector('.auth-card')) {
    initAuthForms();
  }
});

function initAuthForms() {
  const loginForm = document.querySelector('#loginForm');
  const registerForm = document.querySelector('#registerForm');
  
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
  
  if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
  }
}

function handleLogin(e) {
  e.preventDefault();
  
  const form = e.target;
  const formData = {
    username: form.username.value,
    password: form.password.value
  };
  
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Logging in...';
  
  fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData)
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      window.location.href = '/';
    } else {
      showError(data.message || 'Login failed');
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  })
  .catch(error => {
    console.error('Error:', error);
    showError('Connection error');
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  });
}

function handleRegister(e) {
  e.preventDefault();
  
  const form = e.target;
  const formData = {
    username: form.username.value,
    password: form.password.value,
    email: form.email.value
  };
  
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Registering...';
  
  fetch('/api/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData)
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      window.location.href = '/';
    } else {
      showError(data.message || 'Registration failed');
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  })
  .catch(error => {
    console.error('Error:', error);
    showError('Connection error');
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  });
}

function showError(message) {
  const errorElement = document.createElement('div');
  errorElement.className = 'error-message';
  errorElement.textContent = message;
  errorElement.style.color = '#f44336';
  errorElement.style.marginTop = '10px';
  errorElement.style.textAlign = 'center';
  
  const existingError = document.querySelector('.error-message');
  if (existingError) {
    existingError.remove();
  }
  
  const form = document.querySelector('.auth-card form');
  form.appendChild(errorElement);
  
  setTimeout(() => {
    errorElement.style.opacity = '1';
  }, 10);
}