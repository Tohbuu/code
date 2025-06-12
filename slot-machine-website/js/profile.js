// DOM Elements
const profileBtn = document.getElementById('profile-btn');
const profileModal = document.getElementById('profile-modal');
const closeModalBtn = document.querySelector('.close-modal');
const saveProfileBtn = document.getElementById('save-profile-btn');
const savePasswordBtn = document.getElementById('save-password-btn');
const soundBtn = document.getElementById('sound-btn');
const avatarOptions = document.querySelectorAll('.avatar-option');
const clickSound = document.getElementById('click-sound');

// Event Listeners
profileBtn.addEventListener('click', openProfileModal);
closeModalBtn.addEventListener('click', closeProfileModal);
saveProfileBtn.addEventListener('click', saveProfile);
savePasswordBtn.addEventListener('click', savePassword);
soundBtn.addEventListener('click', toggleSound);
avatarOptions.forEach(option => option.addEventListener('click', selectAvatar));

// Functions
function openProfileModal() {
    playSound(clickSound);
    profileModal.classList.remove('hidden');
    
    // Select current avatar
    if (currentUser) {
        avatarOptions.forEach(option => {
            option.classList.remove('selected');
            if (option.dataset.avatar === currentUser.avatar) {
                option.classList.add('selected');
            }
        });
    }
}

function closeProfileModal() {
    playSound(clickSound);
    profileModal.classList.add('hidden');
}

function selectAvatar(e) {
    playSound(clickSound);
    avatarOptions.forEach(option => option.classList.remove('selected'));
    e.target.classList.add('selected');
}

function saveProfile() {
    playSound(clickSound);
    
    if (!currentUser) return;
    
    // Save selected avatar
    const selectedAvatar = document.querySelector('.avatar-option.selected');
    if (selectedAvatar) {
        currentUser.avatar = selectedAvatar.dataset.avatar;
        profilePic.src = `images/symbols/${currentUser.avatar}.png`;
    }
    
    // Save to local storage
    const userIndex = users.findIndex(u => u.username === currentUser.username);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('slotMachineUsers', JSON.stringify(users));
    }
    
    closeProfileModal();
}

function savePassword() {
    playSound(clickSound);
    
    if (!currentUser) return;
    
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmNewPassword = document.getElementById('confirm-new-password').value;
    
    if (currentPassword !== currentUser.password) {
        alert('Current password is incorrect!');
        return;
    }
    
    if (newPassword !== confirmNewPassword) {
        alert('New passwords do not match!');
        return;
    }
    
    if (newPassword.length < 6) {
        alert('Password must be at least 6 characters!');
        return;
    }
    
    currentUser.password = newPassword;
    
    // Save to local storage
    const userIndex = users.findIndex(u => u.username === currentUser.username);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('slotMachineUsers', JSON.stringify(users));
    }
    
    alert('Password changed successfully!');
    document.getElementById('current-password').value = '';
    document.getElementById('new-password').value = '';
    document.getElementById('confirm-new-password').value = '';
}

function toggleSound() {
    playSound(clickSound);
    
    if (!currentUser) return;
    
    currentUser.soundOn = !currentUser.soundOn;
    soundBtn.innerHTML = currentUser.soundOn ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-volume-mute"></i>';
    
    // Save to local storage
    const userIndex = users.findIndex(u => u.username === currentUser.username);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('slotMachineUsers', JSON.stringify(users));
    }
}

// Initialize sound button
if (currentUser) {
    soundBtn.innerHTML = currentUser.soundOn ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-volume-mute"></i>';
}