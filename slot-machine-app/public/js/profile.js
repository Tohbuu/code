document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.profile-form')) {
    loadProfile();
    setupProfileForm();
    setupThemeSelector();
  }
});

function loadProfile() {
  fetch('/api/user')
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        updateProfileDisplay(data.user);
      } else {
        window.location.href = '/login';
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function updateProfileDisplay(user) {
  // Update profile header
  document.querySelector('.profile-avatar').src = `/images/avatars/${user.profilePicture}`;
  document.querySelector('.profile-info h2').textContent = user.username;
  document.querySelector('.stat-value.balance').textContent = user.balance;
  document.querySelector('.stat-value.level').textContent = user.level;
  
  // Update progress bar
  const progressFill = document.querySelector('.progress-fill');
  progressFill.style.width = `${user.experience}%`;
  
  // Update form fields
  document.querySelector('#email').value = user.email || '';
  document.querySelector('#username').value = user.username;
  
  // Set active theme
  const themeOptions = document.querySelectorAll('.theme-option');
  themeOptions.forEach(option => {
    option.classList.remove('active');
    if (option.dataset.theme === user.theme) {
      option.classList.add('active');
    }
  });
}

function setupProfileForm() {
  const form = document.querySelector('.profile-form');
  form.addEventListener('submit', handleProfileUpdate);
}

function handleProfileUpdate(e) {
  e.preventDefault();
  
  const form = e.target;
  const formData = {
    email: form.email.value,
    username: form.username.value
  };
  
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Saving...';
  
  fetch('/api/user/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData)
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      showMessage('Profile updated successfully!', true);
      updateProfileDisplay(data.user);
    } else {
      showMessage(data.message || 'Update failed', false);
    }
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  })
  .catch(error => {
    console.error('Error:', error);
    showMessage('Connection error', false);
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  });
}

function setupThemeSelector() {
  const themeOptions = document.querySelectorAll('.theme-option');
  themeOptions.forEach(option => {
    option.addEventListener('click', () => {
      const theme = option.dataset.theme;
      updateTheme(theme);
    });
  });
}

function updateTheme(theme) {
  fetch('/api/user/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ theme })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // Update active theme indicator
      document.querySelectorAll('.theme-option').forEach(option => {
        option.classList.remove('active');
      });
      document.querySelector(`.theme-option[data-theme="${theme}"]`).classList.add('active');
      
      // Apply theme to the page
      applyTheme(theme);
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

function applyTheme(theme) {
  // Remove all theme classes
  document.body.className = document.body.className.replace(/\btheme-\S+/g, '');
  
  // Add new theme class
  document.body.classList.add(`theme-${theme}`);
}

function showMessage(message, isSuccess) {
  const messageElement = document.createElement('div');
  messageElement.className = 'profile-message';
  messageElement.textContent = message;
  messageElement.style.color = isSuccess ? '#4caf50' : '#f44336';
  messageElement.style.marginTop = '10px';
  messageElement.style.textAlign = 'center';
  messageElement.style.padding = '10px';
  messageElement.style.borderRadius = '5px';
  messageElement.style.backgroundColor = isSuccess ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)';
  
  const existingMessage = document.querySelector('.profile-message');
  if (existingMessage) {
    existingMessage.remove();
  }
  
  const form = document.querySelector('.profile-form');
  form.appendChild(messageElement);
  
  setTimeout(() => {
    messageElement.style.opacity = '1';
  }, 10);
  
  // Auto-hide after 3 seconds
  setTimeout(() => {
    messageElement.style.opacity = '0';
    setTimeout(() => {
      messageElement.remove();
    }, 300);
  }, 3000);
}