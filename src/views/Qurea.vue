<template>
    <div class="min-h-screen flex flex-col bg-[#FEFAF7] font-sans" dir="rtl">
      <!-- Top Navigation -->
      <header class="bg-white shadow-sm z-20 flex-shrink-0 h-16 flex justify-between items-center px-6 relative">
        <div class="flex items-center gap-3">
          <!-- Sidebar Toggle Button -->
          <button 
            @click="toggleSidebar"
            class="p-2 hover:bg-gray-100 text-gray-600 hover:text-gray-800 rounded-lg transition-colors"
            :title="sidebarVisible ? 'إخفاء الشريط الجانبي' : 'إظهار الشريط الجانبي'"
          >
            <img src="/sidebar-right.png" alt="Sidebar" class="h-5 w-5" />
          </button>
          <!-- <img src="/logo-icon.png" class="h-8 opacity-80" /> -->
          <div>
             <h1 class="font-bold text-primary text-lg leading-tight">منصة حجاج</h1>
             <p class="text-[10px] text-gray-500">لخدمات الحج والعمرة</p>
          </div>
          <div v-if="qureaStationName" class="hidden md:block border-r border-gray-200 pr-3 mr-3">
             <div class="text-xs text-gray-500">محطة القرعة</div>
             <div class="font-bold text-gray-800 text-sm">{{ qureaStationName }}</div>
          </div>
        </div>
        
        <!-- Floating Progress Stripe (Bottom of Navbar) -->
        <!-- <div class="absolute bottom-0 left-0 w-full group z-30">
            <div class="w-full h-1 bg-gray-100 relative">
                <div 
                    class="h-full transition-all duration-1000 ease-out relative"
                    :class="overallProgress === 100 ? 'bg-green-500' : 'bg-[#D8A663]'"
                    :style="{ width: overallProgress + '%' }"
                >
                    <div class="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                </div>
            </div>

            <div class="absolute top-full left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded-b-lg border-b border-x border-gray-100 shadow-sm opacity-60 group-hover:opacity-100 transition-opacity z-30">
                 <span class="text-[10px] font-bold text-gray-500">نسبة اكتمال القرعة</span>
                 <span class="text-[10px] font-bold font-mono" :class="overallProgress === 100 ? 'text-green-600' : 'text-[#D8A663]'">
                    {{ overallProgress }}%
                </span>
            </div>

            <div class="absolute top-full left-1/2 -translate-x-1/2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-2 -translate-y-2 z-40 mt-1">
                <div class="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-l border-t border-gray-100 transform rotate-45"></div>
                
                <div class="flex justify-between items-center mb-3 border-b border-gray-50 pb-2">
                    <h4 class="text-xs font-bold text-gray-400">تفاصيل التنسيقيات</h4>
                    <span class="text-xs font-bold font-mono" :class="overallProgress === 100 ? 'text-green-600' : 'text-[#D8A663]'">
                        {{ overallProgress }}%
                    </span>
                </div>
                
                <div class="space-y-3 max-h-[300px] overflow-y-auto scrollbar-hide">
                    <div v-for="stat in coordinationStats" :key="stat.id" class="flex flex-col gap-1">
                        <div class="flex justify-between items-center text-xs">
                            <span class="font-bold text-gray-700 truncate max-w-[140px]" :title="stat.name">{{ stat.name }}</span>
                            <span class="font-mono font-bold" :class="stat.percentage === 100 ? 'text-green-600' : 'text-gray-500'">
                                {{ stat.percentage }}%
                            </span>
                        </div>
                        <div class="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden">
                            <div 
                                class="h-full rounded-full transition-all duration-500"
                                :class="stat.percentage === 100 ? 'bg-green-500' : 'bg-[#D8A663]'"
                                :style="{ width: stat.percentage + '%' }"
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div> -->

        <!-- Global Stats Ticker -->
        <div class="hidden lg:flex items-center gap-6 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
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

      <!-- Main Content -->
      <main class="flex-grow flex overflow-hidden" style="height: calc(100vh - 4rem);">
        <!-- Clickable area for remaining 20% to close sidebar on mobile -->
        <div 
          v-if="sidebarVisible"
          @click="toggleSidebar"
          class="fixed inset-y-0 left-0 w-[20%] z-40 md:hidden bg-black/10 shadow-[4px_0_10px_rgba(0,0,0,0.3)]"
        ></div>
        
        <!-- Left Panel: Center Info -->
        <aside 
          class="bg-white flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden md:relative"
          :class="[
            sidebarVisible 
              ? 'w-[80%] md:w-80 border-l border-gray-200 z-50 translate-x-0 opacity-100' 
              : 'w-[80%] md:w-80 md:!w-0 translate-x-full md:translate-x-0 opacity-0 md:opacity-100 border-0 md:!p-0 md:!min-w-0 md:!max-w-0 pointer-events-none md:pointer-events-auto',
            'fixed md:relative inset-y-0 right-0 md:inset-auto'
          ]"
        >
          <div v-show="sidebarVisible" class="flex flex-col h-full p-6 relative">
            <!-- Close Button - Mobile Only -->
            <!-- <button
              @click="toggleSidebar"
              class="md:hidden absolute top-4 right-4 z-10 p-2 hover:bg-gray-100 text-gray-600 hover:text-gray-800 rounded-lg transition-colors"
              title="إغلاق"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button> -->
            
            <!-- Offices List -->
            <div ref="sidebarOfficesContainer" class="flex-1 overflow-y-auto min-h-0 sidebar-scroll">
              <h3 class="text-lg font-bold text-gray-800 mb-3">المكاتب</h3>
              <div class="space-y-3">
                <div 
                  v-for="office in filteredOffices" 
                  :key="office.id"
                  :data-office-id="office.id"
                  class="bg-white rounded-lg border-2 p-3 transition-all h-[110px] flex flex-col"
                  :class="[
                    String(office.id) === String(route.params.officeId) ? 'border-[#D8A663] ring-2 ring-[#D8A663]/20' : 'border-gray-200',
                    isButtonDisabled || (!isCurrentCoordinationComplete && String(office.id) !== String(route.params.officeId)) ? 'opacity-40 grayscale' : 'cursor-pointer hover:shadow-md hover:border-[#D8A663]/50',
                    isButtonDisabled ? 'pointer-events-none' : ''
                  ]"
                  @click="selectOffice(office.id)"
                >
                  <h4 class="font-bold text-base text-gray-800 mb-2">{{ office.name }}</h4>
                  
                  <!-- Status section  -->
                  <div class="mt-auto flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span 
                        class="w-2 h-2 rounded-full"
                        :class="getStatusDotColor(office.status)"
                      ></span>  
                      <span class="text-sm font-bold" :class="getStatusTextColor(office.status)">
                        {{ getStatusText(office.status) }}
                      </span>
                    </div>

                    <button
                      @click.stop="handlePrintOffice(office)"
                      :disabled="printingOfficeId !== null"
                      class="flex items-center justify-center p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-primary disabled:opacity-50"
                      title="طباعة النتائج"
                    >
                      <span v-if="printingOfficeId == office.id" class="inline-block animate-spin w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full"></span>
                      <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <!-- Center Content -->
        <div class="flex-grow flex flex-col overflow-y-auto p-6 relative min-h-0">
          <!-- Current Office Card - Top Left -->
          <div v-if="currentOffice" class="absolute top-6 left-6 z-10 w-40 bg-white rounded-xl border-2 border-[#D8A663] p-2 shadow-lg">
            <h4 class="font-bold text-sm text-gray-800 mb-2">{{ currentOffice.name }}</h4>
            <div class="space-y-1.5">
              <!-- <div class="flex items-center gap-1.5">
                <p class="text-[10px] text-gray-500">الحصة الإجمالية:</p>
                <p class="text-sm font-bold text-gray-800">{{ currentOffice.quota }} حاج</p>
              </div> -->
              <!-- <div class="flex items-center gap-1.5">
                <p class="text-[10px] text-gray-500">تم إختيار:</p>
                <p class="text-sm font-bold text-gray-800">{{ currentOffice.selectedCount || 0 }} حاج</p>
              </div> -->
              <div class="flex flex-col gap-1.5 mt-2">
                <span class="text-xs text-gray-500">الحالة:</span>
                <!-- Progress bar when lottery is running -->
                <div v-if="isLotteryRunning" class="w-full">
                  <div class="w-full bg-gray-300 rounded-full h-2 overflow-hidden">
                    <div 
                      class="h-full transition-all duration-300 ease-out rounded-full"
                      :style="{ width: lotteryProgressPercentage + '%', backgroundColor: '#005045' }"
                    ></div>
                  </div>
                  <div class="flex justify-between items-center mt-0.5">
                    <span class="text-[10px] font-bold" style="color: #005045">{{ lotteryProgressPercentage }}%</span>
                    <!-- <span class="text-[10px] text-gray-500">{{ currentWinnerIndex + 1 }} / {{ winnersQueue.length }}</span> -->
                  </div>
                </div>
                <!-- Normal status when lottery is not running -->
                <div v-else class="flex items-center gap-2">
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
          </div>

          <!-- Title -->
          <div class="relative flex items-center justify-center mb-3 mt-[15px] px-6">
            <h1 class="text-xl 2xl:text-4xl font-bold text-gray-800">قرعة الحج لموسم 1447 هجري - 2026 ميلادي</h1>
            
            <!-- Stats Dropdown - Right of Title -->
             <div class="absolute right-6 2xl:right-12 top-1/2 -translate-y-1/2 z-[100]" v-click-outside="() => showStatsDropdown = false">
                <button 
                    @click.stop="showStatsDropdown = !showStatsDropdown"
                    class="flex items-center gap-2 bg-white px-3 py-1.5 2xl:px-5 2xl:py-3 rounded-lg border border-[#D8A663] shadow-sm hover:bg-gray-50 transition-colors"
                >
                    <div class="flex flex-col items-end gap-1">
                        <span class="text-[10px] 2xl:text-sm text-gray-500 font-bold">نسبة اكتمال القرعة</span>
                        <span class="text-xs 2xl:text-lg font-bold font-mono" :class="overallProgress === 100 ? 'text-green-600' : 'text-[#D8A663]'">
                           {{ overallProgress }}%
                       </span>
                       <!-- Mini Progress Bar -->
                       <div class="w-20 2xl:w-48 h-1 2xl:h-2 bg-gray-100 rounded-full overflow-hidden">
                           <div 
                               class="h-full rounded-full transition-all duration-500"
                               :class="overallProgress === 100 ? 'bg-green-500' : 'bg-[#D8A663]'"
                               :style="{ width: overallProgress + '%' }"
                           ></div>
                       </div>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 2xl:h-6 2xl:w-6 text-gray-400 transition-transform duration-200" :class="{'rotate-180': showStatsDropdown}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                <!-- Dropdown -->
                <div 
                    v-if="showStatsDropdown"
                    class="absolute top-full right-0 mt-2 w-72 2xl:w-96 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-[100] animate-fade-in origin-top-right"
                >
                    <!-- Arrow -->
                    <div class="absolute -top-1.5 right-6 w-3 h-3 bg-white border-l border-t border-gray-100 transform rotate-45"></div>

                    <div class="flex justify-between items-center mb-3 border-b border-gray-50 pb-2">
                        <h4 class="text-xs 2xl:text-base font-bold text-gray-400">تفاصيل التنسيقيات</h4>
                    </div>
                    
                    <div class="space-y-3 max-h-[300px] 2xl:max-h-[500px] overflow-y-auto scrollbar-hide">
                        <div v-for="stat in coordinationStats" :key="stat.id" class="flex flex-col gap-1">
                            <div class="flex justify-between items-center text-xs 2xl:text-base">
                                <span class="font-bold text-gray-700 truncate max-w-[140px] 2xl:max-w-[200px]" :title="stat.name">{{ stat.name }}</span>
                                <span class="font-mono font-bold" :class="stat.percentage === 100 ? 'text-green-600' : 'text-gray-500'">
                                    {{ stat.percentage }}%
                                </span>
                            </div>
                            <div class="w-full h-1.5 2xl:h-2.5 bg-gray-50 rounded-full overflow-hidden">
                                <div 
                                    class="h-full rounded-full transition-all duration-500"
                                    :class="stat.percentage === 100 ? 'bg-green-500' : 'bg-[#D8A663]'"
                                    :style="{ width: stat.percentage + '%' }"
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>

          <!-- Side-by-Side Layout: Names Card and Number Card -->
          <div class="flex-grow flex flex-col md:flex-row items-center justify-center gap-8 lg:gap-12 mb-3 px-6">
            <!-- Winners List -->
            <div class="winners-list-wrapper w-[420px] md:w-[750px] h-[400px]">
              <div class="bg-white rounded-xl p-6 h-full flex flex-col relative">
                <!-- Corner Ornaments -->
                <span class="corner-ornament corner-tl"></span>
                <span class="corner-ornament corner-tr"></span>
                <span class="corner-ornament corner-br"></span>
                <span class="corner-ornament corner-bl"></span>
                
                <!-- Scrollable Winners List -->
                <div ref="winnersListContainer" class="flex-1 overflow-y-auto space-y-4 scrollbar-hide relative z-10">
                  <div 
                    v-for="(winner, index) in winnersQueue.slice(0, currentWinnerIndex + 1)" 
                    :key="index"
                    class="py-3 px-4 transition-all duration-500"
                    :class="[
                      index === currentWinnerIndex ? 'bg-[#D8A663]/10 rounded-lg animate-fade-in' : '',
                      'opacity-100'
                    ]"
                  >
                    <div class="flex items-start gap-6 text-right">
                      <!-- Number -->
                      <div class="flex-shrink-0">
                        <div class="text-base font-bold text-[#D8A663] mb-1">رقم:</div>
                        <div class="text-lg font-bold text-gray-800">{{ winner.registerNumber || '-' }}</div>
                      </div>
                      
                      <!-- Hajj Name -->
                      <div class="flex-1">
                        <div class="text-base font-bold text-[#D8A663] mb-1">الحاج:</div>
                        <div class="text-lg font-bold text-gray-800">{{ winner.hajj || 'لا يوجد' }}</div>
                      </div>
                      
                      <!-- Morafeq -->
                      <div class="flex-1">
                        <div class="text-base font-bold text-[#D8A663] mb-1">المرافق:</div>
                        <div class="text-lg font-bold text-gray-600">{{ winner.companionHajj || 'لا يوجد' }}</div>
                      </div>
                    </div>
                  </div>

                  <!-- Empty State -->
                  <div v-if="winnersQueue.length === 0" class="flex items-center justify-center h-full text-gray-400 text-lg">
                    لا يوجد فائزين بعد
                  </div>
                </div>
              </div>
            </div>

            <!-- Lottery Number Card -->
            <div class="flex items-center justify-center">
              <div class="winner-number-outer bg-[#DCB278] rounded-[20px] p-[8px] shadow-2xl border-[8px] border-white">
                <div class="winner-number-inner bg-gradient-to-br rounded-[12px] w-[200px] md:w-[318px] h-[110px] md:h-[174px] text-center transform hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                  <p class="winner-number-text text-[30px] md:text-[60px] font-bold text-white tracking-wider" style="font-family: Arial, Helvetica, sans-serif;">{{ lotteryNumber || '----' }}</p>
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
          <div class="sticky bottom-0 flex justify-between items-center bg-[#005045] rounded-xl p-3 shadow-lg z-30 mt-auto">
            <!-- Center Display (Static) -->
            <div 
              v-if="selectedCenter"
              class="px-8 py-3 bg-white border-2 border-gray-200 rounded-lg font-bold text-gray-700 shadow-sm"
              style="font-family: 'Somar Sans', sans-serif;"
            >
              {{ selectedCenter.name }}
            </div>

            <!-- Middle Image -->
            <div class="flex-1 flex justify-center items-center">
              <img src="/image 6.png" alt="Decoration" class="h-full w-[72px] object-contain" />
            </div>

            <!-- Start Lottery Button -->
            <div class="flex items-center gap-3">
              <button     
                @click="handleStartLottery"
                :disabled="isButtonDisabled || isPolling || (winnersQueue.length > 0 && currentWinnerIndex >= winnersQueue.length - 1)"
                class="bg-[#D8A764] text-white px-6 py-2 rounded-lg font-bold shadow-md hover:shadow-lg hover:bg-[#C89654] flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style="font-family: 'Somar Sans', sans-serif;"
              >
                <svg v-if="!isDrawing && !isPolling && !(currentWinnerIndex >= 0 && currentWinnerIndex < winnersQueue.length - 1) && !(winnersQueue.length > 0 && currentWinnerIndex >= winnersQueue.length - 1)" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                <span v-if="isDrawing || isPolling || (currentWinnerIndex >= 0 && currentWinnerIndex < winnersQueue.length - 1)" class="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></span>
                <span>{{ isPolling ? 'جاري بدء القرعة...' : (isDrawing ? 'جاري السحب...' : lotteryButtonText) }}</span>
              </button>

              <!-- Next Office Button -->
              <button
                v-if="showNextButton"
                @click="handleNextOffice"
                class="bg-white text-[#D8A764] border-2 border-[#D8A764] px-6 py-2 rounded-lg font-bold shadow-md hover:shadow-lg hover:bg-[#D8A764] hover:text-white flex items-center gap-2 transition-all"
                style="font-family: 'Somar Sans', sans-serif;"
              >
                <span>التالي</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="transform: scaleX(-1);">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <!-- New Button: Switch Coordination when all offices are done -->
              <button
                v-if="isCurrentCoordinationComplete"
                @click="showOfficeSelector = true"
                class="bg-white text-[#D8A764] border-2 border-[#005045] px-6 py-2 rounded-lg font-bold shadow-md hover:shadow-lg hover:bg-white/90 flex items-center gap-2 transition-all"
                style="font-family: 'Somar Sans', sans-serif;"
              >
                <span>اختيار تنسيقية</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>

              <!-- Export PDF Button -->
              <button
                v-if="winnersQueue.length > 0 || (currentOffice && currentOffice.status === 3)"
                @click="handleExportPDF"
                :disabled="printingOfficeId !== null || isButtonDisabled"
                class="bg-white text-[#D8A764] border-2 border-[#D8A764] px-6 py-2 rounded-lg font-bold shadow-md hover:shadow-lg hover:bg-[#D8A764] hover:text-white flex items-center gap-2 transition-all disabled:opacity-50"
                style="font-family: 'Somar Sans', sans-serif;"
                title="تصدير النتائج كملف PDF"
              >
                <template v-if="printingOfficeId != null && printingOfficeId == (currentOffice?.id)">
                  <span class="animate-spin w-5 h-5 border-2 border-[#D8A764]/30 border-t-[#D8A764] rounded-full"></span>
                  <span>جاري التحميل...</span>
                </template>
                <template v-else>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6" />
                  </svg>
                  <span>طباعة PDF</span>
                </template>
              </button>
            </div>
          </div>
        </div>
      </main>
  
    <!-- Alert Modal -->
    <AlertModal
      :isVisible="alertModal.isVisible"
      :type="alertModal.type"
      :title="alertModal.title"
      :message="alertModal.message"
      @close="closeAlert"
    />

    <!-- Coordination and Office Selector Modal -->
    <CoordinationOfficeSelector
      :isVisible="showOfficeSelector"
      :coordinations="centers"
      :offices="offices"
      :allowCancel="true"
      :initialCoordinationId="selectedCenterId"
      :exportingId="exportingCoordinationId"
      @confirm="handleOfficeSelectionConfirm"
      @cancel="handleLogout"
      @export-all="handleExportAllCoordinationPDFs"
    />
  </div>
    <!-- Blocking Overlay when animation is running -->
    <div v-if="isButtonDisabled" class="fixed inset-0 z-[9999] cursor-not-allowed"></div> <!-- Blocks all interactions -->
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../services/api';
import { logout } from '../services/auth';
import AlertModal from '../components/AlertModal.vue';
import CoordinationOfficeSelector from '../components/CoordinationOfficeSelector.vue';
import pdfService from '../services/pdfService';

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
const exportingCoordinationId = ref(null); // To track bulk export loading state
const isAnimating = ref(false); // Guard to prevent multiple animation loops
const isPolling = ref(false);
const winnersQueue = ref([]);
const currentWinnerIndex = ref(-1);
const cachedRegisterNames = ref([]);
const officeCardsContainer = ref(null);
const officeScrollLeft = ref(0);
const canScrollRight = ref(false);
const sidebarVisible = ref(true);
const winnersListContainer = ref(null);
const sidebarOfficesContainer = ref(null);
const officeOrderMap = ref(new Map()); // Store original office order

