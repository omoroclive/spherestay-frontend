import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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

// Thunks for bookings
export const fetchBookings = createAsyncThunk(
  'bookings/fetchBookings',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/api/bookings');
      return data.data || [];
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch bookings';
      return rejectWithValue(message);
    }
  }
);

export const updateBooking = createAsyncThunk(
  'bookings/updateBooking',
  async ({ id, ...updateData }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/api/bookings/${id}`, updateData);
      return data.data || data.booking;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update booking';
      return rejectWithValue(message);
    }
  }
);

export const deleteBooking = createAsyncThunk(
  'bookings/deleteBooking',
  async (bookingId, { rejectWithValue }) => {
    try {
      await api.delete(`/api/bookings/${bookingId}`);
      return bookingId;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete booking';
      return rejectWithValue(message);
    }
  }
);

export const refundBooking = createAsyncThunk(
  'bookings/refundBooking',
  async (bookingId, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/api/bookings/${bookingId}/refund`);
      return data.booking; // adjust depending on your API response
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to refund booking';
      return rejectWithValue(message);
    }
  }
);


const Bookings = () => {
  const dispatch = useDispatch();
  const { properties, loading, error } = useSelector((state) => state.bookings || {});
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    status: '',
  });
  const [editBooking, setEditBooking] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, bookingId: null });

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const filteredBookings = properties?.filter((b) => {
    const matchesSearch = b._id?.includes(search) || b.user?.firstName?.toLowerCase().includes(search.toLowerCase()) || b.property?.title?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !filters.status || b.status === filters.status;
    return matchesSearch && matchesStatus;
  }) || [];

  const columns = [
    { field: 'id', headerName: 'ID', width: 100, valueGetter: (params) => params.row._id },
    { field: 'user', headerName: 'User', width: 200, valueGetter: (params) => `${params.row.user?.firstName} ${params.row.user?.lastName}` },
    { field: 'property', headerName: 'Property', width: 200, valueGetter: (params) => params.row.property?.title },
    { field: 'checkInDate', headerName: 'Check-In', width: 150, valueGetter: (params) => new Date(params.row.checkInDate).toLocaleDateString() },
    { field: 'checkOutDate', headerName: 'Check-Out', width: 150, valueGetter: (params) => new Date(params.row.checkOutDate).toLocaleDateString() },
    { field: 'status', headerName: 'Status', width: 120 },
    { field: 'total', headerName: 'Total', width: 120, valueGetter: (params) => params.row.total?.toLocaleString() },
  ];

  const actions = {
    edit: (row) => setEditBooking(row),
    delete: (row) => setDeleteModal({ open: true, bookingId: row._id }),
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleResetFilters = () => {
    setSearch('');
    setFilters({ status: '' });
  };

  const handleEditSubmit = async (data) => {
    await dispatch(updateBooking({ id: editBooking._id, ...data }));
    setEditBooking(null);
  };

  const handleDeleteConfirm = async () => {
    await dispatch(deleteBooking(deleteModal.bookingId));
    setDeleteModal({ open: false, bookingId: null });
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
        <h1 className="text-3xl font-bold text-gray-900">Bookings Management</h1>
        <SearchFilterBar
          search={search}
          setSearch={setSearch}
          filters={[
            {
              name: 'status',
              label: 'Status',
              value: filters.status,
              options: [
                { value: '', label: 'All Statuses' },
                { value: 'pending', label: 'Pending' },
                { value: 'confirmed', label: 'Confirmed' },
                { value: 'completed', label: 'Completed' },
                { value: 'cancelled', label: 'Cancelled' },
              ],
            },
          ]}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />
        <AdminTable
          rows={filteredBookings}
          columns={columns}
          actions={actions}
        />
        {editBooking && (
          <AdminForm
            fields={[
              {
                name: 'status',
                label: 'Status',
                type: 'select',
                options: [
                  { value: 'pending', label: 'Pending' },
                  { value: 'confirmed', label: 'Confirmed' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'cancelled', label: 'Cancelled' },
                ],
                rules: { required: 'Status is required' },
              },
              // Add more fields if needed (e.g., notes, adjustments)
            ]}
            defaultValues={{ status: editBooking.status }}
            onSubmit={handleEditSubmit}
            submitLabel="Update Booking"
          />
        )}
        <ConfirmationModal
          open={deleteModal.open}
          onClose={() => setDeleteModal({ open: false, bookingId: null })}
          onConfirm={handleDeleteConfirm}
          title="Delete Booking"
          message="Are you sure you want to delete this booking? This action cannot be undone."
        />
      </motion.div>
    </ErrorBoundary>
  );
};

export default Bookings;