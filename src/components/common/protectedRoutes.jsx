import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !user) {
      toast.error('Please login to access this page')
      navigate('/login')
    }

    if (!loading && user && roles.length > 0 && !roles.includes(user.role)) {
      toast.error('You are not authorized to access this page')
      navigate('/')
    }
  }, [user, loading, navigate, roles])

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return null
  }

  return children
}

export default ProtectedRoute