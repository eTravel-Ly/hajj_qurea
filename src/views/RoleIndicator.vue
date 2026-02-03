<template>
  <div class="min-h-screen bg-[#FEFAF7] flex flex-col items-center justify-center p-4 font-sans overflow-hidden relative" dir="rtl">
    <!-- Background Decoration -->
    <div class="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#D8A663]/5 rounded-full blur-3xl"></div>
    <div class="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#005045]/5 rounded-full blur-3xl"></div>

    <!-- Content Area -->
    <div class="relative z-10 w-full max-w-2xl flex flex-col items-center py-10">
      <div class="text-center mb-16">
        <h1 class="text-4xl font-bold text-gray-800 mb-4">مفتاح التقريع</h1>
        <p class="text-lg text-gray-500">يرجى إدخال مفاتيح التقريع  للمتابعة</p>
      </div>

      <!-- Inputs & Wires Container -->
      <div class="relative flex flex-col items-center gap-20 w-80">
        <!-- SVG Wires Layer -->
        <svg class="absolute inset-x-[-150px] inset-y-0 w-[calc(100%+300px)] h-full pointer-events-none overflow-visible" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="glow1" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow2" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <!-- Wire 1 to 2 (Right Side Arc) -->
          <path 
            d="M 470 40 A 100 80 0 0 1 470 200" 
            fill="none" 
            stroke="#E5E7EB" 
            stroke-width="5" 
            stroke-linecap="round"
          />
          <path 
            class="transition-all duration-700 ease-in-out"
            d="M 470 40 A 100 80 0 0 1 470 200" 
            fill="none" 
            :stroke="key1.length > 0 ? '#005045' : 'transparent'"
            stroke-width="5" 
            stroke-linecap="round"
            stroke-dasharray="350"
            :stroke-dashoffset="key1.length > 0 ? 0 : 350"
            filter="url(#glow1)"
          />

          <!-- Wire 2 to 3 (Left Side Arc) -->
          <path 
            d="M 150 200 A 100 80 0 0 0 150 360" 
            fill="none" 
            stroke="#E5E7EB" 
            stroke-width="5" 
            stroke-linecap="round"
          />
          <path 
            class="transition-all duration-700 ease-in-out"
            d="M 150 200 A 100 80 0 0 0 150 360" 
            fill="none" 
            :stroke="key2.length > 0 ? '#D8A663' : 'transparent'"
            stroke-width="5" 
            stroke-linecap="round"
            stroke-dasharray="350"
            :stroke-dashoffset="key2.length > 0 ? 0 : 350"
            filter="url(#glow2)"
          />
        </svg>

        <!-- Key Input 1 -->
        <div class="relative z-20 group w-full">
          <div 
            class="absolute -inset-1 bg-gradient-to-r from-[#005045]/10 to-[#D8A663]/10 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"
            :class="{'opacity-100 ring-2 ring-[#005045]/10': key1.length > 0}"
          ></div>
          <div class="relative bg-white rounded-2xl p-4 flex items-center gap-4 border border-gray-100 shadow-sm transition-all h-20">
            <div class="w-12 h-12 rounded-full bg-[#005045]/10 flex items-center justify-center text-[#005045] font-bold text-xl">1</div>
            <input 
              v-model="key1Display"
              type="text"
              maxlength="10"
              placeholder="المفتاح الأول"
              class="flex-1 bg-transparent border-none outline-none text-2xl tracking-[0.5em] font-mono text-gray-800 placeholder:text-gray-300 placeholder:tracking-normal"
            />
          </div>
        </div>

        <!-- Key Input 2 -->
        <div class="relative z-10 group w-full" :class="{'opacity-50 grayscale pointer-events-none': key1.length === 0}">
          <div 
            class="absolute -inset-1 bg-gradient-to-r from-[#005045]/10 to-[#D8A663]/10 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"
            :class="{'opacity-100 ring-2 ring-[#D8A663]/10': key2.length > 0}"
          ></div>
          <div class="relative bg-white rounded-2xl p-4 flex items-center gap-4 border border-gray-100 shadow-sm transition-all h-20">
            <div class="w-12 h-12 rounded-full bg-[#D8A663]/10 flex items-center justify-center text-[#D8A663] font-bold text-xl">2</div>
            <input 
              v-model="key2Display"
              type="text"
              maxlength="10"
              :disabled="key1.length === 0"
              placeholder="المفتاح الثاني"
              class="flex-1 bg-transparent border-none outline-none text-2xl tracking-[0.5em] font-mono text-gray-800 placeholder:text-gray-300 placeholder:tracking-normal disabled:cursor-not-allowed"
            />
          </div>
        </div>

        <!-- Key Input 3 -->
        <div class="relative z-0 group w-full" :class="{'opacity-50 grayscale pointer-events-none': key2.length === 0}">
          <div 
            class="absolute -inset-1 bg-gradient-to-r from-[#005045]/10 to-[#D8A663]/10 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"
            :class="{'opacity-100 ring-2 ring-[#005045]/10': key3.length > 0}"
          ></div>
          <div class="relative bg-white rounded-2xl p-4 flex items-center gap-4 border border-gray-100 shadow-sm transition-all h-20">
            <div class="w-12 h-12 rounded-full bg-[#005045]/10 flex items-center justify-center text-[#005045] font-bold text-xl">3</div>
            <input 
              v-model="key3Display"
              type="text"
              maxlength="10"
              :disabled="key2.length === 0"
              placeholder="المفتاح الثالث"
              class="flex-1 bg-transparent border-none outline-none text-2xl tracking-[0.5em] font-mono text-gray-800 placeholder:text-gray-300 placeholder:tracking-normal disabled:cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      <!-- Action Button -->
      <div 
        class="mt-20 flex flex-col items-center gap-6 transition-all duration-700"
        :class="key3.length > 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'"
      >
        <!-- Combined Key Preview -->
        <div v-if="combinedKey" class="flex flex-col items-center gap-2">
            <span class="text-xs font-bold text-gray-400 tracking-widest uppercase">المفتاح الكامل</span>
            <div class="px-6 py-2 bg-gray-100 rounded-full font-mono text-xl tracking-[0.2em] text-gray-600 border border-gray-200 shadow-inner">
                {{ combinedKey }}
            </div>
        </div>

        <button 
          @click="handleSystemUnlock"
          :disabled="isLoading"
          class="group relative inline-flex items-center justify-center px-12 py-5 font-bold text-white transition-all duration-200 bg-[#005045] rounded-2xl hover:bg-[#003d35] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#005045] shadow-xl shadow-[#005045]/20 text-lg disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <span class="relative flex items-center gap-4">
            <template v-if="isLoading">
              <svg class="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              جاري التفعيل...
            </template>
            <template v-else>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              تفعيل مفتاح التقريع
            </template>
          </span>
        </button>
      </div>

      <!-- Footer Branding -->
      <div class="mt-24 flex flex-col items-center gap-2 opacity-40 grayscale saturate-0 pointer-events-none">
        <div class="flex items-center gap-4">
             <h1 class="font-bold text-primary text-2xl leading-tight">منصة حجاج</h1>
             <div class="w-px h-10 bg-gray-300"></div>
             <p class="text-[14px] text-gray-500 font-medium">لخدمات الحج والعمرة</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';
