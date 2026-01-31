<template>
    <div class="min-h-screen flex flex-col bg-[#FEFAF7] font-sans rtl" dir="rtl">
      <!-- Top Navigation -->
      <header class="bg-white shadow-sm z-20 flex-shrink-0 h-16 flex justify-between items-center px-6">
        <div class="flex items-center gap-3">
          <div>
             <h1 class="font-bold text-primary text-lg leading-tight">منصة حجاج</h1>
             <p class="text-[10px] text-gray-500">لخدمات الحج والعمرة</p>
          </div>
        </div>
        <button @click="handleLogout" class="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors" title="تسجيل الخروج">
          <img src="/logout-02.png" alt="Logout" class="h-5 w-5" />
        </button>
      </header>

      <!-- Main Content Container -->
      <main class="flex-1 flex justify-center items-center py-8 relative">
        <!-- Loading State -->
        <div v-if="isLoading" class="absolute inset-0 bg-[#FEFAF7]/80 z-30 flex items-center justify-center">
          <div class="flex flex-col items-center gap-4">
            <div class="w-12 h-12 border-4 border-[#01564733] border-t-[#015647] rounded-full animate-spin"></div>
            <span class="text-sm font-medium text-[#2B3032]">جاري تحميل البيانات...</span>
          </div>
        </div>

        <!-- Error Notification Toast -->
        <transition name="fade">
          <div v-if="showErrorNotify" class="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3">
             <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             <span class="text-sm font-bold">فشل الاتصال بالخادم. يتم عرض بيانات تجريبية.</span>
             <button @click="showErrorNotify = false" class="hover:opacity-70">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
          </div>
        </transition>

        <div v-if="!isLoading" class="w-[900px] flex flex-col gap-2">
          <!-- Header Row  -->
          <div class="flex justify-between items-center h-[28px]">
             <h2 class="text-sm font-semibold text-[#2B3032]">ملخص</h2>
             <button class="flex items-center gap-1 px-2 py-1 bg-[#23282D0D] rounded-lg text-xs text-[#2B3032]">
                                <svg class="w-4 h-4 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                <span>الكل</span>
             </button>
          </div>

          <!-- Summary Cards Row  -->
          <div class="flex gap-7 h-[112px]">
            <!-- Card 1 -->
            <div class="flex-1 min-w-[200px] bg-white rounded-2xl p-6 flex flex-col justify-between items-end">
              <span class="text-[12px] font-medium text-[#2B3032]">مكاتب لم تبدأ بعد</span>
              <div class="text-[24px] font-semibold text-[#2B3032]">{{ indicators.officesNotStartedCount }}</div>
            </div>
            <!-- Card 2 -->
            <div class="flex-1 min-w-[200px] bg-white rounded-2xl p-6 flex flex-col justify-between items-end">
              <span class="text-[12px] font-medium text-[#2B3032]">مكاتب انتهت من القرعة</span>
              <div class="text-[24px] font-semibold text-[#2B3032]">{{ indicators.officesFinishedCount }}</div>
            </div>
            <!-- Card 3 -->
            <div class="flex-1 min-w-[200px] bg-white rounded-2xl p-6 flex flex-col justify-between items-end">
              <span class="text-[12px] font-medium text-[#2B3032]">الفائزين بالقرعة</span>
              <div class="text-[24px] font-semibold text-[#2B3032]">{{ indicators.totalWinnersCount }}</div>
            </div>
            <!-- Card 4 -->
            <div class="flex-1 min-w-[200px] bg-white rounded-2xl p-6 flex flex-col justify-between items-end">
              <span class="text-[12px] font-medium text-[#2B3032]">المسجلين في المنظومة</span>
              <div class="text-[24px] font-semibold text-[#2B3032]">{{ indicators.registeredUsersCount }}</div>
            </div>
          </div>

          <!-- Middle Block  -->
          <div class="flex gap-7 h-[280px]">
             <!-- Donut Chart Block  -->
             <div class="w-[600px] min-w-[400px] bg-white rounded-2xl p-6 flex flex-col gap-4 flex-grow">
                <!-- Text Header Row -->
                <div class="flex justify-between items-center h-[28px] shrink-0">
                  <button class="flex items-center gap-1 px-2 py-1 bg-[#23282D0D] rounded-lg h-[28px] w-[76px] justify-center">
                    <div class="flex items-center justify-center w-5 h-5 gap-1 shrink-0">
                       <svg class="w-4 h-4 opacity-40 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                    <span class="text-[12px] text-[#2B3032]">طرابلس</span>
                  </button>
                  <h3 class="text-sm font-semibold text-[#2B3032] flex-grow text-right">التوزيع حسب المكتب</h3>
                </div>

                <!-- Frame -->
                <div class="flex flex-1 items-center justify-end px-5 gap-10 border-none">
                  <!-- Donut Chart -->
                  <div class="w-[120px] h-[120px] shrink-0">
                     <apexchart type="donut" width="100%" height="100%" :options="donutOptions" :series="donutSeries"></apexchart>
                  </div>

                  <!-- Legend Card -->
                  <div class="flex-1 flex flex-col gap-3 max-w-[352px]">
                    <div v-for="(label, index) in donutOptions.labels" :key="label" 
                         class="flex items-center justify-between h-[22px]">
                      <!-- Tag -->
                      <div class="flex items-center gap-2">
                        <span class="text-[12px] text-[#2B3032]">{{ label }}</span>
                        <span class="w-4 h-4 rounded-full flex items-center justify-center shrink-0" :style="{ backgroundColor: donutOptions.colors[index] }"></span>
                      </div>
                      <!-- Percentage -->
                      <span class="text-[12px] text-[#2B3032] font-['Inter'] min-w-[35px] text-left">{{ donutSeries[index] }}%</span>
                    </div>
                  </div>
                </div>
             </div>

             <!-- Stats List -->
             <div class="w-[272px] bg-white rounded-2xl p-6 flex flex-col gap-4">
                <h3 class="text-sm font-semibold text-[#2B3032] text-right">إحصائيات</h3>
                <div class="flex flex-col gap-4 w-full">
                  <div class="flex justify-between w-full text-[12px]">
                    <span class="font-medium text-[#2B3032]">{{ indicators.totalPilgrims.toLocaleString() }}</span>
                    <span class="text-[#2B3032] opacity-60">عدد الحواج</span>
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
                    <span class="text-[#2B3032] opacity-60">اكبر من 60</span>
                  </div>
                  <div class="flex justify-between w-full text-[12px]">
                    <span class="font-medium text-[#2B3032]">{{ indicators.totalCompletionRateForAllCenters.toLocaleString() }}</span>
                    <span class="text-[#2B3032] opacity-60">اجمالي القرعة لكل المكاتب</span>
                  </div>
                  <div class="flex justify-between w-full text-[12px]">
                    <span class="font-medium text-[#2B3032]">{{ indicators.totalWinnersCount.toLocaleString() }}</span>
                    <span class="text-[#2B3032] opacity-60">الفائزين</span>
                  </div>
                </div>
             </div>
          </div>

          <!-- Bottom Block  -->
          <div class="flex gap-7 h-[280px]">
            <!-- Bar Chart Block  -->
            <div class="flex-1 bg-white rounded-2xl p-6 flex flex-col gap-4">
              <h3 class="text-sm font-semibold text-[#2B3032] text-right">عدد الفائزين في كل مكتب</h3>
              <div class="flex-1 overflow-hidden">
                <apexchart type="bar" height="100%" width="100%" :options="barOptions" :series="barSeries"></apexchart>
              </div>
            </div>
            
            <!-- Cards Block    -->
            <div class="w-[434px] flex flex-col gap-7">
               <div class="flex gap-7">
                 <div class="flex-1 bg-white rounded-2xl p-6 flex flex-col justify-between items-end h-[110px]">
                    <span class="text-[12px] font-medium text-[#2B3032]">نسبة الإنجاز</span>
                    <div class="text-[24px] font-semibold text-[#2B3032]">{{ indicators.completionRate }}%</div>
                 </div>
                 <div class="flex-1 bg-white rounded-2xl p-6 flex flex-col justify-between items-end h-[110px]">
                    <span class="text-[12px] font-medium text-[#2B3032]">الحصة الإجمالية للمركز</span>
                    <div class="text-[24px] font-semibold text-[#2B3032]">{{ indicators.totalQuota }}</div>
                 </div>
               </div>
               <div class="bg-white rounded-2xl p-6 flex flex-col justify-between items-end h-[112px]">
                 <span class="text-[12px] font-medium text-[#2B3032]">إحصائيات اخرى</span>
                 <div class="text-[24px] font-semibold text-[#2B3032]">{{ indicators.otherStats }}</div>
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
            // Indicators data
            indicators: {
              officesNotStartedCount: 0,
              officesFinishedCount: 0,
              totalWinnersCount: 0,
              registeredUsersCount: 0,
              maleCount: 0,
              femaleCount: 0,
              singleCount: 0,
              companionCount: 0,
              totalPilgrims: 0,
              completionRate: 0,
              totalQuota: 0,
              otherStats: 0
            },
            // Donut Chart Data
            donutSeries: [],
            donutOptions: {
              chart: {
                type: 'donut',
                sparkline: {
                  enabled: true
                }
              },
              labels: [],
              colors: ['#2B3032', '#A1E3CB', '#B1E3FF', '#A8C5DA', '#015647', '#9FD4CA', '#FFCF9F'],
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
            barSeries: [
              {
                name: 'رجال',
                data: []
              },
              {
                name: 'نساء',
                data: []
              }
            ],
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
    async mounted() {
      await this.fetchIndicators();
    },
    methods: {
        async fetchIndicators() {
          this.isLoading = true;
          this.error = null;
          this.showErrorNotify = false;
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
                numberOfHajjajOver65YearsOfAge: data.numberOfHajjajOver65YearsOfAge || 0,
                totalCompletionRateForAllCenters: data.totalCompletionRateForAllCenters || 0,
                maleCount: data.numberOfMen || 0,
                femaleCount: data.numberOfWomen || 0,
                singleCount: (data.numberOfHajjaj || 0) - (data.numberOfCompanions || 0),
                companionCount: data.numberOfCompanions || 0,
                totalPilgrims: data.numberOfHajjaj || 0,
                completionRate: data.totalCompletionRateForAllCenters || 0,
                totalQuota: data.totalQuotaForAllCenters || 0,
                otherStats: data.numberOfHajjajOver65YearsOfAge || 0
              };

              // Map Donut Chart (distributionByCenter)
              if (data.distributionByCenter && Object.keys(data.distributionByCenter).length > 0) {
                const keys = Object.keys(data.distributionByCenter);
                this.donutSeries = keys.map(k => data.distributionByCenter[k]);
                this.donutOptions = {
                  ...this.donutOptions,
                  labels: keys
                };
              } else {
                this.setDummyCharts();
              }

              // Map Bar Chart (numberOfWinnersInEachCenter)
              if (data.numberOfWinnersInEachCenter && Object.keys(data.numberOfWinnersInEachCenter).length > 0) {
                const keys = Object.keys(data.numberOfWinnersInEachCenter);
                const values = keys.map(k => data.numberOfWinnersInEachCenter[k]);
                
                this.barSeries = [
                  {
                    name: 'الفائزين (إجمالي)',
                    data: values
                  }
                ];
                
                this.barOptions = {
                  ...this.barOptions,
                  xaxis: {
                    ...this.barOptions.xaxis,
                    categories: keys
                  }
                };
              } else {
                this.setDummyCharts();
              }
            } else {
              this.setDummyFull();
            }
          } catch (err) {
            console.error("Error fetching indicators:", err);
            this.showErrorNotify = true;
            this.setDummyFull();
          } finally {
            this.isLoading = false;
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
            singleCount: 2500,
            companionCount: 500,
            totalPilgrims: 3000,
            completionRate: 1,
            totalQuota: 5,
            otherStats: 764
          };
          this.setDummyCharts();
        },
        setDummyCharts() {
          this.donutSeries = [38, 22, 30, 10];
          this.donutOptions = {
            ...this.donutOptions,
            labels: ['حي الأندلس', 'قرجي', 'أبوسليم', 'سوق الجمعة']
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
        toggleSidebar() {
            this.sidebarVisible = !this.sidebarVisible
        },
        handleLogout() {
            logout();
        }
    }
}
</script>
