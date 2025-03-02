<template>
  <div class="home-screen" :style="{ background: weatherBackground }">
    <div class="status-bar">
      <span>{{ currentTime }}</span>
      <div>
        <i class="fas fa-signal"></i>
        <i class="fas fa-wifi"></i>
        <i class="fas fa-battery-full"></i>
      </div>
    </div>
    
    <div class="location-bar" @click="goToLocations">
      <i class="fas fa-map-marker-alt"></i>
      <span>{{ currentLocation.name }}</span>
    </div>
    
    <div class="current-weather">
      <i :class="getWeatherIcon(currentWeather.condition)" style="font-size: 64px;"></i>
      <div class="temperature">{{ formatTemp(currentWeather.temperature) }}</div>
      <div class="weather-condition">{{ currentWeather.condition }}</div>
      <div>最高 {{ formatTemp(currentWeather.highTemp) }} | 最低 {{ formatTemp(currentWeather.lowTemp) }}</div>
    </div>
    
    <div class="weather-details">
      <div class="detail-item">
        <div><i class="fas fa-wind"></i></div>
        <div>{{ formatWindSpeed(currentWeather.windSpeed) }}</div>
        <div>风速</div>
      </div>
      <div class="detail-item">
        <div><i class="fas fa-tint"></i></div>
        <div>{{ currentWeather.humidity }}%</div>
        <div>湿度</div>
      </div>
      <div class="detail-item">
        <div><i class="fas fa-sun"></i></div>
        <div>{{ formatTime(currentWeather.sunrise) }}</div>
        <div>日出</div>
      </div>
    </div>
    
    <div class="hourly-forecast">
      <div class="hourly-title">小时预报</div>
      <div class="hourly-items">
        <div class="hourly-item" v-for="(item, index) in hourlyForecast" :key="index">
          <div>{{ item.time }}</div>
          <div><i :class="getWeatherIcon(item.icon)"></i></div>
          <div>{{ formatTemp(item.temp) }}</div>
        </div>
      </div>
    </div>
    
    <div class="daily-forecast">
      <div class="daily-title">7天预报</div>
      <div class="daily-item" v-for="(item, index) in dailyForecast.slice(0, 3)" :key="index" @click="goToForecast">
        <div>{{ item.day }}</div>
        <div><i :class="getWeatherIcon(item.icon)"></i></div>
        <div>{{ formatTemp(item.lowTemp) }} / {{ formatTemp(item.highTemp) }}</div>
      </div>
    </div>
    
    <div class="bottom-nav">
      <div class="nav-item active">
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
import { getWeatherIcon, getWeatherBackground, convertTemperature, convertWindSpeed, formatTime } from '@/utils/helpers'

export default {
  name: 'HomeView',
  setup() {
    const store = useStore()
    const router = useRouter()
    const currentTime = ref('00:00')
    
    // 获取当前位置
    const currentLocation = computed(() => store.getters.getCurrentLocation)
    
    // 获取当前天气
    const currentWeather = computed(() => store.getters.getCurrentWeather)
    
    // 获取小时预报
    const hourlyForecast = computed(() => store.getters.getHourlyForecast)
    
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
    
    // 格式化风速
    const formatWindSpeed = (speed) => {
      const convertedSpeed = convertWindSpeed(speed, settings.value.windSpeedUnit)
      const unit = settings.value.windSpeedUnit === 'mph' ? 'mph' : 
                  settings.value.windSpeedUnit === 'ms' ? 'm/s' : 'km/h'
      return `${convertedSpeed} ${unit}`
    }
    
    // 更新当前时间
    const updateCurrentTime = () => {
      const now = new Date()
      const hours = now.getHours().toString().padStart(2, '0')
      const minutes = now.getMinutes().toString().padStart(2, '0')
      currentTime.value = `${hours}:${minutes}`
    }
    
    // 导航函数
    const goToForecast = () => router.push('/forecast')
    const goToLocations = () => router.push('/locations')
    const goToSettings = () => router.push('/settings')
    
    onMounted(() => {
      // 获取天气数据
      store.dispatch('fetchWeatherData', currentLocation.value)
      
      // 更新当前时间
      updateCurrentTime()
      setInterval(updateCurrentTime, 60000)
    })
    
    return {
      currentLocation,
      currentWeather,
      hourlyForecast,
      dailyForecast,
      currentTime,
      weatherBackground,
      formatTemp,
      formatWindSpeed,
      formatTime,
      getWeatherIcon,
      goToForecast,
      goToLocations,
      goToSettings
    }
  }
}
</script>

<style scoped>
.home-screen {
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

.location-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px;
  font-size: 18px;
}

.location-bar i {
  margin-right: 5px;
}

.current-weather {
  text-align: center;
  padding: 20px 0;
}

.temperature {
  font-size: 72px;
  font-weight: 200;
  margin: 10px 0;
}

.weather-condition {
  font-size: 24px;
  margin-bottom: 10px;
}

.weather-details {
  display: flex;
  justify-content: space-around;
  padding: 15px;
  background-color: rgba(255,255,255,0.2);
  border-radius: 15px;
  margin: 0 15px;
}

.detail-item {
  text-align: center;
}

.hourly-forecast {
  margin: 20px 15px;
  background-color: rgba(255,255,255,0.2);
  border-radius: 15px;
  padding: 15px;
}

.hourly-title {
  margin-bottom: 10px;
  font-weight: bold;
}

.hourly-items {
  display: flex;
  overflow-x: auto;
  padding-bottom: 10px;
}

.hourly-item {
  flex: 0 0 auto;
  text-align: center;
  margin-right: 20px;
}

.daily-forecast {
  margin: 0 15px;
  background-color: rgba(255,255,255,0.2);
  border-radius: 15px;
  padding: 15px;
}

.daily-title {
  margin-bottom: 10px;
  font-weight: bold;
}

.daily-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255,255,255,0.3);
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