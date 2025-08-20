import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { submitVerification, clearAuthError } from '@/store/slices/authSlice';
import {
  DocumentTextIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

const SubmitVerification = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error: serverError } = useSelector((state) => state.auth);
  const [previews, setPreviews] = useState([]);

  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const watchFiles = watch('documents');

  // Generate previews for selected files
  useEffect(() => {
    if (watchFiles && watchFiles.length > 0) {
      const newPreviews = [];
      Array.from(watchFiles).forEach((file) => {
        if (file && file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onloadend = () => {
            newPreviews.push({ name: file.name, url: reader.result });
            if (newPreviews.length === watchFiles.length) {
              setPreviews(newPreviews);
            }
          };
          reader.readAsDataURL(file);
        } else {
          newPreviews.push({ name: file.name, url: null });
          if (newPreviews.length === watchFiles.length) {
            setPreviews(newPreviews);
          }
        }
      });
    } else {
      setPreviews([]);
    }
  }, [watchFiles]);

  // Clear server error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  // Check role access
  useEffect(() => {
    if (user && !['host', 'business'].includes(user.role)) {
      toast.error('Only hosts or businesses can submit verification documents');
      navigate('/profile');
    }
  }, [user, navigate]);

  const onSubmit = async (data) => {
    if (!data.documents || data.documents.length === 0) {
      toast.error('Please select at least one document');
      return;
    }

    const formData = new FormData();
    Array.from(data.documents).forEach((file) => {
      formData.append('documents', file);
    });

    try {
      const result = await dispatch(submitVerification(formData));
      if (submitVerification.fulfilled.match(result)) {
        toast.success('Verification documents submitted successfully');
        navigate('/profile');
      }
    } catch (error) {
      console.error('Verification submission error:', error);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-secondary-500 to-accent-500 rounded-full mb-4 shadow-lg">
          <DocumentTextIcon className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit Verification Documents</h1>
        <p className="text-gray-600">Upload documents to verify your host or business account</p>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        {serverError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            <p className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {serverError || 'An error occurred during document submission. Please try again.'}
            </p>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          {/* File Input */}
          <div className="space-y-2">
            <label htmlFor="documents" className="block text-sm font-semibold text-gray-700">
              Verification Documents
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DocumentTextIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="documents"
                name="documents"
                type="file"
                multiple
                accept="image/png,image/jpeg,image/jpg,application/pdf"
                {...register('documents', {
                  required: 'Please select at least one document',
                  validate: {
                    validType: (files) =>
                      Array.from(files).every((file) => file.type.startsWith('image/') || file.type === 'application/pdf')
                        ? true
                        : 'Files must be images (PNG, JPEG, JPG) or PDFs',
                    size: (files) =>
                      Array.from(files).every((file) => file.size <= 5 * 1024 * 1024)
                        ? true
                        : 'Each file must be less than 5MB',
                  },
                })}
                className={`block w-full pl-10 pr-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200 ${
                  errors.documents
                    ? 'border-red-300 bg-red-50'
                    : watchFiles && watchFiles.length > 0 && Array.from(watchFiles).every((file) => file.type.startsWith('image/') || file.type === 'application/pdf')
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              />
              {watchFiles && watchFiles.length > 0 && !errors.documents && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500">Upload images (PNG, JPEG, JPG) or PDFs. Maximum 5MB per file.</p>
            {errors.documents && (
              <p className="text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.documents.message}
              </p>
            )}
          </div>

          {/* Document Previews */}
          {previews.length > 0 && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Document Previews</label>
              <div className="grid grid-cols-2 gap-4">
                {previews.map((preview, index) => (
                  <div key={index} className="flex flex-col items-center">
                    {preview.url ? (
                      <img
                        src={preview.url}
                        alt={preview.name}
                        className="h-24 w-24 object-cover rounded-md border border-gray-300 shadow-sm"
                      />
                    ) : (
                      <div className="h-24 w-24 flex items-center justify-center bg-gray-100 rounded-md border border-gray-300 shadow-sm">
                        <DocumentTextIcon className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    <p className="mt-2 text-sm text-gray-600 truncate w-24 text-center">{preview.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
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
                  Submitting documents...
                </span>
              ) : (
                <>
                  <DocumentTextIcon className="h-6 w-6 mr-2 group-hover:scale-110 transition-transform duration-200" />
                  Submit Verification
                </>
              )}
            </button>
          </div>
        </form>

        {/* Back to Profile Link */}
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

export default SubmitVerification;