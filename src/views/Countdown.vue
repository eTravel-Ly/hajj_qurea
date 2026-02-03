<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-[#F9FAFB] relative overflow-hidden font-sans" dir="rtl">
    <div class="absolute top-6 left-6 z-50">
      <button @click="logout" class="p-2 bg-white/80 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors shadow-sm border border-gray-100" title="تسجيل الخروج">
        <img src="/logout-02.png" alt="Logout" class="h-5 w-5" />
      </button>
    </div>

    
    <!-- Background Pattern/Gradient -->
    <div class="absolute inset-0 z-0 opacity-5">
        <img src="/pattern.png" class="w-full h-full object-cover" />
    </div>
    
    <!-- Gradient Overlay -->
    <div class="absolute inset-0 z-0 bg-gradient-to-br from-[#03AA77]/5 to-[#D8A663]/5 pointer-events-none"></div>

    <div class="relative z-10 flex flex-col items-center p-4 w-full max-w-5xl">
      
      <!-- Logo -->
      <img src="/hajjgovly1.svg" class="h-24 md:h-40 mb-8 drop-shadow-sm animate-fade-in" alt="Hajj Authority" />

      <!-- Title -->
      <h1 class="text-3xl md:text-5xl lg:text-6xl font-bold text-[#03AA77] mb-6 text-center" style="font-family: 'The Year of Handicrafts', sans-serif;">
        نظام قرعة الحج لموسم 2026 م - 1447هـ
      </h1>
      
      <p class="text-lg md:text-2xl text-gray-600 mb-12 text-center max-w-2xl leading-relaxed" style="font-family: 'Somar Sans', sans-serif;">
        سينطلق البث المباشر والقرعة بشكل رسمي للجمهور ووسائل الإعلام خلال
      </p>

      <!-- Countdown Grid -->
      <div v-if="!expired" class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-16 w-full max-w-4xl px-4">
        <!-- Seconds -->
        <div class="flex flex-col items-center group">
          <div class="w-full aspect-square md:w-36 md:h-36 bg-white rounded-3xl shadow-lg border border-gray-100 flex flex-col items-center justify-center transition-transform transform group-hover:-translate-y-2 duration-300 relative overflow-hidden">
             <div class="absolute inset-x-0 top-0 h-1 bg-[#D8A663]"></div>
            <span class="text-4xl md:text-6xl font-bold text-[#03AA77] mb-1" style="font-family: 'Somar Sans', sans-serif;">{{ seconds }}</span>
            <span class="text-sm md:text-base text-gray-400 font-medium">ثانية</span>
          </div>
        </div>
        
        <!-- Minutes -->
        <div class="flex flex-col items-center group">
          <div class="w-full aspect-square md:w-36 md:h-36 bg-white rounded-3xl shadow-lg border border-gray-100 flex flex-col items-center justify-center transition-transform transform group-hover:-translate-y-2 duration-300 relative overflow-hidden">
             <div class="absolute inset-x-0 top-0 h-1 bg-[#D8A663]"></div>
            <span class="text-4xl md:text-6xl font-bold text-[#03AA77] mb-1" style="font-family: 'Somar Sans', sans-serif;">{{ minutes }}</span>
            <span class="text-sm md:text-base text-gray-400 font-medium">دقيقة</span>
          </div>
        </div>

        <!-- Hours -->
        <div class="flex flex-col items-center group">
          <div class="w-full aspect-square md:w-36 md:h-36 bg-white rounded-3xl shadow-lg border border-gray-100 flex flex-col items-center justify-center transition-transform transform group-hover:-translate-y-2 duration-300 relative overflow-hidden">
            <div class="absolute inset-x-0 top-0 h-1 bg-[#D8A663]"></div>
            <span class="text-4xl md:text-6xl font-bold text-[#03AA77] mb-1" style="font-family: 'Somar Sans', sans-serif;">{{ hours }}</span>
            <span class="text-sm md:text-base text-gray-400 font-medium">ساعة</span>
          </div>
        </div>

        <!-- Days -->
        <div class="flex flex-col items-center group">
           <div class="w-full aspect-square md:w-36 md:h-36 bg-white rounded-3xl shadow-lg border border-gray-100 flex flex-col items-center justify-center transition-transform transform group-hover:-translate-y-2 duration-300 relative overflow-hidden">
            <div class="absolute inset-x-0 top-0 h-1 bg-[#D8A663]"></div>
            <span class="text-4xl md:text-6xl font-bold text-[#03AA77] mb-1" style="font-family: 'Somar Sans', sans-serif;">{{ days }}</span>
            <span class="text-sm md:text-base text-gray-400 font-medium">يوم</span>
          </div>
        </div>
      </div>

      <div v-else-if="isWaiting" class="flex flex-col items-center gap-6">
        <div v-if="!hasIndicatorRole" class="text-3xl text-[#03AA77] font-bold animate-pulse">
          في انتظار بدء القرعة...
        </div>
        <button
          v-if="hasIndicatorRole"
          @click="handleStartQurea"
          :disabled="isStartingQurea"
          class="bg-[#03AA77] text-white rounded-2xl font-bold shadow-2xl hover:shadow-3xl hover:bg-[#03AA77] flex flex-col items-center justify-center gap-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer group"
          style="font-family: 'Somar Sans', sans-serif; width: 800px; height: 200px;"
        >
          <div v-if="!isStartingQurea" class="bg-white/20 p-4 rounded-full group-hover:scale-110 transition-transform duration-300">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-white pl-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
          </div>
          <span v-if="isStartingQurea" class="animate-spin w-16 h-16 border-4 border-white/30 border-t-white rounded-full"></span>
          <span class="text-6xl">{{ isStartingQurea ? 'جاري البدء...' : 'بدء القرعة' }}</span>
        </button>
      </div>
      <div v-else class="text-3xl text-[#03AA77] font-bold mb-12 animate-pulse">
        جاري الدخول للنظام...
      </div>
      
      <!-- Date Display -->
      <!-- <div class="bg-white/60 backdrop-blur-md px-8 py-3 rounded-full shadow-sm border border-gray-200/50">
         <p class="text-[#D8A663] font-bold dir-ltr tracking-wide text-lg" style="direction: ltr; font-family: sans-serif;">
            07-02-2026 10:00 AM (Tripoli Time)
         </p>
      </div> -->

    </div>
    
    <!-- Footer -->
    <div class="absolute bottom-4 text-gray-400 text-sm">
        &copy; 2026 الهيئة العامة لشؤون الحج والعمرة
    </div>
  </div>
  
  <!-- Start Countdown Overlay -->
  <StartCountdown 
    :show="showStartCountdown" 
    :duration="5"
    @complete="handleCountdownComplete"
  />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { COUNTDOWN_TARGET_DATE } from '../constants';
import api from '../services/api';
import { parseJwt, logout } from '../services/auth';
import StartCountdown from '../components/StartCountdown.vue';

const router = useRouter();
const route = useRoute();

// Target Date: 07-02-2026 10:00 AM Tripoli Time
// Format: YYYY-MM-DDTHH:mm:ss+Offset
const TARGET_DATE_STR = "2026-02-03T19:40:00+02:00"; 
const API_URL = "/proxy-time/api/v1/time/current/zone?timezone=Africa%2FTripoli";

const targetDate = new Date(TARGET_DATE_STR);
const days = ref(0);
const hours = ref(0);
const minutes = ref(0);
const seconds = ref(0);
const expired = ref(false);
const isLoading = ref(true);
const isWaiting = ref(false);
const isStartingQurea = ref(false);
const showStartCountdown = ref(false);
let interval = null;
let statusPollingInterval = null;
let timeOffset = 0; // Difference between server time and local time (server - local)

// Get user roles from JWT token
const getUserRoles = () => {
    const token = localStorage.getItem('app-token');
    if (!token) return [];
    const decoded = parseJwt(token);
    return decoded?.realm_access?.roles || [];
};

// Check if user has indicator role
const hasIndicatorRole = computed(() => {
    const roles = getUserRoles();
    return roles.includes('qurea-role-indicators');
});

const fetchServerTime = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch time');
        const data = await response.json();
        
        // Construct date object from API response
        // data.date_time example: "2026-02-02T17:36:55.709584+02:00"
        const serverTime = new Date(data.date_time);
        const localTime = new Date();
        timeOffset = serverTime - localTime;
        
        isLoading.value = false;
        startTimer();
    } catch (error) {
        console.error("Error fetching time from API, falling back to local time:", error);
        // Fallback: assume local time is correct enough or just proceed
        isLoading.value = false;
        startTimer();
    }
};

