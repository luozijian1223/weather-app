<template>
  <div class="forecast-screen" :style="{ background: weatherBackground }">
    <div class="status-bar">
      <span>{{ currentTime }}</span>
      <div>
        <i class="fas fa-signal"></i>
        <i class="fas fa-wifi"></i>
        <i class="fas fa-battery-full"></i>
      </div>
    </div>
    
    <div class="forecast-header">
      <h2>7天预报</h2>
      <div>{{ currentLocation.name }}</div>
    </div>
    
    <div class="forecast-day" v-for="(item, index) in dailyForecast" :key="index">
      <div class="forecast-date">{{ item.day }} - {{ item.date }}</div>
      <div class="forecast-details">
        <div><i :class="getWeatherIcon(item.icon)"></i></div>
        <div class="temp-range">
          <span>{{ formatTemp(item.lowTemp) }}</span>
          <div class="temp-bar">
            <div class="temp-fill" :style="getTempBarStyle(item.lowTemp, item.highTemp)"></div>
          </div>
          <span>{{ formatTemp(item.highTemp) }}</span>
        </div>
      </div>
      <div style="margin-top: 10px; font-size: 14px;">
        {{ item.condition }}
      </div>
    </div>
    
    <div class="bottom-nav">
      <div class="nav-item" @click="goToHome">
        <i class="fas fa-home"></i>
        <span>主页</span>
      </div>
      <div class="nav-item active">
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
import { getWeatherIcon, getWeatherBackground, convertTemperature } from '@/utils/helpers'

export default {
  name: 'ForecastView',
  setup() {
    const store = useStore()
    const router = useRouter()
    const currentTime = ref('00:00')
    
    // 获取当前位置
    const currentLocation = computed(() => store.getters.getCurrentLocation)
    
    // 获取当前天气
    const currentWeather = computed(() => store.getters.getCurrentWeather)
    
    // 获取每日预报
    const dailyForecast = computed(() => store.getters.getDailyForecast)
    
    // 获取设置
    const settings = computed(() => store.getters.getSettings)
    
    // 获取天气背景
    const weatherBackground = computed(() => {
      return getWeatherBackground(currentWeather.value.condition)
    })
    
    // 格式化温度
    const formatTemp = (temp) => {
      const convertedTemp = convertTemperature(temp, settings.value.tempUnit)
      const unit = settings.value.tempUnit === 'fahrenheit' ? '°F' : '°'
      return `${convertedTemp}${unit}`
    }
    
    // 获取温度条样式
    const getTempBarStyle = (lowTemp, highTemp) => {
      // 假设温度范围在-10°C到40°C之间
      const minTemp = -10
      const maxTemp = 40
      const range = maxTemp - minTemp
      
      // 计算填充宽度和位置
      const left = ((lowTemp - minTemp) / range) * 100
      const width = ((highTemp - lowTemp) / range) * 100
      
      return {
        width: `${width}%`,
        left: `${left}%`
      }
    }
    
    // 更新当前时间
    const updateCurrentTime = () => {
      const now = new Date()
      const hours = now.getHours().toString().padStart(2, '0')
      const minutes = now.getMinutes().toString().padStart(2, '0')
      currentTime.value = `${hours}:${minutes}`
    }
    
    // 导航函数
    const goToHome = () => router.push('/')
    const goToLocations = () => router.push('/locations')
    const goToSettings = () => router.push('/settings')
    
    onMounted(() => {
      // 更新当前时间
      updateCurrentTime()
      setInterval(updateCurrentTime, 60000)
    })
    
    return {
      currentLocation,
      currentWeather,
      dailyForecast,
      currentTime,
      weatherBackground,
      formatTemp,
      getWeatherIcon,
      getTempBarStyle,
      goToHome,
      goToLocations,
      goToSettings
    }
  }
}
</script>

<style scoped>
.forecast-screen {
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

.forecast-header {
  padding: 15px;
  text-align: center;
}

.forecast-day {
  margin: 10px 15px;
  background-color: rgba(255,255,255,0.2);
  border-radius: 15px;
  padding: 15px;
}

.forecast-date {
  font-weight: bold;
  margin-bottom: 10px;
}

.forecast-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.temp-range {
  display: flex;
  align-items: center;
}

.temp-bar {
  width: 100px;
  height: 6px;
  background-color: rgba(255,255,255,0.3);
  border-radius: 3px;
  margin: 0 10px;
  position: relative;
}

.temp-fill {
  position: absolute;
  height: 100%;
  background-color: white;
  border-radius: 3px;
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