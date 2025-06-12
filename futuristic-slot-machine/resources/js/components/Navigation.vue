<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <router-link to="/" class="logo">FUTURE SLOTS</router-link>
    </div>
    <div class="navbar-links">
      <router-link to="/" class="nav-link">Play</router-link>
      <router-link to="/profile" class="nav-link">Profile</router-link>
      <button @click="logout" class="logout-button">Logout</button>
    </div>
  </nav>
</template>

<script>
import { useRouter } from 'vue-router';
import axios from 'axios';

export default {
  setup() {
    const router = useRouter();
    
    const logout = async () => {
      try {
        await axios.post('/api/logout', {}, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
      } catch (error) {
        console.error('Logout failed:', error);
      }
    };
    
    return { logout };
  },
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(26, 26, 46, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--primary-color);
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.navbar-links {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav-link {
  color: var(--light-color);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-link:hover {
  color: var(--primary-color);
}

.logout-button {
  background: transparent;
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
}

.logout-button:hover {
  background: var(--primary-color);
  color: var(--light-color);
}

.router-link-active {
  color: var(--primary-color);
  border-bottom: 2px solid var(--primary-color);
}
</style>