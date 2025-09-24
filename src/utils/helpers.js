import { TIME_CONSTANTS } from './constants'

// Date and Time Utilities
export const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export const formatTime = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const formatDateTime = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const formatDuration = (minutes) => {
  if (!minutes) return '0 min'
  
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  
  if (hours === 0) return `${mins} min`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}min`
}

export const addMinutes = (date, minutes) => {
  return new Date(date.getTime() + minutes * 60000)
}

export const isWithinTimeWindow = (examDateTime, windowMinutes = TIME_CONSTANTS.EXAM_LAUNCH_WINDOW) => {
  const now = new Date()
  const examTime = new Date(examDateTime)
  const windowEnd = addMinutes(examTime, windowMinutes)
  
  return now >= examTime && now <= windowEnd
}

export const getTimeUntilExam = (examDateTime) => {
  const now = new Date()
  const examTime = new Date(examDateTime)
  const diff = examTime.getTime() - now.getTime()
  
  if (diff <= 0) return null
  
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  return { hours, minutes, total: diff }
}

// File Utilities
export const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'
  
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
}

export const validateFileType = (file, allowedTypes) => {
  return allowedTypes.some(type => 
    file.type === type || file.name.toLowerCase().endsWith(type.replace('application/', '.'))
  )
}

export const validateFileSize = (file, maxSize) => {
  return file.size <= maxSize
}

// String Utilities
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export const capitalizeFirst = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')
}

// Array Utilities
export const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const group = item[key]
    groups[group] = groups[group] || []
    groups[group].push(item)
    return groups
  }, {})
}

export const sortBy = (array, key, direction = 'asc') => {
  return [...array].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    
    if (direction === 'desc') {
      return bVal > aVal ? 1 : -1
    }
    return aVal > bVal ? 1 : -1
  })
}

// URL Utilities
export const generateExamUrl = (examId, baseUrl = window.location.origin) => {
  return `${baseUrl}/exam/${examId}`
}

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    return true
  }
}

// Device Detection
export const getDeviceInfo = () => {
  const userAgent = navigator.userAgent
  const platform = navigator.platform
  
  const isWindows = platform.indexOf('Win') > -1
  const isMac = platform.indexOf('Mac') > -1
  const isLinux = platform.indexOf('Linux') > -1
  const isIOS = /iPad|iPhone|iPod/.test(userAgent)
  const isAndroid = /Android/.test(userAgent)
  
  const isChrome = /Chrome/.test(userAgent) && !/Edge/.test(userAgent)
  const isFirefox = /Firefox/.test(userAgent)
  const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent)
  const isEdge = /Edge/.test(userAgent)
  
  return {
    os: {
      windows: isWindows,
      mac: isMac,
      linux: isLinux,
      ios: isIOS,
      android: isAndroid
    },
    browser: {
      chrome: isChrome,
      firefox: isFirefox,
      safari: isSafari,
      edge: isEdge
    },
    isMobile: isIOS || isAndroid,
    isDesktop: isWindows || isMac || isLinux
  }
}

// Network Utilities
export const checkInternetSpeed = async () => {
  const startTime = Date.now()
  const downloadSize = 1024 * 1024 // 1MB test file
  
  try {
    // This would need to be replaced with an actual speed test endpoint
    const response = await fetch('/api/speed-test', {
      cache: 'no-cache'
    })
    
    if (!response.ok) throw new Error('Speed test failed')
    
    const endTime = Date.now()
    const duration = (endTime - startTime) / 1000 // seconds
    const speedMbps = (downloadSize * 8) / (duration * 1024 * 1024)
    
    return {
      speed: Math.round(speedMbps * 100) / 100,
      duration,
      success: true
    }
  } catch (error) {
    return {
      speed: 0,
      duration: 0,
      success: false,
      error: error.message
    }
  }
}

// Local Storage Utilities
export const storage = {
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error('Error saving to localStorage:', error)
      return false
    }
  },
  
  get: (key) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return null
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error('Error removing from localStorage:', error)
      return false
    }
  },
  
  clear: () => {
    try {
      localStorage.clear()
      return true
    } catch (error) {
      console.error('Error clearing localStorage:', error)
      return false
    }
  }
}

// Error Handling
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response
    
    switch (status) {
      case 401:
        return 'Session expired. Please login again.'
      case 403:
        return 'You do not have permission to perform this action.'
      case 404:
        return 'The requested resource was not found.'
      case 422:
        return data.message || 'Invalid data provided.'
      case 500:
        return 'Server error. Please try again later.'
      default:
        return data.message || `Error ${status}: Something went wrong.`
    }
  } else if (error.request) {
    // Network error
    return 'Network error. Please check your connection.'
  } else {
    // Other error
    return error.message || 'An unexpected error occurred.'
  }
}

// Debounce function
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Throttle function
export const throttle = (func, limit) => {
  let inThrottle
  return function() {
    const args = arguments
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

export default {
  formatDate,
  formatTime,
  formatDateTime,
  formatDuration,
  addMinutes,
  isWithinTimeWindow,
  getTimeUntilExam,
  formatFileSize,
  validateFileType,
  validateFileSize,
  truncateText,
  capitalizeFirst,
  generateSlug,
  groupBy,
  sortBy,
  generateExamUrl,
  copyToClipboard,
  getDeviceInfo,
  checkInternetSpeed,
  storage,
  handleApiError,
  debounce,
  throttle
}