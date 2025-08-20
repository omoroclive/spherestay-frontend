import axios from 'axios'
import { toast } from 'react-toastify'

// Get API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
console.log('API Base URL:', API_BASE_URL)

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Include cookies if needed
})

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Log request for debugging
    console.log(`Making ${config.method?.toUpperCase()} request to:`, config.url)
    
    return config
  },
  (error) => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor - Handle responses and errors globally
api.interceptors.response.use(
  (response) => {
    // Log successful responses for debugging
    console.log('Response received:', response.status, response.config.url)
    return response
  },
  (error) => {
    console.error('Response interceptor error:', error.response?.status, error.config?.url)
    
    // Handle different error scenarios
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    } else if (error.response?.status === 403) {
      // Forbidden
      toast.error('You do not have permission to perform this action')
    } else if (error.response?.status >= 500) {
      // Server error
      toast.error('Server error. Please try again later.')
    }
    
    return Promise.reject(error)
  }
)

// Auth service functions
export const authService = {
  // Register user
  register: async (userData) => {
    try {
      const response = await api.post('/api/users/signup', userData)
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
      }
      
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Registration failed'
      toast.error(message)
      throw error
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/api/users/login', credentials)
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
      }
      
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed'
      toast.error(message)
      throw error
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }
      
      const response = await api.get('/api/users/me')
      return response.data.user || response.data.data?.user
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token')
      }
      throw error
    }
  },

  // Logout user
  logout: async () => {
    try {
      // Optional: Call backend logout endpoint if you have one
      // await api.post('/api/users/logout')
      
      localStorage.removeItem('token')
      return true
    } catch (error) {
      // Even if backend call fails, remove token locally
      localStorage.removeItem('token')
      throw error
    }
  },

  // Request password reset
  requestPasswordReset: async (email) => {
    try {
      const response = await api.post('/api/users/forgotPassword', { email })
      toast.success('Password reset link sent to your email')
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to send reset link'
      toast.error(message)
      throw error
    }
  },

  // Reset password
  resetPassword: async ({ token, password, passwordConfirm }) => {
    try {
      const response = await api.patch(`/api/users/resetPassword/${token}`, { 
        password, 
        passwordConfirm 
      })
      toast.success('Password reset successfully')
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Password reset failed'
      toast.error(message)
      throw error
    }
  },

  // Update profile
  updateProfile: async (userData) => {
    try {
      const response = await api.patch('/api/users/updateMe', userData)
      toast.success('Profile updated successfully')
      return response.data.user || response.data.data?.user
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Update failed'
      toast.error(message)
      throw error
    }
  },

  // Update password
  updatePassword: async ({ passwordCurrent, password, passwordConfirm }) => {
    try {
      const response = await api.patch('/api/users/updateMyPassword', {
        passwordCurrent,
        password,
        passwordConfirm
      })
      toast.success('Password updated successfully')
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Password update failed'
      toast.error(message)
      throw error
    }
  },

  // Upload profile photo
  uploadPhoto: async (formData) => {
    try {
      const response = await api.patch('/api/users/uploadPhoto', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      toast.success('Photo uploaded successfully')
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Photo upload failed'
      toast.error(message)
      throw error
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token')
    return !!token
  },

  // Get token
  getToken: () => {
    return localStorage.getItem('token')
  }
}

// Export the configured axios instance for direct use if needed
export { api }

// Default export
export default authService