// Register numbers for animation
const registerNumbers = ref([]);
const currentRegisterIndex = ref(0);
const currentRegisterPage = ref(1);
const isLoadingRegisters = ref(false);

// Local Storage Key Prefix
const STORAGE_KEY_PREFIX = 'qurea_state_';
const POLLING_KEY_PREFIX = 'qurea_polling_office_';

const printingOfficeId = ref(null);
const showOfficeSelector = ref(false);
const isLoadingWinners = ref(false); // Prevent duplicate API calls
const showStatsDropdown = ref(false);

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

// Save state to local storage
const saveState = () => {
    if (!currentOffice.value || !currentOffice.value.id) return;
    
    const state = {
        winners: winnersQueue.value,
        currentIndex: currentWinnerIndex.value,
        timestamp: new Date().getTime(),
        officeStatus: currentOffice.value.status,
        selectedCount: currentOffice.value.selectedCount
    };
    
    localStorage.setItem(STORAGE_KEY_PREFIX + currentOffice.value.id, JSON.stringify(state));
};

// Load state from local storage
const loadState = () => {
    if (!currentOffice.value) return false;
    
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + currentOffice.value.id);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (parsed.winners && Array.isArray(parsed.winners) && parsed.winners.length > 0) {
                winnersQueue.value = parsed.winners;
                currentWinnerIndex.value = parsed.currentIndex;
                cachedRegisterNames.value = parsed.winners; // Restore cached names
                
                // Restore office status and count
                if (parsed.officeStatus !== undefined) currentOffice.value.status = parsed.officeStatus;
                if (parsed.selectedCount !== undefined) currentOffice.value.selectedCount = parsed.selectedCount;

                // Update the office in the list as well to reflect status in sidebar/list
                const officeInList = offices.value.find(o => String(o.id) === String(currentOffice.value.id));
                if (officeInList) {
                    if (parsed.officeStatus !== undefined) officeInList.status = parsed.officeStatus;
                    if (parsed.selectedCount !== undefined) officeInList.selectedCount = parsed.selectedCount;
                }
                
                // If we have winners, we should show the current winner immediately without animation
                if (currentWinnerIndex.value >= 0) {
                    showCurrentWinner();
                    
                    // Scroll to bottom of list
                    nextTick(() => {
                        if (winnersListContainer.value) {
                            winnersListContainer.value.scrollTop = winnersListContainer.value.scrollHeight;
                        }
                    });

                    // If not finished, RESUME loop - but only if not already animating
                    if (currentWinnerIndex.value < winnersQueue.value.length - 1 && !isAnimating.value && !isDrawing.value) {
                        console.log(`[State Resume] Resuming from winner ${currentWinnerIndex.value + 1}/${winnersQueue.value.length}`);
                        setTimeout(() => {
                            // Triple-check: not animating, not drawing, and not at last winner
                            if (!isAnimating.value && !isDrawing.value && currentWinnerIndex.value < winnersQueue.value.length - 1) {
                                showNextWinnerInLoop();
                            }
                        }, 1000);
                    } else if (currentWinnerIndex.value >= winnersQueue.value.length - 1) {
                        console.log(`[State Resume] At last winner (${currentWinnerIndex.value + 1}/${winnersQueue.value.length}), skipping resume`);
                    }
                }
                return true;
            }
        } catch (e) {
            console.error('Error loading saved state', e);
        }
    }
    return false;
};

