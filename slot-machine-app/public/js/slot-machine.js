document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const reelsContainer = document.querySelector('.reels-container');
  const spinBtn = document.querySelector('.spin-btn');
  const betAmountDisplay = document.querySelector('.bet-amount');
  const balanceDisplay = document.querySelector('.balance-amount');
  const resultDisplay = document.querySelector('.result-display');
  const freeSpinsDisplay = document.querySelector('.free-spins-count');
  const jackpotDisplay = document.querySelector('.jackpot-amount');
  const increaseBetBtn = document.querySelector('.bet-increase');
  const decreaseBetBtn = document.querySelector('.bet-decrease');
  const maxBetBtn = document.querySelector('.bet-max');
  
  // Game State
  let balance = 0;
  let betAmount = 10;
  let freeSpins = 0;
  let isSpinning = false;
  let jackpotAmount = 10000;
  
  // Initialize game
  initGame();
  
  // Event Listeners
  spinBtn.addEventListener('click', spin);
  increaseBetBtn.addEventListener('click', () => adjustBet(10));
  decreaseBetBtn.addEventListener('click', () => adjustBet(-10));
  maxBetBtn.addEventListener('click', setMaxBet);
  
  // Initialize the game
  function initGame() {
    // Load user data
    fetchUserData();
    
    // Load jackpot data
    fetch('/api/slots/jackpot')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          jackpotAmount = data.jackpot.currentAmount;
          updateJackpotDisplay();
        }
      });
    
    createReels();
  }
  
  // Fetch user data
  function fetchUserData() {
    fetch('/api/users/me')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          balance = data.user.balance;
          freeSpins = data.user.freeSpins || 0;
          updateBalanceDisplay();
          updateFreeSpinsDisplay();
          updateBetDisplay();
        } else {
          window.location.href = '/login';
        }
      });
  }
  
  // Create 3D reel elements with enhanced styling
  function createReels() {
    reelsContainer.innerHTML = '';

    for (let i = 0; i < 3; i++) {
      const reel = document.createElement('div');
      reel.className = 'reel';
      reel.dataset.reelIndex = i;
      reel.style.transformStyle = 'preserve-3d';
      reel.style.width = '120px';
      reel.style.height = '160px';
      reel.style.position = 'relative';

      // Create 6 faces (for 6 symbols)
      for (let j = 0; j < 6; j++) {
        const face = document.createElement('div');
        face.className = 'reel-face';
        face.style.position = 'absolute';
        face.style.width = '100%';
        face.style.height = '100%';
        face.style.display = 'flex';
        face.style.justifyContent = 'center';
        face.style.alignItems = 'center';
        face.style.backfaceVisibility = 'hidden';
        face.style.borderRadius = '10px';
        face.style.background = 'rgba(0, 0, 0, 0.3)';
        face.style.transform = `rotateX(${j * 60}deg) translateZ(100px)`;

        const symbolImg = document.createElement('img');
        symbolImg.className = 'reel-symbol';
        symbolImg.src = `/images/symbols/${SYMBOLS[j].name}.png`;
        symbolImg.alt = SYMBOLS[j].name;
        symbolImg.style.maxWidth = '80%';
        symbolImg.style.maxHeight = '80%';

        face.appendChild(symbolImg);
        reel.appendChild(face);
      }

      reelsContainer.appendChild(reel);
    }
  }
  
  // Spin the reels
  async function spin() {
    if (isSpinning) return;
    
    if (balance < betAmount && freeSpins <= 0) {
      showResult('Insufficient balance!', false);
      return;
    }
    
    isSpinning = true;
    spinBtn.disabled = true;
    resultDisplay.textContent = '';
    resultDisplay.className = 'result-display';
    
    // Play spin sound
    playSound('spin');
    
    // Disable bet buttons during spin
    [increaseBetBtn, decreaseBetBtn, maxBetBtn].forEach(btn => {
      btn.disabled = true;
    });
    
    try {
      const response = await fetch('/api/slots/spin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ betAmount })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Animate reels
        await animateReels(data.result);
        
        // Update game state
        balance = data.newBalance;
        freeSpins = data.freeSpins || 0;
        jackpotAmount = data.jackpotAmount || jackpotAmount;
        
        updateBalanceDisplay();
        updateFreeSpinsDisplay();
        updateJackpotDisplay();
        
        // Handle results
        if (data.jackpotWin > 0) {
          showResult(`JACKPOT! You won ${data.jackpotWin} credits!`, true);
          playSound('jackpot');
          triggerParticles();
        } else if (data.winnings > 0) {
          showResult(`You won ${data.winnings} credits!`, true);
          playSound('win');
          triggerParticles();
        } else {
          showResult('No win this time. Try again!', false);
        }
        
        // Handle bonus
        if (data.bonus) {
          showBonusMessage(data.bonus);
        }
      } else {
        showResult(data.error || 'Spin failed', false);
      }
    } catch (error) {
      console.error('Error:', error);
      showResult('Connection error', false);
    } finally {
      isSpinning = false;
      spinBtn.disabled = false;
      
      // Re-enable bet buttons
      [increaseBetBtn, decreaseBetBtn, maxBetBtn].forEach(btn => {
        btn.disabled = false;
      });
    }
  }
  
  // Animate reels with 3D spinning effect (enhanced version)
  async function animateReels(finalSymbols) {
    const reels = document.querySelectorAll('.reel');
    const spinDuration = 2000; // 2 seconds
    const frames = 60; // FPS
    const totalFrames = (spinDuration / 1000) * frames;
    
    const animations = Array.from(reels).map((reel, index) => {
      return new Promise((resolve) => {
        let frame = 0;
        const startRotation = 0;
        const endRotation = 1080 + (index * 120); // 3 full rotations + stagger

        const animate = () => {
          frame++;
          const progress = frame / totalFrames;
          const easeProgress = easeOutCubic(progress);
          const rotation = startRotation + (endRotation * easeProgress);
          
          reel.style.transform = `rotateX(${rotation}deg)`;

          if (frame < totalFrames) {
            requestAnimationFrame(animate);
          } else {
            // Snap to final symbol
            const symbolIndex = SYMBOLS.findIndex(s => s.name === finalSymbols[index]);
            const finalRotation = 360 - (symbolIndex * 60);
            reel.style.transform = `rotateX(${finalRotation}deg)`;
            resolve();
          }
        };

        animate();
      });
    });

    await Promise.all(animations);
  }
  
  // Easing function for smooth animation
  function easeOutCubic(t) {
    return (--t) * t * t + 1;
  }
  
  // Play sound effects
  function playSound(type) {
    if (typeof Howl !== 'undefined') {
      const sounds = {
        spin: new Howl({ src: ['/sounds/spin.mp3'] }),
        win: new Howl({ src: ['/sounds/win.mp3'] }),
        jackpot: new Howl({ src: ['/sounds/jackpot.mp3'] })
      };
      sounds[type].play();
    }
  }
  
  // Trigger particle explosion
  function triggerParticles() {
    if (typeof particlesJS !== 'undefined') {
      particlesJS('particles-js', particlesConfig);
      setTimeout(() => {
        const canvas = document.querySelector('#particles-js canvas');
        if (canvas) canvas.remove();
      }, 3000);
    }
  }
  
  // Show bonus message
  function showBonusMessage(bonus) {
    const bonusElement = document.createElement('div');
    bonusElement.className = 'bonus-message';
    bonusElement.textContent = `BONUS! ${bonus.amount} FREE SPINS!`;
    document.querySelector('.slot-machine').appendChild(bonusElement);
    
    setTimeout(() => {
      bonusElement.remove();
    }, 3000);
  }
  
  // Show result message
  function showResult(message, isWin) {
    resultDisplay.textContent = message;
    resultDisplay.className = `result-display ${isWin ? 'win' : ''}`;
  }
  
  // Update displays
  function updateBalanceDisplay() {
    balanceDisplay.textContent = balance;
  }
  
  function updateFreeSpinsDisplay() {
    freeSpinsDisplay.textContent = freeSpins;
  }
  
  function updateJackpotDisplay() {
    jackpotDisplay.textContent = jackpotAmount.toLocaleString();
  }
  
  function updateBetDisplay() {
    betAmountDisplay.textContent = betAmount;
  }
  
  // Adjust bet amount
  function adjustBet(amount) {
    const newBet = betAmount + amount;
    if (newBet >= 10 && newBet <= Math.min(100, balance)) {
      betAmount = newBet;
      updateBetDisplay();
    }
  }
  
  // Set bet to maximum
  function setMaxBet() {
    betAmount = Math.min(100, balance);
    updateBetDisplay();
  }
});