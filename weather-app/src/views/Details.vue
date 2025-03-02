<template>
  <div class="details-screen" :style="{ background: weatherBackground }">
    <div class="status-bar">
      <span>{{ currentTime }}</span>
      <div>
        <i class="fas fa-signal"></i>
        <i class="fas fa-wifi"></i>
        <i class="fas fa-battery-full"></i>
      </div>
    </div>
    
    <div class="details-header">
      <h2>天气详情</h2>
      <div>{{ currentLocation.name }} · 今天</div>
    </div>
    
    <div class="details-card">
      <div class="details-grid">
        <div class="detail-grid-item">
          <div>体感温度</div>
          <div class="value">{{ formatTemp(weatherDetails.feelsLike) }}</div>
        </div>
        <div class="detail-grid-item">
          <div>湿度</div>
          <div class="value">{{ weatherDetails.humidity }}%</div>
        </div>
        <div class="detail-grid-item">
          <div>风速</div>
          <div class="value">{{ formatWindSpeed(weatherDetails.windSpeed) }}</div>
        </div>
        <div class="detail-grid-item">
          <div>气压</div>
          <div class="value">{{ weatherDetails.pressure }} hPa</div>
        </div>
        <div class="detail-grid-item">
          <div>能见度</div>
          <div class="value">{{ formatDistance(weatherDetails.visibility) }}</div>
        </div>
        <div class="detail-grid-item">
          <div>紫外线指数</div>
          <div class="value">{{ weatherDetails.uvIndex }}</div>
        </div>
      </div>
    </div>
    
    <div class="details-card">
      <div>温度变化</div>
      <div class="chart-container" ref="chartContainer">
        <!-- 图表将在这里渲染 -->
      </div>
    </div>
    
    <div class="details-card">
      <div>生活建议</div>
      <div style="margin-top: 10px;">
        <div style="margin-bottom: 10px;">
          <div><i class="fas fa-tshirt"></i> 穿衣指数</div>
          <div style="font-size: 14px; margin-top: 5px;">{{ lifeSuggestions.clothing }}</div>
        </div>
        <div style="margin-bottom: 10px;">
          <div><i class="fas fa-running"></i> 运动指数</div>
          <div style="font-size: 14px; margin-top: 5px;">{{ lifeSuggestions.sport }}</div>
        </div>
        <div>
          <div><i class="fas fa-car"></i> 出行指数</div>
          <div style="font-size: 14px; margin-top: 5px;">{{ lifeSuggestions.travel }}</div>
        </div>
      </div>
    </div>
    
    <div class="bottom-nav">
      <div class="nav-item" @click="goToHome">
        <i class="fas fa-home"></i>
        <span>主页</span>
      </div>
      <div class="nav-item" @click="goToForecast">
        <i class="fas fa-list"></i>
        <span>预报</span>
      </div>
      <div class="nav-item" @click="goToLocations">
        <i class="fas fa-map-marker-alt"></i>
        <span>位置</span>
      </div>
      <div class="nav-item" @click="goToSettings">
        <i class="fas fa-cog"></i>
        <span>设置</span>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, TitleComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { getWeatherBackground, convertTemperature, convertWindSpeed, convertDistance, getLifeSuggestions } from '@/utils/helpers'

// 注册必要的组件
echarts.use([LineChart, GridComponent, TooltipComponent, TitleComponent, CanvasRenderer])

