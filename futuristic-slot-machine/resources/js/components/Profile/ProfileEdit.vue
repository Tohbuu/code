<template>
  <div class="profile-edit-container">
    <div class="profile-edit-card">
      <h2>Edit Profile</h2>
      
      <form @submit.prevent="handleSubmit" class="profile-edit-form">
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
          <label>Avatar</label>
          <div class="avatar-options">
            <div
              v-for="avatar in avatars"
              :key="avatar"
              @click="form.avatar = avatar"
              class="avatar-option"
              :class="{ selected: form.avatar === avatar }"
            >
              <img :src="getAvatarUrl(avatar)" :alt="avatar" />
            </div>
          </div>
        </div>
        
        <div class="form-group">
          <label for="theme_color">Theme Color</label>
          <input
            type="color"
            id="theme_color"
            v-model="form.theme_color"
            class="color-input"
          />
        </div>
        
        <div class="form-group">
          <label for="bio">Bio</label>
          <textarea
            id="bio"
            v-model="form.bio"
            class="form-textarea"
            rows="4"
          ></textarea>
        </div>
        
        <div class="form-actions">
          <router-link to="/profile" class="cancel-button">Cancel</router-link>
          <button type="submit" class="save-button">Save Changes</button>
        </div>
      </form>
      
      <div v-if="error" class="error-message">{{ error }}</div>
      <div v-if="success" class="success-message">Profile updated successfully!</div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

export default {
  setup() {
    const form = ref({
      name: '',
      email: '',
      avatar: 'default.png',
      theme_color: '#3a0ca3',
      bio: '',
    });
    
    const avatars = ref([
      'default.png',
      'avatar1.png',
      'avatar2.png',
      'avatar3.png',
      'avatar4.png',
      'avatar5.png',
    ]);
    
    const error = ref('');
    const success = ref(false);
    const router = useRouter();
    
    const getAvatarUrl = (avatar) => {
      return `/images/avatars/${avatar}`;
    };
    
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/api/user', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        form.value = {
          name: response.data.name,
          email: response.data.email,
          avatar: response.data.profile?.avatar || 'default.png',
          theme_color: response.data.profile?.theme_color || '#3a0ca3',
          bio: response.data.profile?.bio || '',
        };
      } catch (err) {
        console.error('Failed to fetch user data:', err);
      }
    };
    
    const handleSubmit = async () => {
      try {
        const response = await axios.put('/api/profile', form.value, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        localStorage.setItem('user', JSON.stringify(response.data));
        success.value = true;
        setTimeout(() => {
          router.push('/profile');
        }, 1500);
      } catch (err) {
        error.value = err.response?.data?.message || 'Failed to update profile';
      }
    };
    
    onMounted(() => {
      fetchUserData();
    });
    
    return {
      form,
      avatars,
      error,
      success,
      getAvatarUrl,
      handleSubmit,
    };
  },
};
</script>

<style scoped>
.profile-edit-container {
  max-width: 800px;
  margin: 2rem auto;
}

.profile-edit-card {
  background: rgba(26, 26, 46, 0.8);
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 0 20px rgba(58, 12, 163, 0.3);
  border: 1px solid var(--primary-color);
}

.profile-edit-card h2 {
  color: var(--primary-color);
  text-align: center;
  margin-bottom: 2rem;
}

.profile-edit-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: #aaa;
  font-size: 0.9rem;
}

.form-input, .form-textarea {
  padding: 0.8rem;
  border-radius: 5px;
  border: 1px solid #444;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: var(--primary-color);
}

.form-textarea {
  resize: vertical;
}

.color-input {
  width: 60px;
  height: 40px;
  border: none;
  background: transparent;
  cursor: pointer;
}

.color-input::-webkit-color-swatch {
  border-radius: 5px;
  border: 1px solid #444;
}

.avatar-options {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.avatar-option {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s;
}

.avatar-option img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-option.selected {
  border-color: var(--primary-color);
  transform: scale(1.1);
}

.avatar-option:hover {
  transform: scale(1.05);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.cancel-button, .save-button {
  padding: 0.8rem 1.5rem;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.cancel-button {
  background: transparent;
  border: 1px solid #f72585;
  color: #f72585;
  text-decoration: none;
  text-align: center;
}

.cancel-button:hover {
  background: rgba(247, 37, 133, 0.1);
}

.save-button {
  background: var(--primary-color);
  border: none;
  color: white;
}

.save-button:hover {
  background: #4a0cd3;
}

.error-message {
  color: #ff6b6b;
  text-align: center;
  margin-top: 1rem;
}

.success-message {
  color: #4ade80;
  text-align: center;
  margin-top: 1rem;
}
</style>