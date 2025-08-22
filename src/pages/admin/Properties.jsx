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

// Thunks for properties
export const fetchProperties = createAsyncThunk(
  'properties/fetchProperties',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/api/properties');
      return data.data || [];
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch properties';
      return rejectWithValue(message);
    }
  }
);

export const verifyProperty = createAsyncThunk(
  'properties/verifyProperty',
  async (propertyId, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/api/properties/${propertyId}/verify`);
      return data.data || data.property;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to verify property';
      return rejectWithValue(message);
    }
  }
);

export const updateProperty = createAsyncThunk(
  'properties/updateProperty',
  async ({ id, ...updateData }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/api/properties/${id}`, updateData);
      return data.data || data.property;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update property';
      return rejectWithValue(message);
    }
  }
);

export const deleteProperty = createAsyncThunk(
  'properties/deleteProperty',
  async (propertyId, { rejectWithValue }) => {
    try {
      await api.delete(`/api/properties/${propertyId}`);
      return propertyId;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete property';
      return rejectWithValue(message);
    }
  }
);

const Properties = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user: currentUser } = useSelector((state) => state.auth);
  const { properties, loading, error } = useSelector((state) => state.properties || {});
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    type: '',
  });
  const [editProperty, setEditProperty] = useState(null);
  const [verifyModal, setVerifyModal] = useState({ open: false, propertyId: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, propertyId: null });

  useEffect(() => {
    dispatch(fetchProperties());
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const filteredProperties = properties?.filter((p) => {
    const matchesSearch = p.title?.toLowerCase().includes(search.toLowerCase()) || p.location?.city?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !filters.status || p.verificationStatus === filters.status;
    const matchesType = !filters.type || p.type === filters.type;
    return matchesSearch && matchesStatus && matchesType;
  }) || [];

  const columns = [
    { field: 'id', headerName: 'ID', width: 100, valueGetter: (params) => params.row._id },
    { field: 'title', headerName: 'Title', width: 200 },
    { field: 'owner', headerName: 'Owner', width: 150, valueGetter: (params) => params.row.owner?.firstName || 'Unknown' },
    { field: 'location', headerName: 'Location', width: 150, valueGetter: (params) => params.row.location?.city || '' },
    { field: 'type', headerName: 'Type', width: 120 },
    { field: 'verificationStatus', headerName: 'Status', width: 120 },
    {
      field: 'createdAt',
      headerName: 'Listed On',
      width: 150,
      valueGetter: (params) => new Date(params.row.createdAt).toLocaleDateString(),
    },
  ];

  const actions = {
    edit: (row) => setEditProperty(row),
    verify: (row) => {
      if (row.verificationStatus === 'pending') {
        setVerifyModal({ open: true, propertyId: row._id });
      } else {
        toast.info('Property already verified or rejected.');
      }
    },
    delete: (row) => setDeleteModal({ open: true, propertyId: row._id }),
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleResetFilters = () => {
    setSearch('');
    setFilters({ status: '', type: '' });
  };

  const handleEditSubmit = async (data) => {
    await dispatch(updateProperty({ id: editProperty._id, ...data }));
    setEditProperty(null);
  };

  const handleVerifyConfirm = async () => {
    await dispatch(verifyProperty(verifyModal.propertyId));
    setVerifyModal({ open: false, propertyId: null });
  };

  const handleDeleteConfirm = async () => {
    await dispatch(deleteProperty(deleteModal.propertyId));
    setDeleteModal({ open: false, propertyId: null });
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
        <h1 className="text-3xl font-bold text-gray-900">Properties Management</h1>
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
                { value: 'verified', label: 'Verified' },
                { value: 'rejected', label: 'Rejected' },
              ],
            },
            {
              name: 'type',
              label: 'Type',
              value: filters.type,
              options: [
                { value: '', label: 'All Types' },
                { value: 'house', label: 'House' },
                { value: 'apartment', label: 'Apartment' },
                { value: 'villa', label: 'Villa' },
              ],
            },
          ]}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />
        <AdminTable
          rows={filteredProperties}
          columns={columns}
          actions={actions}
          onRowClick={(params) => navigate(`/admin/properties/${params.row._id}`)}
        />
        {editProperty && (
          <AdminForm
            fields={[
              { name: 'title', label: 'Title', rules: { required: 'Title is required' } },
              { name: 'description', label: 'Description', type: 'text', rules: { required: 'Description is required' } },
              {
                name: 'type',
                label: 'Type',
                type: 'select',
                options: [
                  { value: 'house', label: 'House' },
                  { value: 'apartment', label: 'Apartment' },
                  { value: 'villa', label: 'Villa' },
                ],
                rules: { required: 'Type is required' },
              },
              // Add more fields as needed (e.g., pricing, location)
            ]}
            defaultValues={{
              title: editProperty.title,
              description: editProperty.description,
              type: editProperty.type,
            }}
            onSubmit={handleEditSubmit}
            submitLabel="Update Property"
          />
        )}
        <ConfirmationModal
          open={verifyModal.open}
          onClose={() => setVerifyModal({ open: false, propertyId: null })}
          onConfirm={handleVerifyConfirm}
          title="Verify Property"
          message="Are you sure you want to verify this property?"
        />
        <ConfirmationModal
          open={deleteModal.open}
          onClose={() => setDeleteModal({ open: false, propertyId: null })}
          onConfirm={handleDeleteConfirm}
          title="Delete Property"
          message="Are you sure you want to delete this property? This action cannot be undone."
        />
      </motion.div>
    </ErrorBoundary>
  );
};

export default Properties;