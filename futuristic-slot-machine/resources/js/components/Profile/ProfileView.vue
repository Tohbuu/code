<template>
  <div class="profile-container">
    <div class="profile-card">
      <div class="profile-header">
        <img :src="getAvatarUrl(user.profile.avatar)" class="avatar" />
        <h2>{{ user.name }}</h2>
        <div class="balance">Balance: ${{ user.balance.toFixed(2) }}</div>
      </div>
      
      <div class="profile-details">
        <div class="detail">
          <label>Email:</label>
          <span>{{ user.email }}</span>
        </div>
        
        <div class="detail">
          <label>Theme Color:</label>
          <span class="theme-color" :style="{ backgroundColor: user.profile.theme_color }"></span>
        </div>
        
        <div class="detail" v-if="user.profile.bio">
          <label>Bio:</label>
          <p>{{ user.profile.bio }}</p>
        </div>
      </div>
      
      <router-link to="/profile/edit" class="edit-button">Edit Profile</router-link>
    </div>
    
    <div class="stats-card">
      <h3>Game Statistics</h3>
      <div class="stats-grid">
        <div class="stat">
          <div class="stat-value">{{ totalSpins }}</div>
          <div class="stat-label">Total Spins</div>
        </div>
        <div class="stat">
          <div class="stat-value">${{ totalWagered.toFixed(2) }}</div>
          <div class="stat-label">Total Wagered</div>
        </div>
        <div class="stat">
          <div class="stat-value">${{ totalWon.toFixed(2) }}</div>
          <div class="stat-label">Total Won</div>
        </div>
        <div class="stat">
          <div class="stat-value">{{ biggestWin.toFixed(2) }}</div>
          <div class="stat-label">Biggest Win</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const user = ref(JSON.parse(localStorage.getItem('user')));
    const totalSpins = ref(0);
    const totalWagered = ref(0);
    const totalWon = ref(0);
    const biggestWin = ref(0);
    
    const getAvatarUrl = (avatar) => {
      return `/images/avatars/${avatar}`;
    };
    
    const fetchUserStats = async () => {
      try {
        const response = await axios.get('/api/history', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        const games = response.data;
        totalSpins.value = games.length;
        totalWagered.value = games.reduce((sum, game) => sum + game.bet_amount, 0);
        totalWon.value = games.reduce((sum, game) => sum + game.win_amount, 0);
        biggestWin.value = games.reduce((max, game) => Math.max(max, game.win_amount), 0);
      } catch (error) {
        console.error('Failed to fetch user stats:', error);
      }
    };
    
    onMounted(() => {
      fetchUserStats();
    });
    
    return {
      user,
      totalSpins,
      totalWagered,
      totalWon,
      biggestWin,
      getAvatarUrl,
    };
  },
};
</script>

<style scoped>
.profile-container {
  max-width: 800px;
  margin: 2rem auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

.profile-card, .stats-card {
  background: rgba(26, 26, 46, 0.8);
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 0 20px rgba(58, 12, 163, 0.3);
  border: 1px solid var(--primary-color);
}

.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--primary-color);
  margin-bottom: 1rem;
}

.profile-header h2 {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

.balance {
  font-size: 1.2rem;
  color: var(--primary-color);
  font-weight: bold;
}

.profile-details {
  margin-bottom: 2rem;
}

.detail {
  margin-bottom: 1rem;
}

.detail label {
  display: block;
  color: #aaa;
  font-size: 0.9rem;
  margin-bottom: 0.3rem;
}

.theme-color {
  display: inline-block;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid #444;
}

.edit-button {
  display: block;
  text-align: center;
  padding: 0.8rem;
  background: var(--primary-color);
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-weight: bold;
  transition: background 0.3s;
}

.edit-button:hover {
  background: #4a0cd3;
}

.stats-card h3 {
  margin-bottom: 1.5rem;
  color: var(--primary-color);
  text-align: center;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.stat {
  background: rgba(58, 12, 163, 0.2);
  padding: 1rem;
  border-radius: 5px;
  text-align: center;
  border: 1px solid var(--primary-color);
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  color: #aaa;
}

@media (min-width: 768px) {
  .profile-container {
    grid-template-columns: 1fr 1fr;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>