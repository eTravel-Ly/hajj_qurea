<template>
  <div class="h-screen flex flex-col bg-gray-50 overflow-hidden font-sans" dir="rtl">
    <!-- Top Navigation -->
    <header class="bg-white shadow-sm z-20 flex-shrink-0 h-16 flex justify-between items-center px-6">
      <div class="flex items-center gap-3">
        <!-- <img src="/logo-icon.png" class="h-8 opacity-80" /> -->
        <div>
           <h1 class="font-bold text-primary text-lg leading-tight">منصة حجاج</h1>
           <p class="text-[10px] text-gray-500">لوحة التحكم المركزية</p>
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
        <img src="/logout-02.png" alt="Logout" class="h-5 w-5" />
      </button>
    </header>

    <div class="flex flex-grow overflow-hidden">
      
      <!-- Sidebar: Office List -->
      <aside class="w-80 bg-white border-l border-gray-200 flex flex-col z-10 flex-shrink-0">
        <!-- Sidebar Header: Filters -->
        <div class="p-4 border-b border-gray-100 space-y-3 bg-gray-50/50">
           <!-- Coordination Select -->
           <div class="relative">
              <select v-model="selectedCoordinationId" class="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none cursor-pointer">
                 <option :value="null">كل التنسيقيات</option>
                 <option v-for="coord in coordinations" :key="coord.id" :value="coord.id">
                    {{ coord.name }}
                 </option>
              </select>
              <div class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
           </div>

           <!-- Search Input -->
           <div class="relative">
              <input 
                v-model="searchQuery" 
                type="text" 
                placeholder="بحث عن مكتب..." 
                class="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all"
              />
              <div class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
           </div>
        </div>

        <!-- Pagination / Count for Sidebar -->
        <div class="px-4 py-2 bg-gray-50 text-[10px] text-gray-400 flex justify-between items-center border-b border-gray-100">
            <span>عدد المكاتب: {{ filteredOffices.length }}</span>
        </div>

        <!-- List -->
        <div class="flex-grow overflow-y-auto overflow-x-hidden custom-scrollbar p-3 space-y-3">
           <div v-for="office in filteredOffices" :key="office.id" 
                @click="selectOffice(office)"
                class="p-4 rounded-xl border transition-all duration-200 cursor-pointer bg-white border-gray-100 hover:border-gray-300 hover:shadow-md group relative"
                :class="selectedOffice?.id === office.id ? 'ring-2 ring-[#D8A663] border-[#D8A663] bg-[#fffbf5]' : 'bg-white'"
           >
              <!-- Header -->
              <div class="mb-3">
                 <h4 class="font-bold text-gray-800 text-base group-hover:text-primary transition-colors line-clamp-1" :title="office.name">
                    {{ office.name }}
                 </h4>
              </div>

              <!-- Details -->
              <div class="space-y-2 text-xs">
                  <!-- Quota -->
                  <div class="flex justify-between items-center">
                      <span class="text-gray-500 font-medium">الحصة الإجمالية:</span>
                      <span class="font-bold text-gray-800">{{ office.quota || 0 }} حاج</span>
                  </div>

                  <!-- Population -->
                  <div class="flex justify-between items-center">
                      <span class="text-gray-500 font-medium">عدد المسجلين:</span>
                      <span class="font-bold text-gray-800">{{ office.populationCount || 0 }}</span>
                  </div>

                  <!-- Done Count -->
                  <div class="flex justify-between items-center">
                      <span class="text-gray-500 font-medium">تم إختيار:</span>
                      <span class="font-bold" :class="office.doneCount > 0 ? 'text-[#D8A663]' : 'text-gray-800'">
                          {{ office.doneCount || 0 }} حاج
                      </span>
                  </div>
              </div>

              <!-- Status Footer -->
              <div class="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
                 <span class="text-xs text-gray-400">الحالة:</span>
                 <div class="flex items-center gap-1.5">
                    <span class="text-xs font-bold" :class="getStatusTextColor(office.status)">
                        {{ getStatusText(office.status) }}
                    </span>
                    <span class="w-2.5 h-2.5 rounded-full" :class="getStatusColor(office.status)"></span>
                 </div>
              </div>
           </div>
           
           <div v-if="filteredOffices.length === 0" class="p-8 text-center text-gray-400 text-sm">
             لا توجد مكاتب مطابقة
           </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-grow flex flex-col bg-gray-50 overflow-hidden relative">
        
        <!-- Welcome State -->
        <div v-if="!selectedOffice" class="absolute inset-0 flex flex-col items-center justify-center text-gray-300 p-8 text-center animate-in fade-in duration-700">
            <svg class="w-32 h-32 mb-6 opacity-20" fill="currentColor" viewBox="0 0 24 24"><path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 9c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3zm0-4c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm6 10H6v-1.53c0-2.5 3.97-3.58 6-3.58s6 1.08 6 3.58V18zm-9.69-2h7.38c-.69-.56-2.38-1.12-3.69-1.12s-3.01.56-3.69 1.12z"/></svg>
            <h2 class="text-2xl font-bold text-gray-400 mb-2">مرحباً بك في منصة القرعة</h2>
            <p class="max-w-md">الرجاء اختيار مكتب من القائمة الجانبية لعرض التفاصيل وإجراء القرعة</p>
        </div>

        <!-- Selected Office Detail -->
        <div v-else class="flex flex-col h-full animate-in slide-up duration-300">
           
           <!-- Office Header -->
           <div class="bg-white p-6 border-b border-gray-200 flex justify-between items-start shadow-sm z-10">
              <div>
                  <div class="flex items-center gap-3 mb-2">
                     <h2 class="text-2xl font-bold text-gray-800">{{ selectedOffice.name }}</h2>
                     <span class="px-2.5 py-0.5 rounded-full text-xs font-bold ring-1 ring-inset" 
                           :class="getStatusBadgeClass(selectedOffice.status)">
                        {{ getStatusText(selectedOffice.status) }}
                     </span>
                  </div>
                  <div class="flex gap-6 text-sm text-gray-500">
                      <div class="flex items-center gap-1.5">
                          <span class="font-medium text-gray-700">كود المكتب:</span>
                          <span class="font-mono text-gray-600 bg-gray-100 px-1.5 rounded">{{ selectedOffice.id }}</span>
                      </div>
                      <div class="flex items-center gap-1.5">
                          <span class="font-medium text-gray-700">الحصة:</span>
                          <span>{{ selectedOffice.quota }} حاج</span>
                      </div>
                      <div class="flex items-center gap-1.5" v-if="selectedOffice.coordination">
                          <span class="font-medium text-gray-700">التنسيقية:</span>
                          <span>{{ selectedOffice.coordination.name }}</span>
                      </div>
                  </div>
              </div>

              <!-- Primary Action -->
              <div class="flex flex-col gap-2">

                  
                  <button 
                    v-if="selectedOffice.status === 0 || selectedOffice.status === 1"
                    @click="handleStartQurea"
                    :disabled="processing"
                    class="bg-[#D8A663] text-white px-6 py-2.5 rounded-lg font-bold shadow-md hover:shadow-lg hover:bg-[#c29558] flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     <span v-if="processing" class="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></span>
                     <span>{{ processing ? 'جاري السحب...' : 'بدأ القرعة' }}</span>
                     <svg v-if="!processing" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </button>
                  <button 
                    v-else-if="selectedOffice.status === 2"
                    @click="handleStartQurea"
                    class="bg-yellow-500 text-white px-6 py-2.5 rounded-lg font-bold shadow-md hover:shadow-lg hover:bg-yellow-600 flex items-center gap-2 transition-all active:scale-95"
                  >
                     <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                     <span>مشاهدة القرعة</span>
                  </button>
                  <div v-else-if="selectedOffice.status === 3" class="bg-green-50 text-green-700 px-4 py-2 rounded-lg border border-green-200 font-bold flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
                      <span>تمت القرعة بنجاح</span>
                  </div>
                  <div v-else-if="selectedOffice.status === 4" class="bg-red-50 text-red-700 px-4 py-2 rounded-lg border border-red-200 font-bold flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" /></svg>
                      <span>القرعة ملغاة</span>
                  </div>
              </div>
           </div>

           <!-- Tabs -->
           <div class="bg-white px-6 border-b border-gray-200 flex gap-6">
              <button 
                @click="activeTab = 'registers'"
                class="py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2"
                :class="activeTab === 'registers' ? 'border-secondary text-secondary' : 'border-transparent text-gray-500 hover:text-gray-700'"
              >
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                 سجل المتقدمين
              </button>
              <button 
                @click="activeTab = 'winners'"
                class="py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2"
                :class="activeTab === 'winners' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'"
              >
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                 الفائزين بالقرعة
                 <span v-if="winners.length" class="bg-primary/10 text-primary text-[10px] px-1.5 py-0.5 rounded-full">{{ winners.length }}</span>
              </button>
           </div>

           <!-- Tab Content Area -->
           <div class="flex-grow overflow-auto bg-gray-50 p-6 relative">
             
             <!-- Tab: Registers -->
             <div v-if="activeTab === 'registers'" class="space-y-4">
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-right">
                            <thead class="bg-gray-50 text-gray-500 border-b border-gray-200 font-medium">
                                <tr>
                                    <th class="px-6 py-3">رقم الاشتراك</th>
                                    <th class="px-6 py-3">الاسم الثلاثي</th>
                                    <th class="px-6 py-3">الرقم الوطني</th>
                                    <th class="px-6 py-3">رقم الهاتف</th>
                                    <th class="px-6 py-3">تاريخ التسجيل</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100">
                                <tr v-for="reg in registers" :key="reg.id" class="hover:bg-gray-50/50">
                                    <td class="px-6 py-3 font-mono text-gray-600">{{ reg.id || '#' }}</td>
                                    <td class="px-6 py-3 font-bold text-gray-700">{{ reg.name || 'غير متوفر' }}</td>
                                    <td class="px-6 py-3 font-mono">{{ reg.nationalId || '-' }}</td>
                                    <td class="px-6 py-3 font-mono text-gray-500">{{ reg.phoneNumber || '-' }}</td>
                                    <td class="px-6 py-3 text-gray-400">{{ formatDate(reg.createDate) }}</td>
                                </tr>
                                <tr v-if="registers.length === 0 && !loadingRegisters">
                                    <td colspan="5" class="px-6 py-8 text-center text-gray-400">لا يوجد متقدمين في هذا المكتب</td>
                                </tr>
                                <tr v-if="loadingRegisters">
                                    <td colspan="5" class="px-6 py-8 text-center text-gray-400 animate-pulse">جاري تحميل البيانات...</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Pagination -->
                <div class="flex justify-center items-center gap-4 text-sm" v-if="registers.length > 0">
                    <button @click="changePage(currentPage - 1)" :disabled="currentPage <= 1" class="px-3 py-1 rounded border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50">السابق</button>
                    <span class="text-gray-600">صفحة {{ currentPage }}</span>
                    <button @click="changePage(currentPage + 1)" :disabled="registers.length < pageSize" class="px-3 py-1 rounded border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50">التالي</button>
                </div>
             </div>

             <!-- Tab: Winners -->
             <div v-if="activeTab === 'winners'">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div v-for="(winner, idx) in winners" :key="idx" 
                         class="bg-white p-5 rounded-xl border border-gray-100 shadow-sm border-l-4 border-l-[#D8A663] hover:shadow-md transition-shadow">
                        <div class="space-y-3">
                            <!-- Pilgrim Section -->
                            <div>
                                <div class="flex justify-between items-start mb-2">
                                    <h4 class="font-bold text-gray-800 text-lg">{{ winner.hajj }}</h4>
                                    <span class="bg-primary/10 text-primary text-xs px-2 py-1 rounded font-bold">حاج</span>
                                </div>
                            </div>
                            <!-- Companion Section -->
                            <div>
                                <div class="flex justify-between items-start mb-2">
                                    <h4 class="font-bold text-gray-800 text-lg">{{ winner.companionHajj || 'لا يوجد مرافق' }}</h4>
                                    <span class="bg-secondary/10 text-secondary text-xs px-2 py-1 rounded font-bold">مرافق</span>
                                </div>
                            </div>
                            <!-- Registration Number -->
                            <div class="pt-2 border-t border-gray-100">
                                <p class="flex items-center gap-2 text-sm text-gray-500">
                                    <span class="text-xs text-gray-400">رقم التسجيل:</span> 
                                    <span class="font-mono font-bold">{{ winner.registerNumber || 'لا يوجد رقم تسجيل' }}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div v-if="winners.length === 0" class="col-span-full p-8 text-center text-gray-400">
                        {{ winnersMessage || 'لا يوجد فائزين حالياً' }}
                    </div>
                </div>
             </div>

           </div>
        </div>

      </main>
    </div>

    <!-- Alert Modal -->
    <AlertModal
      :isVisible="alertModal.isVisible"
      :type="alertModal.type"
      :title="alertModal.title"
      :message="alertModal.message"
      @close="closeAlert"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';