export default {
  name: 'DetailsView',
  setup() {
    const store = useStore()
    const router = useRouter()
    const currentTime = ref('00:00')
    const chartContainer = ref(null)
    let chart = null
    
    // 获取当前位置
    const currentLocation = computed(() => store.getters.getCurrentLocation)
    
    // 获取当前天气
    const currentWeather = computed(() => store.getters.getCurrentWeather)
    
    // 获取天气详情
    const weatherDetails = computed(() => store.getters.getWeatherDetails)
    
    // 获取小时预报
    const hourlyForecast = computed(() => store.getters.getHourlyForecast)
    
    // 获取设置
    const settings = computed(() => store.getters.getSettings)
    
    // 获取天气背景
    const weatherBackground = computed(() => {
      return getWeatherBackground(currentWeather.value.condition)
    })
    
    // 获取生活建议
    const lifeSuggestions = computed(() => {
      return getLifeSuggestions(currentWeather.value)
    })
    
    // 格式化温度
    const formatTemp = (temp) => {
      const convertedTemp = convertTemperature(temp, settings.value.tempUnit)
      const unit = settings.value.tempUnit === 'fahrenheit' ? '°F' : '°'
      return `${convertedTemp}${unit}`
    }
    
    // 格式化风速
    const formatWindSpeed = (speed) => {
      const convertedSpeed = convertWindSpeed(speed, settings.value.windSpeedUnit)
      const unit = settings.value.windSpeedUnit === 'mph' ? 'mph' : 
                  settings.value.windSpeedUnit === 'ms' ? 'm/s' : 'km/h'
      return `${convertedSpeed} ${unit}`
    }
    
    // 格式化距离
    const formatDistance = (distance) => {
      const convertedDistance = convertDistance(distance, settings.value.distanceUnit)
      const unit = settings.value.distanceUnit === 'miles' ? 'mi' : 'km'
      return `${convertedDistance} ${unit}`
    }
    
    // 更新当前时间
    const updateCurrentTime = () => {
      const now = new Date()
      const hours = now.getHours().toString().padStart(2, '0')
      const minutes = now.getMinutes().toString().padStart(2, '0')
      currentTime.value = `${hours}:${minutes}`
    }
    
    // 初始化图表
    const initChart = () => {
      if (chartContainer.value) {
        chart = echarts.init(chartContainer.value)
        
        const hours = hourlyForecast.value.map(item => item.time)
        const temps = hourlyForecast.value.map(item => item.temp)
        
        const option = {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          grid: {
            left: '5%',
            right: '5%',
            top: '10%',
            bottom: '10%',
            containLabel: true
          },
          tooltip: {
            trigger: 'axis',
            formatter: function(params) {
              return `${params[0].name}: ${formatTemp(params[0].value)}`
            }
          },
          xAxis: {
            type: 'category',
            data: hours,
            axisLine: {
              lineStyle: {
                color: 'rgba(255, 255, 255, 0.5)'
              }
            },
            axisLabel: {
              color: 'rgba(255, 255, 255, 0.8)'
            }
          },
          yAxis: {
            type: 'value',
            axisLine: {
              show: false
            },
            axisLabel: {
              color: 'rgba(255, 255, 255, 0.8)',
              formatter: function(value) {
                return formatTemp(value).replace('°', '')
              }
            },
            splitLine: {
              lineStyle: {
                color: 'rgba(255, 255, 255, 0.2)'
              }
            }
          },
          series: [
            {
              data: temps,
              type: 'line',
              smooth: true,
              symbol: 'circle',
              symbolSize: 8,
              itemStyle: {
                color: '#fff'
              },
              lineStyle: {
                color: '#fff',
                width: 3
              },
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: 'rgba(255, 255, 255, 0.5)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(255, 255, 255, 0.1)'
                    }
                  ]
                }
              }
            }
          ]
        }
        
        chart.setOption(option)
      }
    }
    
    // 导航函数
    const goToHome = () => router.push('/')
    const goToForecast = () => router.push('/forecast')
    const goToLocations = () => router.push('/locations')
    const goToSettings = () => router.push('/settings')
    
    onMounted(() => {
      // 更新当前时间
      updateCurrentTime()
      setInterval(updateCurrentTime, 60000)
      
      // 初始化图表
      setTimeout(initChart, 100)
      
      // 监听窗口大小变化，重新调整图表大小
      window.addEventListener('resize', () => {
        if (chart) {
          chart.resize()
        }
      })
    })
    
    return {
      currentLocation,
      currentWeather,
      weatherDetails,
      currentTime,
      weatherBackground,
      lifeSuggestions,
      chartContainer,
      formatTemp,
      formatWindSpeed,
      formatDistance,
      goToHome,
      goToForecast,
      goToLocations,
      goToSettings
    }
  }
}
</script>

<style scoped>
.details-screen {
  height: 100vh;
  color: white;
  overflow-y: auto;
  padding-bottom: 60px;
}

.status-bar {
  height: 40px;
  background-color: rgba(255,255,255,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
  font-size: 14px;
}

.status-bar i {
  margin-left: 5px;
}

.details-header {
  padding: 15px;
  text-align: center;
}

.details-card {
  margin: 15px;
  background-color: rgba(255,255,255,0.2);
  border-radius: 15px;
  padding: 15px;
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.detail-grid-item {
  background-color: rgba(255,255,255,0.1);
  border-radius: 10px;
  padding: 15px;
  text-align: center;
}

.detail-grid-item .value {
  font-size: 24px;
  margin: 5px 0;
}

.chart-container {
  height: 200px;
  margin-top: 15px;
  background-color: rgba(255,255,255,0.1);
  border-radius: 10px;
}

.bottom-nav {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 60px;
  background-color: white;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 1px solid #eee;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 10px;
  color: #888;
}

.nav-item i {
  font-size: 20px;
  margin-bottom: 4px;
}

.nav-item.active {
  color: #4a90e2;
}
</style> 