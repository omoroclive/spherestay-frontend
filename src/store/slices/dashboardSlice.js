import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ✅ Async thunk to fetch all dashboard data
export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchDashboardData',
  async (_, { rejectWithValue }) => {
    try {
      console.log("Fetching dashboard data...");

      // ✅ Make all API calls concurrently
      const [usersRes, propertiesRes, publicPropertiesRes, bookingsRes] = await Promise.all([
        api.get('api/users'),
        api.get('api/properties'),
        api.get('api/publicProperties').catch(() => ({ data: { data: [] } })), // Handle if endpoint doesn't exist
        api.get('api/bookings'),
      ]);

      console.log("Dashboard API results:", {
        users: usersRes.data,
        properties: propertiesRes.data,
        publicProperties: publicPropertiesRes.data,
        bookings: bookingsRes.data,
      });

      return {
        users: usersRes.data?.data || [],
        properties: propertiesRes.data?.data || [],
        publicProperties: publicPropertiesRes.data?.data || [],
        bookings: bookingsRes.data?.data || [],
      };
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch dashboard data';
      return rejectWithValue(errorMessage);
    }
  }
);

// ✅ Async thunk to refresh specific data
export const refreshDashboardSection = createAsyncThunk(
  'dashboard/refreshSection',
  async (section, { rejectWithValue }) => {
    try {
      console.log(`Refreshing ${section} data...`);
      
      let endpoint = '';
      switch (section) {
        case 'users':
          endpoint = '/users';
          break;
        case 'properties':
          endpoint = '/properties';
          break;
        case 'bookings':
          endpoint = '/bookings';
          break;
        case 'publicProperties':
          endpoint = '/publicProperties';
          break;
        default:
          throw new Error('Invalid section');
      }

      const response = await api.get(endpoint);
      return {
        section,
        data: response.data?.data || [],
      };
    } catch (err) {
      console.error(`Error refreshing ${section}:`, err);
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    data: null,
    loading: false,
    error: null,
    lastFetched: null,
  },
  reducers: {
    // ✅ Clear error
    clearError: (state) => {
      state.error = null;
    },
    // ✅ Reset dashboard
    resetDashboard: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
      state.lastFetched = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Fetch dashboard data cases
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.lastFetched = new Date().toISOString();
        state.error = null;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      })
      // ✅ Refresh section cases
      .addCase(refreshDashboardSection.pending, (state) => {
        // Don't set global loading for section refresh
      })
      .addCase(refreshDashboardSection.fulfilled, (state, action) => {
        if (state.data) {
          const { section, data } = action.payload;
          state.data[section] = data;
          state.lastFetched = new Date().toISOString();
        }
      })
      .addCase(refreshDashboardSection.rejected, (state, action) => {
        // Could set a specific section error if needed
        console.error('Section refresh failed:', action.payload);
      });
  },
});

// ✅ Export actions
export const { clearError, resetDashboard } = dashboardSlice.actions;

// ✅ Selectors
export const selectDashboardData = (state) => state.dashboard.data;
export const selectDashboardLoading = (state) => state.dashboard.loading;
export const selectDashboardError = (state) => state.dashboard.error;
export const selectLastFetched = (state) => state.dashboard.lastFetched;

// ✅ Computed selectors
export const selectDashboardStats = (state) => {
  const data = selectDashboardData(state);
  if (!data) return null;

  return {
    totalUsers: data.users?.length || 0,
    totalProperties: data.properties?.length || 0,
    totalPublicProperties: data.publicProperties?.length || 0,
    totalBookings: data.bookings?.length || 0,
    pendingProperties: data.properties?.filter(p => p.status === 'pending')?.length || 0,
  };
};

// ✅ Default export reducer
export default dashboardSlice.reducer;