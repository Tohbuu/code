<template>
  <div class="slot-machine-container">
    <div class="user-info">
      <div class="balance">Balance: ${{ user.balance.toFixed(2) }}</div>
      <div class="last-win" v-if="lastWin > 0">+${{ lastWin.toFixed(2) }}</div>
    </div>
    
    <div class="slot-machine">
      <div class="reels-container">
        <Reel 
          v-for="(reel, index) in reels" 
          :key="index" 
          :symbol="reel" 
          :spinning="spinning" 
          :position="index"
        />
      </div>
      
      <BetControls 
        :betAmount="betAmount"
        @update:betAmount="betAmount = $event"
        @spin="handleSpin"
        :spinning="spinning"
        :balance="user.balance"
      />
    </div>
    
    <div class="game-history">
      <h3>Recent Games</h3>
      <div v-if="historyLoading">Loading...</div>
      <ul v-else>
        <li v-for="(game, index) in gameHistory" :key="index">
          Bet: ${{ game.bet_amount }} | Win: ${{ game.win_amount }}
          <span class="win" v-if="game.win_amount > 0">WIN!</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Reel from './Reel.vue';
import BetControls from './BetControls.vue';

export default {
  components: { Reel, BetControls },
  setup() {
    const reels = ref(['cherry', 'cherry', 'cherry']);
    const spinning = ref(false);
    const betAmount = ref(10);
    const lastWin = ref(0);
    const user = ref(JSON.parse(localStorage.getItem('user')));
    const gameHistory = ref([]);
    const historyLoading = ref(false);
    
    const symbols = ['cherry', 'lemon', 'orange', 'plum', 'bell', 'bar', 'seven'];
    
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/api/user', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        user.value = response.data;
        localStorage.setItem('user', JSON.stringify(response.data));
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };
    
    const fetchGameHistory = async () => {
      historyLoading.value = true;
      try {
        const response = await axios.get('/api/history', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        gameHistory.value = response.data;
      } catch (error) {
        console.error('Failed to fetch game history:', error);
      } finally {
        historyLoading.value = false;
      }
    };
    
    const handleSpin = async () => {
      if (spinning.value) return;
      
      spinning.value = true;
      lastWin.value = 0;
      
      try {
        const response = await axios.post('/api/spin', {
          betAmount: betAmount.value
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        // Animate the reels
        animateReels(response.data.reels);
        
        lastWin.value = response.data.winAmount;
        user.value.balance = response.data.balance;
        localStorage.setItem('user', JSON.stringify(user.value));
        
        // Refresh history
        await fetchGameHistory();
      } catch (error) {
        console.error('Spin failed:', error);
        spinning.value = false;
      }
    };
    
    const animateReels = (finalReels) => {
      const spinDuration = 3000; // 3 seconds
      const startTime = Date.now();
      
      const spinInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / spinDuration, 1);
        
        if (progress >= 1) {
          clearInterval(spinInterval);
          reels.value = finalReels;
          spinning.value = false;
          return;
        }
        
        // Random symbols during spin
        reels.value = [
          symbols[Math.floor(Math.random() * symbols.length)],
          symbols[Math.floor(Math.random() * symbols.length)],
          symbols[Math.floor(Math.random() * symbols.length)],
        ];
      }, 100);
    };
    
    onMounted(() => {
      fetchUserData();
      fetchGameHistory();
    });
    
    return {
      reels,
      spinning,
      betAmount,
      lastWin,
      user,
      gameHistory,
      historyLoading,
      handleSpin,
    };
  },
};
</script>

<style scoped>
.slot-machine-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
}

.user-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.balance {
  color: var(--primary-color);
  font-weight: bold;
}

.last-win {
  color: #4ade80;
  font-weight: bold;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

.slot-machine {
  background: rgba(26, 26, 46, 0.8);
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 0 30px rgba(58, 12, 163, 0.5);
  border: 2px solid var(--primary-color);
}

.reels-container {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.game-history {
  margin-top: 2rem;
  background: rgba(26, 26, 46, 0.8);
  padding: 1rem;
  border-radius: 10px;
}

.game-history h3 {
  margin-bottom: 0.5rem;
  color: var(--primary-color);
}

.game-history ul {
  list-style: none;
}

.game-history li {
  padding: 0.5rem;
  border-bottom: 1px solid #444;
}

.win {
  color: #4ade80;
  font-weight: bold;
  margin-left: 1rem;
}
</style>