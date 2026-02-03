<template>
    <div class="min-h-screen flex flex-col bg-[#FEFAF7] font-sans" dir="rtl">
      <!-- Top Navigation -->
      <header class="bg-white shadow-sm z-20 flex-shrink-0 h-14 sm:h-16 lg:h-20 xl:h-24 3xl:h-28 flex justify-between items-center px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 3xl:px-16">
        <div class="flex items-center gap-2 sm:gap-3 3xl:gap-4">
          <div>
             <h1 class="font-bold text-primary text-base sm:text-lg lg:text-xl xl:text-2xl 3xl:text-3xl leading-tight">منصة حجاج</h1>
             <p class="text-[9px] sm:text-[10px] lg:text-[11px] xl:text-[12px] 3xl:text-[14px] text-gray-500">لخدمات الحج والعمرة</p>
          </div>
        </div>
        
        <!-- Global Stats  -->
        <div class="hidden md:flex items-center gap-3 lg:gap-4 xl:gap-6 3xl:gap-8 bg-gray-50 px-3 lg:px-4 xl:px-6 3xl:px-8 py-1.5 lg:py-2 xl:py-3 3xl:py-4 rounded-lg border border-gray-100">
            <div class="flex items-center gap-1.5 lg:gap-2 3xl:gap-3">
               <span class="w-1.5 h-1.5 lg:w-2 lg:h-2 xl:w-2.5 xl:h-2.5 3xl:w-3 3xl:h-3 rounded-full bg-primary animate-pulse"></span>
               <span class="text-[10px] lg:text-xs xl:text-sm 3xl:text-base text-gray-400">إجمالي الحجاج</span>
               <span class="font-bold text-gray-700 font-mono text-sm lg:text-base xl:text-lg 3xl:text-xl">{{ indicators.totalPilgrims.toLocaleString() }}</span>
            </div>
            <div class="w-px h-3 lg:h-4 xl:h-5 3xl:h-6 bg-gray-300"></div>
            <!-- Auto Refresh Controls -->
            <div class="hidden lg:flex items-center gap-2 xl:gap-3 3xl:gap-4 bg-white px-2 xl:px-3 3xl:px-4 py-1 xl:py-1.5 3xl:py-2 rounded-md border border-gray-200">
                <span class="text-[10px] xl:text-[11px] 3xl:text-[13px] text-gray-500 font-medium">تحديث تلقائي:</span>
                <input 
                    type="number" 
                    v-model.number="autoRefreshInterval" 
                    min="5" 
                    class="w-10 xl:w-12 3xl:w-14 text-center text-[10px] xl:text-xs 3xl:text-sm border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-primary"
                />
                <span class="text-[10px] xl:text-[11px] 3xl:text-[13px] text-gray-500">ثانية</span>
                <button 
                    @click="toggleAutoRefresh" 
                    class="px-2 xl:px-3 3xl:px-4 py-0.5 xl:py-1 3xl:py-1.5 text-[10px] xl:text-xs 3xl:text-sm rounded-md transition-all duration-200 flex items-center gap-1 font-medium"
                    :class="isAutoRefreshActive ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-[#03AA77]/10 text-[#03AA77] hover:bg-[#03AA77]/20'"
                >
                    <span v-if="isAutoRefreshActive" class="w-1.5 h-1.5 3xl:w-2 3xl:h-2 rounded-full bg-red-500 animate-pulse"></span>
                    {{ isAutoRefreshActive ? 'إيقاف' : 'تشغيل' }}
                </button>
            </div>
            <div class="hidden lg:block w-px h-3 lg:h-4 xl:h-5 3xl:h-6 bg-gray-300"></div>
            <div class="text-[10px] lg:text-xs xl:text-sm 3xl:text-base text-secondary font-bold">الإحصائيات</div>
        </div>
        
        <div class="flex items-center gap-2">
          <!-- Key Preview Button -->
          <div v-if="hasIndicatorRole" class="relative">
            <button 
              @mouseenter="fetchCurrentKey"
              @mouseleave="showKeyPopover = false"
              class="p-1.5 sm:p-2 lg:p-3 3xl:p-4 hover:bg-yellow-50 text-gray-400 hover:text-yellow-600 rounded-lg transition-colors border border-transparent hover:border-yellow-200"
              title="مفتاح التقريع الحالي"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 xl:h-7 xl:w-7 3xl:h-8 3xl:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </button>
            
            <!-- Key Popover -->
            <transition name="fade">
              <div 
                v-if="showKeyPopover" 
                class="absolute left-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 p-4 z-[100] transform origin-top-left"
              >
                <div class="flex flex-col gap-2">
                  <div class="flex items-center justify-between">
                    <span class="text-xs text-gray-400 font-medium text-right w-full">مفتاح التقريع الحالي</span>
                    <div v-if="isFetchingKey" class="w-3 h-3 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                  </div>
                  <div v-if="currentKey" class="bg-gray-50 p-3 rounded-lg border border-gray-100 break-all text-center">
                    <code class="text-sm font-bold text-primary">{{ currentKey.code }}</code>
                  </div>
                  <div v-else-if="!isFetchingKey" class="text-xs text-red-500 text-center py-2">
                    لم يتم العثور على مفتاح فعال
                  </div>
                </div>
              </div>
            </transition>
          </div>

          <button @click="handleLogout" class="p-1.5 sm:p-2 lg:p-3 3xl:p-4 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors" title="تسجيل الخروج">
            <img src="/logout-02.png" alt="Logout" class="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 xl:h-7 xl:w-7 3xl:h-8 3xl:w-8" />
          </button>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-grow flex overflow-hidden main-content">
        <!-- Right Sidebar-->

        <!-- Main Content Area -->
        <div class="flex-1 flex flex-col overflow-y-auto relative bg-[#FEFAF7]">

        <div class="flex-1 flex flex-col items-center py-4 sm:py-6 lg:py-8 3xl:py-10">
            <div v-if="isLoading" class="absolute inset-0 bg-[#FEFAF7]/80 z-30 flex items-center justify-center">
              <div class="flex flex-col items-center gap-4">
                <div class="w-12 h-12 3xl:w-16 3xl:h-16 border-4 3xl:border-6 border-[#01564733] border-t-[#015647] rounded-full animate-spin"></div>
                <span class="text-sm 3xl:text-base font-medium text-[#2B3032]">جاري تحميل البيانات...</span>
              </div>
            </div>

            <transition name="fade">
              <div v-if="showErrorNotify" class="fixed top-16 sm:top-20 3xl:top-28 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white px-4 sm:px-6 3xl:px-8 py-2 sm:py-3 3xl:py-4 rounded-full shadow-2xl flex items-center gap-2 sm:gap-3 3xl:gap-4 text-xs sm:text-sm 3xl:text-base">
                 <svg class="w-4 h-4 sm:w-5 sm:h-5 3xl:w-6 3xl:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 <span class="font-bold">فشل الاتصال بالخادم. يتم عرض بيانات تجريبية.</span>
                 <button @click="showErrorNotify = false" class="hover:opacity-70">
                    <svg class="w-3 h-3 sm:w-4 sm:h-4 3xl:w-5 3xl:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                 </button>
              </div>
            </transition>

            <div v-if="!isLoading" class="w-full max-w-[95%] sm:max-w-[90%] md:max-w-[95%] lg:max-w-[1200px] xl:max-w-[1400px] 2xl:max-w-[1600px] 3xl:max-w-[2000px] flex flex-col gap-3 sm:gap-4 lg:gap-5 xl:gap-6 3xl:gap-8 px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 3xl:px-10">
              <!-- View Mode Toggle -->
              <div class="flex justify-between items-center h-auto sm:h-[28px] 3xl:h-[32px]">
                 <h2 class="text-xs sm:text-sm lg:text-base xl:text-lg 3xl:text-xl font-semibold text-[#2B3032]">ملخص</h2>
                 <div class="flex gap-1.5 sm:gap-2 3xl:gap-3">
                    <button 
                       v-if="hasIndicatorRole"
                       @click="goToCountdown" 
                       class="flex items-center gap-2 px-2 sm:px-3 3xl:px-4 py-1 3xl:py-1.5 rounded-lg text-[10px] sm:text-xs lg:text-sm 3xl:text-base border border-[#03AA77] text-[#03AA77] hover:bg-[#03AA77]/10 transition-all font-bold"
                    >
                       <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                       </svg>
                       <span>بدء القرعة</span>
                    </button>
                    <button 
                       @click="viewMode = 'all'" 
                       class="flex items-center gap-1 px-2 sm:px-3 3xl:px-4 py-1 3xl:py-1.5 rounded-lg text-[10px] sm:text-xs lg:text-sm 3xl:text-base transition-all"
                       :class="viewMode === 'all' ? 'bg-[#015647] text-white' : 'bg-[#23282D0D] text-[#2B3032] hover:bg-[#23282D1A]'"
                    >
                       <span>الكل</span>
                    </button>
                    <button 
                       @click="switchToStationView" 
                       class="flex items-center gap-1 px-2 sm:px-3 3xl:px-4 py-1 3xl:py-1.5 rounded-lg text-[10px] sm:text-xs lg:text-sm 3xl:text-base transition-all"
                       :class="viewMode === 'station' ? 'bg-[#015647] text-white' : 'bg-[#23282D0D] text-[#2B3032] hover:bg-[#23282D1A]'"
                    >
                       <span>مراكز التقريع</span>
                    </button>
                 </div>
              </div>

              <!-- All View -->
              <div v-if="viewMode === 'all'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 3xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5 xl:gap-6 2xl:gap-7 3xl:gap-8">
                <div class="bg-white rounded-xl sm:rounded-2xl 3xl:rounded-3xl p-3 sm:p-4 lg:p-5 xl:p-6 2xl:p-7 3xl:p-9 flex flex-col justify-between items-end transition-all hover:shadow-md border border-transparent hover:border-gray-100 min-h-[80px] sm:min-h-[100px] lg:min-h-[120px] xl:min-h-[140px] 2xl:min-h-[160px] 3xl:min-h-[200px]">
                  <span class="text-[11px] sm:text-[12px] lg:text-[14px] xl:text-[16px] 2xl:text-[18px] 3xl:text-[20px] font-medium text-[#2B3032]">مكاتب لم تبدأ بعد</span>
                  <div class="text-[20px] sm:text-[24px] lg:text-[28px] xl:text-[36px] 2xl:text-[44px] 3xl:text-[52px] font-semibold text-[#2B3032]">{{ indicators.officesNotStartedCount }}</div>
                </div>
                <div class="bg-white rounded-xl sm:rounded-2xl 3xl:rounded-3xl p-3 sm:p-4 lg:p-5 xl:p-6 2xl:p-7 3xl:p-9 flex flex-col justify-between items-end transition-all hover:shadow-md border border-transparent hover:border-gray-100 min-h-[80px] sm:min-h-[100px] lg:min-h-[120px] xl:min-h-[140px] 2xl:min-h-[160px] 3xl:min-h-[200px]">
                  <span class="text-[11px] sm:text-[12px] lg:text-[14px] xl:text-[16px] 2xl:text-[18px] 3xl:text-[20px] font-medium text-[#2B3032]">مكاتب انتهت من القرعة</span>
                  <div class="text-[20px] sm:text-[24px] lg:text-[28px] xl:text-[36px] 2xl:text-[44px] 3xl:text-[52px] font-semibold text-[#2B3032]">{{ indicators.officesFinishedCount }}</div>
                </div>
                <div class="bg-white rounded-xl sm:rounded-2xl 3xl:rounded-3xl p-3 sm:p-4 lg:p-5 xl:p-6 2xl:p-7 3xl:p-9 flex flex-col justify-between items-end transition-all hover:shadow-md border border-transparent hover:border-gray-100 min-h-[80px] sm:min-h-[100px] lg:min-h-[120px] xl:min-h-[140px] 2xl:min-h-[160px] 3xl:min-h-[200px]">
                  <span class="text-[11px] sm:text-[12px] lg:text-[14px] xl:text-[16px] 2xl:text-[18px] 3xl:text-[20px] font-medium text-[#2B3032]">الفائزين بالقرعة</span>
                  <div class="flex items-end justify-between w-full gap-2 sm:gap-3 lg:gap-4 3xl:gap-5">
                    <!-- Right side: Breakdown -->
                    <div class="flex flex-col gap-0.5 sm:gap-1 3xl:gap-1.5 items-end">
                      <div class="flex items-baseline gap-1 sm:gap-2 3xl:gap-3">
                        <div class="text-[12px] sm:text-[14px] lg:text-[16px] xl:text-[20px] 2xl:text-[24px] 3xl:text-[28px] font-semibold text-[#2B3032]">{{ indicators.totalWinnersHajjaj || 0 }}</div>
                        <span class="text-[9px] sm:text-[10px] lg:text-[11px] xl:text-[12px] 2xl:text-[13px] 3xl:text-[15px] text-gray-500">حجاج</span>
                      </div>
                      <div class="flex items-baseline gap-1 sm:gap-2 3xl:gap-3">
                        <div class="text-[12px] sm:text-[14px] lg:text-[16px] xl:text-[20px] 2xl:text-[24px] 3xl:text-[28px] font-semibold text-[#015647]">{{ indicators.totalWinnersCompanions || 0 }}</div>
                        <span class="text-[9px] sm:text-[10px] lg:text-[11px] xl:text-[12px] 2xl:text-[13px] 3xl:text-[15px] text-gray-500">مرافقين</span>
                      </div>
                    </div>
                    <!-- Left side: Total -->
                    <div class="text-[20px] sm:text-[24px] lg:text-[28px] xl:text-[36px] 2xl:text-[44px] 3xl:text-[52px] font-semibold text-[#2B3032]">{{ indicators.totalWinnersCount }}</div>
                  </div>
                </div>
                <div class="bg-white rounded-xl sm:rounded-2xl 3xl:rounded-3xl p-3 sm:p-4 lg:p-5 xl:p-6 2xl:p-7 3xl:p-9 flex flex-col justify-between items-end transition-all hover:shadow-md border border-transparent hover:border-gray-100 min-h-[80px] sm:min-h-[100px] lg:min-h-[120px] xl:min-h-[140px] 2xl:min-h-[160px] 3xl:min-h-[200px]">
                  <span class="text-[11px] sm:text-[12px] lg:text-[14px] xl:text-[16px] 2xl:text-[18px] 3xl:text-[20px] font-medium text-[#2B3032]">المسجلين في المنظومة</span>
                  <div class="text-[20px] sm:text-[24px] lg:text-[28px] xl:text-[36px] 2xl:text-[44px] 3xl:text-[52px] font-semibold text-[#2B3032]">{{ indicators.registeredUsersCount }}</div>
                </div>
              </div>

              <!-- Office Distribution Chart  -->
              <div v-if="viewMode === 'all'" class="flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-5 xl:gap-6">
                 <div class="flex-1 bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 xl:p-6 flex flex-col gap-2 sm:gap-3 lg:gap-4 transition-all hover:shadow-md border border-transparent hover:border-gray-100">
                    <div class="flex justify-between items-center shrink-0">
                      <h3 class="text-xs sm:text-sm lg:text-base xl:text-lg font-semibold text-[#2B3032] flex-grow text-right">التوزيع حسب المكتب</h3>
                    </div>

                    <div class="flex flex-col sm:flex-row flex-1 items-center justify-center gap-4 sm:gap-6 lg:gap-8 xl:gap-10">
                      <div class="w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] lg:w-[160px] lg:h-[160px] xl:w-[180px] xl:h-[180px] shrink-0">
                         <apexchart type="donut" :width="chartSize" :height="chartSize" :options="paginatedChartOptions" :series="paginatedSeries"></apexchart>
                      </div>

                      <div class="flex-1 flex flex-col w-full sm:max-w-[300px] lg:max-w-[350px] xl:max-w-[400px] self-stretch py-1 sm:py-2">
                        <div class="flex-1 flex flex-col gap-1.5 sm:gap-2 lg:gap-3">
                          <div v-for="(item, idx) in paginatedLegend" :key="item.index" 
                               class="flex items-center justify-between h-auto sm:h-[22px] lg:h-[26px] xl:h-[30px]">
                            <div class="flex items-center gap-1.5 sm:gap-2">
                              <span class="text-[10px] sm:text-[11px] lg:text-[12px] xl:text-[13px] text-[#2B3032]">{{ item.label }}</span>
                              <span class="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 rounded-full flex items-center justify-center shrink-0" :style="{ backgroundColor: donutOptions.colors[idx] || '#eee' }"></span>
                            </div>
                            <span class="text-[10px] sm:text-[11px] lg:text-[12px] xl:text-[13px] text-[#2B3032] font-['Inter'] min-w-[30px] sm:min-w-[35px] lg:min-w-[40px] text-left">{{ item.percentage }}%</span>
                          </div>
                        </div>
                        
                        <div v-if="totalPages > 1" class="flex items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-3 lg:pt-4 mt-auto border-t border-gray-50">
                           <button @click="legendPage--" :disabled="legendPage <= 1" class="p-1.5 sm:p-2 hover:bg-gray-100 rounded-md disabled:opacity-20 transition-colors text-[#2B3032] touch-manipulation">
                              <svg class="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                           </button>
                           <span class="text-[10px] sm:text-[11px] lg:text-[12px] text-gray-400 font-mono tracking-tighter">{{ legendPage }} / {{ totalPages }}</span>
                           <button @click="legendPage++" :disabled="legendPage >= totalPages" class="p-1.5 sm:p-2 hover:bg-gray-100 rounded-md disabled:opacity-20 transition-colors text-[#2B3032] touch-manipulation">
                              <svg class="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                           </button>
                        </div>
                      </div>
                    </div>
                 </div>

                 <div class="w-full lg:w-[240px] xl:w-[280px] 2xl:w-[320px] bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 xl:p-6 flex flex-col gap-2 sm:gap-3 lg:gap-4 transition-all hover:shadow-md border border-transparent hover:border-gray-100">
                    <h3 class="text-xs sm:text-sm lg:text-base xl:text-lg font-semibold text-[#2B3032] text-right">إحصائيات</h3>
                    <div class="flex flex-col gap-2 sm:gap-3 lg:gap-4 w-full">
                      <div class="flex justify-between w-full text-[10px] sm:text-[11px] lg:text-[12px] xl:text-[13px]">
                        <span class="font-medium text-[#2B3032]">{{ indicators.totalPilgrims.toLocaleString() }}</span>
                        <span class="text-[#2B3032] opacity-60">عدد الحجاج</span>
                      </div>
                      <div class="flex justify-between w-full text-[10px] sm:text-[11px] lg:text-[12px] xl:text-[13px]">
                        <span class="font-medium text-[#2B3032]">{{ indicators.maleCount.toLocaleString() }}</span>
                        <span class="text-[#2B3032] opacity-60">ذكور</span>
                      </div>
                      <div class="flex justify-between w-full text-[10px] sm:text-[11px] lg:text-[12px] xl:text-[13px]">
                        <span class="font-medium text-[#2B3032]">{{ indicators.femaleCount.toLocaleString() }}</span>
                        <span class="text-[#2B3032] opacity-60">إناث</span>
                      </div>
                      <div class="flex justify-between w-full text-[10px] sm:text-[11px] lg:text-[12px] xl:text-[13px]">
                        <span class="font-medium text-[#2B3032]">{{ indicators.numberOfHajjajOver65YearsOfAge.toLocaleString() }}</span>
                        <span class="text-[#2B3032] opacity-60"> الأعمار اكبر من 60</span>
                      </div>
                      <div class="flex justify-between w-full text-[10px] sm:text-[11px] lg:text-[12px] xl:text-[13px]">
                        <span class="font-medium text-[#2B3032]">{{ indicators.totalCompletionRateForAllCenters }}</span>
                        <span class="text-[#2B3032] opacity-60">نسبة الانجاز</span>
                      </div>
                      <div class="flex justify-between w-full text-[10px] sm:text-[11px] lg:text-[12px] xl:text-[13px]">
                        <span class="font-medium text-[#2B3032]">{{ indicators.totalWinnersCount.toLocaleString() }}</span>
                        <span class="text-[#2B3032] opacity-60">الفائزين</span>
                      </div>
                    </div>
                 </div>
              </div>

              <!-- Bar Chart -->
              <div v-if="viewMode === 'all'" class="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 xl:p-6 flex flex-col gap-2 sm:gap-3 lg:gap-4 transition-all hover:shadow-md border border-transparent hover:border-gray-100 min-h-[200px] sm:min-h-[240px] lg:min-h-[280px] xl:min-h-[320px]">
                  <div class="flex justify-between items-center">
                    <div v-if="totalBarPages > 1" class="flex items-center gap-2 sm:gap-3 lg:gap-4">
                       <button @click="barPage--" :disabled="barPage <= 1" class="p-1.5 sm:p-2 hover:bg-gray-100 rounded-md disabled:opacity-20 transition-colors text-[#2B3032] touch-manipulation">
                          <svg class="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                       </button>
                       <span class="text-[10px] sm:text-[11px] lg:text-[12px] text-gray-400 font-mono tracking-tighter">{{ barPage }} / {{ totalBarPages }}</span>
                       <button @click="barPage++" :disabled="barPage >= totalBarPages" class="p-1.5 sm:p-2 hover:bg-gray-100 rounded-md disabled:opacity-20 transition-colors text-[#2B3032] touch-manipulation">
                          <svg class="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                       </button>
                    </div>
                    <h3 class="text-xs sm:text-sm lg:text-base xl:text-lg font-semibold text-[#2B3032] text-right">عدد الفائزين في كل مكتب</h3>
                  </div>
                  <div class="flex-1 overflow-hidden">
                    <apexchart :key="barPage" type="bar" height="100%" width="100%" :options="paginatedBarOptions" :series="paginatedBarSeries"></apexchart>
                  </div>
              </div>

              <!-- Station View - 8 Cards with Donut Charts -->
              <div v-if="viewMode === 'station'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5 xl:gap-8 2xl:gap-8 3xl:gap-10">
                <div 
                  v-for="(percentage, station) in stationData" 
                  :key="station"
                  class="bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl 3xl:rounded-[2rem] p-4 sm:p-5 md:p-6 lg:p-7 xl:p-8 2xl:p-10 3xl:p-12 flex flex-col gap-3 sm:gap-4 lg:gap-5 xl:gap-6 3xl:gap-7 items-center justify-start transition-all hover:shadow-lg border border-transparent hover:border-[#015647]/20 group h-full"
                >
                  <!-- Station Name (Top) -->
                  <h3 class="text-base sm:text-lg md:text-xl lg:text-2xl 3xl:text-3xl text-[#2B3032] font-bold text-center leading-tight w-full">{{ station }}</h3>

                  <!-- Donut Chart -->
                  <div class="flex-grow flex items-center justify-start w-full px-4 3xl:px [40px] laptop-chart-padding">
                      <div class="w-[140px] h-[140px] sm:w-[160px] sm:h-[160px] md:w-[180px] md:h-[180px] lg:w-[200px] lg:h-[200px] xl:w-[240px] xl:h-[240px] 2xl:w-[240px] 2xl:h-[240px] 3xl:w-[280px] 3xl:h-[280px] shrink-0">
                        <apexchart 
                          type="donut" 
                          :width="stationChartSize" 
                          :height="stationChartSize" 
                          :options="getStationChartOptions(percentage)" 
                          :series="[percentage, 100 - percentage]"
                        ></apexchart>
                      </div>
                  </div>
                  
                  <!-- Percentage (Bottom) -->
                  <!-- <p class="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] xl:text-[26px] 2xl:text-[28px] 3xl:text-[32px] font-bold" :class="percentage === 100 ? 'text-[#03AA77]' : 'text-[#015647]'">{{ percentage }}%</p> -->
                </div>
              </div>

            </div>
        </div>
        </div>
      </main>
    </div>
