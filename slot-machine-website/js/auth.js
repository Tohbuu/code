// User data structure
const users = JSON.parse(localStorage.getItem('slotMachineUsers')) || [];

// DOM Elements
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const showRegister = document.getElementById('show-register');
const showLogin = document.getElementById('show-login');
const authContainer = document.getElementById('auth-container');
const gameContainer = document.getElementById('game-container');
const logoutBtn = document.getElementById('logout-btn');
const usernameDisplay = document.getElementById('username-display');
const coinsDisplay = document.getElementById('coins-display');
const profilePic = document.getElementById('profile-pic');
const clickSound = document.getElementById('click-sound');

// Current user
let currentUser = null;

// Event Listeners
showRegister.addEventListener('click', (e) => {
    e.preventDefault();
    playSound(clickSound);
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
});

showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    playSound(clickSound);
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
});

loginBtn.addEventListener('click', handleLogin);
registerBtn.addEventListener('click', handleRegister);
logoutBtn.addEventListener('click', handleLogout);

// Functions
function handleLogin(e) {
    e.preventDefault();
    playSound(clickSound);
    
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        currentUser = user;
        updateUserDisplay();
        authContainer.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        
        // Reset forms
        document.getElementById('login-form').reset();
    } else {
        alert('Invalid username or password!');
    }
}

function handleRegister(e) {
    e.preventDefault();
    playSound(clickSound);
    
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm').value;
    
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    if (users.some(u => u.username === username)) {
        alert('Username already exists!');
        return;
    }
    
    const newUser = {
        username,
        email,
        password,
        coins: 1000,
        avatar: 'paw',
        betAmount: 10,
        lastWin: 0,
        winHistory: [],
        soundOn: true
    };
    
    users.push(newUser);
    localStorage.setItem('slotMachineUsers', JSON.stringify(users));
    
    currentUser = newUser;
    updateUserDisplay();
    authContainer.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    
    // Reset forms
    document.getElementById('register-form').reset();
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
}

function handleLogout() {
    playSound(clickSound);
    
    // Save user data before logging out
    const userIndex = users.findIndex(u => u.username === currentUser.username);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('slotMachineUsers', JSON.stringify(users));
    }
    
    currentUser = null;
    authContainer.classList.remove('hidden');
    gameContainer.classList.add('hidden');
}

function updateUserDisplay() {
    if (!currentUser) return;
    
    usernameDisplay.textContent = currentUser.username;
    coinsDisplay.textContent = `${currentUser.coins} coins`;
    profilePic.src = `images/symbols/${currentUser.avatar}.png`;
    
    // Update bet amount in slot machine if it exists
    if (document.getElementById('current-bet')) {
        document.getElementById('current-bet').textContent = currentUser.betAmount;
    }
}

function playSound(soundElement) {
    if (currentUser && !currentUser.soundOn) return;
    soundElement.currentTime = 0;
    soundElement.play().catch(e => console.log('Sound play failed:', e));
}

// Check if user is already logged in (for page refresh)
function checkLoggedInUser() {
    const loggedInUsername = sessionStorage.getItem('loggedInUser');
    if (loggedInUsername) {
        const user = users.find(u => u.username === loggedInUsername);
        if (user) {
            currentUser = user;
            updateUserDisplay();
            authContainer.classList.add('hidden');
            gameContainer.classList.remove('hidden');
        }
    }
}

// Initialize
checkLoggedInUser();