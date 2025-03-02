import { createStore } from 'vuex'

export default createStore({
  state: {
    currentLocation: {
      name: '北京市',
      lat: 39.9042,
      lon: 116.4074
    },
    locations: [
      {
        name: '北京市',
        lat: 39.9042,
        lon: 116.4074,
        weather: '晴朗',
        temperature: 23
      },
      {
        name: '上海市',
        lat: 31.2304,
        lon: 121.4737,
        weather: '多云',
        temperature: 25
      },
      {
        name: '广州市',
        lat: 23.1291,
        lon: 113.2644,
        weather: '小雨',
        temperature: 28
      },
      {
        name: '深圳市',
        lat: 22.5431,
        lon: 114.0579,
        weather: '阵雨',
        temperature: 27
      },
      {
        name: '成都市',
        lat: 30.5728,
        lon: 104.0668,
        weather: '多云',
        temperature: 22
      }
    ],
    currentWeather: {
      temperature: 23,
      condition: '晴朗',
      highTemp: 26,
      lowTemp: 18,
      windSpeed: 3,
      humidity: 45,
      sunrise: '6:05'
    },
    hourlyForecast: [
      { time: '现在', icon: 'sun', temp: 23 },
      { time: '11时', icon: 'sun', temp: 24 },
      { time: '12时', icon: 'sun', temp: 25 },
      { time: '13时', icon: 'sun', temp: 26 },
      { time: '14时', icon: 'cloud-sun', temp: 26 },
      { time: '15时', icon: 'cloud-sun', temp: 25 }
    ],
    dailyForecast: [
      { day: '今天', icon: 'sun', lowTemp: 18, highTemp: 26, date: '5月15日', condition: '晴朗，微风，湿度45%' },
      { day: '明天', icon: 'cloud-sun', lowTemp: 17, highTemp: 25, date: '5月16日', condition: '多云间晴，微风，湿度50%' },
      { day: '周三', icon: 'cloud', lowTemp: 16, highTemp: 23, date: '5月17日', condition: '多云，微风，湿度55%' },
      { day: '周四', icon: 'cloud-showers-heavy', lowTemp: 15, highTemp: 22, date: '5月18日', condition: '阵雨，微风，湿度65%' },
      { day: '周五', icon: 'cloud-rain', lowTemp: 14, highTemp: 20, date: '5月19日', condition: '小雨，微风，湿度70%' }
    ],
    weatherDetails: {
      feelsLike: 24,
      humidity: 45,
      windSpeed: 3,
      pressure: 1013,
      visibility: 10,
      uvIndex: 6
    },
    alerts: [
      {
        title: '强降雨预警',
        time: '今天 14:30',
        content: '预计今天下午将有强降雨，请注意防范可能引发的山洪、滑坡、泥石流等灾害。'
      },
      {
        title: '高温预警',
        time: '明天 08:00',
        content: '预计明天最高气温将达到35℃以上，请注意防暑降温，避免长时间户外活动。'
      },
      {
        title: '空气质量提醒',
        time: '今天 07:00',
        content: '今日空气质量良好，适合户外活动。'
      }
    ],
    settings: {
      tempUnit: 'celsius',
      windSpeedUnit: 'kmh',
      timeFormat: '24h',
      distanceUnit: 'km',
      notifications: {
        weatherAlerts: true,
        dailyForecast: true,
        extremeWeather: true
      },
      appSettings: {
        autoUpdate: true,
        backgroundRefresh: true,
        dataSource: '气象局'
      }
    }
  },
  getters: {
    getCurrentLocation: state => state.currentLocation,
    getLocations: state => state.locations,
    getCurrentWeather: state => state.currentWeather,
    getHourlyForecast: state => state.hourlyForecast,
    getDailyForecast: state => state.dailyForecast,
    getWeatherDetails: state => state.weatherDetails,
    getAlerts: state => state.alerts,
    getSettings: state => state.settings
  },
  mutations: {
    setCurrentLocation(state, location) {
      state.currentLocation = location
    },
    addLocation(state, location) {
      state.locations.push(location)
    },
    removeLocation(state, locationName) {
      state.locations = state.locations.filter(loc => loc.name !== locationName)
    },
    updateCurrentWeather(state, weather) {
      state.currentWeather = weather
    },
    updateHourlyForecast(state, forecast) {
      state.hourlyForecast = forecast
    },
    updateDailyForecast(state, forecast) {
      state.dailyForecast = forecast
    },
    updateWeatherDetails(state, details) {
      state.weatherDetails = details
    },
    addAlert(state, alert) {
      state.alerts.unshift(alert)
    },
    removeAlert(state, alertTitle) {
      state.alerts = state.alerts.filter(alert => alert.title !== alertTitle)
    },
    updateSettings(state, settings) {
      state.settings = { ...state.settings, ...settings }
    }
  },
  actions: {
    fetchWeatherData({ commit }, location) {
      // 这里将来会调用实际的天气API
      console.log('Fetching weather data for', location)
      // 模拟API调用
      setTimeout(() => {
        // 更新当前天气
        commit('updateCurrentWeather', {
          temperature: 23,
          condition: '晴朗',
          highTemp: 26,
          lowTemp: 18,
          windSpeed: 3,
          humidity: 45,
          sunrise: '6:05'
        })
        // 更新小时预报
        commit('updateHourlyForecast', [
          { time: '现在', icon: 'sun', temp: 23 },
          { time: '11时', icon: 'sun', temp: 24 },
          { time: '12时', icon: 'sun', temp: 25 },
          { time: '13时', icon: 'sun', temp: 26 },
          { time: '14时', icon: 'cloud-sun', temp: 26 },
          { time: '15时', icon: 'cloud-sun', temp: 25 }
        ])
        // 更新每日预报
        commit('updateDailyForecast', [
          { day: '今天', icon: 'sun', lowTemp: 18, highTemp: 26, date: '5月15日', condition: '晴朗，微风，湿度45%' },
          { day: '明天', icon: 'cloud-sun', lowTemp: 17, highTemp: 25, date: '5月16日', condition: '多云间晴，微风，湿度50%' },
          { day: '周三', icon: 'cloud', lowTemp: 16, highTemp: 23, date: '5月17日', condition: '多云，微风，湿度55%' },
          { day: '周四', icon: 'cloud-showers-heavy', lowTemp: 15, highTemp: 22, date: '5月18日', condition: '阵雨，微风，湿度65%' },
          { day: '周五', icon: 'cloud-rain', lowTemp: 14, highTemp: 20, date: '5月19日', condition: '小雨，微风，湿度70%' }
        ])
        // 更新天气详情
        commit('updateWeatherDetails', {
          feelsLike: 24,
          humidity: 45,
          windSpeed: 3,
          pressure: 1013,
          visibility: 10,
          uvIndex: 6
        })
      }, 500)
    }
  }
}) 