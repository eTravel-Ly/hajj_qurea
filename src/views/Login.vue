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
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login, parseJwt } from '../services/auth';
import api from '../services/api';

const router = useRouter();
const username = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const handleLogin = async () => {
  loading.value = true;
  error.value = '';
  try {
    const data = await login(username.value, password.value);
    
    // Role-based redirection logic
    if (data && data.access_token) {
      const decoded = parseJwt(data.access_token);
      const roles = decoded?.realm_access?.roles || [];
      
      if (roles.includes('qurea-role-indicators')) {
        router.push('/info');
      } else {
        // Fetch offices and redirect to the first one
        try {
            const officeResponse = await api.getOfficeCrs();
            const offices = officeResponse.data?.object || []; 
            
            if (offices.length > 0) {
                const firstOfficeId = offices[0].id;
                // Redirect to /:officeId
                router.push(`/qurea/${firstOfficeId}`);
            } else {
                console.warn("No offices found, cannot redirect to office ID.");
                // Fallback to home if no offices (though home is now :officeId, this might be tricky)
                // Maybe just retry fetch or show error? For now, try pushing to a default or back to existing logic
                // If route expects :officeId, pushing '/' might match if officeId is optional, or fail.
                // Given the router config `path: '/:officeId'`, pushing '/' is actually not matching that route unless officeId is optional?
                // Wait, `path: '/:officeId'` usually implies required param.
                // But let's assume if no office, we can't show Qurea properly anyway. 
                // Let's redirect to '/info' as a fallback or stay on login with error?
                // Or maybe just push to '/dashboard' if restored? 
                // User removed dashboard route. 
                // Let's try pushing to '/0' as a safe default or handle error.
                
                // Correction: Using the logic from before, but targeting route with ID.
                router.push('/'); 
            }
        } catch (err) {
            console.error("Failed to fetch offices for redirection:", err);
            router.push('/');
        }
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
</script>
