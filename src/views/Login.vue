<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 transform transition-all hover:scale-[1.01]">
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
import { login } from '../services/auth';

const router = useRouter();
const username = ref('qurea01');
const password = ref('udqrrpmyD2q8');
const error = ref('');
const loading = ref(false);

const handleLogin = async () => {
  loading.value = true;
  error.value = '';
  try {
    await login(username.value, password.value);
    router.push('/');
  } catch (e) {
    error.value = 'فشل تسجيل الدخول. يرجى التحقق من البيانات';
    console.error(e);
  } finally {
    loading.value = false;
  }
};
</script>