import { parseJwt } from '../services/auth';

const router = useRouter();

const key1 = ref('');
const key2 = ref('');
const key3 = ref('');
const isLoading = ref(false);

const getUserRoles = () => {
    const token = localStorage.getItem('app-token');
    if (!token) return [];
    const decoded = parseJwt(token);
    return decoded?.realm_access?.roles || [];
};

onMounted(async () => {
    // Check if already activated on the backend
    try {
        const response = await api.getkey();
        const keys = Array.isArray(response.data) ? response.data : (response.data?.object || []);
        const hasActiveKey = keys.some(k => k.isCurrent === true || k.IsCurrent === true);
        
        if (hasActiveKey) {
            router.push('/info');
            return;
        }
    } catch (err) {
        console.error('Failed to pre-check activation status:', err);
    }

    // Protection: only allow indicators to be here
    const roles = getUserRoles();
    if (!roles.includes('qurea-role-indicators')) {
        router.push('/');
    }
});

const key1Display = computed({
  get: () => key1.value,
  set: (val) => {
    key1.value = val.replace(/\s/g, '').slice(0, 10);
  }
});

const key2Display = computed({
  get: () => key2.value,
  set: (val) => {
    key2.value = val.replace(/\s/g, '').slice(0, 10);
  }
});

const key3Display = computed({
  get: () => key3.value,
  set: (val) => {
    key3.value = val.replace(/\s/g, '').slice(0, 10);
  }
});

const combinedKey = computed(() => {
  return key1.value + key2.value + key3.value;
});

const handleSystemUnlock = async () => {
    if (key1.value.length >= 1 && key2.value.length >= 1 && key3.value.length >= 1) {
        isLoading.value = true;
        try {
            // Sending the keys to the backend
            await api.postkey({ code: combinedKey.value });
            
            // Store activation status to bypass this page next time
            localStorage.setItem('qurea_activated', 'true');
            
            // Redirect after success
            router.push('/info');
        } catch (error) {
            console.error('Activation failed:', error);
            alert('فشل تفعيل النظام. يرجى التأكد من صحة المفاتيح.');
        } finally {
            isLoading.value = false;
        }
    }
};
</script>

<style scoped>
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}

input {
  transition: all 0.3s ease;
}

input:focus {
  transform: scale(1.02);
}

.font-mono {
  font-family: 'JetBrains Mono', 'Courier New', monospace;
}
</style>
