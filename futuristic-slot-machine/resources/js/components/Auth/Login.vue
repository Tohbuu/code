<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2 class="auth-title">Login</h2>
      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="form.email"
            required
            class="form-input"
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            v-model="form.password"
            required
            class="form-input"
          />
        </div>
        <button type="submit" class="auth-button">Login</button>
      </form>
      <p class="auth-footer">
        Don't have an account? <router-link to="/register" class="auth-link">Register</router-link>
      </p>
      <div v-if="error" class="error-message">{{ error }}</div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

export default {
  setup() {
    const form = ref({
      email: '',
      password: '',
    });
    
    const error = ref('');
    const router = useRouter();
    
    const handleLogin = async () => {
      try {
        const response = await axios.post('/api/login', form.value);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        router.push('/');
      } catch (err) {
        error.value = err.response?.data?.message || 'Login failed';
      }
    };
    
    return { form, error, handleLogin };
  },
};
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

.auth-card {
  background: rgba(26, 26, 46, 0.8);
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(247, 37, 133, 0.3);
  width: 100%;
  max-width: 400px;
  backdrop-filter: blur(10px);
  border: 1px solid var(--primary-color);
}

.auth-title {
  color: var(--primary-color);
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-input {
  padding: 0.8rem;
  border-radius: 5px;
  border: 1px solid #444;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.auth-button {
  padding: 0.8rem;
  border-radius: 5px;
  border: none;
  background: var(--primary-color);
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
  margin-top: 1rem;
}

.auth-button:hover {
  background: #4a0cd3;
}

.auth-footer {
  text-align: center;
  margin-top: 1.5rem;
  color: #aaa;
}

.auth-link {
  color: var(--primary-color);
  text-decoration: none;
}

.error-message {
  color: #ff6b6b;
  text-align: center;
  margin-top: 1rem;
}
</style>