const updateTimer = () => {
  // Current time = Local time + Calculated Offset
  const now = new Date(Date.now() + timeOffset);
  const diff = targetDate - now;

  if (diff <= 0) {
    expired.value = true;
    days.value = 0; hours.value = 0; minutes.value = 0; seconds.value = 0;
    clearInterval(interval);
    
    // Show waiting state and start polling
    isWaiting.value = true;
    startStatusPolling();
    return;
  }

  days.value = Math.floor(diff / (1000 * 60 * 60 * 24));
  hours.value = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  minutes.value = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  seconds.value = Math.floor((diff % (1000 * 60)) / 1000);
};

// Start polling for Qurea status
const startStatusPolling = async () => {
    // Clear any existing polling interval
    if (statusPollingInterval) {
        clearInterval(statusPollingInterval);
    }
    
    const pollStatus = async () => {
        try {
          if(!hasIndicatorRole.value){
            const response = await api.getQureaStatus();
            if (response.data?.object?.isStart === true) {
                // Stop polling
                clearInterval(statusPollingInterval);
                statusPollingInterval = null;
                
                // Show countdown overlay before routing
                showStartCountdown.value = true;
            }
          } else {
            const response = await api.getQureaStatusindicators();
            if (response.data?.object?.isStart === true) {
                // Stop polling
                clearInterval(statusPollingInterval);
                statusPollingInterval = null;
                
                // Show countdown overlay before routing
                showStartCountdown.value = true;
            }
          }
        } catch (error) {
            console.error('Error polling Qurea status:', error);
            // Continue polling despite errors
        }
    };
    
    // Initial call
    await pollStatus();
    
    // Poll every 1 second
    statusPollingInterval = setInterval(pollStatus, 1000);
};

