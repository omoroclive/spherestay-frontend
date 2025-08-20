import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { upgradeRole } from '@/store/slices/authSlice';
import { useState, useEffect } from 'react';
import {
  UserIcon,
  UserPlusIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

const UpgradeRole = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error: serverError, user } = useSelector((state) => state.auth);

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: {
      role: '',
      businessName: '',
    },
  });

  const watchRole = watch('role');
  const watchBusinessName = watch('businessName');

  useEffect(() => {
    if (user.role !== 'user') {
      navigate('/profile'); // Redirect if already upgraded
    }
  }, [user, navigate]);

  const onSubmit = async (data) => {
    if (data.role === 'business' && !data.businessName) {
      return;
    }

    const upgradeData = {
      role: data.role,
      businessName: data.role === 'business' ? data.businessName : undefined,
    };

    const result = await dispatch(upgradeRole(upgradeData));
    if (upgradeRole.fulfilled.match(result)) {
      navigate('/submit-verification'); // Redirect to verification after upgrade
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-secondary-500 to-accent-500 rounded-full mb-4 shadow-lg">
          <UserPlusIcon className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upgrade Your Account</h1>
        <p className="text-gray-600">Upgrade to host or business to list properties</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        {serverError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            <p className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 0 11-16 0 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {serverError || 'An error occurred during upgrade. Please try again.'}
            </p>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <label htmlFor="role" className="block text-sm font-semibold text-gray-700">
              Select Role
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="role"
                name="role"
                {...register('role', { required: 'Please select a role' })}
                className={`block w-full pl-10 pr-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200 ${
                  errors.role
                    ? 'border-red-300 bg-red-50'
                    : watchRole
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <option value="">Select role</option>
                <option value="host">Host (List properties)</option>
                <option value="business">Business (Manage multiple properties)</option>
              </select>
              {watchRole && !errors.role && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                </div>
              )}
            </div>
            {errors.role && (
              <p className="text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 0 11-16 0 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.role.message}
              </p>
            )}
          </div>

          {watchRole === 'business' && (
            <div className="space-y-2">
              <label htmlFor="businessName" className="block text-sm font-semibold text-gray-700">
                Business Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="businessName"
                  name="businessName"
                  type="text"
                  placeholder="Enter business name"
                  {...register('businessName', { required: 'Business name is required for business role' })}
                  className={`block w-full pl-10 pr-4 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200 ${
                    errors.businessName
                      ? 'border-red-300 bg-red-50'
                      : watchBusinessName
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                />
                {watchBusinessName && !errors.businessName && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  </div>
                )}
              </div>
              {errors.businessName && (
                <p className="text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 0 11-16 0 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.businessName.message}
                </p>
              )}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-4 px-6 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-secondary-600 to-secondary-700 hover:from-secondary-700 hover:to-secondary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 disabled:opacity-60 disabled:cursor-not-allowed transform transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Upgrading role...
                </span>
              ) : (
                <>
                  <UserPlusIcon className="h-6 w-6 mr-2 group-hover:scale-110 transition-transform duration-200" />
                  Upgrade Role
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/profile"
            className="inline-flex items-center justify-center w-full py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 transition-all duration-200 hover:shadow-md"
          >
            Back to Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UpgradeRole;