// Clear state 
const clearState = () => {
    if (!currentOffice.value) return;
    localStorage.removeItem(STORAGE_KEY_PREFIX + currentOffice.value.id);
};

// Watchers to auto-save
watch([winnersQueue, currentWinnerIndex], () => {
    if (winnersQueue.value.length > 0) {
        saveState();
    }
}, { deep: true });

// Watch for office change to load state
watch(currentOffice, async (newVal, oldVal) => {
    if (newVal) {
        // Clear any running animation intervals first
        if (drawingInterval) {
            clearInterval(drawingInterval);
            drawingInterval = null;
        }
        
        // Clear any pending next winner timeout
        if (nextWinnerTimeout) {
            clearTimeout(nextWinnerTimeout);
            nextWinnerTimeout = null;
        }
        
        // CRITICAL: Stop polling when switching offices
        if (pollingInterval) {
            clearInterval(pollingInterval);
            pollingInterval = null;
        }
        isPolling.value = false;
        
        // Reset animation state
        isDrawing.value = false;
        animatedPilgrimName.value = '';
        animatedCompanionName.value = '';
        
        // Reset state first
        winnersQueue.value = [];
        currentWinnerIndex.value = -1;
        cachedRegisterNames.value = [];
        lotteryNumber.value = null;
        
        // Try to load saved state
        const stateLoaded = loadState();
        
        // If no state was loaded but office is completed (status 3), fetch winners from API
        if (!stateLoaded && newVal.status === 3) {
            try {
                const winnersRes = await api.getOfficeWinners(newVal.id);
                const winners = winnersRes.data?.object || [];
                
                if (Array.isArray(winners) && winners.length > 0) {
                    winnersQueue.value = winners;
                    currentWinnerIndex.value = winners.length - 1; // Show all winners
                    cachedRegisterNames.value = winners;
                    
                    // Show the last winner
                    showCurrentWinner();
                    
                    // Save this state
                    saveState();
                    
                    // Scroll to bottom
                    nextTick(() => {
                        if (winnersListContainer.value) {
                            winnersListContainer.value.scrollTop = winnersListContainer.value.scrollHeight;
                        }
                    });
                }
            } catch (error) {
                console.error('Error loading winners for completed office:', error);
            }
        }
        
        // Auto-resume polling if this office was polling (has polling flag in localStorage)
        const wasPolling = localStorage.getItem(POLLING_KEY_PREFIX + newVal.id);
        if (wasPolling === 'true') {
            // Check if winners are already saved (polling completed while away)
            const saved = localStorage.getItem(STORAGE_KEY_PREFIX + newVal.id);
            let hasWinners = false;
            
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    hasWinners = parsed.winners && Array.isArray(parsed.winners) && parsed.winners.length > 0;
                } catch (e) {
                    // ignore
                }
            }
            
            if (hasWinners) {
                localStorage.removeItem(POLLING_KEY_PREFIX + newVal.id);
                // Animation should already be running from loadState
            } else {
                // No winners yet, resume polling
                setTimeout(() => {
                    startPollingWinners();
                }, 500);
            }
        }
    }
});