// Handle start Qurea button click (for indicator role users)
const handleStartQurea = async () => {
    if (isStartingQurea.value) return;
    
    try {
        isStartingQurea.value = true;
        const response = await api.startQureaStatus();
        
        if (response.status === 200) {
            // Stop current polling if running
            if (statusPollingInterval) {
                clearInterval(statusPollingInterval);
                statusPollingInterval = null;
            }
            
            // Show countdown overlay
            showStartCountdown.value = true;
        }
    } catch (error) {
        console.error('Error starting Qurea:', error);
        alert('حدث خطأ أثناء بدء القرعة. يرجى المحاولة مرة أخرى.');
        isStartingQurea.value = false;
    }
};

// Handle countdown completion
const handleCountdownComplete = () => {
    showStartCountdown.value = false;
    isStartingQurea.value = false;
    
    // Route based on user role
    if (hasIndicatorRole.value) {
        router.push('/info');
    } else {
        // Regular user - route to Qurea page
        const officeId = route.query.officeId;
        if (officeId) {
            router.push(`/qurea/${officeId}`);
        } else {
            console.warn('No officeId found in query, redirecting to login');
            router.push('/');
        }
    }
};

const startTimer = () => {
    updateTimer(); // Initial call
    // Clear any existing interval just in case
    if (interval) clearInterval(interval);
    interval = setInterval(updateTimer, 1000);
};

onMounted(() => {
    fetchServerTime();
});

onUnmounted(() => {
    if (interval) clearInterval(interval);
    if (statusPollingInterval) clearInterval(statusPollingInterval);
});
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 1s ease-out;
}
</style>
