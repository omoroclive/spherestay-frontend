import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { api } from '@/services/auth';
import AdminTable from '../../components/admin/AdminTable';
import SearchFilterBar from '../../components/admin/SearchFilterBar';
import AdminForm from '../../components/admin/AdminForm';
import ConfirmationModal from '../../components/admin/ConfirmationModal';
import LoadingSkeleton from '../../components/common/loading/SkeletonLoader';
import ErrorBoundary from '../../components/common/errorBoundary/ErrorBoundary';

// Thunks for employees (using users API with role filter)
export const fetchEmployees = createAsyncThunk(
  'employees/fetchEmployees',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/api/users?role=admin,superadmin');
      return data.data || [];
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch employees';
      return rejectWithValue(message);
    }
  }
);

export const createEmployee = createAsyncThunk(
  'employees/createEmployee',
  async (employeeData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/api/users/signup', employeeData);
      return data.user || data.data?.user;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create employee';
      return rejectWithValue(message);
    }
  }
);

export const updateEmployee = createAsyncThunk(
  'employees/updateEmployee',
  async ({ id, ...updateData }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/api/users/${id}`, updateData);
      return data.user || data.data?.user;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update employee';
      return rejectWithValue(message);
    }
  }
);

export const deleteEmployee = createAsyncThunk(
  'employees/deleteEmployee',
  async (employeeId, { rejectWithValue }) => {
    try {
      await api.delete(`/api/users/${employeeId}`);
      return employeeId;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete employee';
      return rejectWithValue(message);
    }
  }
);

const Employees = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user: currentUser } = useSelector((state) => state.auth);
  const { employees, loading, error } = useSelector((state) => state.employees || {});
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ role: '' });
  const [editEmployee, setEditEmployee] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, employeeId: null });

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const filteredEmployees =
    employees?.filter((e) => {
      const matchesSearch =
        e.firstName?.toLowerCase().includes(search.toLowerCase()) ||
        e.lastName?.toLowerCase().includes(search.toLowerCase()) ||
        e.email?.toLowerCase().includes(search.toLowerCase());
      const matchesRole = !filters.role || e.role === filters.role;
      return matchesSearch && matchesRole;
    }) || [];

  const columns = [
    { field: 'id', headerName: 'ID', width: 100, valueGetter: (params) => params.row._id },
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      valueGetter: (params) => `${params.row.firstName} ${params.row.lastName}`,
    },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'role', headerName: 'Role', width: 150 },
    {
      field: 'joined',
      headerName: 'Joined',
      width: 150,
      valueGetter: (params) => new Date(params.row.createdAt).toLocaleDateString(),
    },
  ];

  const actions = {
    edit: (row) => setEditEmployee(row),
    delete:
      currentUser?.role === 'superadmin'
        ? (row) => setDeleteModal({ open: true, employeeId: row._id })
        : null,
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleResetFilters = () => {
    setSearch('');
    setFilters({ role: '' });
  };

  const handleAddSubmit = async (data) => {
    await dispatch(createEmployee(data));
    setAddModal(false);
  };

  const handleEditSubmit = async (data) => {
    await dispatch(updateEmployee({ id: editEmployee._id, ...data }));
    setEditEmployee(null);
  };

  const handleDeleteConfirm = async () => {
    await dispatch(deleteEmployee(deleteModal.employeeId));
    setDeleteModal({ open: false, employeeId: null });
  };

  if (loading) return <LoadingSkeleton height="100vh" />;

  return (
    <ErrorBoundary>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Employees Management</h1>
          <button
            className="bg-gradient-to-r from-[#006644] to-[#00a876] text-white font-bold py-3 px-6 rounded-xl hover:from-[#005532] hover:to-[#008a5e] transition-all duration-300"
            onClick={() => setAddModal(true)}
          >
            Add Employee
          </button>
        </div>

        {/* Filters */}
        <SearchFilterBar
          search={search}
          setSearch={setSearch}
          filters={[
            {
              name: 'role',
              label: 'Role',
              value: filters.role,
              options: [
                { value: '', label: 'All Roles' },
                { value: 'admin', label: 'Admin' },
                { value: 'superadmin', label: 'Superadmin' },
              ],
            },
          ]}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        {/* Employees Table */}
        <AdminTable
          rows={filteredEmployees}
          columns={columns}
          actions={actions}
          onRowClick={(params) => navigate(`/admin/employees/${params.row._id}`)}
        />

        {/* Add Employee Form */}
        {addModal && (
          <AdminForm
            fields={[
              { name: 'firstName', label: 'First Name', rules: { required: 'First Name is required' } },
              { name: 'lastName', label: 'Last Name', rules: { required: 'Last Name is required' } },
              { name: 'email', label: 'Email', type: 'email', rules: { required: 'Email is required' } },
              {
                name: 'password',
                label: 'Password',
                type: 'password',
                rules: {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' },
                },
              },
              {
                name: 'role',
                label: 'Role',
                type: 'select',
                options: [
                  { value: 'admin', label: 'Admin' },
                  { value: 'superadmin', label: 'Superadmin' },
                ],
                rules: { required: 'Role is required' },
              },
            ]}
            onSubmit={handleAddSubmit}
            submitLabel="Add Employee"
          />
        )}

        {/* Edit Employee Form */}
        {editEmployee && (
          <AdminForm
            fields={[
              { name: 'firstName', label: 'First Name', rules: { required: 'First Name is required' } },
              { name: 'lastName', label: 'Last Name', rules: { required: 'Last Name is required' } },
              { name: 'email', label: 'Email', type: 'email', rules: { required: 'Email is required' } },
              {
                name: 'role',
                label: 'Role',
                type: 'select',
                options: [
                  { value: 'admin', label: 'Admin' },
                  { value: 'superadmin', label: 'Superadmin' },
                ],
                rules: { required: 'Role is required' },
              },
            ]}
            defaultValues={{
              firstName: editEmployee.firstName,
              lastName: editEmployee.lastName,
              email: editEmployee.email,
              role: editEmployee.role,
            }}
            onSubmit={handleEditSubmit}
            submitLabel="Update Employee"
          />
        )}

        {/* Delete Confirmation */}
        <ConfirmationModal
          open={deleteModal.open}
          onClose={() => setDeleteModal({ open: false, employeeId: null })}
          onConfirm={handleDeleteConfirm}
          title="Delete Employee"
          message="Are you sure you want to delete this employee? This action cannot be undone."
        />
      </motion.div>
    </ErrorBoundary>
  );
};

export default Employees;