// Animation settings
//adding emojis to see where the animation config is this is me not ai 😊(😶‍🌫️😶‍🌫️😶‍🌫️😪😪😪😪😫😫😫😫😝😝😝🙃🙃😯😯😌😛😜)

const animationDuration = ref(1.2); // Total animation duration in seconds
const numberDisplayDuration = ref(0.03); // How long each number shows in seconds (10ms = 0.01s)

let timeInterval = null;
let drawingInterval = null;
let nextWinnerTimeout = null;
let pollingInterval = null;

const handleLogout = () => {
    logout();
};

const toggleSidebar = () => {
    sidebarVisible.value = !sidebarVisible.value;
};

// Export PDF with lottery results for a specific office
const handlePrintOffice = async (office) => {
    if (!office) return;
    
    // Check if office has finished lottery
    if (office.status !== 3) {
        showAlert('القرعة لهذا المكتب لم تنتهي بعد. لا يمكن طباعة النتائج إلا بعد اكتمال السحب.', 'warning', 'تنبيه');
        return;
    }
    
    try {
        printingOfficeId.value = office.id;
        
        // Fetch fresh winner data for the target office
        const res = await api.getOfficeWinners(office.id);
        const winners = res.data?.object || [];
        
        if (!Array.isArray(winners) || winners.length === 0) {
            showAlert('لا توجد نتائج قرعة لتصديرها لهذا المكتب', 'warning', 'تنبيه');
            return;
        }
        
        let targetCenter = selectedCenter.value;
        if (office.coordinationId && (!targetCenter || String(targetCenter.id) !== String(office.coordinationId))) {
            targetCenter = centers.value.find(c => String(c.id) === String(office.coordinationId));
        }
        
        await pdfService.generateLotteryResultsPDF(
            office,
            winners,
            targetCenter
        );
        
    } catch (error) {
        console.error('Error in handlePrintOffice:', error);
        showAlert('حدث خطأ أثناء إنشاء ملف PDF', 'error', 'خطأ');
    } finally {
        printingOfficeId.value = null;
    }
};

// Export PDF with lottery results for current office
const handleExportPDF = () => {
    handlePrintOffice(currentOffice.value);
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
      showAlert('لا توجد مكاتب لهذه التنسيقية', 'warning', 'تنبيه');
      return;
    }

    // Get coordination info
    const coordination = centers.value.find(c => c.id === coordinationId);
    let exportedCount = 0;

    // List to hold all winner results for combined PDF
    const allResults = [];

    // Process each office
    for (const office of coordinationOffices) {
      try {
        // Fetch fresh winner data for ALL offices (regardless of status, just in case)
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
      showAlert('لا توجد مكاتب مكتملة لتصديرها', 'warning', 'تنبيه');
    } else {
      // Optional: Show success message?
      // showAlert(`تم تصدير ${exportedCount} ملفات`, 'success', 'نجاح');
    }
    
  } catch (err) {
    console.error('Error in bulk export:', err);
    showAlert('حدث خطأ أثناء التصدير', 'error', 'خطأ');
  } finally {
    exportingCoordinationId.value = null;
  }
};

