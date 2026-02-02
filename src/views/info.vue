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
            <img src="/sidebar-right.png" alt="Sidebar" class="h-5 w-5" />
          </button>
          <div>
             <h1 class="font-bold text-primary text-lg leading-tight">منصة حجاج</h1>
             <p class="text-[10px] text-gray-500">لخدمات الحج والعمرة</p>
          </div>
        </div>
        
        <!-- Global Stats Placeholder -->
        <div class="hidden md:flex items-center gap-6 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
            <div class="flex items-center gap-2">
               <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
               <span class="text-xs text-gray-400">إجمالي الحجاج</span>
               <span class="font-bold text-gray-700 font-mono text-lg">{{ indicators.totalPilgrims.toLocaleString() }}</span>
            </div>
             <div class="w-px h-4 bg-gray-300"></div>
            <!-- Auto Refresh Controls -->
            <div class="flex items-center gap-3 bg-white px-3 py-1 rounded-md border border-gray-200">
                <span class="text-[10px] text-gray-500 font-medium">تحديث تلقائي:</span>
                <input 
                    type="number" 
                    v-model.number="autoRefreshInterval" 
                    min="5" 
                    class="w-12 text-center text-xs border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-primary"
                />
                <span class="text-[10px] text-gray-500">ثانية</span>
                <button 
                    @click="toggleAutoRefresh" 
                    class="px-3 py-1 text-xs rounded-md transition-all duration-200 flex items-center gap-1 font-medium"
                    :class="isAutoRefreshActive ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-[#03AA77]/10 text-[#03AA77] hover:bg-[#03AA77]/20'"
                >
                    <span v-if="isAutoRefreshActive" class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    {{ isAutoRefreshActive ? 'إيقاف' : 'تشغيل' }}
                </button>
            </div>
            <div class="w-px h-4 bg-gray-300"></div>
            <div class="text-xs text-secondary font-bold">الإحصائيات</div>
        </div>
        
        <button @click="handleLogout" class="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors" title="تسجيل الخروج">
          <img src="/logout-02.png" alt="Logout" class="h-5 w-5" />
        </button>
      </header>

      <!-- Main Content -->
      <main class="flex-grow flex overflow-hidden" style="height: calc(100vh - 4rem);">
        <!-- Right Sidebar-->
        <aside 
          class="bg-white flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden md:relative"
          :class="[
            sidebarVisible 
              ? 'w-[80%] md:w-80 border-l border-gray-200 z-50 translate-x-0 opacity-100' 
              : 'w-[80%] md:w-80 md:!w-0 translate-x-full md:translate-x-0 opacity-0 md:opacity-100 border-0 md:!p-0 md:!min-w-0 md:!max-w-0 pointer-events-none md:pointer-events-auto',
            'fixed md:relative inset-y-0 right-0 md:inset-auto'
          ]"
        >
          <div v-show="sidebarVisible" class="flex flex-col h-full py-4 px-4 gap-2 relative">
            <nav class="w-full flex flex-col gap-1">
              <div class="px-3 py-1 mb-1 border-b border-gray-50">
                <span class="text-[14px] font-medium text-[#23282D66]" style="font-family: 'The Year of Handicrafts'">لوحة التحكم</span>
              </div>

              <!-- Dashboard Link -->
              <!-- <router-link to="/" class="flex items-center justify-end gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors group">
                <span class="text-[14px] text-[#2B3032] group-hover:text-primary" style="font-family: 'The Year of Handicrafts'">لوحة التحكم</span>
                <div class="w-5 h-5 flex items-center justify-center">
                   <svg class="w-5 h-5 text-[#2B3032]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
                </div>
              </router-link> -->

              <!-- Qurea Link -->
              <!-- <router-link to="/qurea/1" class="flex items-center justify-end gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors group">
                <span class="text-[14px] text-[#2B3032] group-hover:text-primary" style="font-family: 'The Year of Handicrafts'">القرعة</span>
                <div class="w-5 h-5 flex items-center justify-center">
                    <svg class="w-5 h-5 text-[#2B3032]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 4h16v16H4V4z"/><path d="M4 11h16"/><path d="M10 4v7"/></svg>
                </div>
              </router-link> -->

              <!-- Statistics Link  -->
              <div class="flex items-center justify-end gap-2 px-3 py-2 rounded-lg bg-[#03AA770D] transition-colors">
                <span class="text-[14px] text-[#03AA77]" style="font-family: 'The Year of Handicrafts'">الإحصائيات</span>
                <div class="w-5 h-5 flex items-center justify-center">
                    <svg class="w-5 h-5 text-[#03AA77]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
                </div>
              </div>

              <!-- Export Button -->
              <button @click="handleExport" :disabled="isExporting" class="flex items-center justify-end gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors group mt-4 ">
                <span class="text-[14px] text-[#2B3032] group-hover:text-primary" style="font-family: 'The Year of Handicrafts'">{{ isExporting ? 'جاري الاستخراج...' : 'استخراج النتائج' }}</span>
                <div class="w-5 h-5 flex items-center justify-center">
                    <svg class="w-5 h-5 text-[#2B3032]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25">
                       <path d="M6 18H18V9L15 6H6V18Z"/>
                       <path d="M10 6V9H14"/>
                       <path d="M10 18V14H14V18"/>
                       <path d="M12 11V14"/>
                    </svg>
                </div>
              </button>
            </nav>
          </div>
        </aside>

        <!-- Main Content Area -->
        <div class="flex-1 flex flex-col overflow-y-auto relative bg-[#FEFAF7]">

        <div class="flex-1 flex flex-col items-center py-8">
            <div v-if="isLoading" class="absolute inset-0 bg-[#FEFAF7]/80 z-30 flex items-center justify-center">
              <div class="flex flex-col items-center gap-4">
                <div class="w-12 h-12 border-4 border-[#01564733] border-t-[#015647] rounded-full animate-spin"></div>
                <span class="text-sm font-medium text-[#2B3032]">جاري تحميل البيانات...</span>
              </div>
            </div>

            <transition name="fade">
              <div v-if="showErrorNotify" class="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3">
                 <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 <span class="text-sm font-bold">فشل الاتصال بالخادم. يتم عرض بيانات تجريبية.</span>
                 <button @click="showErrorNotify = false" class="hover:opacity-70">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                 </button>
              </div>
            </transition>

            <div v-if="!isLoading" class="w-[900px] flex flex-col gap-2 scale-95 origin-top">
              <div class="flex justify-between items-center h-[28px]">
                 <h2 class="text-sm font-semibold text-[#2B3032]">ملخص</h2>
                 <button class="flex items-center gap-1 px-2 py-1 bg-[#23282D0D] rounded-lg text-xs text-[#2B3032]">
                    <svg class="w-4 h-4 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    <span>الكل</span>
                 </button>
              </div>

              <div class="flex gap-7 h-[112px]">
                <div class="flex-1 min-w-[200px] bg-white rounded-2xl p-6 flex flex-col justify-between items-end transition-all hover:shadow-md border border-transparent hover:border-gray-100">
                  <span class="text-[12px] font-medium text-[#2B3032]">مكاتب لم تبدأ بعد</span>
                  <div class="text-[24px] font-semibold text-[#2B3032]">{{ indicators.officesNotStartedCount }}</div>
                </div>
                <div class="flex-1 min-w-[200px] bg-white rounded-2xl p-6 flex flex-col justify-between items-end transition-all hover:shadow-md border border-transparent hover:border-gray-100">
                  <span class="text-[12px] font-medium text-[#2B3032]">مكاتب انتهت من القرعة</span>
                  <div class="text-[24px] font-semibold text-[#2B3032]">{{ indicators.officesFinishedCount }}</div>
                </div>
                <div class="flex-1 min-w-[200px] bg-white rounded-2xl p-6 flex flex-col justify-between items-end transition-all hover:shadow-md border border-transparent hover:border-gray-100">
                  <span class="text-[12px] font-medium text-[#2B3032]">الفائزين بالقرعة</span>
                  <div class="text-[24px] font-semibold text-[#2B3032]">{{ indicators.totalWinnersCount }}</div>
                </div>
                <div class="flex-1 min-w-[200px] bg-white rounded-2xl p-6 flex flex-col justify-between items-end transition-all hover:shadow-md border border-transparent hover:border-gray-100">
                  <span class="text-[12px] font-medium text-[#2B3032]">المسجلين في المنظومة</span>
                  <div class="text-[24px] font-semibold text-[#2B3032]">{{ indicators.registeredUsersCount }}</div>
                </div>
              </div>

              <div class="flex gap-7 h-[280px]">
                 <div class="w-[600px] min-w-[400px] bg-white rounded-2xl p-6 flex flex-col gap-4 flex-grow transition-all hover:shadow-md border border-transparent hover:border-gray-100">
                    <div class="flex justify-between items-center h-[28px] shrink-0">
                      <h3 class="text-sm font-semibold text-[#2B3032] flex-grow text-right">التوزيع حسب المكتب</h3>
                    </div>

                    <div class="flex flex-1 items-center justify-center px-5 gap-10 border-none">
                      <div class="w-[140px] h-[140px] shrink-0">
                         <apexchart type="donut" width="140" height="140" :options="paginatedChartOptions" :series="paginatedSeries"></apexchart>
                      </div>

                      <div class="flex-1 flex flex-col max-w-[352px] self-stretch py-2">
                        <div class="flex-1 flex flex-col gap-3">
                          <div v-for="(item, idx) in paginatedLegend" :key="item.index" 
                               class="flex items-center justify-between h-[22px]">
                            <div class="flex items-center gap-2">
                              <span class="text-[12px] text-[#2B3032]">{{ item.label }}</span>
                              <span class="w-4 h-4 rounded-full flex items-center justify-center shrink-0" :style="{ backgroundColor: donutOptions.colors[idx] || '#eee' }"></span>
                            </div>
                            <span class="text-[12px] text-[#2B3032] font-['Inter'] min-w-[35px] text-left">{{ item.percentage }}%</span>
                          </div>
                        </div>
                        
                        <div v-if="totalPages > 1" class="flex items-center justify-center gap-4 pt-4 mt-auto border-t border-gray-50">
                           <button @click="legendPage--" :disabled="legendPage <= 1" class="p-1 hover:bg-gray-100 rounded-md disabled:opacity-20 transition-colors text-[#2B3032]">
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                           </button>
                           <span class="text-[11px] text-gray-400 font-mono tracking-tighter">{{ legendPage }} / {{ totalPages }}</span>
                           <button @click="legendPage++" :disabled="legendPage >= totalPages" class="p-1 hover:bg-gray-100 rounded-md disabled:opacity-20 transition-colors text-[#2B3032]">
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                           </button>
                        </div>
                      </div>
                    </div>
                 </div>

                 <div class="w-[272px] bg-white rounded-2xl p-6 flex flex-col gap-4 transition-all hover:shadow-md border border-transparent hover:border-gray-100">
                    <h3 class="text-sm font-semibold text-[#2B3032] text-right">إحصائيات</h3>
                    <div class="flex flex-col gap-4 w-full">
                      <div class="flex justify-between w-full text-[12px]">
                        <span class="font-medium text-[#2B3032]">{{ indicators.totalPilgrims.toLocaleString() }}</span>
                        <span class="text-[#2B3032] opacity-60">عدد الحجاج</span>
                      </div>
                      <div class="flex justify-between w-full text-[12px]">
                        <span class="font-medium text-[#2B3032]">{{ indicators.maleCount.toLocaleString() }}</span>
                        <span class="text-[#2B3032] opacity-60">ذكور</span>
                      </div>
                      <div class="flex justify-between w-full text-[12px]">
                        <span class="font-medium text-[#2B3032]">{{ indicators.femaleCount.toLocaleString() }}</span>
                        <span class="text-[#2B3032] opacity-60">إناث</span>
                      </div>
                      <div class="flex justify-between w-full text-[12px]">
                        <span class="font-medium text-[#2B3032]">{{ indicators.numberOfHajjajOver65YearsOfAge.toLocaleString() }}</span>
                        <span class="text-[#2B3032] opacity-60"> الأعمار اكبر من 60</span>
                      </div>
                      <div class="flex justify-between w-full text-[12px]">
                        <span class="font-medium text-[#2B3032]">{{ indicators.totalCompletionRateForAllCenters }}</span>
                        <span class="text-[#2B3032] opacity-60">نسبة الانجاز</span>
                      </div>
                      <div class="flex justify-between w-full text-[12px]">
                        <span class="font-medium text-[#2B3032]">{{ indicators.totalWinnersCount.toLocaleString() }}</span>
                        <span class="text-[#2B3032] opacity-60">الفائزين</span>
                      </div>
                    </div>
                 </div>
              </div>

              <div class="flex gap-7 h-[280px]">
                <div class="flex-1 bg-white rounded-2xl p-6 flex flex-col gap-4 transition-all hover:shadow-md border border-transparent hover:border-gray-100">
                  <div class="flex justify-between items-center mb-2">
                    <div v-if="totalBarPages > 1" class="flex items-center gap-4">
                       <button @click="barPage--" :disabled="barPage <= 1" class="p-1 hover:bg-gray-100 rounded-md disabled:opacity-20 transition-colors text-[#2B3032]">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                       </button>
                       <span class="text-[11px] text-gray-400 font-mono tracking-tighter">{{ barPage }} / {{ totalBarPages }}</span>
                       <button @click="barPage++" :disabled="barPage >= totalBarPages" class="p-1 hover:bg-gray-100 rounded-md disabled:opacity-20 transition-colors text-[#2B3032]">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                       </button>
                    </div>
                    <h3 class="text-sm font-semibold text-[#2B3032] text-right">عدد الفائزين في كل مكتب</h3>
                  </div>
                  <div class="flex-1 overflow-hidden">
                    <apexchart :key="barPage" type="bar" height="100%" width="100%" :options="paginatedBarOptions" :series="paginatedBarSeries"></apexchart>
                  </div>
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
import { logout } from "../services/auth";

