// 温度单位转换
export const convertTemperature = (temp, unit) => {
  if (unit === 'fahrenheit') {
    return Math.round((temp * 9/5) + 32)
  }
  return temp
}

// 风速单位转换
export const convertWindSpeed = (speed, unit) => {
  switch (unit) {
    case 'mph':
      return Math.round(speed * 0.621371)
    case 'ms':
      return Math.round(speed * 0.277778)
    default:
      return speed
  }
}

// 距离单位转换
export const convertDistance = (distance, unit) => {
  if (unit === 'miles') {
    return Math.round(distance * 0.621371 * 10) / 10
  }
  return distance
}

// 时间格式转换
export const formatTime = (time, format) => {
  if (!time) return ''
  
  const [hours, minutes] = time.split(':').map(Number)
  
  if (format === '12h') {
    const period = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours % 12 || 12
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
  }
  
  return time
}

// 获取天气图标
export const getWeatherIcon = (condition) => {
  const iconMap = {
    'sun': 'fas fa-sun',
    'cloud-sun': 'fas fa-cloud-sun',
    'cloud': 'fas fa-cloud',
    'cloud-showers-heavy': 'fas fa-cloud-showers-heavy',
    'cloud-rain': 'fas fa-cloud-rain',
    'bolt': 'fas fa-bolt',
    'snowflake': 'fas fa-snowflake',
    'smog': 'fas fa-smog',
    'wind': 'fas fa-wind'
  }
  
  return iconMap[condition] || 'fas fa-sun'
}

// 获取天气背景色
export const getWeatherBackground = (condition) => {
  const backgroundMap = {
    'sun': 'linear-gradient(to bottom, #4a90e2, #87cefa)',
    'cloud-sun': 'linear-gradient(to bottom, #5d9eed, #a2d0fa)',
    'cloud': 'linear-gradient(to bottom, #7a9ebd, #b8c9d9)',
    'cloud-showers-heavy': 'linear-gradient(to bottom, #5d7394, #9eaec1)',
    'cloud-rain': 'linear-gradient(to bottom, #4d6280, #8e9eb1)',
    'bolt': 'linear-gradient(to bottom, #4a5568, #718096)',
    'snowflake': 'linear-gradient(to bottom, #718096, #cbd5e0)',
    'smog': 'linear-gradient(to bottom, #718096, #a0aec0)',
    'wind': 'linear-gradient(to bottom, #4a6fa5, #8bb0d9)'
  }
  
  return backgroundMap[condition] || 'linear-gradient(to bottom, #4a90e2, #87cefa)'
}

// 获取生活建议
export const getLifeSuggestions = (weather) => {
  const { temperature, condition, windSpeed } = weather
  
  // 穿衣建议
  let clothingSuggestion = ''
  if (temperature >= 30) {
    clothingSuggestion = '天气炎热，建议穿着轻薄、透气的衣物。'
  } else if (temperature >= 20) {
    clothingSuggestion = '天气温暖，建议穿着轻薄的衣物。'
  } else if (temperature >= 10) {
    clothingSuggestion = '天气凉爽，建议穿着长袖衣物。'
  } else if (temperature >= 0) {
    clothingSuggestion = '天气较冷，建议穿着保暖外套。'
  } else {
    clothingSuggestion = '天气寒冷，建议穿着厚重的保暖衣物。'
  }
  
  // 运动建议
  let sportSuggestion = ''
  if (condition === 'sun' && temperature < 30 && windSpeed < 5) {
    sportSuggestion = '天气适宜，是户外运动的好时机。'
  } else if (condition === 'cloud-sun' && temperature < 28) {
    sportSuggestion = '天气较好，适合户外运动。'
  } else if (condition === 'cloud') {
    sportSuggestion = '天气一般，可以进行户外运动。'
  } else if (['cloud-showers-heavy', 'cloud-rain', 'bolt'].includes(condition)) {
    sportSuggestion = '天气不佳，建议在室内进行运动。'
  } else if (temperature >= 30) {
    sportSuggestion = '天气炎热，建议避免剧烈运动，注意防暑。'
  } else if (temperature <= 0) {
    sportSuggestion = '天气寒冷，建议在室内进行运动。'
  }
  
  // 出行建议
  let travelSuggestion = ''
  if (['sun', 'cloud-sun', 'cloud'].includes(condition) && windSpeed < 5) {
    travelSuggestion = '天气良好，适合外出活动。'
  } else if (['cloud-showers-heavy', 'cloud-rain'].includes(condition)) {
    travelSuggestion = '有雨，外出请携带雨具。'
  } else if (condition === 'bolt') {
    travelSuggestion = '有雷雨，尽量避免外出。'
  } else if (condition === 'snowflake') {
    travelSuggestion = '有雪，道路可能湿滑，出行注意安全。'
  } else if (windSpeed >= 8) {
    travelSuggestion = '风力较大，外出注意防风。'
  }
  
  return {
    clothing: clothingSuggestion,
    sport: sportSuggestion,
    travel: travelSuggestion
  }
} 