const filteredOffices = computed(() => {
  if (!selectedCenterId.value) return offices.value;
  // Filter by coordination and sort alphabetically by name
  return offices.value
    .filter(office => office.coordinationId === selectedCenterId.value)
    .sort((a, b) => a.name.localeCompare(b.name, 'ar'));
});

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

// Lottery progress percentage
const lotteryProgressPercentage = computed(() => {
  if (winnersQueue.value.length === 0) return 0;
  // currentWinnerIndex is -1 initially, so we add 1 to get the count of shown winners
  const shownWinners = currentWinnerIndex.value + 1;
  return Math.round((shownWinners / winnersQueue.value.length) * 100);
});

// Check if lottery is running
const isLotteryRunning = computed(() => {
  return winnersQueue.value.length > 0 && (isDrawing.value || currentWinnerIndex.value >= 0);
});

// Button disabled state - only clickable when starting fresh or all winners shown
const isButtonDisabled = computed(() => {
  // Disabled while drawing or polling or showing winners or animating (preparing)
  return isDrawing.value || isPolling.value || isAnimating.value || (winnersQueue.value.length > 0 && currentWinnerIndex.value < winnersQueue.value.length - 1 && currentWinnerIndex.value >= 0);
});

// Get qureaStation name from selected coordination
const qureaStationName = computed(() => {
  if (selectedCenter.value && selectedCenter.value.qureaStation) {
    return selectedCenter.value.qureaStation.name;
  }
  return '';
});

