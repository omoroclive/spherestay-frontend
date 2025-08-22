// src/slices/employeesSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchEmployees, createEmployee, updateEmployee, deleteEmployee } from '../../pages/admin/Employees';

const employeesSlice = createSlice({
  name: 'employees',
  initialState: { employees: [], loading: false, error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.employees.push(action.payload);
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.employees = state.employees.map((e) =>
          e._id === action.payload._id ? action.payload : e
        );
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.employees = state.employees.filter((e) => e._id !== action.payload);
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default employeesSlice.reducer;