import { logout } from '../services/auth';
import AlertModal from '../components/AlertModal.vue';

const router = useRouter();

// --- State ---
const currentTime = ref('');
const coordinations = ref([]);
const offices = ref([]);
const qureaStationStatus = ref({ quota: 0 });

const selectedCoordinationId = ref(null);
const searchQuery = ref('');
const selectedOffice = ref(null);

const activeTab = ref('registers'); // 'registers' | 'winners'

// Registers Pagination
const registers = ref([]);
const loadingRegisters = ref(false);
const currentPage = ref(1);
const pageSize = ref(1000);

// Winners
const winners = ref([]);
const loadingWinners = ref(false);

const processing = ref(false);

// Alert Modal State
const alertModal = ref({
    isVisible: false,
    type: 'info', // 'error', 'warning', 'success', 'info'
    title: 'تنبيه',
    message: ''
});

// Alert Functions
const showAlert = (message, type = 'info', title = 'تنبيه') => {
    alertModal.value = {
        isVisible: true,
        type,
        title,
        message
    };
};

const closeAlert = () => {
    alertModal.value.isVisible = false;
};

// --- Computed ---
const filteredOffices = computed(() => {
    return offices.value.filter(office => {
        const matchesCoord = selectedCoordinationId.value ? office.coordinationId === selectedCoordinationId.value : true;
        const matchesSearch = searchQuery.value ? office.name.toLowerCase().includes(searchQuery.value.toLowerCase()) : true;
        return matchesCoord && matchesSearch;
    });
});