// Button text based on state
const lotteryButtonText = computed(() => {
  if (isPolling.value) {
    return 'جاري بدء القرعة...';
  }
  
  // Check if current office is finished (from multiple sources for reliability)
  const officeId = route.params.officeId;
  const officeInList = offices.value.find(o => String(o.id) === String(officeId));
  const isFinished = (officeInList && (officeInList.status === 3 || officeInList.status === '3')) || 
                     (currentOffice.value && (currentOffice.value.status === 3 || currentOffice.value.status === '3')) ||
                     (winnersQueue.value.length > 0 && currentWinnerIndex.value >= winnersQueue.value.length - 1);
  
  // If the office is already finished or the coordination is all done, show "عرض القرعه"
  if (isFinished || isCurrentCoordinationComplete.value) {
    return 'عرض القرعه';
  }

  if (winnersQueue.value.length === 0) {
    return 'بدأ القرعة';
  } else if (isDrawing.value || (currentWinnerIndex.value >= 0 && currentWinnerIndex.value < winnersQueue.value.length - 1)) {
    return 'جاري السحب...';
  } else {
    return 'بدأ عرض النتائج';
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

// Overall Progress Statistics
const overallProgress = computed(() => {
  if (!offices.value.length) return 0;
  const completed = offices.value.filter(o => o.status === 3).length;
  // If we have 0 offices, percentage is 0. If all complete, 100.
  return Math.round((completed / offices.value.length) * 100);
});

// Per-Coordination Statistics
const coordinationStats = computed(() => {
  if (!centers.value || !centers.value.length) return [];
  
  return centers.value.map(center => {
    // Get offices for this center
    const centerOffices = offices.value.filter(o => o.coordinationId === center.id);
    const total = centerOffices.length;
    
    // If no offices, consider it 0% (or 100%? usually 0 if nothing to do)
    if (total === 0) {
      return {
        id: center.id,
        name: center.name,
        percentage: 0,
        total: 0,
        completed: 0
      };
    }
    
    const completed = centerOffices.filter(o => o.status === 3).length;
    const percentage = Math.round((completed / total) * 100);
    
    return {
      id: center.id,
      name: center.name,
      percentage,
      total,
      completed
    };
  }).sort((a, b) => b.percentage - a.percentage); // Sort by highest percentage first
});

// Select next office
const selectNextOffice = () => {
  if (!offices.value.length || !currentOffice.value) return;
  // Prevent if animation running
  if (isButtonDisabled.value) return;
  
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
  // Prevent if animation running
  if (isButtonDisabled.value) return;
  
  const currentIndex = offices.value.findIndex(o => String(o.id) === String(currentOffice.value.id));
  if (currentIndex === -1) return;
  
  // Get previous office (wrap around to last if at the beginning)
  const prevIndex = currentIndex === 0 ? offices.value.length - 1 : currentIndex - 1;
  const prevOffice = offices.value[prevIndex];
  
  // Navigate to previous office
  router.push(`/qurea/${prevOffice.id}`);
};

const isCurrentCoordinationComplete = computed(() => {
  if (!selectedCenterId.value || offices.value.length === 0) return false;
  const coordinationOffices = offices.value.filter(o => o.coordinationId === selectedCenterId.value);
  if (coordinationOffices.length === 0) return false;
  return coordinationOffices.every(o => o.status === 3 || o.status === '3');
});

// Select office by ID
const selectOffice = (officeId) => {
  if (isButtonDisabled.value) return;
  
  // Check if current coordination is complete
  if (!isCurrentCoordinationComplete.value) {
      // Allow clicking ONLY if it's the current office (no-op)
      if (currentOffice.value && String(currentOffice.value.id) === String(officeId)) return;
      return; 
  }

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

// Fetch register numbers for animation
const fetchRegisterPage = async (pageNumber) => {
  if (!currentOffice.value || isLoadingRegisters.value) return false;
  
  try {
    isLoadingRegisters.value = true;
    const res = await api.getRegisters(currentOffice.value.id, pageNumber, 100);
    const list = res.data?.object?.list || [];
    
    if (Array.isArray(list) && list.length > 0) {
      registerNumbers.value = list;
      return true;
    } else {
      console.warn('No register numbers found for page:', pageNumber);
      return false;
    }
  } catch (error) {
    console.error('Error fetching register numbers:', error);
    return false;
  } finally {
    isLoadingRegisters.value = false;
  }
};

// Start lottery - Auto loop through all winners
const handleStartLottery = async () => {
    // CRITICAL: Robust guard at entry point
    if (!currentOffice.value || isDrawing.value || isAnimating.value || isPolling.value || isButtonDisabled.value) {
        console.warn('[Guard] Blocked handleStartLottery:', { 
            isDrawing: isDrawing.value, 
            isAnimating: isAnimating.value, 
            isPolling: isPolling.value, 
            isButtonDisabled: isButtonDisabled.value 
        });
        return;
    }

  // Check if we need to load winners from API
  if (winnersQueue.value.length === 0) {
    // CRITICAL: Prevent duplicate API calls
    if (isLoadingWinners.value) {
      console.warn('[API Guard] Already loading winners, skipping duplicate call');
      return;
    }
    
    // First time load all winners from API
    isLoadingWinners.value = true; // Set flag to prevent duplicate calls
    
    try {
      console.log('[API] Starting lottery for office:', currentOffice.value.id);
      const call = await api.startQurea(currentOffice.value.id);
      if (call.data?.object?.status == 2) {
        startPollingWinners();
        return;
      }
      
      console.log('[API] Fetching winners for office:', currentOffice.value.id);
      const res = await api.getOfficeWinners(currentOffice.value.id);
      const winners = res.data?.object || [];
      
      // Special case: quota = 0 (no winners)
      if (!Array.isArray(winners) || winners.length === 0) {
        console.log('[API] No winners found (quota = 0)');
        showAlert('لا توجد نتائج قرعة حالياً - الحصة = 0', 'info', 'تنبيه');
        // Mark office as complete with 0 winners
        currentOffice.value.status = 3;
        currentOffice.value.selectedCount = 0;
        saveState();
        return;
      }
      
      console.log(`[API] Loaded ${winners.length} winners`);
      winnersQueue.value = winners;
      currentWinnerIndex.value = -1; 
      
      // Update status to In Progress (2) and reset count
      currentOffice.value.status = 2;
      currentOffice.value.selectedCount = 0;
      saveState(); // Save initial state
        if (isButtonDisabled.value || isAnimating.value) return;

      // Cache register names for animation
      cachedRegisterNames.value = winners;
      
      // Reset register numbers for animation
      registerNumbers.value = [];
      currentRegisterIndex.value = 0;
      currentRegisterPage.value = 1;
        if (isButtonDisabled.value || isAnimating.value) return;

      // Start the auto-loop
      showNextWinnerInLoop();
    } catch (error) {
      console.error('Error loading winners:', error);
      return;
    } finally {
      // Always reset the flag
      isLoadingWinners.value = false;
    }
  } else if (currentWinnerIndex.value >= winnersQueue.value.length - 1) {
    // If at the end, do nothing (button should be disabled anyway)
    return;
  } else {
    // Double check before starting loop from button click
    if (!isAnimating.value && !isDrawing.value) {
        showNextWinnerInLoop();
    }
  }
};

// Start polling for winners
const startPollingWinners = async () => {
  if (isPolling.value) return;
  
  isPolling.value = true;
  
  // Store the office ID we're polling for
  const pollingOfficeId = currentOffice.value.id;
  
  // Mark this office as polling in localStorage
  localStorage.setItem(POLLING_KEY_PREFIX + pollingOfficeId, 'true');
  
  const poll = async () => {
    try {
      const res = await api.startQurea(pollingOfficeId);
      if (res.data?.object?.status === 3) {
        // Stop polling interval but keep isPolling true to block UI
        if (pollingInterval) {
          clearInterval(pollingInterval);
          pollingInterval = null;
        }
        isPolling.value = false; // Set to false immediately to prevent interval starting on line 1184
        
        // Clear polling flag from localStorage when completed
        localStorage.removeItem(POLLING_KEY_PREFIX + pollingOfficeId);
        
        // Load winners
        const winnersRes = await api.getOfficeWinners(pollingOfficeId);
        const winners = winnersRes.data?.object || [];
        
        // CRITICAL: Only load winners if we're still viewing the same office
        if (Array.isArray(winners) && winners.length > 0 && currentOffice.value.id === pollingOfficeId) {
          winnersQueue.value = winners;
          currentWinnerIndex.value = -1;
          
          // Update status
          currentOffice.value.status = 2;
          currentOffice.value.selectedCount = 0;
          saveState();
          
          cachedRegisterNames.value = winners;
          registerNumbers.value = [];
          currentRegisterIndex.value = 0;
          currentRegisterPage.value = 1;
          
          // DOUBLE-CHECK: Ensure we're still on the same office before starting animation
          // This prevents race condition when switching offices at the exact moment polling completes
          // CRITICAL: Call immediately without setTimeout to acquire isAnimating lock synchronously
          if (currentOffice.value.id === pollingOfficeId) {
            showNextWinnerInLoop();
          } else {
            // Office changed, save state for the completed office
            const stateToSave = {
              winners: winners,
              currentIndex: -1,
              officeStatus: 2,
              selectedCount: 0
            };
            localStorage.setItem(STORAGE_KEY_PREFIX + pollingOfficeId, JSON.stringify(stateToSave));
          }
        } else if (currentOffice.value.id !== pollingOfficeId) {
          isPolling.value = false; // Reset now since we're not starting animation here
          
          // If we switched offices, just save the winners to localStorage for that office
          // Set currentIndex to -1 so animation starts from beginning when user returns
          const stateToSave = {
            winners: winners,
            currentIndex: -1, // Start from beginning, not the end
            officeStatus: 2, // Set to "in progress" so animation will run
            selectedCount: 0
          };
          localStorage.setItem(STORAGE_KEY_PREFIX + pollingOfficeId, JSON.stringify(stateToSave));
        } else if (winners.length === 0) {
          isPolling.value = false; // Reset now
        }
      }
    } catch (error) {
      console.error('Error during polling:', error);
      // We continue polling despite errors unless it's a critical failure
    }
  };

  // Initial call
  await poll();
  
  // If still polling, set interval
  if (isPolling.value) {
    pollingInterval = setInterval(poll, 2000);
  }
};

// Show next winner in automatic loop
const showNextWinnerInLoop = async () => {
  // CRITICAL: SYNC LOCK IMMEDIATELY to prevent race conditions during async bits below
  if (isAnimating.value) {
    console.warn('[Animation Guard] Animation already in progress, skipping duplicate call');
    return;
  }
  isAnimating.value = true;
  
  // Additional guard: Don't start if already drawing
  if (isDrawing.value) {
    console.warn('[Animation Guard] Already drawing, skipping duplicate call');
    isAnimating.value = false; // Release lock if blocked
    return;
  }
  
  // Check if we've reached the end
  if (currentWinnerIndex.value >= winnersQueue.value.length - 1) {
    isAnimating.value = false;
    return; // Stop at the end
  }
  
  console.log(`[Animation] Starting animation for winner ${currentWinnerIndex.value + 1}/${winnersQueue.value.length}`);
  
  // DON'T increment here - wait until animation completes
  
  // Pre-fetch register numbers if not loaded
  if (registerNumbers.value.length === 0) {
    const success = await fetchRegisterPage(currentRegisterPage.value);
    if (!success) {
      // Fallback to random numbers if API fails
    }
  }
  
  // Pre-fetch next page if we're running low
  if (registerNumbers.value.length > 0 && currentRegisterIndex.value >= registerNumbers.value.length - 20) {
    fetchRegisterPage(currentRegisterPage.value + 1).catch(() => {
      // Silently fail, we'll wrap around if needed
    });
  }
  
  // Start animation
  isDrawing.value = true;
  animatedPilgrimName.value = '';
  animatedCompanionName.value = '';
  
  try {
    // Prepare name arrays for animation
    let namePool = [];
    if (cachedRegisterNames.value.length > 0) {
      namePool = cachedRegisterNames.value.map(r => r?.hajj).filter(Boolean);
    } else {
      namePool = ['لا يوجد فائز'];
    }
    
    // Simulate lottery drawing animation
    let frameCount = 0;
    const intervalMs = numberDisplayDuration.value * 1000; // Convert seconds to milliseconds
    const totalFrames = Math.floor(animationDuration.value / numberDisplayDuration.value); // Calculate how many numbers to show
    
    drawingInterval = setInterval(() => {
      frameCount++;
      
      // Animate lottery number using register numbers from API
      if (registerNumbers.value.length > 0) {
        // Use register number from current position
        const index = currentRegisterIndex.value % registerNumbers.value.length;
        const currentRegisterNum = registerNumbers.value[index] || null;
        lotteryNumber.value = currentRegisterNum || '----';
        
        // Find matching winner/register entry by registerNumber to link name
        if (currentRegisterNum && cachedRegisterNames.value.length > 0) {
          const matchingEntry = cachedRegisterNames.value.find(
            entry => String(entry?.registerNumber) === String(currentRegisterNum)
          );
          
          if (matchingEntry) {
            // Use the linked name from the matching entry
            animatedPilgrimName.value = matchingEntry.hajj || '---';
            animatedCompanionName.value = matchingEntry.companionHajj || '---';
          } else {
            // If no match found, use random from pool
            const randomPilgrimIndex = Math.floor(Math.random() * namePool.length);
            const randomCompanionIndex = Math.floor(Math.random() * namePool.length);
            animatedPilgrimName.value = namePool[randomPilgrimIndex] || '---';
            animatedCompanionName.value = namePool[randomCompanionIndex] || '---';
          }
        } else {
          // Fallback to random names if no register number or no cached names
          const randomPilgrimIndex = Math.floor(Math.random() * namePool.length);
          const randomCompanionIndex = Math.floor(Math.random() * namePool.length);
          animatedPilgrimName.value = namePool[randomPilgrimIndex] || '---';
          animatedCompanionName.value = namePool[randomCompanionIndex] || '---';
        }
        
        currentRegisterIndex.value++;
        
        // Check if we've cycled through current page
        if (currentRegisterIndex.value >= registerNumbers.value.length * 2) {
          // Move to next page
          currentRegisterPage.value++;
          currentRegisterIndex.value = 0;
          // Trigger fetch for next page (non-blocking)
          fetchRegisterPage(currentRegisterPage.value).catch(() => {
            // If fetch fails, reset to page 1
            currentRegisterPage.value = 1;
            fetchRegisterPage(1);
          });
        }
      } else {
        // Fallback to random numbers if API failed
        lotteryNumber.value = Math.floor(Math.random() * (999999 - 10000 + 1)) + 10000;
        // Use random names when using random numbers
        const randomPilgrimIndex = Math.floor(Math.random() * namePool.length);
        const randomCompanionIndex = Math.floor(Math.random() * namePool.length);
        animatedPilgrimName.value = namePool[randomPilgrimIndex] || '---';
        animatedCompanionName.value = namePool[randomCompanionIndex] || '---';
      }
      
      if (frameCount >= totalFrames) {
        clearInterval(drawingInterval);
        
        // NOW increment the winner index AFTER animation completes
        currentWinnerIndex.value++;
        
        // Show winner from queue
        showCurrentWinner();
        isDrawing.value = false;
        // Clear animated names
        animatedPilgrimName.value = '';
        animatedCompanionName.value = '';
        
        // Release the animation lock
        isAnimating.value = false;
        
        // Auto-continue to next winner after 2 seconds
        nextWinnerTimeout = setTimeout(() => {
          if (currentWinnerIndex.value < winnersQueue.value.length - 1) {
            showNextWinnerInLoop();
          }
        }, 2000);
      }
    }, intervalMs); // Use configurable interval
    
  } catch (error) {
    console.error('Error during animation:', error);
    isDrawing.value = false;
    animatedPilgrimName.value = '';
    animatedCompanionName.value = '';
    isAnimating.value = false; // Release lock on error
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
    currentCompanion.value = winner.companionHajj ? {
      name: winner.companionHajj,
      nationalId: null
    } : null;

    // Update selected count
    currentOffice.value.selectedCount = currentWinnerIndex.value + 1;
    
    // ONLY set status to 3 when ALL winners have been shown (animation complete)
    // This ensures status doesn't change to "completed" while still animating
    if (currentWinnerIndex.value >= winnersQueue.value.length - 1) {
        currentOffice.value.status = 3;
        saveState(); // Save the completed state
    }
  }
};

// Load data
const loadOffices = async () => {
  try {
    const res = await api.getOfficeCrs();
    const rawOffices = res.data?.object || [];
    let fetchedOffices = Array.isArray(rawOffices) ? rawOffices : (rawOffices.list || []);
    
    // CRITICAL: Store current status of polling offices BEFORE updating
    const pollingOfficeStatuses = new Map();
    if (offices.value.length > 0) {
      offices.value.forEach(office => {
        const isPolling = localStorage.getItem(POLLING_KEY_PREFIX + office.id) === 'true';
        if (isPolling) {
          pollingOfficeStatuses.set(office.id, {
            status: office.status,
            selectedCount: office.selectedCount
          });
        }
      });
    }
    
    // If this is the first load, store the original order
    if (officeOrderMap.value.size === 0) {
      fetchedOffices.forEach((office, index) => {
        officeOrderMap.value.set(office.id, index);
      });
    } else {
      // Sort offices according to the original order
      fetchedOffices.sort((a, b) => {
        const orderA = officeOrderMap.value.get(a.id) ?? 999999;
        const orderB = officeOrderMap.value.get(b.id) ?? 999999;
        return orderA - orderB;
      });
    }
    
    // Restore status for polling offices BEFORE assigning to offices.value
    fetchedOffices.forEach(office => {
      if (pollingOfficeStatuses.has(office.id)) {
        const saved = pollingOfficeStatuses.get(office.id);
        office.status = saved.status;
        office.selectedCount = saved.selectedCount;
      }
    });
    
    offices.value = fetchedOffices;
    
    // Find current office
    currentOffice.value = offices.value.find(o => String(o.id) === String(route.params.officeId));
    
    // Calculate selected counts 
    offices.value.forEach(office => {
      // Check local storage for saved status/count
      const saved = localStorage.getItem(STORAGE_KEY_PREFIX + office.id);
      const isCurrentlyPolling = localStorage.getItem(POLLING_KEY_PREFIX + office.id) === 'true';
      
      if (saved && !isCurrentlyPolling) {
        try {
           const parsed = JSON.parse(saved);
           if (parsed.officeStatus !== undefined) {
             office.status = parsed.officeStatus;
           }
           if (parsed.selectedCount !== undefined) office.selectedCount = parsed.selectedCount;
        } catch (e) {
            // ignore error
        }
      }

      if (!office.selectedCount && !isCurrentlyPolling) {
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
    
    // Try to restore selected coordination from localStorage
    const savedCoordinationId = localStorage.getItem('selectedCoordinationId');
    
    if (savedCoordinationId && centers.value.length > 0) {
      const savedCenter = centers.value.find(c => String(c.id) === String(savedCoordinationId));
      if (savedCenter) {
        selectedCenterId.value = savedCenter.id;
        selectedCenter.value = savedCenter;
      } else {
        // Fallback to first center if saved one not found
        selectedCenterId.value = centers.value[0].id;
        selectedCenter.value = centers.value[0];
      }
    } else if (centers.value.length > 0) {
      // No saved coordination, use first one
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
// Watch for office ID changes and reload data
watch(() => route.params.officeId, async (newOfficeId) => {
  if (newOfficeId) {
    // Reload offices to get updated data
    await loadOffices();
    
    // Find and set current office
    // This assignment will trigger the watch(currentOffice) which handles state reset and loading
    currentOffice.value = offices.value.find(o => String(o.id) === String(newOfficeId));
    
    // Reset lottery data
    lotteryNumber.value = null;
    currentPilgrim.value = null;
    currentCompanion.value = null;
    
    // Scroll to current office
    setTimeout(() => {
      scrollToSelectedOffice();
    }, 100);
  }
});

// Click outside directive
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = function(event) {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event);
      }
    };
    document.body.addEventListener('click', el.clickOutsideEvent);
  },
  unmounted(el) {
    document.body.removeEventListener('click', el.clickOutsideEvent);
  },
};

// Watch for new winners and auto-scroll to bottom
watch(currentWinnerIndex, async () => {
  if (winnersListContainer.value && currentWinnerIndex.value >= 0) {
    await nextTick();
    // Wait a bit more for animations to settle
    setTimeout(() => {
      if (winnersListContainer.value) {
        winnersListContainer.value.scrollTo({
          top: winnersListContainer.value.scrollHeight,
          behavior: 'smooth'
        });
      }
    }, 500);
  }
});

// Watch for office completion to show selector
watch([currentWinnerIndex, winnersQueue, currentOffice], () => {
  // Only show selector when ALL offices in current coordination are complete
  if (
    currentOffice.value &&
    currentOffice.value.status === 3 &&
    winnersQueue.value.length > 0 &&
    currentWinnerIndex.value >= winnersQueue.value.length - 1 &&
    !isDrawing.value &&
    !isPolling.value &&
    !isAnimating.value
  ) {
    // Check if there are more offices in this coordination
    const coordinationOffices = offices.value.filter(o => o.coordinationId === selectedCenterId.value);
    const allOfficesComplete = coordinationOffices.every(o => o.status === 3);
    
    // Only show selector if all offices in coordination are complete
    // COMMENTED OUT as per user request to not show it "every time"
    /*
    if (allOfficesComplete) {
      setTimeout(() => {
        showOfficeSelector.value = true;
      }, 3000);
    }
    */
  }
}, { deep: true });

// Computed property to show Next button
const showNextButton = computed(() => {
  if (!currentOffice.value || !selectedCenterId.value) return false;
  
  // Show Next button when current office is complete
  if (
    currentOffice.value.status === 3 &&
    winnersQueue.value.length > 0 &&
    currentWinnerIndex.value >= winnersQueue.value.length - 1 &&
    !isDrawing.value &&
    !isPolling.value
  ) {
    // Hide next button if all offices in current coordination are complete
    if (isCurrentCoordinationComplete.value) return false;
    // Otherwise show it to move to next office
    return true;
  }
  
  return false;
});

// Handle next office navigation
const handleNextOffice = () => {
  if (!currentOffice.value || !selectedCenterId.value) return;
  
  // Get all offices for current coordination, sorted alphabetically
  const coordinationOffices = offices.value
    .filter(o => o.coordinationId === selectedCenterId.value)
    .sort((a, b) => a.name.localeCompare(b.name, 'ar'));
  
  const currentIndex = coordinationOffices.findIndex(o => String(o.id) === String(currentOffice.value.id));
  
  if (currentIndex >= 0 && currentIndex < coordinationOffices.length - 1) {
    // Default to the immediate next office
    let nextIndex = currentIndex + 1;
    let foundNext = false;
    
    // Search forward for the nearest office that is NOT completed (status != 3)
    for (let i = currentIndex + 1; i < coordinationOffices.length; i++) {
        if (coordinationOffices[i].status !== 3) {
            nextIndex = i;
            foundNext = true;
            break;
        }
    }
    
    if (foundNext) {
        const nextOffice = coordinationOffices[nextIndex];
        
        // Navigate to next office
        router.push(`/qurea/${nextOffice.id}`);
        
        // Auto-scroll sidebar to show the next office after a short delay
        nextTick(() => {
          setTimeout(() => {
            if (sidebarOfficesContainer.value) {
              const officeCard = sidebarOfficesContainer.value.querySelector(`[data-office-id="${nextOffice.id}"]`);
              if (officeCard) {
                officeCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }
          }, 100); 
        });
    } else {
        // No incomplete next office found -> All subsequent are complete.
        showOfficeSelector.value = true;
    }
  } else {
      // Last item in array
       showOfficeSelector.value = true;
  }
};

// Handle office selection confirmation
const handleOfficeSelectionConfirm = ({ coordinationId }) => {
  // Hide the selector
  showOfficeSelector.value = false;
  
  // Update the selected coordination
  selectedCenterId.value = coordinationId;
  selectedCenter.value = centers.value.find(c => c.id === coordinationId);
  
  // Store in localStorage
  localStorage.setItem('selectedCoordinationId', coordinationId);
  
  // Navigate to the first unfinished office of the new coordination
  const coordinationOffices = offices.value
    .filter(o => o.coordinationId === coordinationId)
    .sort((a, b) => a.name.localeCompare(b.name, 'ar'));
  
  if (coordinationOffices.length > 0) {
    // Find first office that is not completed (status != 3)
    const firstUnfinishedOffice = coordinationOffices.find(o => o.status !== 3);
    
    // If all offices are completed, go to the first one
    const targetOffice = firstUnfinishedOffice || coordinationOffices[0];
    
    router.push(`/qurea/${targetOffice.id}`);
  }
};

// Cleanup intervals on unmount
onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval);
  }
  if (drawingInterval) {
    clearInterval(drawingInterval);
  }
  if (nextWinnerTimeout) {
    clearTimeout(nextWinnerTimeout);
  }
  if (pollingInterval) {
    clearInterval(pollingInterval);
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

/* Sidebar Scrollbar Styling */
.sidebar-scroll::-webkit-scrollbar {
  width: 5px;
}

.sidebar-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-scroll::-webkit-scrollbar-thumb {
  background: rgba(216, 166, 99, 0.1);
  border-radius: 10px;
}

.sidebar-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(216, 166, 99, 0.3);
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Large Screen Enhancements (32" and 43" displays) */
@media (min-width: 1600px) {
    .winners-list-wrapper {
        width: 1000px !important;
        height: 550px !important;
    }
    .winner-number-inner {
        width: 450px !important;
        height: 250px !important;
    }
    .winner-number-text {
        font-size: 90px !important;
    }
    .corner-ornament {
        width: 120px !important;
        height: 120px !important;
    }
    .corner-ornament::before {
        width: 120px !important;
        height: 120px !important;
    }
}

@media (min-width: 2000px) {
    .winners-list-wrapper {
        width: 1300px !important;
        height: 700px !important;
    }
    .winner-number-inner {
        width: 600px !important;
        height: 350px !important;
    }
    .winner-number-text {
        font-size: 130px !important;
    }
    .corner-ornament {
        width: 150px !important;
        height: 150px !important;
    }
    .corner-ornament::before {
        width: 150px !important;
        height: 150px !important;
    }
    
    /* Font scaling for list items */
    .winners-list-wrapper .text-base { font-size: 1.5rem !important; } /* Label text */
    .winners-list-wrapper .text-lg { font-size: 2rem !important; }   /* Value text */
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out;
}

/* Corner Ornament Styles */
.corner-ornament {
  position: absolute;
  width: 90px;
  height: 90px;
  z-index: 1;
  pointer-events: none;
}

/* One PNG per corner using pseudo-element */
.corner-ornament::before {
  content: "";
  position: absolute;
  width: 90px;
  height: 90px;
  background: url("/Group.png") no-repeat center;
  background-size: contain;
}

/* TOP LEFT */
.corner-tl {
  top: 5px;
  left: 2px;
}

.corner-tl::before {
  top: 0;
  left: 0;
  transform: rotate(90deg);
}

/* TOP RIGHT */
.corner-tr {
  top: 2px;
  right: 5px;
}

.corner-tr::before {
  top: 0;
  right: 0;
  transform: rotate(180deg);
}

/* BOTTOM RIGHT */
.corner-br {
  bottom: 5px;
  right: 2px;
}

.corner-br::before {
  bottom: 0;
  right: 0;
  transform: rotate(270deg);
}

/* BOTTOM LEFT */
.corner-bl {
  bottom: 2px;
  left: 5px;
}

.corner-bl::before {
  bottom: 0;
  left: 0;
  transform: rotate(0deg);
}
</style>