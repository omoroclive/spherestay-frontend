import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { forgotPassword, clearAuthError, clearAuthSuccess } from '@/store/slices/authSlice'
import { useState, useEffect } from 'react'
import {
  EnvelopeIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  KeyIcon
} from '@heroicons/react/24/outline'

const ForgotPassword = () => {
  const dispatch = useDispatch()
  const { passwordResetLoading, error, success } = useSelector((state) => state.auth)
  const [emailSent, setEmailSent] = useState(false)

  const { register, handleSubmit, formState: { errors }, watch } = useForm()
  const watchEmail = watch('email')

  // Clear any previous errors/success when component mounts
  useEffect(() => {
    dispatch(clearAuthError())
    dispatch(clearAuthSuccess())
  }, [dispatch])

  const onSubmit = async (data) => {
    try {
      const result = await dispatch(forgotPassword(data.email))
      if (result.type === 'auth/forgotPassword/fulfilled') {
        setEmailSent(true)
      }
    } catch (error) {
      console.error('Forgot password error:', error)
    }
  }

  const handleResendEmail = () => {
    if (watchEmail) {
      dispatch(forgotPassword(watchEmail))
    }
  }

  const handleBackToLogin = () => {
    dispatch(clearAuthError())
    dispatch(clearAuthSuccess())
    setEmailSent(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Back to Login Link */}
        <div className="mb-8">
          <Link
            to="/login"
            onClick={handleBackToLogin}
            className="inline-flex items-center text-sm font-medium text-secondary-600 hover:text-secondary-700 transition-colors duration-200"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to login
          </Link>
        </div>

        {!emailSent ? (
          // Forgot Password Form
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-secondary-500 to-accent-500 rounded-full mb-4 shadow-lg">
                <KeyIcon className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
              <p className="text-gray-600 max-w-sm mx-auto">
                No worries! Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-600 mr-3" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Form */}
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Enter your email address"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Please enter a valid email address'
                      }
                    })}
                    className={`block w-full pl-10 pr-4 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200 ${errors.email
                        ? 'border-red-300 bg-red-50'
                        : watchEmail
                          ? 'border-green-300 bg-green-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                  />
                  {watchEmail && !errors.email && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    </div>
                  )}
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={passwordResetLoading}
                  className="group relative w-full flex justify-center py-4 px-6 border border-transparent text-base font-bold rounded-xl text-white bg-gradient-to-r from-secondary-600 to-secondary-700 hover:from-secondary-700 hover:to-secondary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 disabled:opacity-60 disabled:cursor-not-allowed transform transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 shadow-md"
                >
                  {passwordResetLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending Reset Link...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <EnvelopeIcon className="h-6 w-6 mr-3 group-hover:scale-110 transition-transform duration-200" />
                      Send Reset Link
                    </span>
                  )}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">Remember your password?</span>
                </div>
              </div>
            </div>

            {/* Back to Login */}
            <div className="mt-6 text-center">
              <Link
                to="/login"
                onClick={handleBackToLogin}
                className="inline-flex items-center justify-center w-full py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 transition-all duration-200 hover:shadow-md"
              >
                Sign in instead
              </Link>
            </div>
          </div>
        ) : (
          // Success State
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            {/* Success Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-4 shadow-lg">
                <CheckCircleIcon className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Check Your Email!</h1>
              <p className="text-gray-600 max-w-sm mx-auto">
                We've sent a password reset link to{' '}
                <span className="font-semibold text-secondary-600">{watchEmail}</span>
              </p>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
              <h3 className="text-sm font-semibold text-blue-800 mb-2">What's next?</h3>
              <div className="space-y-2 text-sm text-blue-700">
                <div className="flex items-start">
                  <span className="flex-shrink-0 w-5 h-5 bg-blue-500 text-white rounded-full text-xs flex items-center justify-center mr-2 mt-0.5">1</span>
                  <span>Check your email inbox (and spam folder)</span>
                </div>
                <div className="flex items-start">
                  <span className="flex-shrink-0 w-5 h-5 bg-blue-500 text-white rounded-full text-xs flex items-center justify-center mr-2 mt-0.5">2</span>
                  <span>Click the "Reset Password" link in the email</span>
                </div>
                <div className="flex items-start">
                  <span className="flex-shrink-0 w-5 h-5 bg-blue-500 text-white rounded-full text-xs flex items-center justify-center mr-2 mt-0.5">3</span>
                  <span>Create a new secure password</span>
                </div>
              </div>
            </div>

            {/* Resend Email */}
            <div className="text-center mb-6">
              <p className="text-sm text-gray-600 mb-3">Didn't receive the email?</p>
              <button
                onClick={handleResendEmail}
                disabled={passwordResetLoading}
                className="inline-flex items-center px-4 py-2 border border-secondary-600 rounded-lg text-sm font-medium text-secondary-600 bg-white hover:bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {passwordResetLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Resending...
                  </>
                ) : (
                  <>
                    <EnvelopeIcon className="w-4 h-4 mr-2" />
                    Resend Email
                  </>
                )}
              </button>
            </div>

            {/* Back to Login */}
            <div className="text-center">
              <Link
                to="/login"
                onClick={handleBackToLogin}
                className="inline-flex items-center justify-center w-full py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 transition-all duration-200 hover:shadow-md"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back to Login
              </Link>
            </div>
          </div>
        )}

        {/* Security Notice */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Secure Reset
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              Link Expires in 15min
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-0.257-0.257A6 6 0 1118 8zM10 2a8 8 0 100 16 8 8 0 000-16z" clipRule="evenodd" />
              </svg>
              Safe & Private
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword