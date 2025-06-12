// Main initialization
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    if (currentUser) {
        authContainer.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        initSlotMachine();
    }
    
    // Initialize sound button
    if (currentUser) {
        const soundBtn = document.getElementById('sound-btn');
        soundBtn.innerHTML = currentUser.soundOn ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-volume-mute"></i>';
    }
});

// Helper function to play sound
function playSound(soundElement) {
    if (currentUser && !currentUser.soundOn) return;
    soundElement.currentTime = 0;
    soundElement.play().catch(e => console.log('Sound play failed:', e));
}