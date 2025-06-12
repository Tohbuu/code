// DOM Elements
const reel1 = document.getElementById('reel1');
const reel2 = document.getElementById('reel2');
const reel3 = document.getElementById('reel3');
const spinBtn = document.getElementById('spin-btn');
const betUpBtn = document.getElementById('bet-up');
const betDownBtn = document.getElementById('bet-down');
const currentBetDisplay = document.getElementById('current-bet');
const lastWinDisplay = document.getElementById('last-win');
const winHistoryDisplay = document.getElementById('win-history');
const spinSound = document.getElementById('spin-sound');
const winSound = document.getElementById('win-sound');
const clickSound = document.getElementById('click-sound');

// Slot symbols
const symbols = [
    { name: 'cat', value: 5 },
    { name: 'dog', value: 10 },
    { name: 'bone', value: 15 },
    { name: 'fish', value: 20 },
    { name: 'paw', value: 25 }
];

// Game state
let isSpinning = false;
let spinCount = 0;

// Initialize
function initSlotMachine() {
    if (!currentUser) return;
    
    currentBetDisplay.textContent = currentUser.betAmount;
    lastWinDisplay.textContent = currentUser.lastWin;
    updateWinHistory();
    
    // Create additional symbols for smooth spinning
    createReelSymbols(reel1);
    createReelSymbols(reel2);
    createReelSymbols(reel3);
}

function createReelSymbols(reel) {
    // Clear existing symbols (except the first 5)
    while (reel.children.length > 5) {
        reel.removeChild(reel.lastChild);
    }
    
    // Add copies of symbols for seamless spinning
    for (let i = 0; i < 5; i++) {
        symbols.forEach(symbol => {
            const symbolDiv = document.createElement('div');
            symbolDiv.className = 'symbol';
            symbolDiv.innerHTML = `<img src="images/symbols/${symbol.name}.png" alt="${symbol.name}">`;
            reel.appendChild(symbolDiv.cloneNode(true));
        });
    }
}

// Event Listeners
spinBtn.addEventListener('click', startSpin);
betUpBtn.addEventListener('click', increaseBet);
betDownBtn.addEventListener('click', decreaseBet);

// Functions
function startSpin() {
    if (!currentUser || isSpinning) return;
    playSound(clickSound);
    
    // Deduct bet amount
    const betAmount = parseInt(currentBetDisplay.textContent);
    if (currentUser.coins < betAmount) {
        alert('Not enough coins!');
        return;
    }
    
    currentUser.coins -= betAmount;
    updateUserDisplay();
    
    isSpinning = true;
    spinCount = 0;
    
    // Play spin sound
    playSound(spinSound);
    
    // Start spinning all reels
    spinReel(reel1);
    setTimeout(() => spinReel(reel2), 200);
    setTimeout(() => spinReel(reel3), 400);
}

function spinReel(reel) {
    reel.style.transition = 'none';
    reel.style.transform = 'translateY(0)';
    
    // Force reflow
    void reel.offsetHeight;
    
    const spinDuration = 2000 + Math.random() * 1000;
    const symbolHeight = 180; // Height of each symbol
    const extraSpins = 10; // Number of extra full spins
    
    // Calculate final position (align with a symbol)
    const randomSymbolIndex = Math.floor(Math.random() * symbols.length);
    const finalPosition = -(extraSpins * symbols.length * symbolHeight + randomSymbolIndex * symbolHeight);
    
    reel.style.transition = `transform ${spinDuration}ms cubic-bezier(0.2, 0.7, 0.3, 1)`;
    reel.style.transform = `translateY(${finalPosition}px)`;
    
    // When spinning completes
    setTimeout(() => {
        spinCount++;
        
        // Check if all reels have stopped
        if (spinCount === 3) {
            isSpinning = false;
            checkWin();
        }
    }, spinDuration);
}

function checkWin() {
    const reel1Symbol = getVisibleSymbol(reel1);
    const reel2Symbol = getVisibleSymbol(reel2);
    const reel3Symbol = getVisibleSymbol(reel3);
    
    const betAmount = parseInt(currentBetDisplay.textContent);
    let winAmount = 0;
    
    // Check for wins
    if (reel1Symbol === reel2Symbol && reel2Symbol === reel3Symbol) {
        // Three of a kind
        const symbol = symbols.find(s => s.name === reel1Symbol);
        winAmount = betAmount * symbol.value;
    } else if (reel1Symbol === reel2Symbol || reel2Symbol === reel3Symbol || reel1Symbol === reel3Symbol) {
        // Two of a kind
        winAmount = betAmount * 2;
    }
    
    // Update user data and display
    if (winAmount > 0) {
        currentUser.coins += winAmount;
        currentUser.lastWin = winAmount;
        currentUser.winHistory.unshift({
            amount: winAmount,
            date: new Date().toLocaleString()
        });
        
        // Keep only last 5 wins
        if (currentUser.winHistory.length > 5) {
            currentUser.winHistory.pop();
        }
        
        // Play win sound and animation
        playSound(winSound);
        animateWin();
    }
    
    updateUserDisplay();
    updateWinHistory();
}

function getVisibleSymbol(reel) {
    const reelRect = reel.getBoundingClientRect();
    const centerY = reelRect.top + reelRect.height / 2;
    
    for (let i = 0; i < reel.children.length; i++) {
        const symbol = reel.children[i];
        const symbolRect = symbol.getBoundingClientRect();
        
        if (symbolRect.top <= centerY && symbolRect.bottom >= centerY) {
            const img = symbol.querySelector('img');
            return img.alt.toLowerCase();
        }
    }
    
    return symbols[0].name; // Default if none found
}

function increaseBet() {
    playSound(clickSound);
    let bet = parseInt(currentBetDisplay.textContent);
    if (bet < 100) {
        bet += 5;
        currentBetDisplay.textContent = bet;
        if (currentUser) {
            currentUser.betAmount = bet;
        }
    }
}

function decreaseBet() {
    playSound(clickSound);
    let bet = parseInt(currentBetDisplay.textContent);
    if (bet > 5) {
        bet -= 5;
        currentBetDisplay.textContent = bet;
        if (currentUser) {
            currentUser.betAmount = bet;
        }
    }
}

function updateWinHistory() {
    if (!currentUser) return;
    
    winHistoryDisplay.innerHTML = '';
    currentUser.winHistory.forEach(win => {
        const winElement = document.createElement('div');
        winElement.textContent = `${win.amount} coins - ${win.date}`;
        winHistoryDisplay.appendChild(winElement);
    });
}

function animateWin() {
    // Pulse animation on win display
    lastWinDisplay.classList.add('win-animation');
    setTimeout(() => {
        lastWinDisplay.classList.remove('win-animation');
    }, 1500);
    
    // Coin animation on coins display
    coinsDisplay.classList.add('coin-effect');
    setTimeout(() => {
        coinsDisplay.classList.remove('coin-effect');
    }, 1000);
    
    // Create confetti
    createConfetti();
}

function createConfetti() {
    const container = document.querySelector('.slot-machine');
    const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#FFA5A5', '#88D8C0'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.width = `${Math.random() * 10 + 5}px`;
        confetti.style.height = `${Math.random() * 10 + 5}px`;
        confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
        container.appendChild(confetti);
        
        // Remove after animation
        setTimeout(() => {
            confetti.remove();
        }, 3000);
    }
}

// Initialize when game container is shown
const gameContainerObserver = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
        if (mutation.attributeName === 'class') {
            if (!gameContainer.classList.contains('hidden')) {
                initSlotMachine();
            }
        }
    });
});

gameContainerObserver.observe(gameContainer, { attributes: true });