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

// Thunks for public properties
export const fetchPublicProperties = createAsyncThunk(
  'publicProperties/fetchPublicProperties',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/api/publicProperties');
      return data.data || [];
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch public properties';
      return rejectWithValue(message);
    }
  }
);

export const createPublicProperty = createAsyncThunk(
  'publicProperties/createPublicProperty',
  async (propertyData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/api/public-properties', propertyData);
      return data.data || data.publicProperty;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create public property';
      return rejectWithValue(message);
    }
  }
);

export const updatePublicProperty = createAsyncThunk(
  'publicProperties/updatePublicProperty',
  async ({ id, ...updateData }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/api/public-properties/${id}`, updateData);
      return data.data || data.publicProperty;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update public property';
      return rejectWithValue(message);
    }
  }
);

export const deletePublicProperty = createAsyncThunk(
  'publicProperties/deletePublicProperty',
  async (propertyId, { rejectWithValue }) => {
    try {
      await api.delete(`/api/public-properties/${propertyId}`);
      return propertyId;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete public property';
      return rejectWithValue(message);
    }
  }
);

const PublicProperties = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user: currentUser } = useSelector((state) => state.auth);
  const { publicProperties, loading, error } = useSelector((state) => state.publicProperties || {});
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    visibility: '',
    type: '',
  });
  const [editProperty, setEditProperty] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, propertyId: null });

  useEffect(() => {
    dispatch(fetchPublicProperties());
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const filteredProperties = publicProperties?.filter((p) => {
    const matchesSearch = p.title?.toLowerCase().includes(search.toLowerCase()) || p.location?.city?.toLowerCase().includes(search.toLowerCase());
    const matchesVisibility = !filters.visibility || p.visibility === filters.visibility;
    const matchesType = !filters.type || p.type === filters.type;
    return matchesSearch && matchesVisibility && matchesType;
  }) || [];

  const columns = [
    { field: 'id', headerName: 'ID', width: 100, valueGetter: (params) => params.row._id },
    { field: 'title', headerName: 'Title', width: 200 },
    { field: 'location', headerName: 'Location', width: 150, valueGetter: (params) => params.row.location?.city || '' },
    { field: 'type', headerName: 'Type', width: 120 },
    { field: 'visibility', headerName: 'Visibility', width: 120 },
    {
      field: 'createdAt',
      headerName: 'Added On',
      width: 150,
      valueGetter: (params) => new Date(params.row.createdAt).toLocaleDateString(),
    },
  ];

  const actions = {
    edit: (row) => setEditProperty(row),
    delete: currentUser?.role === 'superadmin' ? (row) => setDeleteModal({ open: true, propertyId: row._id }) : null,
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleResetFilters = () => {
    setSearch('');
    setFilters({ visibility: '', type: '' });
  };

  const handleAddSubmit = async (data) => {
    await dispatch(createPublicProperty(data));
    setAddModal(false);
  };

  const handleEditSubmit = async (data) => {
    await dispatch(updatePublicProperty({ id: editProperty._id, ...data }));
    setEditProperty(null);
  };

  const handleDeleteConfirm = async () => {
    await dispatch(deletePublicProperty(deleteModal.propertyId));
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
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Public Properties Management</h1>
          <button
            className="bg-gradient-to-r from-[#006644] to-[#00a876] text-white font-bold py-3 px-6 rounded-xl hover:from-[#005532] hover:to-[#008a5e] transition-all duration-300"
            onClick={() => setAddModal(true)}
          >
            Add Public Property
          </button>
        </div>
        <SearchFilterBar
          search={search}
          setSearch={setSearch}
          filters={[
            {
              name: 'visibility',
              label: 'Visibility',
              value: filters.visibility,
              options: [
                { value: '', label: 'All' },
                { value: 'public', label: 'Public' },
                { value: 'featured', label: 'Featured' },
                { value: 'hidden', label: 'Hidden' },
              ],
            },
            {
              name: 'type',
              label: 'Type',
              value: filters.type,
              options: [
                { value: '', label: 'All Types' },
                { value: 'landmark', label: 'Landmark' },
                { value: 'park', label: 'Park' },
                { value: 'museum', label: 'Museum' },
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
          onRowClick={(params) => navigate(`/admin/public-properties/${params.row._id}`)}
        />
        {addModal && (
          <AdminForm
            fields={[
              { name: 'title', label: 'Title', rules: { required: 'Title is required' } },
              { name: 'description', label: 'Description', type: 'text', rules: { required: 'Description is required' } },
              {
                name: 'type',
                label: 'Type',
                type: 'select',
                options: [
                  { value: 'landmark', label: 'Landmark' },
                  { value: 'park', label: 'Park' },
                  { value: 'museum', label: 'Museum' },
                ],
                rules: { required: 'Type is required' },
              },
              { name: 'location.city', label: 'City', rules: { required: 'City is required' } },
              {
                name: 'visibility',
                label: 'Visibility',
                type: 'select',
                options: [
                  { value: 'public', label: 'Public' },
                  { value: 'featured', label: 'Featured' },
                  { value: 'hidden', label: 'Hidden' },
                ],
                rules: { required: 'Visibility is required' },
              },
            ]}
            onSubmit={handleAddSubmit}
            submitLabel="Add Property"
          />
        )}
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
                  { value: 'landmark', label: 'Landmark' },
                  { value: 'park', label: 'Park' },
                  { value: 'museum', label: 'Museum' },
                ],
                rules: { required: 'Type is required' },
              },
              { name: 'location.city', label: 'City', rules: { required: 'City is required' } },
              {
                name: 'visibility',
                label: 'Visibility',
                type: 'select',
                options: [
                  { value: 'public', label: 'Public' },
                  { value: 'featured', label: 'Featured' },
                  { value: 'hidden', label: 'Hidden' },
                ],
                rules: { required: 'Visibility is required' },
              },
            ]}
            defaultValues={{
              title: editProperty.title,
              description: editProperty.description,
              type: editProperty.type,
              'location.city': editProperty.location?.city,
              visibility: editProperty.visibility,
            }}
            onSubmit={handleEditSubmit}
            submitLabel="Update Property"
          />
        )}
        <ConfirmationModal
          open={deleteModal.open}
          onClose={() => setDeleteModal({ open: false, propertyId: null })}
          onConfirm={handleDeleteConfirm}
          title="Delete Public Property"
          message="Are you sure you want to delete this public property? This action cannot be undone."
        />
      </motion.div>
    </ErrorBoundary>
  );
};

export default PublicProperties;