<template>
  <div class="settings-screen">
    <div class="status-bar">
      <span>{{ currentTime }}</span>
      <div>
        <i class="fas fa-signal"></i>
        <i class="fas fa-wifi"></i>
        <i class="fas fa-battery-full"></i>
      </div>
    </div>
    
    <div class="settings-header">
      <h2>设置</h2>
    </div>
    
    <div class="settings-group">
      <div class="settings-group-title">通用设置</div>
      
      <div class="settings-item" @click="showTempUnitPicker = true">
        <div>温度单位</div>
        <div>{{ getTempUnitText }}</div>
      </div>
      
      <div class="settings-item" @click="showWindSpeedUnitPicker = true">
        <div>风速单位</div>
        <div>{{ getWindSpeedUnitText }}</div>
      </div>
      
      <div class="settings-item" @click="showTimeFormatPicker = true">
        <div>时间格式</div>
        <div>{{ getTimeFormatText }}</div>
      </div>
      
      <div class="settings-item" @click="showDistanceUnitPicker = true">
        <div>距离单位</div>
        <div>{{ getDistanceUnitText }}</div>
      </div>
    </div>
    
    <div class="settings-group">
      <div class="settings-group-title">通知设置</div>
      
      <div class="settings-item">
        <div>天气提醒</div>
        <div class="toggle" :class="{ active: settings.notifications.weatherAlerts }" @click="toggleSetting('notifications.weatherAlerts')"></div>
      </div>
      
      <div class="settings-item">
        <div>每日天气预报</div>
        <div class="toggle" :class="{ active: settings.notifications.dailyForecast }" @click="toggleSetting('notifications.dailyForecast')"></div>
      </div>
      
      <div class="settings-item">
        <div>异常天气警报</div>
        <div class="toggle" :class="{ active: settings.notifications.extremeWeather }" @click="toggleSetting('notifications.extremeWeather')"></div>
      </div>
    </div>
    
    <div class="settings-group">
      <div class="settings-group-title">应用设置</div>
      
      <div class="settings-item">
        <div>自动更新</div>
        <div class="toggle" :class="{ active: settings.appSettings.autoUpdate }" @click="toggleSetting('appSettings.autoUpdate')"></div>
      </div>
      
      <div class="settings-item">
        <div>后台刷新</div>
        <div class="toggle" :class="{ active: settings.appSettings.backgroundRefresh }" @click="toggleSetting('appSettings.backgroundRefresh')"></div>
      </div>
      
      <div class="settings-item" @click="showDataSourcePicker = true">
        <div>数据来源</div>
        <div>{{ settings.appSettings.dataSource }}</div>
      </div>
    </div>
    
    <div class="settings-group">
      <div class="settings-group-title">关于</div>
      
      <div class="settings-item">
        <div>版本</div>
        <div>1.0.0</div>
      </div>
      
      <div class="settings-item" @click="showPrivacyPolicy = true">
        <div>隐私政策</div>
        <div><i class="fas fa-chevron-right"></i></div>
      </div>
      
      <div class="settings-item" @click="showTermsOfService = true">
        <div>用户协议</div>
        <div><i class="fas fa-chevron-right"></i></div>
      </div>
    </div>
    
    <!-- 温度单位选择器 -->
    <van-popup v-model:show="showTempUnitPicker" position="bottom" round>
      <van-picker
        :columns="tempUnitOptions"
        @confirm="onTempUnitConfirm"
        @cancel="showTempUnitPicker = false"
        show-toolbar
        title="选择温度单位"
      />
    </van-popup>
    
    <!-- 风速单位选择器 -->
    <van-popup v-model:show="showWindSpeedUnitPicker" position="bottom" round>
      <van-picker
        :columns="windSpeedUnitOptions"
        @confirm="onWindSpeedUnitConfirm"
        @cancel="showWindSpeedUnitPicker = false"
        show-toolbar
        title="选择风速单位"
      />
    </van-popup>
    
    <!-- 时间格式选择器 -->
    <van-popup v-model:show="showTimeFormatPicker" position="bottom" round>
      <van-picker
        :columns="timeFormatOptions"
        @confirm="onTimeFormatConfirm"
        @cancel="showTimeFormatPicker = false"
        show-toolbar
        title="选择时间格式"
      />
    </van-popup>
    
    <!-- 距离单位选择器 -->
    <van-popup v-model:show="showDistanceUnitPicker" position="bottom" round>
      <van-picker
        :columns="distanceUnitOptions"
        @confirm="onDistanceUnitConfirm"
        @cancel="showDistanceUnitPicker = false"
        show-toolbar
        title="选择距离单位"
      />
    </van-popup>
    
    <!-- 数据来源选择器 -->
    <van-popup v-model:show="showDataSourcePicker" position="bottom" round>
      <van-picker
        :columns="dataSourceOptions"
        @confirm="onDataSourceConfirm"
        @cancel="showDataSourcePicker = false"
        show-toolbar
        title="选择数据来源"
      />
    </van-popup>
    
    <!-- 隐私政策弹窗 -->
    <van-popup v-model:show="showPrivacyPolicy" position="bottom" round :style="{ height: '70%' }">
      <div class="popup-header">
        <h3>隐私政策</h3>
        <i class="fas fa-times" @click="showPrivacyPolicy = false"></i>
      </div>
      <div class="popup-content">
        <p>本应用尊重并保护所有使用服务用户的个人隐私权。为了给您提供更准确、更有个性化的服务，本应用会按照本隐私权政策的规定使用和披露您的个人信息。但本应用将以高度的勤勉、审慎义务对待这些信息。除本隐私权政策另有规定外，在未征得您事先许可的情况下，本应用不会将这些信息对外披露或向第三方提供。本应用会不时更新本隐私权政策。您在同意本应用服务使用协议之时，即视为您已经同意本隐私权政策全部内容。</p>
        <p>1. 适用范围</p>
        <p>a) 在您使用本应用网络服务时，本应用自动接收并记录的您的浏览器和计算机上的信息，包括但不限于您的IP地址、浏览器的类型、使用的语言、访问日期和时间、软硬件特征信息及您需求的网页记录等数据；</p>
        <p>b) 本应用通过合法途径从商业伙伴处取得的用户个人数据。</p>
        <p>2. 信息使用</p>
        <p>a) 本应用不会向任何无关第三方提供、出售、出租、分享或交易您的个人信息，除非事先得到您的许可，或该第三方和本应用单独或共同为您提供服务，且在该服务结束后，其将被禁止访问包括其以前能够访问的所有这些资料。</p>
        <p>b) 本应用亦不允许任何第三方以任何手段收集、编辑、出售或者无偿传播您的个人信息。任何本应用平台用户如从事上述活动，一经发现，本应用有权立即终止与该用户的服务协议。</p>
      </div>
    </van-popup>
    
    <!-- 用户协议弹窗 -->
    <van-popup v-model:show="showTermsOfService" position="bottom" round :style="{ height: '70%' }">
      <div class="popup-header">
        <h3>用户协议</h3>
        <i class="fas fa-times" @click="showTermsOfService = false"></i>
      </div>
      <div class="popup-content">
        <p>欢迎您使用本天气应用服务！</p>
        <p>请您仔细阅读以下条款，如果您对本协议的任何条款表示异议，您可以选择不使用本应用。当您使用本应用时，即表示您已经同意遵守本协议的所有条款。</p>
        <p>1. 服务内容</p>
        <p>本应用为用户提供天气预报、实时天气、天气预警等服务。</p>
        <p>2. 用户行为规范</p>
        <p>用户在使用本应用服务时，必须遵守中华人民共和国相关法律法规的规定，不得利用本应用服务进行任何违法或不正当的活动，包括但不限于：</p>
        <p>a) 发布、传送、传播、储存违反国家法律法规禁止的内容；</p>
        <p>b) 发布、传送、传播、储存侵害他人知识产权、商业秘密等合法权利的内容；</p>
        <p>c) 恶意使用本应用服务，导致本应用服务器过度负荷或其他影响本应用正常运行的行为。</p>
        <p>3. 服务的变更、中断或终止</p>
        <p>本应用有权在必要时修改服务条款，本应用服务条款一旦发生变动，将会在重要页面上提示修改内容。如果您继续使用本应用服务，则视为您接受服务条款的变动。</p>
      </div>
    </van-popup>
    
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
      <div class="nav-item active">
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
  name: 'SettingsView',
  setup() {
    const store = useStore()
    const router = useRouter()
    const currentTime = ref('00:00')
    
    // 弹窗控制
    const showTempUnitPicker = ref(false)
    const showWindSpeedUnitPicker = ref(false)
    const showTimeFormatPicker = ref(false)
    const showDistanceUnitPicker = ref(false)
    const showDataSourcePicker = ref(false)
    const showPrivacyPolicy = ref(false)
    const showTermsOfService = ref(false)
    
    // 获取设置
    const settings = computed(() => store.getters.getSettings)
    
    // 选项
    const tempUnitOptions = [
      { text: '摄氏度 (°C)', value: 'celsius' },
      { text: '华氏度 (°F)', value: 'fahrenheit' }
    ]
    
    const windSpeedUnitOptions = [
      { text: '公里/小时 (km/h)', value: 'kmh' },
      { text: '英里/小时 (mph)', value: 'mph' },
      { text: '米/秒 (m/s)', value: 'ms' }
    ]
    
    const timeFormatOptions = [
      { text: '24小时制', value: '24h' },
      { text: '12小时制', value: '12h' }
    ]
    
    const distanceUnitOptions = [
      { text: '公里 (km)', value: 'km' },
      { text: '英里 (mi)', value: 'miles' }
    ]
    
    const dataSourceOptions = [
      { text: '气象局', value: '气象局' },
      { text: '和风天气', value: '和风天气' },
      { text: 'OpenWeatherMap', value: 'OpenWeatherMap' }
    ]
    
    // 获取显示文本
    const getTempUnitText = computed(() => {
      const option = tempUnitOptions.find(opt => opt.value === settings.value.tempUnit)
      return option ? option.text : '摄氏度 (°C)'
    })
    
    const getWindSpeedUnitText = computed(() => {
      const option = windSpeedUnitOptions.find(opt => opt.value === settings.value.windSpeedUnit)
      return option ? option.text : '公里/小时 (km/h)'
    })
    
    const getTimeFormatText = computed(() => {
      const option = timeFormatOptions.find(opt => opt.value === settings.value.timeFormat)
      return option ? option.text : '24小时制'
    })
    
    const getDistanceUnitText = computed(() => {
      const option = distanceUnitOptions.find(opt => opt.value === settings.value.distanceUnit)
      return option ? option.text : '公里 (km)'
    })
    
    // 更新设置
    const updateSetting = (key, value) => {
      const newSettings = { ...settings.value }
      
      // 处理嵌套属性
      if (key.includes('.')) {
        const [parent, child] = key.split('.')
        newSettings[parent] = { ...newSettings[parent], [child]: value }
      } else {
        newSettings[key] = value
      }
      
      store.commit('updateSettings', newSettings)
    }
    
    // 切换开关设置
    const toggleSetting = (key) => {
      const [parent, child] = key.split('.')
      const currentValue = settings.value[parent][child]
      updateSetting(key, !currentValue)
    }
    
    // 选择器确认回调
    const onTempUnitConfirm = (value) => {
      updateSetting('tempUnit', value.value)
      showTempUnitPicker.value = false
    }
    
    const onWindSpeedUnitConfirm = (value) => {
      updateSetting('windSpeedUnit', value.value)
      showWindSpeedUnitPicker.value = false
    }
    
    const onTimeFormatConfirm = (value) => {
      updateSetting('timeFormat', value.value)
      showTimeFormatPicker.value = false
    }
    
    const onDistanceUnitConfirm = (value) => {
      updateSetting('distanceUnit', value.value)
      showDistanceUnitPicker.value = false
    }
    
    const onDataSourceConfirm = (value) => {
      updateSetting('appSettings.dataSource', value.value)
      showDataSourcePicker.value = false
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
    const goToForecast = () => router.push('/forecast')
    const goToLocations = () => router.push('/locations')
    
    onMounted(() => {
      // 更新当前时间
      updateCurrentTime()
      setInterval(updateCurrentTime, 60000)
    })
    
    return {
      settings,
      currentTime,
      showTempUnitPicker,
      showWindSpeedUnitPicker,
      showTimeFormatPicker,
      showDistanceUnitPicker,
      showDataSourcePicker,
      showPrivacyPolicy,
      showTermsOfService,
      tempUnitOptions,
      windSpeedUnitOptions,
      timeFormatOptions,
      distanceUnitOptions,
      dataSourceOptions,
      getTempUnitText,
      getWindSpeedUnitText,
      getTimeFormatText,
      getDistanceUnitText,
      toggleSetting,
      onTempUnitConfirm,
      onWindSpeedUnitConfirm,
      onTimeFormatConfirm,
      onDistanceUnitConfirm,
      onDataSourceConfirm,
      goToHome,
      goToForecast,
      goToLocations
    }
  }
}
</script>

<style scoped>
.settings-screen {
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

.settings-header {
  padding: 15px;
  text-align: center;
  border-bottom: 1px solid #eee;
}

.settings-group {
  margin: 15px 0;
}

.settings-group-title {
  padding: 0 15px;
  margin-bottom: 10px;
  color: #888;
  font-size: 14px;
}

.settings-item {
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
}

.toggle {
  width: 50px;
  height: 30px;
  background-color: #ddd;
  border-radius: 15px;
  position: relative;
  transition: background-color 0.3s;
}

.toggle.active {
  background-color: #4a90e2;
}

.toggle::after {
  content: '';
  position: absolute;
  width: 26px;
  height: 26px;
  background-color: white;
  border-radius: 13px;
  top: 2px;
  left: 2px;
  transition: left 0.3s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

.toggle.active::after {
  left: 22px;
}

.popup-header {
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
}

.popup-content {
  padding: 15px;
  height: calc(100% - 60px);
  overflow-y: auto;
}

.popup-content p {
  margin-bottom: 10px;
  line-height: 1.5;
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