// --- Formatting ---
const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('ar-LY');
}

// --- Status Helpers ---
const getStatusText = (status) => {
    switch(status) {
        case 0: 
        case 1: return 'لم تبدأ بعد';
        case 2: return 'قيد الإجراء';
        case 3: return 'منتهي';
        case 4: return 'ملغي';
        default: return 'غير محدد';
    }
};

const getStatusColor = (status) => {
    switch(status) {
        case 0: return 'bg-gray-400'; // None - gray
        case 1: return 'bg-gray-400'; // Waiting - gray
        case 2: return 'bg-yellow-500'; // InProgress - yellow
        case 3: return 'bg-green-500'; // Completed - green
        case 4: return 'bg-red-500'; // Cancelled - red
        default: return 'bg-gray-300';
    }
};

const getStatusTextColor = (status) => {
    switch(status) {
        case 0: return 'text-gray-500'; // None - gray
        case 1: return 'text-gray-500'; // Waiting - gray
        case 2: return 'text-yellow-600'; // InProgress - yellow
        case 3: return 'text-green-600'; // Completed - green
        case 4: return 'text-red-500'; // Cancelled - red
        default: return 'text-gray-400';
    }
};

const getStatusBadgeClass = (status) => {
    switch(status) {
        case 0: return 'bg-gray-100 text-gray-600 ring-gray-600/10'; // None - gray
        case 1: return 'bg-gray-100 text-gray-600 ring-gray-600/10'; // Waiting - gray
        case 2: return 'bg-yellow-50 text-yellow-700 ring-yellow-600/20 border border-yellow-200'; // InProgress - yellow
        case 3: return 'bg-green-50 text-green-700 ring-green-600/20'; // Completed - green
        case 4: return 'bg-red-50 text-red-700 ring-red-600/10'; // Cancelled - red
        default: return 'bg-gray-50 text-gray-600 ring-gray-500/10';
    }
};

