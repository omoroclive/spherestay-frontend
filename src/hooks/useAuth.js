import { useSelector, useDispatch } from 'react-redux'
import { useCallback, useEffect } from 'react'
import {
  registerUser,
  loginUser,
  logoutUser,
  fetchUser,
  forgotPassword,
  resetPassword,
  updateProfile,
  updatePassword,
  clearAuthError,
  clearAuthSuccess,
  resetAuthState,
  setUser,
  setToken
} from '../store/slices/authSlice'

export const useAuth = () => {
  const dispatch = useDispatch()
  
  // Get auth state from Redux store
  const {
    user,
    token,
    loading,
    error,
    success,
    isAuthenticated,
    passwordResetLoading,
    profileUpdateLoading
  } = useSelector((state) => state.auth)

  // Initialize auth state on hook mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (storedToken && !user) {
      dispatch(fetchUser())
    }
  }, [dispatch, user])

  // Auth actions
  const register = useCallback(async (userData) => {
    try {
      const result = await dispatch(registerUser(userData))
      if (result.type === 'auth/register/fulfilled') {
        return { success: true, data: result.payload }
      } else {
        return { success: false, error: result.payload }
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }, [dispatch])

  const login = useCallback(async (credentials) => {
    try {
      const result = await dispatch(loginUser(credentials))
      if (result.type === 'auth/login/fulfilled') {
        return { success: true, data: result.payload }
      } else {
        return { success: false, error: result.payload }
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }, [dispatch])

  const logout = useCallback(async () => {
    try {
      await dispatch(logoutUser())
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }, [dispatch])

  const getCurrentUser = useCallback(async () => {
    try {
      const result = await dispatch(fetchUser())
      if (result.type === 'auth/fetchUser/fulfilled') {
        return { success: true, data: result.payload }
      } else {
        return { success: false, error: result.payload }
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }, [dispatch])

  const requestPasswordReset = useCallback(async (email) => {
    try {
      const result = await dispatch(forgotPassword(email))
      if (result.type === 'auth/forgotPassword/fulfilled') {
        return { success: true, data: result.payload }
      } else {
        return { success: false, error: result.payload }
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }, [dispatch])

  const resetUserPassword = useCallback(async (resetData) => {
    try {
      const result = await dispatch(resetPassword(resetData))
      if (result.type === 'auth/resetPassword/fulfilled') {
        return { success: true, data: result.payload }
      } else {
        return { success: false, error: result.payload }
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }, [dispatch])

  const updateUserProfile = useCallback(async (userData) => {
    try {
      const result = await dispatch(updateProfile(userData))
      if (result.type === 'auth/updateProfile/fulfilled') {
        return { success: true, data: result.payload }
      } else {
        return { success: false, error: result.payload }
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }, [dispatch])

  const updateUserPassword = useCallback(async (passwordData) => {
    try {
      const result = await dispatch(updatePassword(passwordData))
      if (result.type === 'auth/updatePassword/fulfilled') {
        return { success: true, data: result.payload }
      } else {
        return { success: false, error: result.payload }
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }, [dispatch])

  // Utility functions
  const clearError = useCallback(() => {
    dispatch(clearAuthError())
  }, [dispatch])

  const clearSuccess = useCallback(() => {
    dispatch(clearAuthSuccess())
  }, [dispatch])

  const resetAuth = useCallback(() => {
    dispatch(resetAuthState())
  }, [dispatch])

  const updateUser = useCallback((userData) => {
    dispatch(setUser(userData))
  }, [dispatch])

  const updateToken = useCallback((newToken) => {
    dispatch(setToken(newToken))
  }, [dispatch])

  // Check authentication status
  const checkAuthStatus = useCallback(() => {
    const storedToken = localStorage.getItem('token')
    return !!(storedToken && user)
  }, [user])

  return {
    // State
    user,
    token,
    loading,
    error,
    success,
    isAuthenticated: isAuthenticated || checkAuthStatus(),
    passwordResetLoading,
    profileUpdateLoading,

    // Actions
    register,
    login,
    logout,
    getCurrentUser,
    requestPasswordReset,
    resetUserPassword,
    updateUserProfile,
    updateUserPassword,

    // Utility functions
    clearError,
    clearSuccess,
    resetAuth,
    updateUser,
    updateToken,
    checkAuthStatus
  }
}

export default useAuth