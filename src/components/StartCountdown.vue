<template>
  <Transition name="fade">
    <div v-if="isVisible" class="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div class="flex flex-col items-center gap-8">
        <!-- Logo -->
        <img src="/hajjgovly1.svg" class="h-32 md:h-48 drop-shadow-2xl animate-pulse" alt="Hajj Authority" />
        
        <!-- Title -->
        <h1 class="text-4xl md:text-6xl font-bold text-white text-center" style="font-family: 'The Year of Handicrafts', sans-serif;">
          بدء القرعة
        </h1>
        
        <!-- Countdown Circle -->
        <div class="relative w-64 h-64 flex items-center justify-center">
          <!-- Background Circle -->
          <div class="absolute inset-0 rounded-full border-8 border-white/20"></div>
          
          <!-- Countdown Number -->
          <div class="text-9xl font-bold text-white animate-pulse" style="font-family: 'Somar Sans', sans-serif;">
            {{ countdown }}
          </div>
        </div>
        
        <!-- Message -->
        <p class="text-2xl md:text-3xl text-white/90 text-center max-w-2xl" style="font-family: 'Somar Sans', sans-serif;">
          جاري تحميل النظام...
        </p>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  duration: {
    type: Number,
    default: 5 // Default 5 seconds
  }
});

const emit = defineEmits(['complete']);

const isVisible = ref(false);
const countdown = ref(props.duration);
let countdownInterval = null;

// Watch for show prop changes
watch(() => props.show, (newVal) => {
  if (newVal) {
    startCountdown();
  }
}, { immediate: true });

const startCountdown = () => {
  isVisible.value = true;
  countdown.value = props.duration;
  
  // Clear any existing interval
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
  
  countdownInterval = setInterval(() => {
    countdown.value--;
    
    if (countdown.value <= 0) {
      clearInterval(countdownInterval);
      countdownInterval = null;
      isVisible.value = false;
      emit('complete');
    }
  }, 1000);
};

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
