import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { api } from '@/services/auth';

// Register User
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/api/users/signup', userData);
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Registration failed';
      return rejectWithValue(message);
    }
  }
);

// Login User
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/api/users/login', credentials);
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      return rejectWithValue(message);
    }
  }
);

// Logout User
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      localStorage.removeItem('token');
      return true;
    } catch (error) {
      localStorage.removeItem('token');
      return true;
    }
  }
);

// Fetch Current User
export const fetchUser = createAsyncThunk(
  'auth/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No token found');
      }
      const { data } = await api.get('/api/users/me');
      return data.user || data.data?.user;
    } catch (error) {
      localStorage.removeItem('token');
      const message = error.response?.data?.message || error.message || 'Failed to fetch user';
      return rejectWithValue(message);
    }
  }
);

// Forgot Password
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/api/users/forgotPassword', { email });
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to send reset link';
      return rejectWithValue(message);
    }
  }
);

// Reset Password
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, password, passwordConfirm }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/api/users/resetPassword/${token}`, {
        password,
        passwordConfirm,
      });
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Password reset failed';
      return rejectWithValue(message);
    }
  }
);

// Update Profile
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await api.patch('/api/users/updateMe', userData);
      return data.user || data.data?.user;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Update failed';
      return rejectWithValue(message);
    }
  }
);

// Update Password
export const updatePassword = createAsyncThunk(
  'auth/updatePassword',
  async ({ passwordCurrent, password, passwordConfirm }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch('/api/users/updateMyPassword', {
        passwordCurrent,
        password,
        passwordConfirm,
      });
      return data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Password update failed';
      return rejectWithValue(message);
    }
  }
);

// Upload Photo
export const uploadPhoto = createAsyncThunk(
  'auth/uploadPhoto',
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.patch('/api/users/uploadPhoto', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data.user || data.data?.user;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Photo upload failed';
      return rejectWithValue(message);
    }
  }
);

// Submit Verification
export const submitVerification = createAsyncThunk(
  'auth/submitVerification',
  async (verificationData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/api/users/submitVerification', verificationData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data.user || data.data?.user;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Verification submission failed';
      return rejectWithValue(message);
    }
  }
);

// Delete Account
export const deleteAccount = createAsyncThunk(
  'auth/deleteAccount',
  async ({ password }, { rejectWithValue }) => {
    try {
      await api.delete('/api/users/deleteMe', {
        data: { password },
      });
      localStorage.removeItem('token');
      return true;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Account deletion failed';
      return rejectWithValue(message);
    }
  }
);

// Upgrade Role
export const upgradeRole = createAsyncThunk(
  'auth/upgradeRole',
  async (upgradeData, { rejectWithValue }) => {
    try {
      const { data } = await api.patch('/api/users/upgradeRole', upgradeData);
      return data.user || data.data?.user;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Role upgrade failed';
      return rejectWithValue(message);
    }
  }
);

// Auth Slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token'),
    loading: false,
    error: null,
    success: false,
    isAuthenticated: false,
    passwordResetLoading: false,
    profileUpdateLoading: false,
    photoUploadLoading: false,
    verificationLoading: false,
    deleteAccountLoading: false,
  },
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    clearAuthSuccess: (state) => {
      state.success = false;
    },
    resetAuthState: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      state.success = false;
      state.isAuthenticated = false;
      state.passwordResetLoading = false;
      state.profileUpdateLoading = false;
      state.photoUploadLoading = false;
      state.verificationLoading = false;
      state.deleteAccountLoading = false;
      localStorage.removeItem('token');
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
      if (action.payload) {
        localStorage.setItem('token', action.payload);
      } else {
        localStorage.removeItem('token');
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.success = true;
        toast.success('Registration successful!');
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        toast.error(action.payload);
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.success = true;
        toast.success('Login successful!');
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        toast.error(action.payload);
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
        state.loading = false;
        toast.success('Logged out successfully');
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload;
        state.loading = false;
        toast.error(action.payload);
      })
      // Fetch User
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        toast.error(action.payload);
      })
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.passwordResetLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.passwordResetLoading = false;
        state.success = true;
        toast.success('Password reset link sent to your email');
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.passwordResetLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.passwordResetLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.passwordResetLoading = false;
        state.success = true;
        toast.success('Password reset successfully');
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.passwordResetLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.profileUpdateLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profileUpdateLoading = false;
        state.user = action.payload;
        toast.success('Profile updated successfully');
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.profileUpdateLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Update Password
      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.loading = false;
        toast.success('Password updated successfully');
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Upload Photo
      .addCase(uploadPhoto.pending, (state) => {
        state.photoUploadLoading = true;
        state.error = null;
      })
      .addCase(uploadPhoto.fulfilled, (state, action) => {
        state.photoUploadLoading = false;
        state.user = action.payload;
        toast.success('Profile photo uploaded successfully');
      })
      .addCase(uploadPhoto.rejected, (state, action) => {
        state.photoUploadLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Submit Verification
      .addCase(submitVerification.pending, (state) => {
        state.verificationLoading = true;
        state.error = null;
      })
      .addCase(submitVerification.fulfilled, (state, action) => {
        state.verificationLoading = false;
        state.user = action.payload;
        toast.success('Verification submitted successfully');
      })
      .addCase(submitVerification.rejected, (state, action) => {
        state.verificationLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Delete Account
      .addCase(deleteAccount.pending, (state) => {
        state.deleteAccountLoading = true;
        state.error = null;
      })
      .addCase(deleteAccount.fulfilled, (state) => {
        state.deleteAccountLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        toast.success('Account deleted successfully');
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.deleteAccountLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Upgrade Role
      .addCase(upgradeRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(upgradeRole.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        toast.success('Role upgraded successfully');
      })
      .addCase(upgradeRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export const {
  clearAuthError,
  clearAuthSuccess,
  resetAuthState,
  setUser,
  setToken,
} = authSlice.actions;

export default authSlice.reducer;