<template>
  <div class="bet-controls">
    <div class="bet-amount">
      <button 
        @click="decreaseBet" 
        :disabled="betAmount <= 10 || spinning"
        class="bet-button"
      >
        -
      </button>
      <input
        type="number"
        v-model.number="internalBetAmount"
        min="10"
        :max="balance"
        step="10"
        class="bet-input"
        :disabled="spinning"
      />
      <button 
        @click="increaseBet" 
        :disabled="betAmount >= balance || spinning"
        class="bet-button"
      >
        +
      </button>
    </div>
    
    <button 
      @click="$emit('spin')" 
      :disabled="spinning || betAmount > balance"
      class="spin-button"
    >
      {{ spinning ? 'SPINNING...' : 'SPIN' }}
    </button>
    
    <div class="quick-bets">
      <button
        v-for="amount in quickBets"
        :key="amount"
        @click="setBet(amount)"
        :disabled="spinning || amount > balance"
        class="quick-bet-button"
        :class="{ active: betAmount === amount }"
      >
        ${{ amount }}
      </button>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';

export default {
  props: {
    betAmount: {
      type: Number,
      required: true,
    },
    spinning: {
      type: Boolean,
      default: false,
    },
    balance: {
      type: Number,
      required: true,
    },
  },
  
  emits: ['update:betAmount', 'spin'],
  
  setup(props, { emit }) {
    const internalBetAmount = ref(props.betAmount);
    const quickBets = [10, 50, 100, 200, 500];
    
    watch(internalBetAmount, (newVal) => {
      if (newVal < 10) {
        internalBetAmount.value = 10;
      } else if (newVal > props.balance) {
        internalBetAmount.value = props.balance;
      }
      emit('update:betAmount', parseInt(internalBetAmount.value));
    });
    
    watch(() => props.betAmount, (newVal) => {
      internalBetAmount.value = newVal;
    });
    
    const increaseBet = () => {
      const newAmount = Math.min(props.betAmount + 10, props.balance);
      emit('update:betAmount', newAmount);
    };
    
    const decreaseBet = () => {
      const newAmount = Math.max(props.betAmount - 10, 10);
      emit('update:betAmount', newAmount);
    };
    
    const setBet = (amount) => {
      emit('update:betAmount', amount);
    };
    
    return {
      internalBetAmount,
      quickBets,
      increaseBet,
      decreaseBet,
      setBet,
    };
  },
};
</script>

<style scoped>
.bet-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.bet-amount {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.bet-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--primary-color);
  color: white;
  border: none;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.bet-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.bet-button:not(:disabled):hover {
  background: #4a0cd3;
  transform: scale(1.05);
}

.bet-input {
  width: 100px;
  padding: 0.5rem;
  text-align: center;
  font-size: 1.2rem;
  border-radius: 5px;
  border: 1px solid #444;
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.bet-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.spin-button {
  padding: 1rem 2rem;
  font-size: 1.2rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 2px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;
  width: 100%;
}

.spin-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spin-button:not(:disabled):hover {
  background: #4a0cd3;
  transform: scale(1.02);
  box-shadow: 0 0 15px rgba(58, 12, 163, 0.5);
}

.quick-bets {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.quick-bet-button {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid var(--primary-color);
  color: white;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;
}

.quick-bet-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quick-bet-button.active {
  background: var(--primary-color);
  font-weight: bold;
}

.quick-bet-button:not(:disabled):hover {
  background: rgba(58, 12, 163, 0.3);
}
</style>