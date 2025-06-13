document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const reelsContainer = document.querySelector('.reels-container');
  const spinBtn = document.querySelector('.spin-btn');
  const betAmountDisplay = document.querySelector('.bet-amount');
  const balanceDisplay = document.querySelector('.balance-amount');
  const resultDisplay = document.querySelector('.result-display');
  const increaseBetBtn = document.querySelector('.bet-increase');
  const decreaseBetBtn = document.querySelector('.bet-decrease');
  const maxBetBtn = document.querySelector('.bet-max');
  
  // Game State
  let balance = 0;
  let betAmount = 10;
  let isSpinning = false;
  const symbols = ['seven', 'bar', 'cherry', 'bell', 'diamond', 'horseshoe'];
  
  // Initialize game
  initGame();
  
  // Event Listeners
  spinBtn.addEventListener('click', spin);
  increaseBetBtn.addEventListener('click', () => adjustBet(10));
  decreaseBetBtn.addEventListener('click', () => adjustBet(-10));
  maxBetBtn.addEventListener('click', setMaxBet);
  
  // Initialize the game
  function initGame() {
    // Fetch user data
    fetch('/api/user')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          balance = data.user.balance;
          updateBalanceDisplay();
          updateBetDisplay();
          createReels();
        } else {
          window.location.href = '/login';
        }
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }
  
  // Create reel elements
  function createReels() {
    reelsContainer.innerHTML = '';
    
    for (let i = 0; i < 3; i++) {
      const reel = document.createElement('div');
      reel.className = 'reel';
      reel.dataset.reelIndex = i;
      
      const symbolImg = document.createElement('img');
      symbolImg.className = 'reel-symbol';
      symbolImg.src = `/images/${symbols[0]}.png`;
      symbolImg.alt = symbols[0];
      
      reel.appendChild(symbolImg);
      reelsContainer.appendChild(reel);
    }
  }
  
  // Spin the reels
  function spin() {
    if (isSpinning) return;
    
    if (balance < betAmount) {
      showResult('Insufficient balance!', false);
      return;
    }
    
    isSpinning = true;
    spinBtn.disabled = true;
    resultDisplay.textContent = '';
    resultDisplay.className = 'result-display';
    
    // Disable bet buttons during spin
    [increaseBetBtn, decreaseBetBtn, maxBetBtn].forEach(btn => {
      btn.disabled = true;
    });
    
    // Send spin request to server
    fetch('/api/slot/spin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ betAmount })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Animate reels
        animateReels(data.result, () => {
          balance = data.newBalance;
          updateBalanceDisplay();
          
          if (data.winnings > 0) {
            showResult(`You won ${data.winnings} credits!`, true);
            playWinAnimation();
          } else {
            showResult('No win this time. Try again!', false);
          }
          
          isSpinning = false;
          spinBtn.disabled = false;
          
          // Re-enable bet buttons
          [increaseBetBtn, decreaseBetBtn, maxBetBtn].forEach(btn => {
            btn.disabled = false;
          });
        });
      } else {
        showResult(data.message || 'Spin failed', false);
        isSpinning = false;
        spinBtn.disabled = false;
        
        // Re-enable bet buttons
        [increaseBetBtn, decreaseBetBtn, maxBetBtn].forEach(btn => {
          btn.disabled = false;
        });
      }
    })
    .catch(error => {
      console.error('Error:', error);
      showResult('Connection error', false);
      isSpinning = false;
      spinBtn.disabled = false;
      
      // Re-enable bet buttons
      [increaseBetBtn, decreaseBetBtn, maxBetBtn].forEach(btn => {
        btn.disabled = false;
      });
    });
  }
  
  // Animate reels with spinning effect
  function animateReels(finalSymbols, callback) {
    const reels = document.querySelectorAll('.reel');
    const spinDuration = 2000; // 2 seconds
    const spinInterval = 100; // 100ms per symbol change
    const spins = spinDuration / spinInterval;
    
    reels.forEach((reel, index) => {
      let spinCount = 0;
      
      const spinIntervalId = setInterval(() => {
        // Random symbol during spin
        const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
        reel.querySelector('.reel-symbol').src = `/images/${randomSymbol}.png`;
        reel.querySelector('.reel-symbol').alt = randomSymbol;
        
        spinCount++;
        
        // Slow down at the end
        if (spinCount > spins * 0.8) {
          clearInterval(spinIntervalId);
          setTimeout(() => {
            // Set final symbol
            reel.querySelector('.reel-symbol').src = `/images/${finalSymbols[index]}.png`;
            reel.querySelector('.reel-symbol').alt = finalSymbols[index];
            
            // Check if all reels have stopped
            if (index === reels.length - 1) {
              setTimeout(callback, 300); // Small delay after last reel stops
            }
          }, 100 * (index + 1)); // Staggered stopping
        }
      }, spinInterval);
    });
  }
  
  // Show spin result
  function showResult(message, isWin) {
    resultDisplay.textContent = message;
    if (isWin) {
      resultDisplay.classList.add('win-animation');
    }
  }
  
  // Play win animation
  function playWinAnimation() {
    const reels = document.querySelectorAll('.reel');
    reels.forEach(reel => {
      reel.style.animation = 'none';
      void reel.offsetWidth; // Trigger reflow
      reel.style.animation = 'winPulse 0.5s 3';
    });
  }
  
  // Adjust bet amount
  function adjustBet(amount) {
    const newBet = betAmount + amount;
    if (newBet >= 10 && newBet <= balance) {
      betAmount = newBet;
      updateBetDisplay();
    }
  }
  
  // Set bet to maximum
  function setMaxBet() {
    betAmount = Math.min(100, balance);
    updateBetDisplay();
  }
  
  // Update bet display
  function updateBetDisplay() {
    betAmountDisplay.textContent = betAmount;
  }
  
  // Update balance display
  function updateBalanceDisplay() {
    balanceDisplay.textContent = balance;
  }
});