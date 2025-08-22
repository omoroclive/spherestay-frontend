// src/slices/publicPropertiesSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchPublicProperties, createPublicProperty, updatePublicProperty, deletePublicProperty } from '../../pages/admin/PublicProperties';

const publicPropertiesSlice = createSlice({
  name: 'publicProperties',
  initialState: { publicProperties: [], loading: false, error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPublicProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublicProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.publicProperties = action.payload;
      })
      .addCase(fetchPublicProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPublicProperty.fulfilled, (state, action) => {
        state.publicProperties.push(action.payload);
      })
      .addCase(updatePublicProperty.fulfilled, (state, action) => {
        state.publicProperties = state.publicProperties.map((p) =>
          p._id === action.payload._id ? action.payload : p
        );
      })
      .addCase(deletePublicProperty.fulfilled, (state, action) => {
        state.publicProperties = state.publicProperties.filter((p) => p._id !== action.payload);
      })
      .addCase(createPublicProperty.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updatePublicProperty.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deletePublicProperty.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default publicPropertiesSlice.reducer;