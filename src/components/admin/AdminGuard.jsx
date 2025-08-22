import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchUser } from '../../store/slices/authSlice';
import LoadingSkeleton from '../../components/common/loading/SkeletonLoader';
import ErrorBoundary from '../../components/common/errorBoundary/ErrorBoundary';

const AdminGuard = ({ superadminOnly = false }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading, error } = useSelector((state) => state.auth);
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      dispatch(fetchUser());
    }
  }, [isAuthenticated, loading, dispatch]);

  if (loading) {
    return <LoadingSkeleton height="100vh" />;
  }

  if (error) {
    toast.error(error);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAuthenticated) {
    toast.error('Please log in to access the admin panel.');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (superadminOnly && user?.role !== 'superadmin') {
    toast.error('Access restricted to superadmins.');
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (!['admin', 'superadmin'].includes(user?.role)) {
    toast.error('You do not have permission to access the admin panel.');
    return <Navigate to="/" replace />;
  }

  return (
    <ErrorBoundary>
      <Outlet /> {/* This renders the nested routes */}
    </ErrorBoundary>
  );
};

export default AdminGuard;
