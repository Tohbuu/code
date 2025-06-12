<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2 class="auth-title">Register</h2>
      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="form-group">
          <label for="name">Name</label>
          <input
            type="text"
            id="name"
            v-model="form.name"
            required
            class="form-input"
          />
        </div>
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
        <div class="form-group">
          <label for="password_confirmation">Confirm Password</label>
          <input
            type="password"
            id="password_confirmation"
            v-model="form.password_confirmation"
            required
            class="form-input"
          />
        </div>
        <button type="submit" class="auth-button">Register</button>
      </form>
      <p class="auth-footer">
        Already have an account? <router-link to="/login" class="auth-link">Login</router-link>
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
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
    });
    
    const error = ref('');
    const router = useRouter();
    
    const handleRegister = async () => {
      try {
        const response = await axios.post('/api/register', form.value);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        router.push('/');
      } catch (err) {
        error.value = err.response?.data?.message || 'Registration failed';
      }
    };
    
    return { form, error, handleRegister };
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