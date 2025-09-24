import { apiRequest, handleRequest } from './api'
import { TOKEN_KEY, REFRESH_TOKEN_KEY } from '../utils/constants'
import { storage } from '../utils/helpers'

// Authentication service
export const authService = {
  // Login teacher
  login: async (credentials) => {
    return handleRequest(() => 
      apiRequest.post('/auth/login/', credentials)
    )
  },

  // Register teacher
  register: async (userData) => {
    return handleRequest(() => 
      apiRequest.post('/auth/register/', userData)
    )
  },

  // Refresh token
  refresh: async (refreshToken) => {
    return handleRequest(() => 
      apiRequest.post('/auth/refresh/', { refresh: refreshToken })
    )
  },

  // Logout
  logout: async () => {
    const refreshToken = storage.get(REFRESH_TOKEN_KEY)
    
    if (refreshToken) {
      try {
        await apiRequest.post('/auth/logout/', { refresh: refreshToken })
      } catch (error) {
        console.error('Logout API call failed:', error)
      }
    }
    
    // Clear tokens regardless of API call success
    storage.remove(TOKEN_KEY)
    storage.remove(REFRESH_TOKEN_KEY)
    
    return { success: true }
  },

  // Get current user profile
  getProfile: async () => {
    return handleRequest(() => 
      apiRequest.get('/auth/profile/')
    )
  },

  // Update profile
  updateProfile: async (profileData) => {
    return handleRequest(() => 
      apiRequest.put('/auth/profile/', profileData)
    )
  },

  // Change password
  changePassword: async (passwordData) => {
    return handleRequest(() => 
      apiRequest.post('/auth/change-password/', passwordData)
    )
  },

  // Forgot password
  forgotPassword: async (email) => {
    return handleRequest(() => 
      apiRequest.post('/auth/forgot-password/', { email })
    )
  },

  // Reset password
  resetPassword: async (token, password) => {
    return handleRequest(() => 
      apiRequest.post('/auth/reset-password/', { token, password })
    )
  },

  // Verify email
  verifyEmail: async (token) => {
    return handleRequest(() => 
      apiRequest.post('/auth/verify-email/', { token })
    )
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = storage.get(TOKEN_KEY)
    return !!token
  },

  // Get stored token
  getToken: () => {
    return storage.get(TOKEN_KEY)
  },

  // Get stored refresh token
  getRefreshToken: () => {
    return storage.get(REFRESH_TOKEN_KEY)
  },

  // Set tokens
  setTokens: (accessToken, refreshToken) => {
    storage.set(TOKEN_KEY, accessToken)
    if (refreshToken) {
      storage.set(REFRESH_TOKEN_KEY, refreshToken)
    }
  },

  // Clear tokens
  clearTokens: () => {
    storage.remove(TOKEN_KEY)
    storage.remove(REFRESH_TOKEN_KEY)
  }
}

export default authService;