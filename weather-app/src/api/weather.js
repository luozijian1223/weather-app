import axios from 'axios'

// 这里使用模拟数据，实际开发中应该使用真实的天气API
// 例如和风天气API、OpenWeatherMap等

// 模拟API请求延迟
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export default {
  // 获取当前天气
  async getCurrentWeather(location) {
    // 模拟API请求
    await delay(500)
    
    // 在实际应用中，这里会使用location参数发送请求
    console.log('获取当前天气数据，位置:', location.name)
    
    // 返回模拟数据
    return {
      temperature: 23,
      condition: '晴朗',
      highTemp: 26,
      lowTemp: 18,
      windSpeed: 3,
      humidity: 45,
      sunrise: '6:05'
    }
  },
  
  // 获取小时预报
  async getHourlyForecast(location) {
    await delay(500)
    
    // 在实际应用中，这里会使用location参数发送请求
    console.log('获取小时预报数据，位置:', location.name)
    
    return [
      { time: '现在', icon: 'sun', temp: 23 },
      { time: '11时', icon: 'sun', temp: 24 },
      { time: '12时', icon: 'sun', temp: 25 },
      { time: '13时', icon: 'sun', temp: 26 },
      { time: '14时', icon: 'cloud-sun', temp: 26 },
      { time: '15时', icon: 'cloud-sun', temp: 25 }
    ]
  },
  
  // 获取每日预报
  async getDailyForecast(location) {
    await delay(500)
    
    // 在实际应用中，这里会使用location参数发送请求
    console.log('获取每日预报数据，位置:', location.name)
    
    return [
      { day: '今天', icon: 'sun', lowTemp: 18, highTemp: 26, date: '5月15日', condition: '晴朗，微风，湿度45%' },
      { day: '明天', icon: 'cloud-sun', lowTemp: 17, highTemp: 25, date: '5月16日', condition: '多云间晴，微风，湿度50%' },
      { day: '周三', icon: 'cloud', lowTemp: 16, highTemp: 23, date: '5月17日', condition: '多云，微风，湿度55%' },
      { day: '周四', icon: 'cloud-showers-heavy', lowTemp: 15, highTemp: 22, date: '5月18日', condition: '阵雨，微风，湿度65%' },
      { day: '周五', icon: 'cloud-rain', lowTemp: 14, highTemp: 20, date: '5月19日', condition: '小雨，微风，湿度70%' }
    ]
  },
  
  // 获取天气详情
  async getWeatherDetails(location) {
    await delay(500)
    
    // 在实际应用中，这里会使用location参数发送请求
    console.log('获取天气详情数据，位置:', location.name)
    
    return {
      feelsLike: 24,
      humidity: 45,
      windSpeed: 3,
      pressure: 1013,
      visibility: 10,
      uvIndex: 6
    }
  },
  
  // 获取天气警报
  async getWeatherAlerts(location) {
    await delay(500)
    
    // 在实际应用中，这里会使用location参数发送请求
    console.log('获取天气警报数据，位置:', location.name)
    
    return [
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
    ]
  },
  
  // 搜索位置
  async searchLocation(query) {
    await delay(500)
    
    // 模拟位置搜索结果
    const locations = [
      { name: '北京市', lat: 39.9042, lon: 116.4074 },
      { name: '上海市', lat: 31.2304, lon: 121.4737 },
      { name: '广州市', lat: 23.1291, lon: 113.2644 },
      { name: '深圳市', lat: 22.5431, lon: 114.0579 },
      { name: '成都市', lat: 30.5728, lon: 104.0668 }
    ]
    
    // 简单的模糊匹配
    return locations.filter(loc => loc.name.includes(query))
  }
} 