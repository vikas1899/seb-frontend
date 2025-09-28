// src/services/auth.js
import { apiRequest, handleRequest } from './api'
import { TOKEN_KEY, REFRESH_TOKEN_KEY } from '../utils/constants'
import { storage } from '../utils/helpers'

// Authentication service - Updated to match API documentation
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
      apiRequest.post('/auth/token/refresh/', { refresh: refreshToken })
    )
  },

  // Logout - Updated endpoint
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
    authService.clearTokens()
    
    return { success: true }
  },

  // Get current user profile
  getProfile: async () => {
    return handleRequest(() => 
      apiRequest.get('/auth/profile/')
    )
  },

  // Update profile - Updated endpoint
  updateProfile: async (profileData) => {
    return handleRequest(() => 
      apiRequest.put('/auth/profile/update/', profileData)
    )
  },

  // Change password - Removed (not in API docs)
  // changePassword: async (passwordData) => {
  //   return handleRequest(() => 
  //     apiRequest.post('/auth/change-password/', passwordData)
  //   )
  // },

  // Forgot password - Removed (not in API docs)
  // forgotPassword: async (email) => {
  //   return handleRequest(() => 
  //     apiRequest.post('/auth/forgot-password/', { email })
  //   )
  // },

  // Reset password - Removed (not in API docs)
  // resetPassword: async (token, password) => {
  //   return handleRequest(() => 
  //     apiRequest.post('/auth/reset-password/', { token, password })
  //   )
  // },

  // Verify email - Removed (not in API docs)
  // verifyEmail: async (token) => {
  //   return handleRequest(() => 
  //     apiRequest.post('/auth/verify-email/', { token })
  //   )
  // },

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

  // Set tokens - Fixed to handle object response from API
  setTokens: (accessToken, refreshToken) => {
    if (typeof accessToken === 'object' && accessToken.tokens) {
      // Handle API response format: { tokens: { access: "...", refresh: "..." } }
      storage.set(TOKEN_KEY, accessToken.tokens.access)
      storage.set(REFRESH_TOKEN_KEY, accessToken.tokens.refresh)
    } else {
      // Handle direct token values
      storage.set(TOKEN_KEY, accessToken)
      if (refreshToken) {
        storage.set(REFRESH_TOKEN_KEY, refreshToken)
      }
    }
  },

  // Clear tokens
  clearTokens: () => {
    storage.remove(TOKEN_KEY)
    storage.remove(REFRESH_TOKEN_KEY)
  }
}

export default authService;