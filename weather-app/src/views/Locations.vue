<template>
  <div class="locations-screen">
    <div class="status-bar">
      <span>{{ currentTime }}</span>
      <div>
        <i class="fas fa-signal"></i>
        <i class="fas fa-wifi"></i>
        <i class="fas fa-battery-full"></i>
      </div>
    </div>
    
    <div class="locations-header">
      <h2>我的位置</h2>
      <i class="fas fa-ellipsis-v" @click="showOptions = true"></i>
    </div>
    
    <div class="location-list">
      <div class="location-item" v-for="(location, index) in locations" :key="index" @click="selectLocation(location)">
        <div class="location-info">
          <div class="location-name">
            {{ location.name }}
            <i class="fas fa-map-marker-alt" style="color: #4a90e2;" v-if="isCurrentLocation(location)"></i>
          </div>
          <div class="location-weather">{{ location.weather }}</div>
        </div>
        <div class="location-temp">{{ formatTemp(location.temperature) }}</div>
      </div>
    </div>
    
    <div class="add-location" @click="showAddLocation = true">
      <i class="fas fa-plus"></i>
    </div>
    
    <!-- 添加位置弹窗 -->
    <van-popup v-model:show="showAddLocation" position="bottom" round :style="{ height: '50%' }">
      <div class="popup-header">
        <h3>添加位置</h3>
        <i class="fas fa-times" @click="showAddLocation = false"></i>
      </div>
      
      <div class="search-bar">
        <van-search
          v-model="searchQuery"
          placeholder="搜索城市"
          @search="searchLocations"
          @update:model-value="searchLocations"
        />
      </div>
      
      <div class="search-results">
        <div class="search-item" v-for="(result, index) in searchResults" :key="index" @click="addLocation(result)">
          <div>{{ result.name }}</div>
          <i class="fas fa-plus"></i>
        </div>
        <div class="no-results" v-if="searchResults.length === 0 && searchQuery">
          未找到匹配的城市
        </div>
      </div>
    </van-popup>
    
    <!-- 位置选项弹窗 -->
    <van-popup v-model:show="showOptions" position="bottom" round :style="{ height: '30%' }">
      <div class="popup-header">
        <h3>位置选项</h3>
        <i class="fas fa-times" @click="showOptions = false"></i>
      </div>
      
      <div class="options-list">
        <div class="option-item" @click="refreshLocations">
          <i class="fas fa-sync-alt"></i>
          <span>刷新所有位置</span>
        </div>
        <div class="option-item" @click="showDeleteMode = true; showOptions = false">
          <i class="fas fa-trash"></i>
          <span>删除位置</span>
        </div>
      </div>
    </van-popup>
    
    <!-- 删除模式 -->
    <div class="delete-mode" v-if="showDeleteMode">
      <div class="delete-header">
        <span>选择要删除的位置</span>
        <span class="delete-done" @click="showDeleteMode = false">完成</span>
      </div>
      
      <div class="location-list">
        <div class="location-item" v-for="(location, index) in locations" :key="index">
          <div class="location-info">
            <div class="location-name">
              {{ location.name }}
              <i class="fas fa-map-marker-alt" style="color: #4a90e2;" v-if="isCurrentLocation(location)"></i>
            </div>
            <div class="location-weather">{{ location.weather }}</div>
          </div>
          <div class="delete-button" @click="deleteLocation(location)" v-if="!isCurrentLocation(location)">
            <i class="fas fa-trash"></i>
          </div>
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
      <div class="nav-item active">
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
import { convertTemperature } from '@/utils/helpers'
import weatherApi from '@/api/weather'

