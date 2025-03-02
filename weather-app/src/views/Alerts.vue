<template>
  <div class="alerts-screen">
    <div class="status-bar">
      <span>{{ currentTime }}</span>
      <div>
        <i class="fas fa-signal"></i>
        <i class="fas fa-wifi"></i>
        <i class="fas fa-battery-full"></i>
      </div>
    </div>
    
    <div class="alerts-header">
      <h2>天气预警</h2>
      <div>{{ currentLocation.name }}</div>
    </div>
    
    <div class="alerts-list" v-if="alerts.length > 0">
      <div class="alert-item" v-for="(alert, index) in alerts" :key="index">
        <div class="alert-title">
          <i class="fas fa-exclamation-triangle"></i>
          <span>{{ alert.title }}</span>
        </div>
        <div class="alert-time">{{ alert.time }}</div>
        <div class="alert-content">{{ alert.content }}</div>
      </div>
    </div>
    
    <div class="no-alerts" v-else>
      <i class="fas fa-check-circle"></i>
      <div>当前没有天气预警</div>
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

export default {
  name: 'AlertsView',
  setup() {
    const store = useStore()
    const router = useRouter()
    const currentTime = ref('00:00')
    
    // 获取当前位置
    const currentLocation = computed(() => store.getters.getCurrentLocation)
    
    // 获取天气警报
    const alerts = computed(() => store.getters.getAlerts)
    
    // 更新当前时间
    const updateCurrentTime = () => {
      const now = new Date()
      const hours = now.getHours().toString().padStart(2, '0')
      const minutes = now.getMinutes().toString().padStart(2, '0')
      currentTime.value = `${hours}:${minutes}`
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
    })
    
    return {
      currentLocation,
      alerts,
      currentTime,
      goToHome,
      goToForecast,
      goToLocations,
      goToSettings
    }
  }
}
</script>

<style scoped>
.alerts-screen {
  height: 100vh;
  background-color: white;
  overflow-y: auto;
  padding-bottom: 60px;
}

.status-bar {
  height: 40px;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
  font-size: 14px;
  color: #333;
}

.status-bar i {
  margin-left: 5px;
}

.alerts-header {
  padding: 15px;
  text-align: center;
  border-bottom: 1px solid #eee;
}

.alerts-list {
  padding: 15px;
}

.alert-item {
  background-color: #fff8f8;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 15px;
  border-left: 4px solid #ff4d4f;
}

.alert-title {
  display: flex;
  align-items: center;
  font-weight: bold;
  margin-bottom: 5px;
}

.alert-title i {
  color: #ff4d4f;
  margin-right: 5px;
}

.alert-time {
  font-size: 12px;
  color: #888;
  margin-bottom: 10px;
}

.alert-content {
  line-height: 1.5;
}

.no-alerts {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #888;
}

.no-alerts i {
  font-size: 48px;
  color: #52c41a;
  margin-bottom: 15px;
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