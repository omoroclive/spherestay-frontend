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
import { upgradeRole } from '../../store/slices/authSlice';

// Thunks
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/api/users');
      return data.data || [];
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch users';
      return rejectWithValue(message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      await api.delete(`/api/users/${userId}`);
      return userId;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete user';
      return rejectWithValue(message);
    }
  }
);

const Users = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user: currentUser } = useSelector((state) => state.auth);
  const { users, loading, error } = useSelector((state) => state.users || {});
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    role: '',
    status: '',
  });
  const [editUser, setEditUser] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, userId: null });

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const filteredUsers = users?.filter((u) => {
    const matchesSearch =
      u.firstName?.toLowerCase().includes(search.toLowerCase()) ||
      u.lastName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = !filters.role || u.role === filters.role;
    const matchesStatus = !filters.status || u.status === filters.status;
    return matchesSearch && matchesRole && matchesStatus;
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
      width: 200,
      valueGetter: (params) => new Date(params.row.createdAt).toLocaleDateString(),
    },
    { field: 'status', headerName: 'Status', width: 120 },
  ];

  const actions = {
    edit: (row) => setEditUser(row),
    delete:
      currentUser?.role === 'superadmin'
        ? (row) => setDeleteModal({ open: true, userId: row._id })
        : null,
    view: (row) => navigate(`/admin/users/${row._id}`),
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleResetFilters = () => {
    setSearch('');
    setFilters({ role: '', status: '' });
  };

  const handleEditSubmit = async (data) => {
    await dispatch(upgradeRole({ id: editUser._id, role: data.role }));
    setEditUser(null);
  };

  const handleDeleteConfirm = async () => {
    await dispatch(deleteUser(deleteModal.userId));
    setDeleteModal({ open: false, userId: null });
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
        <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
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
                { value: 'user', label: 'User' },
                { value: 'admin', label: 'Admin' },
                { value: 'superadmin', label: 'Superadmin' },
              ],
            },
            {
              name: 'status',
              label: 'Status',
              value: filters.status,
              options: [
                { value: '', label: 'All Statuses' },
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
              ],
            },
          ]}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />
        <AdminTable
          rows={filteredUsers}
          columns={columns}
          actions={actions}
          onRowClick={(params) => navigate(`/admin/users/${params.row._id}`)}
        />
        {editUser && (
          <AdminForm
            fields={[
              {
                name: 'role',
                label: 'Role',
                type: 'select',
                options: [
                  { value: 'user', label: 'User' },
                  { value: 'admin', label: 'Admin' },
                  { value: 'superadmin', label: 'Superadmin' },
                ],
                rules: { required: 'Role is required' },
              },
            ]}
            defaultValues={{ role: editUser.role }}
            onSubmit={handleEditSubmit}
            submitLabel="Update Role"
          />
        )}
        <ConfirmationModal
          open={deleteModal.open}
          onClose={() => setDeleteModal({ open: false, userId: null })}
          onConfirm={handleDeleteConfirm}
          title="Delete User"
          message="Are you sure you want to delete this user? This action cannot be undone."
        />
      </motion.div>
    </ErrorBoundary>
  );
};

export default Users;