export default {    
    name: 'info',
    components: {
        apexchart: VueApexCharts,
    },
    data() {
        return {
            sidebarVisible: true,
            isLoading: true,
            error: null,
            showErrorNotify: false,
            isExporting: false,
            // Indicators data
            indicators: {
              officesNotStartedCount: 0,
              officesFinishedCount: 0,
              totalWinnersCount: 0,
              registeredUsersCount: 0,
              maleCount: 0,
              femaleCount: 0,
              totalPilgrims: 0,
              numberOfHajjajOver65YearsOfAge: 0,
              totalCompletionRateForAllCenters: 0,
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
            const response = await api.getIndicators();
            const data = response.data?.object;
            
            if (data) {
              // Map indicators based on provided JSON structure
              this.indicators = {
                officesNotStartedCount: data.numberOfOfficeshaveNotYetStarted || 0,
                officesFinishedCount: data.numberOfOfficesCompleted || 0,
                totalWinnersCount: data.numberOfWinners || 0,
                registeredUsersCount: data.numberOfRegistered || 0,
                totalPilgrims: data.numberOfHajjaj || 0,
                maleCount: data.numberOfMen || 0,
                femaleCount: data.numberOfWomen || 0,
                numberOfHajjajOver65YearsOfAge: data.numberOfHajjajOver65YearsOfAge || 0,
                totalCompletionRateForAllCenters: data.totalCompletionRateForAllCenters || 0
              };

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
