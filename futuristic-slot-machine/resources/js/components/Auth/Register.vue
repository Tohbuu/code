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
/* Same styles as Login.vue */
</style>