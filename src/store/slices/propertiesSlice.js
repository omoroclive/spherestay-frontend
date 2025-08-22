// propertiesSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchProperties, verifyProperty, updateProperty, deleteProperty } from '../../pages/admin/Properties';

const propertiesSlice = createSlice({
  name: 'properties',
  initialState: { properties: [], loading: false, error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.properties = action.payload;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyProperty.fulfilled, (state, action) => {
        state.properties = state.properties.map((p) =>
          p._id === action.payload._id ? action.payload : p
        );
      })
      .addCase(updateProperty.fulfilled, (state, action) => {
        state.properties = state.properties.map((p) =>
          p._id === action.payload._id ? action.payload : p
        );
      })
      .addCase(deleteProperty.fulfilled, (state, action) => {
        state.properties = state.properties.filter((p) => p._id !== action.payload);
      })
      .addCase(verifyProperty.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateProperty.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteProperty.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default propertiesSlice.reducer;