</template>

<script>
import VueApexCharts from "vue3-apexcharts";
import api from "../services/api";
import { logout, parseJwt } from "../services/auth";

export default {    
    name: 'info',
    components: {
        apexchart: VueApexCharts,
    },
    data() {
        return {
            viewMode: 'all', // 'all' or 'station'
            stationData: {},
            sidebarVisible: true,
            isLoading: true,
            error: null,
            showErrorNotify: false,
            isExporting: false,
            // Key Preview Data
            showKeyPopover: false,
            currentKey: null,
            isFetchingKey: false,
            // Indicators data
            indicators: {
              officesNotStartedCount: 0,
              officesFinishedCount: 0,
              totalWinnersCount: 0,
              totalWinnersHajjaj: 0,
              totalWinnersCompanions: 0,
              registeredUsersCount: 0,
              maleCount: 0,
              femaleCount: 0,
              totalPilgrims: 0,
              numberOfHajjajOver65YearsOfAge: 0,
              totalCompletionRateForAllCenters: 0
            },
            // Auto Refresh Data
            autoRefreshInterval: 5,
            isAutoRefreshActive: true,
            refreshTimer: null,
            legendPage: 1,
            donutSeries: [],
            donutOptions: {
              chart: {
                type: 'donut',
                sparkline: {
                  enabled: true
                }
              },
              labels: [],
              colors: ['#2B3032', '#A1E3CB', '#B1E3FF', '#A8C5DA', '#015647', '#9FD4CA', '#FFCF9F', '#7DD3FC', '#F9A8D4', '#BEF264', '#FCA5A5', '#D8B4FE'],
              stroke: {
                show: false
              },
              plotOptions: {
                pie: {
                  donut: {
                    size: '70%',
                  }
                }
              },
              tooltip: {
                enabled: true,
                y: {
                  formatter: function (val) {
                    return val + "%"
                  }
                }
              },
              dataLabels: {
                enabled: false
              },
              legend: {
                show: false
              }
            },
            // Bar Chart Data
            barPage: 1,
            barSeries: [],
            barOptions: {
              chart: {
                type: 'bar',
                stacked: true,
                toolbar: {
                  show: false
                },
                fontFamily: 'Inter, sans-serif'
              },
              colors: ['#015647', '#01564766'],
              plotOptions: {
                bar: {
                  borderRadius: 4,
                  columnWidth: '35%',
                }
              },
              dataLabels: {
                enabled: false
              },
              xaxis: {
                categories: [],
                axisBorder: {
                  show: false
                },
                axisTicks: {
                  show: false
                },
                labels: {
                  style: {
                    colors: '#9CA3AF',
                    fontSize: '10px'
                  }
                }
              },
              yaxis: {
                show: false
              },
              grid: {
                show: false,
                padding: {
                  left: 0,
                  right: 0
                }
              },
              tooltip: {
                theme: 'dark',
                y: {
                  formatter: function (val) {
                    return val + " فائز"
                  }
                }
              },
              legend: {
                show: true,
                position: 'bottom',
                horizontalAlign: 'center',
                fontSize: '10px',
                labels: {
                  colors: '#2B3032'
                },
                markers: {
                  radius: 12
                }
              }
            }
        }
    },
    computed: {
      hasIndicatorRole() {
        const token = localStorage.getItem('app-token');
        if (!token) return false;
        const decoded = parseJwt(token);
        return decoded?.realm_access?.roles?.includes('qurea-role-indicators') || false;
      },
      chartSize() {
        // Return responsive chart size based on screen width
        if (typeof window !== 'undefined') {
          if (window.innerWidth >= 1920) return 200; // 3xl (TV screens)
          if (window.innerWidth >= 1536) return 180; // 2xl
          if (window.innerWidth >= 1280) return 160; // xl
          if (window.innerWidth >= 1024) return 160; // lg
          if (window.innerWidth >= 768) return 140; // md
          if (window.innerWidth >= 640) return 140; // sm
        }
        return 120; // mobile default
      },
      circleRadius() {
        // Radius for the circular progress indicator
        return 35;
      },
      circleCircumference() {
        // Circumference = 2 * π * radius
        return 2 * Math.PI * this.circleRadius;
      },
      stationChartSize() {
        // Return responsive chart size for station cards
        if (typeof window !== 'undefined') {
          if (window.innerWidth >= 1920) return 280; // 3xl (TV screens)
          if (window.innerWidth >= 1536) return 240; // 2xl
          if (window.innerWidth >= 1280) return 220; // xl
          if (window.innerWidth >= 1024) return 200; // lg
          if (window.innerWidth >= 768) return 180; // md
          if (window.innerWidth >= 640) return 160; // sm
        }
        return 140; // mobile default
      },
      totalPages() {
        return Math.ceil((this.donutOptions.labels?.length || 0) / 5);
      },
      paginatedLegend() {
        if (!this.donutOptions.labels || this.donutOptions.labels.length === 0) return [];
        const total = this.donutSeries.reduce((a, b) => a + b, 0) || 1;
        const start = (this.legendPage - 1) * 5;
        const end = start + 5;
        return this.donutOptions.labels.slice(start, end).map((label, idx) => {
          const val = this.donutSeries[start + idx] || 0;
          return {
            label,
            index: start + idx,
            percentage: ((val / total) * 100).toFixed(1)
          };
        });
      },
      paginatedSeries() {
        const start = (this.legendPage - 1) * 5;
        const series = this.donutSeries.slice(start, start + 5);
        return series;
      },
      paginatedChartOptions() {
        const start = (this.legendPage - 1) * 5;
        const labels = this.donutOptions.labels.slice(start, start + 5);
        // Always use the first 5 colors for consistency across pages
        const colors = this.donutOptions.colors.slice(0, 5);
        return {
          ...this.donutOptions,
          labels,
          colors
        };
      },
      totalBarPages() {
        return Math.ceil((this.barOptions.xaxis?.categories?.length || 0) / 7);
      },
      paginatedBarSeries() {
        const start = (this.barPage - 1) * 7;
        if (!this.barSeries || this.barSeries.length === 0) return [];
        return this.barSeries.map(s => ({
          ...s,
          data: s.data.slice(start, start + 7)
        }));
      },
      paginatedBarOptions() {
        const start = (this.barPage - 1) * 7;
        const categories = this.barOptions.xaxis.categories.slice(start, start + 7);
        return {
          ...this.barOptions,
          xaxis: {
            ...this.barOptions.xaxis,
            categories
          }
        };
      }
    },
    async mounted() {
      await this.fetchIndicators();
      // Start auto-refresh if enabled by default
      if (this.isAutoRefreshActive) {
          this.startAutoRefresh();
      }
    },
    watch: {
        autoRefreshInterval(newVal) {
            // Apply minimum limit
            if (newVal < 5) return; 
            
            // Restart timer if currently active
            if (this.isAutoRefreshActive) {
                this.stopAutoRefresh();
                this.startAutoRefresh();
            }
        }
    },
    methods: {
        async switchToStationView() {
            this.viewMode = 'station';
            if (Object.keys(this.stationData).length === 0) {
                await this.fetchStationData();
            }
        },
        goToCountdown() {
            this.$router.push('/countdown');
        },
        async fetchCurrentKey() {
            this.showKeyPopover = true;
            if (this.currentKey) return;
            
            this.isFetchingKey = true;
            try {
                const response = await api.getkey();
                
                // Be robust: check if keys are in data directly or in data.object
                const keys = Array.isArray(response.data) 
                    ? response.data 
                    : (response.data?.object || []);

                // Find the key where isCurrent (or IsCurrent) is true
                this.currentKey = keys.find(k => k.isCurrent === true || k.IsCurrent === true);
            } catch (err) {
                console.error("Failed to fetch key:", err);
            } finally {
                this.isFetchingKey = false;
            }
        },
        async fetchStationData() {
            try {
                const response = await api.getIndicatorsStation();
                const data = response.data?.object;
                if (data) {
                    this.stationData = data;
                }
            } catch (err) {
                console.error("Error fetching station data:", err);
                // Set dummy data for demonstration
                this.stationData = {
                    'محطة 1': 150,
                    'محطة 2': 230,
                    'محطة 3': 180,
                    'محطة 4': 210,
                    'محطة 5': 195,
                    'محطة 6': 165
                };
            }
        },
        toggleSidebar() {
          this.sidebarVisible = !this.sidebarVisible;
        },
        handleLogout() {
            logout();
        },
        toggleAutoRefresh() {
            if (this.isAutoRefreshActive) {
                this.stopAutoRefresh();
            } else {
                this.startAutoRefresh();
            }
        },
        startAutoRefresh() {
            if (this.autoRefreshInterval < 5) {
                this.autoRefreshInterval = 5; // Minimum 5 seconds
            }
            this.isAutoRefreshActive = true;
            console.log("Starting auto-refresh with interval:", this.autoRefreshInterval);
            
            this.refreshTimer = setInterval(() => {
                console.log("Auto-refresh tick");
                this.fetchIndicators(true); // true for silent refresh
            }, this.autoRefreshInterval * 1000);
        },
        getStationChartOptions(percentage) {
            const isComplete = percentage === 100;
            const progressColor = isComplete ? '#03AA77' : '#015647';
            const backgroundColor = '#E5E7EB';
            
            return {
                chart: {
                    type: 'donut',
                    sparkline: {
                        enabled: true
                    }
                },
                labels: ['مكتمل', 'متبقي'],
                colors: [progressColor, backgroundColor],
                stroke: {
                    show: false
                },
                plotOptions: {
                    pie: {
                        donut: {
                            size: '65%',
                            labels: {
                                show: true,
                                name: {
                                    show: false
                                },
                                value: {
                                    show: true,
                                    fontSize: '28px',
                                    fontWeight: 'bold',
                                    color: progressColor,
                                    offsetY: 10,
                                    offsetX: 30,
                                    formatter: function(val) {
                                        return percentage + '%';
                                    }
                                },
                                total: {
                                    show: true,
                                    showAlways: true,
                                    fontSize: '28px',
                                    fontWeight: 'bold',
                                    color: progressColor,
                                    offsetY: 10,
                                    offsetX: -30, 
                                    formatter: function() {
                                        return percentage + '%';
                                    }
                                }
                            }
                        }
                    }
                },
                dataLabels: {
                    enabled: false
                },
                legend: {
                    show: false
                },
                tooltip: {
                    enabled: false
                }
            };
        },
        stopAutoRefresh() {
            this.isAutoRefreshActive = false;
            if (this.refreshTimer) {
                clearInterval(this.refreshTimer);
                this.refreshTimer = null;
            }
        },
        async fetchIndicators(silent = false) {
          if (!silent) {
            this.isLoading = true;
            this.error = null;
            this.showErrorNotify = false;
          }
          // Reset pagination logic if needed, or keep it to persist view
          // Keeping pagination reset only on full reload 
          if (!silent) {
              this.legendPage = 1;
              this.barPage = 1;
          }
          
          try {
            const stationResponse = await api.getIndicatorsStation();
            const stationData = stationResponse.data?.object;
            const response = await api.getIndicators();
            const data = response.data?.object;
            
            if (data) {
              // Map indicators based on provided JSON structure
              this.indicators = {
                officesNotStartedCount: data.numberOfOfficeshaveNotYetStarted || 0,
                officesFinishedCount: data.numberOfOfficesCompleted || 0,
                totalWinnersCount: data.numberOfWinners || 0,
                totalWinnersHajjaj: data.numberOfHajjWinners || 0,
                totalWinnersCompanions: data.numberOfCompanionWinners || 0,
                registeredUsersCount: data.numberOfRegistered || 0,
                totalPilgrims: data.numberOfHajjaj || 0,
                maleCount: data.numberOfMen || 0,
                femaleCount: data.numberOfWomen || 0,
                numberOfHajjajOver65YearsOfAge: data.numberOfHajjajOver65YearsOfAge || 0,
                totalCompletionRateForAllCenters: data.totalCompletionRateForAllCenters || 0
              };
              
              if (stationData) {
                this.stationData = stationData;
              }
              // Map Donut Chart (distributionByCenter)
              if (data.distributionByCenter && Object.keys(data.distributionByCenter).length > 0) {
                const sortedEntries = Object.entries(data.distributionByCenter)
                  .sort((a, b) => b[1] - a[1]);
                
                this.donutSeries = sortedEntries.map(e => e[1]);
                this.donutOptions = {
                  ...this.donutOptions,
                  labels: sortedEntries.map(e => e[0])
                };
              } else {
                this.donutSeries = [];
                this.donutOptions = { ...this.donutOptions, labels: [] };
              }

              // Map Bar Chart (numberOfWinnersInEachCenter)
              if (data.numberOfWinnersInEachCenter && Object.keys(data.numberOfWinnersInEachCenter).length > 0) {
                const sortedEntries = Object.entries(data.numberOfWinnersInEachCenter)
                  .sort((a, b) => b[1] - a[1]);
                
                const sortedKeys = sortedEntries.map(e => e[0]);
                const sortedValues = sortedEntries.map(e => e[1]);
                
                this.barSeries = [
                  {
                    name: 'الفائزين (إجمالي)',
                    data: sortedValues
                  }
                ];
                
                this.barOptions = {
                  ...this.barOptions,
                  xaxis: {
                    ...this.barOptions.xaxis,
                    categories: sortedKeys
                  }
                };
              } else {
                this.barSeries = [{ name: 'الفائزين (إجمالي)', data: [] }];
                this.barOptions = { ...this.barOptions, xaxis: { ...this.barOptions.xaxis, categories: [] } };
              }
            }
          } catch (err) {
            console.error("Error fetching indicators:", err);
            // Only show error notification if it's not a silent refresh
            if (!silent) {
                this.showErrorNotify = true;
                this.setDummyFull();
            }
          } finally {
            if (!silent) {
                this.isLoading = false;
            }
          }
        },
        setDummyFull() {
          this.indicators = {
            officesNotStartedCount: 9,
            officesFinishedCount: 3,
            totalWinnersCount: 764,
            totalWinnersHajjaj: 600,
            totalWinnersCompanions: 164,
            registeredUsersCount: 64152,
            maleCount: 1800,
            femaleCount: 1200,
            totalPilgrims: 3000,
            numberOfHajjajOver65YearsOfAge: 112562,
            totalCompletionRateForAllCenters: 100
          };
          this.setDummyCharts();
        },
        setDummyCharts() {
          this.donutSeries = [30, 20, 15, 10, 8, 5, 4, 3, 2, 1, 1, 1];
          this.donutOptions = {
            ...this.donutOptions,
            labels: ['جردس الجراري', 'البياضة', 'سوسة', 'شحات المدينة', 'البيضاء المدينة', 'بطة', 'الجهاد', 'سلنطة', 'مسة', 'مراوة', 'قندولة', 'زاوية العرقوب']
          };
          this.barSeries = [
            { name: 'رجال', data: [15, 20, 10, 18, 12, 8] },
            { name: 'نساء', data: [9, 12, 6, 10, 8, 4] }
          ];
          this.barOptions = {
            ...this.barOptions,
            xaxis: {
              ...this.barOptions.xaxis,
              categories: ['حي الأندلس', 'قرجي', 'أبوسليم', 'سوق الجمعة', 'تاجوراء', 'جنزور']
            }
          };
        },
        async handleExport() {
          if (this.isExporting) return;
          this.isExporting = true;
          try {
            const response = await api.exportcsv();
            // Assuming the API returns a blob or a URL
            if (response.data) {
                const blob = new Blob([response.data], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'winners_export.csv');
                document.body.appendChild(link);
                link.click();
                link.remove();
            }
          } catch (err) {
            console.error("Export failed:", err);
            alert("فشل استخراج البيانات. يرجى المحاولة مرة أخرى.");
          } finally {
            this.isExporting = false;
          }
        },
        handleLogout() {
            logout();
        }
    },
    beforeUnmount() {
        this.stopAutoRefresh();
    }
}
</script>

<style scoped>
.main-content {
  height: calc(100vh - 4rem);
}

@media (min-width: 1024px) {
  .main-content {
    height: calc(100vh - 5rem);
  }
}

@media (min-width: 1280px) {
  .main-content {
    height: calc(100vh - 6rem);
  }
}

/* Custom padding for laptop screens (15 inch, typically 1280px - 1919px range) */
/* YOU CAN CHANGE THE PIXEL VALUE BELOW UNTIL IT IS OK */
@media (min-width: 1280px) and (max-width: 1919px) {
  .laptop-chart-padding {
    padding-inline: 60px; /* Adjust this value to fix the layout on 15" laptop */
  }
}
</style>

