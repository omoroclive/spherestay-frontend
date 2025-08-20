import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';

// Async thunk to fetch wishlist
export const fetchWishlist = createAsyncThunk('wishlist/fetchWishlist', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/api/wishlist');
    return response.data; // Expected: array of property IDs or objects
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch wishlist');
  }
});

// Async thunk to add to wishlist
export const addToWishlist = createAsyncThunk('wishlist/addToWishlist', async (propertyId, { rejectWithValue }) => {
  try {
    await api.post(`/api/wishlist/${propertyId}`);
    return propertyId;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to add to wishlist');
  }
});

// Async thunk to remove from wishlist
export const removeFromWishlist = createAsyncThunk('wishlist/removeFromWishlist', async (propertyId, { rejectWithValue }) => {
  try {
    await api.delete(`/api/wishlist/${propertyId}`);
    return propertyId;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to remove from wishlist');
  }
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [], // Array of property IDs
    status: 'idle',
    error: null,
  },
  reducers: {
    clearWishlistError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.items = [...new Set([...state.items, action.payload])]; // Avoid duplicates
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = state.items.filter((id) => id !== action.payload);
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearWishlistError } = wishlistSlice.actions;
export default wishlistSlice.reducer;