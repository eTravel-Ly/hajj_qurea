<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 relative" style="background-image: url('/3_Banner_8b649a21ad.png'); background-size: cover; background-position: center; background-repeat: no-repeat;">
    <div class="absolute inset-0 bg-black/30"></div>
    <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 transform transition-all hover:scale-[1.01] relative z-10">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-gray-800">حجاج</h2>
        <p class="text-gray-500 mt-2">تسجيل الدخول للمنصة</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1" for="username">اسم المستخدم</label>
          <input
            id="username"
            v-model="username"
            type="text"
            required
            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
            placeholder="أدخل اسم المستخدم"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1" for="password">كلمة المرور</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
            placeholder="********"
          />
        </div>

        <div v-if="error" class="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">
          {{ error }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
        >
          <span v-if="loading">جاري التحميل...</span>
          <span v-else>دخول</span>
        </button>
      </form>
    </div>

    <!-- Coordination and Office Selector Modal -->
    <CoordinationOfficeSelector
      :isVisible="showSelector"
      :coordinations="coordinations"
      :offices="offices"
      :allowCancel="true"
      :exportingId="exportingCoordinationId"
      @confirm="handleSelectionConfirm"
      @cancel="showSelector = false"
      @export-all="handleExportAllCoordinationPDFs"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login, parseJwt } from '../services/auth';
import api from '../services/api';
import { COUNTDOWN_TARGET_DATE } from '../constants';
import CoordinationOfficeSelector from '../components/CoordinationOfficeSelector.vue';
import pdfService from '../services/pdfService';

const router = useRouter();
const username = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);
const showSelector = ref(false);
const coordinations = ref([]);
const offices = ref([]);
const exportingCoordinationId = ref(null); // Track exporting state
const qureaStarted = ref(false); // Persistent status for selection logic

const handleLogin = async () => {
  loading.value = true;
  error.value = '';
  try {
    const data = await login(username.value, password.value);
    
    // Role-based redirection logic
    if (data && data.access_token) {
      const decoded = parseJwt(data.access_token);
      const roles = decoded?.realm_access?.roles || [];
      
      const hasIndicatorRole = roles.includes('qurea-role-indicators');
      
      // Check Qurea status based on user role
      let qureaStartedResult = false;
      try {
        let statusResponse;
        if (hasIndicatorRole) {
          // Indicators use their own status endpoint
          statusResponse = await api.getQureaStatusindicators();
        } else {
          // Regular users use the standard status endpoint
          statusResponse = await api.getQureaStatus();
        }
        qureaStartedResult = statusResponse.data?.object?.isStart === true;
      } catch (err) {
        console.error('Failed to check Qurea status:', err);
        // If status check fails, assume not started and route to countdown
        qureaStartedResult = false;
      }
      
      // Role-based redirection logic
      if (hasIndicatorRole) {
        try {
          // Check if already activated on the backend
          const keyResponse = await api.getkey();
          const keys = Array.isArray(keyResponse.data) ? keyResponse.data : (keyResponse.data?.object || []);
          const hasActiveKey = keys.some(k => k.isCurrent === true || k.IsCurrent === true);

          if (hasActiveKey) {
            router.push('/info');
          } else {
            router.push('/role-indicator');
          }
        } catch (err) {
          console.error('Failed to check key status at login:', err);
          // Fallback to role-indicator page
          router.push('/role-indicator');
        }
        return;
      }
      
      // Regular users: Fetch coordinations and offices, then show selector
      // This is mandatory regardless of whether Qurea has started
      try {
        const [coordinationsResponse, officesResponse] = await Promise.all([
          api.getCoordinations(),
          api.getOfficeCrs()
        ]);
        
        coordinations.value = coordinationsResponse.data?.object || [];
        offices.value = officesResponse.data?.object || [];
        
        if (offices.value.length === 0) {
          error.value = 'لا توجد مكاتب متاحة';
          return;
        }
        
        // Store the status for use in handleSelectionConfirm
        qureaStarted.value = qureaStartedResult;
        
        // Show the selector modal
        showSelector.value = true;
      } catch (err) {
        console.error("Failed to fetch coordinations/offices:", err);
        error.value = 'فشل في تحميل البيانات';
      }
    } else {
      router.push('/');
    }
  } catch (e) {
    error.value = 'فشل تسجيل الدخول. يرجى التحقق من البيانات';
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const handleSelectionConfirm = ({ coordinationId }) => {
  // Store the selected coordination in localStorage for later use
  localStorage.setItem('selectedCoordinationId', coordinationId);
  
  // Find the first unfinished office for this coordination
  const coordinationOffices = offices.value
    .filter(office => office.coordinationId === coordinationId)
    .sort((a, b) => a.name.localeCompare(b.name, 'ar'));
  
  if (coordinationOffices.length > 0) {
    // Find first office that is not completed (status != 3)
    const firstUnfinishedOffice = coordinationOffices.find(o => o.status !== 3);
    
    // If all offices are completed, go to the first one
    const targetOffice = firstUnfinishedOffice || coordinationOffices[0];
    
    // Navigate based on qureaStarted status
    if (qureaStarted.value) {
      router.push(`/qurea/${targetOffice.id}`);
    } else {
      router.push({ path: '/countdown', query: { officeId: targetOffice.id } });
    }
  } else {
    error.value = 'لا توجد مكاتب متاحة لهذه التنسيقية';
    showSelector.value = false;
  }
};

// Handle export of all completed offices for a coordination
const handleExportAllCoordinationPDFs = async (coordinationId) => {
  if (!coordinationId) return;
  
  exportingCoordinationId.value = coordinationId;
  
  try {
    // Get all offices for this coordination
    const coordinationOffices = offices.value
      .filter(o => o.coordinationId === coordinationId)
      .sort((a, b) => a.id - b.id);
      
    if (coordinationOffices.length === 0) {
      error.value = 'لا توجد مكاتب لهذه التنسيقية';
      return;
    }

    // Get coordination info
    const coordination = coordinations.value.find(c => c.id === coordinationId);
    let exportedCount = 0;

    // List to hold all winner results for combined PDF
    const allResults = [];

    // Process each office
    for (const office of coordinationOffices) {
      try {
        // Fetch fresh winner data for ALL offices (regardless of status)
        const res = await api.getOfficeWinners(office.id);
        const winners = res.data?.object || [];
        
        // Only collect if we actually have winners
        if (Array.isArray(winners) && winners.length > 0) {
          allResults.push({
            office: office,
            winners: winners
          });
          exportedCount++;
        }
      } catch (e) {
        console.error(`Error fetching office ${office.name}:`, e);
      }
    }

    // Generate combined PDF if any results found
    if (allResults.length > 0) {
      await pdfService.generateCombinedLotteryResultsPDF(coordination, allResults);
    }
    
    if (exportedCount === 0) {
      error.value = 'لا توجد مكاتب مكتملة لتصديرها';
    }
    
  } catch (err) {
    console.error('Error in bulk export:', err);
    error.value = 'حدث خطأ أثناء التصدير';
  } finally {
    exportingCoordinationId.value = null;
    // Clear error after 3 seconds if it was an export error
    if (error.value && (error.value.includes('تصدير') || error.value.includes('مكاتب'))) {
      setTimeout(() => { error.value = ''; }, 3000);
    }
  }
};
</script>
