<template>
  <Transition name="modal">
    <div v-if="isVisible" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" @click.self="close">
      <div class="bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-all" dir="rtl">
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b border-gray-200" :class="headerClass">
          <div class="flex items-center gap-3">
            <div v-if="type === 'error'" class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div v-else-if="type === 'warning'" class="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div v-else-if="type === 'success'" class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div v-else class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-bold" :class="titleClass">{{ title }}</h3>
          </div>
          <button @click="close" class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- Body -->
        <div class="p-6">
          <p class="text-gray-700 text-right">{{ message }}</p>
        </div>
        
        <!-- Footer -->
        <div class="flex justify-end gap-3 p-4 border-t border-gray-200">
          <button 
            @click="close" 
            class="px-6 py-2 rounded-lg font-bold transition-colors"
            :class="buttonClass"
          >
            موافق
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'info', // 'error', 'warning', 'success', 'info'
    validator: (value) => ['error', 'warning', 'success', 'info'].includes(value)
  },
  title: {
    type: String,
    default: 'تنبيه'
  },
  message: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['close']);

const close = () => {
  emit('close');
};

const headerClass = computed(() => {
  switch (props.type) {
    case 'error':
      return 'bg-red-50';
    case 'warning':
      return 'bg-yellow-50';
    case 'success':
      return 'bg-green-50';
    default:
      return 'bg-blue-50';
  }
});

const titleClass = computed(() => {
  switch (props.type) {
    case 'error':
      return 'text-red-700';
    case 'warning':
      return 'text-yellow-700';
    case 'success':
      return 'text-green-700';
    default:
      return 'text-blue-700';
  }
});

const buttonClass = computed(() => {
  switch (props.type) {
    case 'error':
      return 'bg-red-600 text-white hover:bg-red-700';
    case 'warning':
      return 'bg-yellow-600 text-white hover:bg-yellow-700';
    case 'success':
      return 'bg-green-600 text-white hover:bg-green-700';
    default:
      return 'bg-primary text-white hover:bg-primary/90';
  }
});
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.9);
  opacity: 0;
}
</style>
