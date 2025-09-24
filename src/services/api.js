import axios from 'axios'
import { API_BASE_URL, TOKEN_KEY, REFRESH_TOKEN_KEY } from '../utils/constants'
import { handleApiError, storage } from '../utils/helpers'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = storage.get(TOKEN_KEY)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = storage.get(REFRESH_TOKEN_KEY)
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
            refresh: refreshToken
          })

          const { access } = response.data
          storage.set(TOKEN_KEY, access)
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${access}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        storage.remove(TOKEN_KEY)
        storage.remove(REFRESH_TOKEN_KEY)
        window.location.href = '/teacher/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// API methods
export const apiRequest = {
  get: (url, config = {}) => api.get(url, config),
  post: (url, data = {}, config = {}) => api.post(url, data, config),
  put: (url, data = {}, config = {}) => api.put(url, data, config),
  patch: (url, data = {}, config = {}) => api.patch(url, data, config),
  delete: (url, config = {}) => api.delete(url, config),
}

// File upload helper
export const uploadFile = (url, file, onUploadProgress = null) => {
  const formData = new FormData()
  formData.append('file', file)
  
  return api.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: onUploadProgress ? (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
      onUploadProgress(percentCompleted)
    } : undefined,
  })
}

// Error handler wrapper
export const handleRequest = async (requestFn) => {
  try {
    const response = await requestFn()
    return {
      success: true,
      data: response.data,
      error: null
    }
  } catch (error) {
    return {
      success: false,
      data: null,
      error: handleApiError(error)
    }
  }
}

export default api;