export default {
  name: 'LocationsView',
  setup() {
    const store = useStore()
    const router = useRouter()
    const currentTime = ref('00:00')
    const showAddLocation = ref(false)
    const showOptions = ref(false)
    const showDeleteMode = ref(false)
    const searchQuery = ref('')
    const searchResults = ref([])
    
    // 获取当前位置
    const currentLocation = computed(() => store.getters.getCurrentLocation)
    
    // 获取所有位置
    const locations = computed(() => store.getters.getLocations)
    
    // 获取设置
    const settings = computed(() => store.getters.getSettings)
    
    // 检查是否为当前位置
    const isCurrentLocation = (location) => {
      return location.name === currentLocation.value.name
    }
    
    // 格式化温度
    const formatTemp = (temp) => {
      const convertedTemp = convertTemperature(temp, settings.value.tempUnit)
      const unit = settings.value.tempUnit === 'fahrenheit' ? '°F' : '°'
      return `${convertedTemp}${unit}`
    }
    
    // 更新当前时间
    const updateCurrentTime = () => {
      const now = new Date()
      const hours = now.getHours().toString().padStart(2, '0')
      const minutes = now.getMinutes().toString().padStart(2, '0')
      currentTime.value = `${hours}:${minutes}`
    }
    
    // 搜索位置
    const searchLocations = async () => {
      if (searchQuery.value.trim() === '') {
        searchResults.value = []
        return
      }
      
      try {
        const results = await weatherApi.searchLocation(searchQuery.value)
        searchResults.value = results
      } catch (error) {
        console.error('搜索位置失败:', error)
        searchResults.value = []
      }
    }
    
    // 添加位置
    const addLocation = (location) => {
      // 检查是否已存在
      const exists = locations.value.some(loc => loc.name === location.name)
      if (!exists) {
        store.commit('addLocation', {
          ...location,
          weather: '获取中...',
          temperature: 0
        })
        
        // 模拟获取天气数据
        setTimeout(() => {
          const updatedLocations = [...locations.value]
          const index = updatedLocations.findIndex(loc => loc.name === location.name)
          if (index !== -1) {
            updatedLocations[index] = {
              ...updatedLocations[index],
              weather: '晴朗',
              temperature: 25
            }
            // 这里应该使用更新位置的mutation，但为了简单起见，我们直接更新整个数组
            store.commit('updateLocations', updatedLocations)
          }
        }, 1000)
      }
      
      showAddLocation.value = false
      searchQuery.value = ''
      searchResults.value = []
    }
    
    // 选择位置
    const selectLocation = (location) => {
      if (!showDeleteMode.value) {
        store.commit('setCurrentLocation', location)
        store.dispatch('fetchWeatherData', location)
        router.push('/')
      }
    }
    
    // 删除位置
    const deleteLocation = (location) => {
      if (!isCurrentLocation(location)) {
        store.commit('removeLocation', location.name)
      }
    }
    
    // 刷新所有位置
    const refreshLocations = () => {
      // 这里应该调用API刷新所有位置的天气数据
      // 但为了简单起见，我们只是关闭选项弹窗
      showOptions.value = false
    }
    
    // 导航函数
    const goToHome = () => router.push('/')
    const goToForecast = () => router.push('/forecast')
    const goToSettings = () => router.push('/settings')
    
    onMounted(() => {
      // 更新当前时间
      updateCurrentTime()
      setInterval(updateCurrentTime, 60000)
    })
    
    return {
      currentLocation,
      locations,
      currentTime,
      showAddLocation,
      showOptions,
      showDeleteMode,
      searchQuery,
      searchResults,
      isCurrentLocation,
      formatTemp,
      searchLocations,
      addLocation,
      selectLocation,
      deleteLocation,
      refreshLocations,
      goToHome,
      goToForecast,
      goToSettings
    }
  }
}
</script>

<style scoped>
.locations-screen {
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

.locations-header {
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
}

.location-list {
  margin-top: 10px;
}

.location-item {
  padding: 15px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.location-info {
  display: flex;
  flex-direction: column;
}

.location-name {
  font-weight: bold;
  margin-bottom: 5px;
}

.location-weather {
  color: #888;
  font-size: 14px;
}

.location-temp {
  font-size: 20px;
  font-weight: bold;
}

.add-location {
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 50px;
  height: 50px;
  background-color: #4a90e2;
  color: white;
  border-radius: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
}

.popup-header {
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
}

.search-bar {
  padding: 10px 15px;
}

.search-results {
  padding: 0 15px;
}

.search-item {
  padding: 15px 0;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.no-results {
  padding: 20px 0;
  text-align: center;
  color: #888;
}

.options-list {
  padding: 15px;
}

.option-item {
  padding: 15px 0;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #eee;
}

.option-item i {
  margin-right: 10px;
  color: #4a90e2;
}

.delete-mode {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: white;
  z-index: 10;
}

.delete-header {
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
}

.delete-done {
  color: #4a90e2;
  font-weight: bold;
}

.delete-button {
  color: #ff4d4f;
  font-size: 18px;
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
  z-index: 5;
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