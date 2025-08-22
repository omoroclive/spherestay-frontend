// bookingsSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchBookings, updateBooking, deleteBooking, refundBooking } from '../../pages/admin/Bookings';

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState: { bookings: [], loading: false, error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateBooking.fulfilled, (state, action) => {
        state.bookings = state.bookings.map((b) =>
          b._id === action.payload._id ? action.payload : b
        );
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.bookings = state.bookings.filter((b) => b._id !== action.payload);
      })
      .addCase(refundBooking.fulfilled, (state, action) => {
        state.bookings = state.bookings.map((b) =>
          b._id === action.payload._id ? action.payload : b
        );
      })
      .addCase(updateBooking.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteBooking.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(refundBooking.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default bookingsSlice.reducer;