// --- Actions ---
const initData = async () => {
    // Clock
    setInterval(() => {
        currentTime.value = new Intl.DateTimeFormat('ar-LY', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }).format(new Date());
    }, 1000);

    await loadOfficesAndStation();
};

const loadOfficesAndStation = async () => {
    try {
        const [stationRes, coordRes, officesRes] = await Promise.all([
            api.getQureaStation(),
            api.getCoordinations(),
            api.getOfficeCrs()
        ]);
        
        qureaStationStatus.value = stationRes.data?.object || {};
        coordinations.value = coordRes.data?.object || [];
        
        const rawOffices = officesRes.data?.object || [];
        const newOfficeList = Array.isArray(rawOffices) ? rawOffices : (rawOffices.list || []);
        
        // Sync with local storage
        const STORAGE_KEY_PREFIX = 'qurea_state_';
        
        newOfficeList.forEach(office => {
            const saved = localStorage.getItem(STORAGE_KEY_PREFIX + office.id);
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    if (parsed.officeStatus !== undefined) office.status = parsed.officeStatus;
                    // Dashboard uses 'doneCount', storage has 'selectedCount'
                    if (parsed.selectedCount !== undefined) office.doneCount = parsed.selectedCount;
                } catch (e) {
                    // ignore
                }
            }
        });
        
        offices.value = newOfficeList;

        // Update selected office reference if it exists
        if (selectedOffice.value) {
            const updated = newOfficeList.find(o => o.id === selectedOffice.value.id);
            if (updated) {
                // Keep the selection but update properties (like status)
                selectedOffice.value = updated;
                
                // Always load winners if on that tab
                if (activeTab.value === 'winners') {
                     loadWinners(updated.id);
                }
            }
        }

    } catch (e) {
        console.error("Initialization error", e);
    }
};

