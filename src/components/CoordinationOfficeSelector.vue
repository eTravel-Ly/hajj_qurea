<template>
  <div v-if="isVisible" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm" @click.self="handleBackdropClick">
    <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all" @click.stop>
      <!-- Header -->
      <div class="text-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-2">اختر التنسيقية</h2>
        <p class="text-gray-500">يرجى اختيار التنسيقية للبدء في القرعة</p>
      </div>

      <!-- Coordination Selector -->
      <div class="mb-8">
        <label class="block text-sm font-bold text-gray-700 mb-3">التنسيقية</label>
        <div class="space-y-3 max-h-[400px] overflow-y-auto scrollbar-hide">
          <div 
            v-for="coordination in coordinations" 
            :key="coordination.id"
            @click="isCoordinationCompleted(coordination.id) ? null : selectCoordination(coordination.id)"
            class="bg-white rounded-lg border-2 p-4 transition-all"
            :class="[
              selectedCoordinationId === coordination.id ? 'border-[#D8A663] ring-2 ring-[#D8A663]/20 bg-[#D8A663]/5' : 'border-gray-200',
              isCoordinationCompleted(coordination.id) ? 'border-green-500 bg-green-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-md'
            ]"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <h4 class="font-bold text-lg text-gray-800">{{ coordination.name }}</h4>
                <p v-if="isCoordinationCompleted(coordination.id)" class="text-sm text-gray-500 mt-1">مكتمل</p>
              </div>
              <div v-if="isCoordinationCompleted(coordination.id)" class="flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div v-else-if="selectedCoordinationId === coordination.id" class="flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[#D8A663]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3 justify-end">
        <button
          v-if="allowCancel"
          @click="handleCancel"
          class="px-6 py-3 rounded-lg font-bold text-gray-600 hover:bg-gray-100 transition-all"
        >
          إلغاء
        </button>
        <button
          @click="handleConfirm"
          :disabled="!selectedCoordinationId"
          class="bg-[#D8A764] text-white px-8 py-3 rounded-lg font-bold shadow-md hover:shadow-lg hover:bg-[#C89654] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          بدء القرعة
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  coordinations: {
    type: Array,
    default: () => []
  },
  offices: {
    type: Array,
    default: () => []
  },
  allowCancel: {
    type: Boolean,
    default: false
  },
  initialCoordinationId: {
    type: [Number, String],
    default: null
  }
});

const emit = defineEmits(['confirm', 'cancel']);

const selectedCoordinationId = ref(props.initialCoordinationId);

// Watch for initial coordination ID changes
watch(() => props.initialCoordinationId, (newVal) => {
  selectedCoordinationId.value = newVal;
});

// Watch for visibility changes to reset if needed
watch(() => props.isVisible, (newVal) => {
  if (newVal && !props.initialCoordinationId) {
    // Reset selection when modal opens (unless we have an initial coordination)
    selectedCoordinationId.value = null;
  }
});

// Check if a coordination is fully completed
const isCoordinationCompleted = (coordinationId) => {
  if (!props.offices || props.offices.length === 0) {
    return false;
  }
  
  // Get all offices for this coordination
  const coordinationOffices = props.offices.filter(o => o.coordinationId === coordinationId);
  
  // If no offices, consider it not completed
  if (coordinationOffices.length === 0) return false;
  
  // Check if all offices are completed (status 3)
  return coordinationOffices.every(o => o.status === 3);
};

const selectCoordination = (coordinationId) => {
  selectedCoordinationId.value = coordinationId;
};

const handleConfirm = () => {
  if (selectedCoordinationId.value) {
    emit('confirm', {
      coordinationId: selectedCoordinationId.value
    });
  }
};

const handleCancel = () => {
  emit('cancel');
};

const handleBackdropClick = () => {
  if (props.allowCancel) {
    handleCancel();
  }
};
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
