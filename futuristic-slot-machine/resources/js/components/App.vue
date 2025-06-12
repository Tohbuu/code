<template>
  <div :style="appStyles">
    <Navigation v-if="isAuthenticated" />
    <router-view />
  </div>
</template>

<script>
import Navigation from './Navigation.vue';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

export default {
  components: { Navigation },
  setup() {
    const router = useRouter();
    
    const isAuthenticated = computed(() => {
      return localStorage.getItem('token');
    });
    
    const userTheme = computed(() => {
      const profile = JSON.parse(localStorage.getItem('user'))?.profile;
      return profile?.theme_color || '#3a0ca3';
    });
    
    const appStyles = computed(() => {
      return {
        '--primary-color': userTheme.value,
        'min-height': '100vh',
        'background': 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        'color': '#ffffff',
      };
    });
    
    return { isAuthenticated, appStyles };
  },
};
</script>

<style>
:root {
  --primary-color: #3a0ca3;
  --secondary-color: #f72585;
  --dark-color: #1a1a2e;
  --light-color: #f8f9fa;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Orbitron', sans-serif;
}

body {
  background: var(--dark-color);
  color: var(--light-color);
}

@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700&display=swap');
</style>