const selectOffice = (office) => {
    selectedOffice.value = office;
    currentPage.value = 1;
    registers.value = [];
    winners.value = [];
    
    console.log("Selected Office Status:", office.status);

    // Default tab logic
    if (office.status === 3) {
        activeTab.value = 'winners';
        loadWinners(office.id);
    } else {
        activeTab.value = 'registers';
        loadRegisters(office.id, 1);
    }
};

const loadRegisters = async (officeId, page) => {
    loadingRegisters.value = true;
    try {
        const res = await api.getRegisters(officeId, page, pageSize.value);
        const data = res.data?.object || [];
        registers.value = Array.isArray(data) ? data : (data.items || data.list || []); 
    } catch (e) {
        console.error('Error loading registers', e);
    } finally {
        loadingRegisters.value = false;
    }
};

const changePage = (newPage) => {
    if (newPage < 1) return;
    currentPage.value = newPage;
    loadRegisters(selectedOffice.value.id, newPage);
};

const winnersMessage = ref('');

const loadWinners = async (officeId) => {
    console.log("Fetching Winners for:", officeId);
    loadingWinners.value = true;
    winnersMessage.value = ''; // Reset message
    try {
        const res = await api.getOfficeWinners(officeId);
        if (!res.data?.object) {
            winners.value = [];
            winnersMessage.value = res.data?.msg || 'لم يتم العثور على بيانات';
        } else {
            winners.value = Array.isArray(res.data?.object) ? res.data.object : (res.data?.object?.list || []);
        }
    } catch (e) {
        console.error("Error loading winners", e);
        winnersMessage.value = 'حدث خطأ أثناء تحميل البيانات';
    } finally {
        loadingWinners.value = false;
    }
};

const handleStartQurea = async () => {
    if (!selectedOffice.value) return;
    
    const status = selectedOffice.value.status;
    
    // First check if winners exist - if yes, route to results page
    try {
        const res = await api.getOfficeWinners(selectedOffice.value.id);
        if (res.data?.object !== null && res.data?.object !== undefined) {
            router.push(`/qurea/${selectedOffice.value.id}`);
            return;
        }
    } catch (e) {
        console.error('Error checking winners:', e);
    }
    
    // Check status before starting
    if (status === 2) { // InProgress
        router.push(`/qurea/${selectedOffice.value.id}`);
        return;
    }
    
    if (status === 3) { // Completed
        // Navigate to results page
        router.push(`/qurea/${selectedOffice.value.id}`);
        return;
    }
    
    if (status === 4) { // Cancelled
        showAlert('لا يمكن بدء القرعة لأنها ملغاة', 'error', 'خطأ');
        return;
    }
    
    // Only allow starting if status is None (0) or Waiting (1)
    if (status !== 0 && status !== 1) {
        showAlert('حالة المكتب غير صالحة لبدء القرعة', 'warning', 'تحذير');
        return;
    }
    
    processing.value = true;
    try {
        await api.startQurea(selectedOffice.value.id);
        
        // Refresh office data to get updated status
        await loadOfficesAndStation();
        
        // Check if qurea is in progress or completed
        const updatedOffice = offices.value.find(o => o.id === selectedOffice.value.id);
        if (updatedOffice) {
            selectedOffice.value = updatedOffice;
            
            if (updatedOffice.status === 2) { // InProgress
                // Navigate to qurea page to watch the process
                router.push(`/qurea/${selectedOffice.value.id}`);
            } else if (updatedOffice.status === 3) { // Completed
                // Navigate to results
                router.push(`/qurea/${selectedOffice.value.id}`);
            }
        }
        
        processing.value = false;
    } catch (e) {
        console.error(e);
        processing.value = false;
        alert('حدث خطأ أثناء بدء القرعة');
    }
};

const handleLogout = () => {
    logout();
};  

        // Watchers
watch(activeTab, (newTab) => {
    if (selectedOffice.value) {
        if (newTab === 'registers' && registers.value.length === 0) {
            loadRegisters(selectedOffice.value.id, currentPage.value);
        } else if (newTab === 'winners') {
            loadWinners(selectedOffice.value.id);
        }
    }
});

onMounted(() => {
    initData();
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #e5e7eb;
    border-radius: 20px;
}
</style>
