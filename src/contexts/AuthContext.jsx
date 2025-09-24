import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { authService } from '../services/auth'
import { TOKEN_KEY, REFRESH_TOKEN_KEY } from '../utils/constants'
import { storage } from '../utils/helpers'

// Auth context
const AuthContext = createContext()

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        loading: false,
        error: null
      }
    
    case 'LOGIN_FAILURE':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: action.payload
      }
    
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null
      }
    
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      }
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      }
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      }
    
    default:
      return state
  }
}

// Initial state
const initialState = {
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null
}

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Initialize auth state on app load
  useEffect(() => {
    const initAuth = async () => {
      const token = storage.get(TOKEN_KEY)
      
      if (token) {
        try {
          const response = await authService.getProfile()
          if (response.success) {
            dispatch({
              type: 'LOGIN_SUCCESS',
              payload: { user: response.data }
            })
          } else {
            // Token exists but invalid
            authService.clearTokens()
            dispatch({ type: 'LOGOUT' })
          }
        } catch (error) {
          authService.clearTokens()
          dispatch({ type: 'LOGOUT' })
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    initAuth()
  }, [])

  // Login function
  const login = async (credentials) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'CLEAR_ERROR' })

    try {
      const response = await authService.login(credentials)
      
      if (response.success) {
        const { access_token, refresh_token, user } = response.data
        
        // Store tokens
        authService.setTokens(access_token, refresh_token)
        
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user }
        })
        
        return { success: true }
      } else {
        dispatch({
          type: 'LOGIN_FAILURE',
          payload: response.error
        })
        return { success: false, error: response.error }
      }
    } catch (error) {
      const errorMessage = 'Login failed. Please try again.'
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: errorMessage
      })
      return { success: false, error: errorMessage }
    }
  }

  // Register function
  const register = async (userData) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'CLEAR_ERROR' })

    try {
      const response = await authService.register(userData)
      
      if (response.success) {
        const { access_token, refresh_token, user } = response.data
        
        // Store tokens
        authService.setTokens(access_token, refresh_token)
        
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user }
        })
        
        return { success: true }
      } else {
        dispatch({
          type: 'SET_ERROR',
          payload: response.error
        })
        return { success: false, error: response.error }
      }
    } catch (error) {
      const errorMessage = 'Registration failed. Please try again.'
      dispatch({
        type: 'SET_ERROR',
        payload: errorMessage
      })
      return { success: false, error: errorMessage }
    }
  }

  // Logout function
  const logout = async () => {
    dispatch({ type: 'SET_LOADING', payload: true })

    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      dispatch({ type: 'LOGOUT' })
    }
  }

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      const response = await authService.updateProfile(profileData)
      
      if (response.success) {
        dispatch({
          type: 'UPDATE_USER',
          payload: response.data
        })
        return { success: true }
      } else {
        return { success: false, error: response.error }
      }
    } catch (error) {
      return { success: false, error: 'Profile update failed' }
    }
  }

  // Change password
  const changePassword = async (passwordData) => {
    try {
      const response = await authService.changePassword(passwordData)
      return response
    } catch (error) {
      return { success: false, error: 'Password change failed' }
    }
  }

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  const value = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    clearError
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}