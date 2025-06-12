<template>
  <div class="reel" :class="{ spinning }">
    <div class="symbol-container">
      <img :src="getSymbolImage(symbol)" :alt="symbol" class="symbol" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    symbol: {
      type: String,
      required: true,
    },
    spinning: {
      type: Boolean,
      default: false,
    },
    position: {
      type: Number,
      required: true,
    },
  },
  
  methods: {
    getSymbolImage(symbol) {
      return `/images/symbols/${symbol}.png`;
    },
  },
};
</script>

<style scoped>
.reel {
  width: 120px;
  height: 120px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid var(--primary-color);
  box-shadow: 0 0 15px rgba(58, 12, 163, 0.3);
}

.symbol-container {
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.symbol {
  max-width: 100%;
  max-height: 100%;
  transition: transform 0.3s;
}

.reel.spinning .symbol {
  animation: spin 0.1s infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>