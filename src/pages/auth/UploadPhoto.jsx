import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { uploadPhoto, clearAuthError } from '@/store/slices/authSlice';
import {
  PhotoIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

const UploadPhoto = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, photoUploadLoading, error: serverError } = useSelector((state) => state.auth);
  const [preview, setPreview] = useState(null);

  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const watchPhoto = watch('photo');

  // Generate image preview when a file is selected
  useEffect(() => {
    if (watchPhoto && watchPhoto.length > 0) {
      const file = watchPhoto[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    } else {
      setPreview(null);
    }
  }, [watchPhoto]);

  // Clear server error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  const onSubmit = async (data) => {
    if (!data.photo || data.photo.length === 0) {
      toast.error('Please select an image file');
      return;
    }

    const formData = new FormData();
    formData.append('photo', data.photo[0]);

    try {
      const result = await dispatch(uploadPhoto(formData));
      if (uploadPhoto.fulfilled.match(result)) {
        toast.success('Profile photo uploaded successfully');
        navigate('/account');
      }
    } catch (error) {
      console.error('Photo upload error:', error);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-secondary-500 to-accent-500 rounded-full mb-4 shadow-lg">
          <PhotoIcon className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Profile Photo</h1>
        <p className="text-gray-600">Upload a new photo for your account</p>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        {serverError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            <p className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {serverError || 'An error occurred during photo upload. Please try again.'}
            </p>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          {/* Current Photo Preview */}
          {user?.photo && !preview && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Current Photo</label>
              <div className="flex justify-center">
                <img
                  src={user.photo}
                  alt="Current profile photo"
                  className="h-32 w-32 rounded-full object-cover border border-gray-300 shadow-sm"
                />
              </div>
            </div>
          )}

          {/* File Input */}
          <div className="space-y-2">
            <label htmlFor="photo" className="block text-sm font-semibold text-gray-700">
              New Profile Photo
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <PhotoIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="photo"
                name="photo"
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                {...register('photo', {
                  required: 'Please select an image file',
                  validate: {
                    isImage: (files) =>
                      files.length > 0 && files[0].type.startsWith('image/')
                        ? true
                        : 'File must be an image (PNG, JPEG, or JPG)',
                    size: (files) =>
                      files.length > 0 && files[0].size <= 5 * 1024 * 1024
                        ? true
                        : 'File size must be less than 5MB',
                  },
                })}
                className={`block w-full pl-10 pr-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all duration-200 ${
                  errors.photo
                    ? 'border-red-300 bg-red-50'
                    : watchPhoto && watchPhoto.length > 0 && watchPhoto[0].type.startsWith('image/')
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              />
              {watchPhoto && watchPhoto.length > 0 && watchPhoto[0].type.startsWith('image/') && !errors.photo && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                </div>
              )}
            </div>
            {errors.photo && (
              <p className="text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.photo.message}
              </p>
            )}
          </div>

          {/* Image Preview */}
          {preview && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Preview</label>
              <div className="flex justify-center">
                <img
                  src={preview}
                  alt="Photo preview"
                  className="h-32 w-32 rounded-full object-cover border border-gray-300 shadow-sm"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={photoUploadLoading}
              className="group relative w-full flex justify-center py-4 px-6 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-secondary-600 to-secondary-700 hover:from-secondary-700 hover:to-secondary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 disabled:opacity-60 disabled:cursor-not-allowed transform transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              {photoUploadLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading photo...
                </span>
              ) : (
                <>
                  <PhotoIcon className="h-6 w-6 mr-2 group-hover:scale-110 transition-transform duration-200" />
                  Upload Photo
                </>
              )}
            </button>
          </div>
        </form>

        {/* Back to Account Link */}
        <div className="mt-6 text-center">
          <Link
            to="/account"
            className="inline-flex items-center justify-center w-full py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 transition-all duration-200 hover:shadow-md"
          >
            Back to Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UploadPhoto;