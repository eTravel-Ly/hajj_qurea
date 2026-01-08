<template>
    <div class="min-h-screen flex flex-col bg-[#FEFAF7] font-sans" dir="rtl">
      <!-- Top Navigation -->
      <header class="bg-white shadow-sm z-20 flex-shrink-0 h-16 flex justify-between items-center px-6">
        <div class="flex items-center gap-3">
          <!-- Sidebar Toggle Button -->
          <button 
            @click="toggleSidebar"
            class="p-2 hover:bg-gray-100 text-gray-600 hover:text-gray-800 rounded-lg transition-colors"
            :title="sidebarVisible ? 'إخفاء الشريط الجانبي' : 'إظهار الشريط الجانبي'"
          >
            <svg v-if="sidebarVisible" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <!-- <img src="/logo-icon.png" class="h-8 opacity-80" /> -->
          <div>
             <h1 class="font-bold text-primary text-lg leading-tight">منصة حجاج</h1>
             <p class="text-[10px] text-gray-500">لخدمات الحج والعمرة</p>
          </div>
        </div>
        
        <!-- Global Stats Ticker -->
        <div class="hidden md:flex items-center gap-6 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
            <div class="flex items-center gap-2">
               <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
               <span class="text-xs text-gray-400">إجمالي الحجاج</span>
               <span class="font-bold text-gray-700 font-mono text-lg">{{ qureaStationStatus?.quota?.toLocaleString() || 0 }}</span>
            </div>
            <div class="w-px h-4 bg-gray-300"></div>
            <div class="text-xs text-secondary font-bold">{{ currentTime }}</div>
        </div>
        
        <button @click="handleLogout" class="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors" title="تسجيل الخروج">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </header>

      <!-- Main Content -->
      <main class="flex-grow flex overflow-hidden" style="height: calc(100vh - 4rem);">
        <!-- Left Panel: Center Info -->
        <aside 
          class="bg-white flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden"
          :class="sidebarVisible ? 'w-80 border-l border-gray-200' : '!w-0 !p-0 !min-w-0 !max-w-0 border-0'"
        >
          <div v-show="sidebarVisible" class="flex flex-col h-full p-6">
            <!-- Offices List -->
            <div class="flex-1 overflow-y-auto min-h-0">
              <h3 class="text-lg font-bold text-gray-800 mb-3">المكاتب</h3>
              <div class="space-y-3">
                <div 
                  v-for="office in offices" 
                  :key="office.id"
                  @click="selectOffice(office.id)"
                  class="bg-white rounded-lg border-2 p-3 transition-all cursor-pointer"
                  :class="String(office.id) === String(route.params.officeId) ? 'border-[#D8A663] ring-2 ring-[#D8A663]/20' : 'border-gray-200'"
                >
                  <h4 class="font-bold text-sm text-gray-800 mb-2">{{ office.name }}</h4>
                  <div class="space-y-1">
                    <div class="flex items-center gap-2">
                      <p class="text-xs text-gray-500">الحصة:</p>
                      <p class="text-sm font-bold text-gray-800">{{ office.quota }} حاج</p>
                    </div>
                    <div class="flex items-center gap-2">
                      <p class="text-xs text-gray-500">تم إختيار:</p>
                      <p class="text-sm font-bold text-gray-800">{{ office.selectedCount || 0 }} حاج</p>
                    </div>
                    <div class="flex items-center gap-2 mt-2">
                      <span 
                        class="w-2 h-2 rounded-full"
                        :class="getStatusDotColor(office.status)"
                      ></span>  
                      <span class="text-xs font-bold" :class="getStatusTextColor(office.status)">
                        {{ getStatusText(office.status) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <!-- Center Content -->
        <div class="flex-grow flex flex-col overflow-y-auto p-6 relative min-h-0">
          <!-- Current Office Card - Top Left -->
          <div v-if="currentOffice" class="absolute top-6 left-6 z-10 w-48 bg-white rounded-xl border-2 border-primary/30 p-3 shadow-lg">
            <h4 class="font-bold text-base text-gray-800 mb-3">{{ currentOffice.name }}</h4>
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <p class="text-xs text-gray-500">الحصة الإجمالية:</p>
                <p class="text-lg font-bold text-gray-800">{{ currentOffice.quota }} حاج</p>
              </div>
              <div class="flex items-center gap-2">
                <p class="text-xs text-gray-500">تم إختيار:</p>
                <p class="text-lg font-bold text-gray-800">{{ currentOffice.selectedCount || 0 }} حاج</p>
              </div>
              <div class="flex items-center gap-2 mt-3">
                <span class="text-xs text-gray-500">الحالة:</span>
                <span 
                  class="w-2 h-2 rounded-full"
                  :class="getStatusDotColor(currentOffice.status)"
                ></span>  
                <span class="text-xs font-bold" :class="getStatusTextColor(currentOffice.status)">
                  {{ getStatusText(currentOffice.status) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Title -->
          <div class="text-center mb-3 mt-[15px]">
            <h1 class="text-xl font-bold text-gray-800">قرعة الحج لموسم 1447 هجري - 2026 ميلادي</h1>
          </div>

          <!-- Large Lottery Number Display -->
          <div class="flex-grow flex flex-col items-center justify-center mb-3">
            <div class="bg-[#DCB278] rounded-[40px] p-[12px] mb-4 shadow-2xl border-[12px] border-white">
              <div class="bg-gradient-to-br rounded-[28px] h-[120px] min-w-[650px] text-center transform hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                <p class="text-[120px] font-bold text-white tracking-wider">{{ lotteryNumber || 4795 }}</p>
              </div>
            </div>

            <!-- Pilgrim and Companion Cards -->
            <div class="w-full max-w-4xl mb-4 mt-6">
              <div class="bg-white rounded-xl border-2 border-primary/30 p-6">
                <div class="grid grid-cols-2" style="gap: calc(var(--spacing) * 19);">
                  <!-- Pilgrim Card - Right side in RTL -->
                  <div>
                    <h3 class="text-base font-bold text-[#D8A663] mb-4 text-right">الحاج</h3>
                    <div class="text-right">
                      <p 
                        :key="isDrawing ? animatedPilgrimName : currentPilgrim?.name"
                        class="text-xl font-bold text-gray-800 transition-all duration-75"
                        :class="isDrawing ? 'animate-pulse' : ''"
                      >
                        {{ isDrawing ? (animatedPilgrimName || '---') : (currentPilgrim?.name || 'ايهاب البهلول فرج القيزاني')}}
                      </p>
                      <p v-if="!isDrawing && currentPilgrim?.nationalId" class="text-sm text-gray-500 mt-2 font-mono">{{ currentPilgrim.nationalId }}</p>
                    </div>
                  </div>

                  <!-- Companion Card - Left side in RTL -->
                  <div>
                    <h3 class="text-base font-bold text-[#D8A663] mb-4 text-right">المرافق</h3>
                    <div class="text-right">
                      <p 
                        :key="isDrawing ? animatedCompanionName : currentCompanion?.name"
                        class="text-xl font-bold text-gray-800 transition-all duration-75"
                        :class="isDrawing ? 'animate-pulse' : ''"
                      >
                        {{ isDrawing ? (animatedCompanionName || '---') : (currentCompanion?.name || 'ايهاب البهلول فرج القيزاني') }}
                      </p>
                      <p v-if="!isDrawing && currentCompanion?.nationalId" class="text-sm text-gray-500 mt-2 font-mono">{{ currentCompanion.nationalId }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Office Cards Scrollable Section -->
          <!-- <div class="mb-2">
            <div class="relative">
              <!-- Scroll Left Button - Select Previous Office -->
              <!-- <button 
                @click="selectPreviousOffice"
                class="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-transparent rounded-full p-2 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="transform: scaleX(-1);">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button> -->

              <!-- Office Cards Container -->
              <!-- <div 
                ref="officeCardsContainer"
                class="flex gap-4 overflow-x-auto scrollbar-hide px-8"
                @scroll="handleOfficeScroll"
              >
                <div 
                  v-for="office in offices" 
                  :key="office.id"
                  @click="selectOffice(office.id)"
                  class="flex-shrink-0 w-48 bg-white rounded-xl border-2 p-4 shadow-md hover:shadow-lg transition-all cursor-pointer"
                  :class="String(office.id) === String(route.params.officeId) ? 'border-secondary ring-4 ring-secondary/20' : 'border-gray-200'"
                >
                  <h4 class="font-bold text-base text-gray-800 mb-3">{{ office.name }}</h4>
                  <div class="space-y-2">
                    <div class="flex items-center gap-2">
                      <p class="text-xs text-gray-500">الحصة الإجمالية:</p>
                      <p class="text-lg font-bold text-gray-800">{{ office.quota }} حاج</p>
                    </div>
                    <div class="flex items-center gap-2">
                      <p class="text-xs text-gray-500">تم إختيار:</p>
                      <p class="text-lg font-bold text-gray-800">{{ office.selectedCount || 0 }} حاج</p>
                    </div>
                    <div class="flex items-center gap-2 mt-3">
                        <span class="text-xs text-gray-500">الحالة:</span>

                      <span 
                        class="w-2 h-2 rounded-full"
                        :class="getStatusDotColor(office.status)"
                      ></span>  
                      <span class="text-xs font-bold" :class="getStatusTextColor(office.status)">
                        {{ getStatusText(office.status) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div> -->

              <!-- Scroll Right Button - Select Next Office -->
              <!-- <button 
                @click="selectNextOffice"
                class="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-transparent rounded-full p-2 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="transform: scaleX(-1);">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button> -->
            <!-- </div>
          </div> -->

          <!-- Bottom Action Bar -->
          <div class="sticky bottom-0 flex justify-between items-center bg-[#025446] rounded-xl p-3 shadow-lg z-30 mt-auto">
            <!-- Center Selector  -->
            <div class="relative">
              <select 
                v-model="selectedCenterId" 
                @change="handleCenterChange"
                class="px-6 py-3 pr-10 bg-white border-2 border-gray-200 rounded-lg font-bold text-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none cursor-pointer"
              >
                <option v-for="center in centers" :key="center.id" :value="center.id">
                  {{ center.name }}
                </option>
              </select>
              <div class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <!-- Start Lottery Button -->
            <button     
              @click="handleStartLottery"
              :disabled="isDrawing || currentOffice?.status !== 0 || allWinnersShown"
              class="bg-[#D8A764] text-white px-6 py-2 rounded-lg font-bold shadow-md hover:shadow-lg hover:bg-[#C89654] flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="!isDrawing" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              <span v-if="isDrawing" class="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></span>
              <span>{{ isDrawing ? 'جاري السحب...' : lotteryButtonText }}</span>
            </button>
          </div>
        </div>
      </main>
  
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../services/api';
import { logout } from '../services/auth';

const route = useRoute();
const router = useRouter();

const currentTime = ref('');
const qureaStationStatus = ref({ quota: 0 });
const offices = ref([]);
const centers = ref([]);
const selectedCenterId = ref(null);
const selectedCenter = ref(null);
const currentOffice = ref(null);
const lotteryNumber = ref(null);
const currentPilgrim = ref(null);
const currentCompanion = ref(null);
const animatedPilgrimName = ref('');
const animatedCompanionName = ref('');
const isDrawing = ref(false);
const winnersQueue = ref([]);
const currentWinnerIndex = ref(-1);
const officeCardsContainer = ref(null);
const officeScrollLeft = ref(0);
const canScrollRight = ref(false);
const sidebarVisible = ref(true);

let timeInterval = null;
let drawingInterval = null;

const handleLogout = () => {
    logout();
};

const toggleSidebar = () => {
    sidebarVisible.value = !sidebarVisible.value;
};

// Computed properties
const centerTotalQuota = computed(() => {
  if (selectedCenter.value) {
    return offices.value
      .filter(office => office.coordinationId === selectedCenter.value.id)
      .reduce((sum, office) => sum + (office.quota || 0), 0);
  }
  return offices.value.reduce((sum, office) => sum + (office.quota || 0), 0);
});

const centerSelectedCount = computed(() => {
  if (selectedCenter.value) {
    return offices.value
      .filter(office => office.coordinationId === selectedCenter.value.id)
      .reduce((sum, office) => sum + (office.selectedCount || 0), 0);
  }
  return offices.value.reduce((sum, office) => sum + (office.selectedCount || 0), 0);
});

const completionPercentage = computed(() => {
  if (centerTotalQuota.value === 0) return 0;
  return Math.round((centerSelectedCount.value / centerTotalQuota.value) * 100);
});

// Check if all winners have been shown
const allWinnersShown = computed(() => {
  return winnersQueue.value.length > 0 && currentWinnerIndex.value >= winnersQueue.value.length - 1;
});

// Button text based on state
const lotteryButtonText = computed(() => {
  if (winnersQueue.value.length === 0) {
    return 'بدأ القرعة';
  } else if (currentWinnerIndex.value >= winnersQueue.value.length - 1) {
    return `تم عرض جميع الفائزين (${winnersQueue.value.length})`;
  } else {
    return `الفائز التالي (${currentWinnerIndex.value + 2}/${winnersQueue.value.length})`;
  }
});

// Status helpers
const getStatusText = (status) => {
  switch(status) {
    case 1: return 'في الانتظار';
    case 2: return 'قيد الإجراء';
    case 3: return 'منتهي';
    case 4: return 'ملغي';
    default: return 'لم تبدأ بعد';
  }
};

const getStatusDotColor = (status) => {
  switch(status) {
    case 1: return 'bg-yellow-400';
    case 2: return 'bg-orange-500';
    case 3: return 'bg-primary';
    default: return 'bg-gray-400';
  }
};

const getStatusTextColor = (status) => {
  switch(status) {
    case 1: return 'text-yellow-700';
    case 2: return 'text-orange-700';
    case 3: return 'text-primary';
    default: return 'text-gray-500';
  }
};

// Select next office
const selectNextOffice = () => {
  if (!offices.value.length || !currentOffice.value) return;
  
  const currentIndex = offices.value.findIndex(o => String(o.id) === String(currentOffice.value.id));
  if (currentIndex === -1) return;
  
  // Get next office (wrap around to first if at the end)
  const nextIndex = (currentIndex + 1) % offices.value.length;
  const nextOffice = offices.value[nextIndex];
  
  // Navigate to next office
  router.push(`/qurea/${nextOffice.id}`);
};

// Select previous office
const selectPreviousOffice = () => {
  if (!offices.value.length || !currentOffice.value) return;
  
  const currentIndex = offices.value.findIndex(o => String(o.id) === String(currentOffice.value.id));
  if (currentIndex === -1) return;
  
  // Get previous office (wrap around to last if at the beginning)
  const prevIndex = currentIndex === 0 ? offices.value.length - 1 : currentIndex - 1;
  const prevOffice = offices.value[prevIndex];
  
  // Navigate to previous office
  router.push(`/qurea/${prevOffice.id}`);
};

// Select office by ID
const selectOffice = (officeId) => {
  router.push(`/qurea/${officeId}`);
};

// Scroll to selected office
const scrollToSelectedOffice = () => {
  if (!officeCardsContainer.value || !route.params.officeId) return;
  
  const officeIndex = offices.value.findIndex(o => String(o.id) === String(route.params.officeId));
  if (officeIndex === -1) return;
  
  const cardWidth = 208; // w-48 (192px) + gap-4 (16px)
  const containerWidth = officeCardsContainer.value.clientWidth;
  const cardPosition = officeIndex * cardWidth;
  
  // Center the selected card in the viewport
  const scrollPosition = cardPosition - (containerWidth / 2) + (cardWidth / 2);
  
  officeCardsContainer.value.scrollTo({
    left: Math.max(0, scrollPosition),
    behavior: 'smooth'
  });
  
  handleOfficeScroll();
};

// Office scrolling - COMMENTED OUT (now using selectNextOffice/selectPreviousOffice)
// const scrollOffices = (direction) => {
//   if (!officeCardsContainer.value) return;
//   const scrollAmount = 220; // Adjusted for smaller cards (w-48)
//   const newScrollLeft = direction === 'left' 
//     ? Math.max(0, officeCardsContainer.value.scrollLeft - scrollAmount)
//     : officeCardsContainer.value.scrollLeft + scrollAmount;
//   
//   officeCardsContainer.value.scrollTo({
//     left: newScrollLeft,
//     behavior: 'smooth'
//   });
// };

const handleOfficeScroll = () => {
  if (!officeCardsContainer.value) return;
  officeScrollLeft.value = officeCardsContainer.value.scrollLeft;
  canScrollRight.value = 
    officeCardsContainer.value.scrollLeft < 
    (officeCardsContainer.value.scrollWidth - officeCardsContainer.value.clientWidth - 10);
};

// Center change handler
const handleCenterChange = () => {
  const center = centers.value.find(c => c.id === selectedCenterId.value);
  if (center) {
    selectedCenter.value = center;
  }
};

// Start lottery
const handleStartLottery = async () => {
  if (!currentOffice.value || isDrawing.value) return;
  
  // Check if we need to load winners from API
  if (winnersQueue.value.length === 0) {
    // First time load all winners from API
    try {
      await api.startQurea(currentOffice.value.id);
      const res = await api.getOfficeWinners(currentOffice.value.id);
      const winners = res.data?.object || [];
      
      if (!Array.isArray(winners) || winners.length === 0) {
        alert('لا توجد نتائج قرعة');
        return;
      }
      
      winnersQueue.value = winners;
      currentWinnerIndex.value = 0;
    } catch (error) {
      console.error('Error loading winners:', error);
      alert('حدث خطأ في تحميل نتائج القرعة');
      return;
    }
  } else {
    // Already have winners move to next winner
    currentWinnerIndex.value++;
    
    // Check if we've reached the end
    if (currentWinnerIndex.value >= winnersQueue.value.length) {
      currentWinnerIndex.value = winnersQueue.value.length - 1; // Stay at last
      return;
    }
  }
  
  // Start animation
  isDrawing.value = true;
  animatedPilgrimName.value = '';
  animatedCompanionName.value = '';
  
  try {
    // Fetch registers for name animation
    let registerNames = [];
    try {
      const registersRes = await api.getRegisters(currentOffice.value.id, 1, 100);
      const registersData = registersRes.data?.object || [];
      registerNames = Array.isArray(registersData) ? registersData : (registersData.items || registersData.list || []);
    } catch (e) {
      console.warn('Could not fetch registers for animation', e);
    }
    
    // Simulate lottery drawing animation
    const maxNumber = currentOffice.value.quota || 1000;
    let frameCount = 0;
    const totalFrames = 60; // 1 second at 60fps
    
    // Prepare name arrays for animation
    let namePool = [];
    if (registerNames.length > 0) {
      namePool = registerNames.map(r => r?.name).filter(Boolean);
    } else {
      namePool = ['محمد أحمد علي', 'عبدالله حسن محمد', 'خالد سعيد إبراهيم', 'عمر فتحي محمود', 'يوسف ناصر سالم', 'أحمد محمود حسن', 'علي يوسف إبراهيم', 'حسن خالد سعيد'];
    }
    
    // Ensure we have names to animate
    if (namePool.length === 0) {
      namePool = ['---'];
    }
    
    drawingInterval = setInterval(() => {
      frameCount++;
      
      // Animate lottery number
      lotteryNumber.value = Math.floor(Math.random() * maxNumber) + 1;
      
      // Animate names - rapid cycling like the number (change every frame for fast animation)
      const randomPilgrimIndex = Math.floor(Math.random() * namePool.length);
      const randomCompanionIndex = Math.floor(Math.random() * namePool.length);
      animatedPilgrimName.value = namePool[randomPilgrimIndex] || '---';
      animatedCompanionName.value = namePool[randomCompanionIndex] || '---';
      
      if (frameCount >= totalFrames) {
        clearInterval(drawingInterval);
        // Show winner from queue
        showCurrentWinner();
        isDrawing.value = false;
        // Clear animated names
        animatedPilgrimName.value = '';
        animatedCompanionName.value = '';
      }
    }, 16); // ~60fps
    
  } catch (error) {
    console.error('Error during animation:', error);
    isDrawing.value = false;
    animatedPilgrimName.value = '';
    animatedCompanionName.value = '';
    alert('حدث خطأ أثناء عرض القرعة');
  }
};

// Show current winner from queue
const showCurrentWinner = () => {
  if (currentWinnerIndex.value >= 0 && currentWinnerIndex.value < winnersQueue.value.length) {
    const winner = winnersQueue.value[currentWinnerIndex.value];
    
    // Map the response to display fields
    lotteryNumber.value = winner.registerNumber || null;
    currentPilgrim.value = {
      name: winner.hajj || '---',
      nationalId: null
    };
    currentCompanion.value = {
      name: winner.companionHajj || '---',
      nationalId: null
    };
    
    // Refresh office data
    loadOffices();
  }
};

// Load data
const loadOffices = async () => {
  try {
    const res = await api.getOfficeCrs();
    const rawOffices = res.data?.object || [];
    offices.value = Array.isArray(rawOffices) ? rawOffices : (rawOffices.list || []);
    
    // Find current office
    currentOffice.value = offices.value.find(o => String(o.id) === String(route.params.officeId));
    
    // Calculate selected counts (assuming we have this data from API)
    offices.value.forEach(office => {
      if (!office.selectedCount) {
        office.selectedCount = office.status === 3 ? office.quota : 0;
      }
    });
  } catch (error) {
    console.error('Error loading offices:', error);
  }
};

const loadCenters = async () => {
  try {
    const res = await api.getCoordinations();
    centers.value = res.data?.object || [];
    
    // Set default center
    if (centers.value.length > 0) {
      selectedCenterId.value = centers.value[0].id;
      selectedCenter.value = centers.value[0];
    }
  } catch (error) {
    console.error('Error loading centers:', error);
  }
};

// Initialize time and data
onMounted(() => {
  // Update time immediately
  currentTime.value = new Intl.DateTimeFormat('ar-LY', { 
    hour: 'numeric', 
    minute: 'numeric', 
    second: 'numeric', 
    hour12: true 
  }).format(new Date());
  
  // Update time every second
  timeInterval = setInterval(() => {
    currentTime.value = new Intl.DateTimeFormat('ar-LY', { 
      hour: 'numeric', 
      minute: 'numeric', 
      second: 'numeric', 
      hour12: true 
    }).format(new Date());
  }, 1000);

  // Load data
  Promise.all([
    api.getQureaStation().then(res => {
      qureaStationStatus.value = res.data?.object || {};
    }),
    loadCenters(),
    loadOffices()
  ]).then(() => {
    // Scroll to current office
    setTimeout(() => {
      scrollToSelectedOffice();
    }, 100);
  });

  // Check scroll position after initial render
  setTimeout(() => {
    handleOfficeScroll();
  }, 500);
});

// Watch for office ID changes and reload data
watch(() => route.params.officeId, async (newOfficeId) => {
  if (newOfficeId) {
    // Reload offices to get updated data
    await loadOffices();
    
    // Find and set current office
    currentOffice.value = offices.value.find(o => String(o.id) === String(newOfficeId));
    
    // Reset lottery data
    lotteryNumber.value = null;
    currentPilgrim.value = null;
    currentCompanion.value = null;
    
    // Reset winners queue when changing offices
    winnersQueue.value = [];
    currentWinnerIndex.value = -1;
    
    // Scroll to current office
    setTimeout(() => {
      scrollToSelectedOffice();
    }, 100);
  }
});

// Cleanup intervals on unmount
onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval);
  }
  if (drawingInterval) {
    clearInterval(drawingInterval);
  }
});
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>