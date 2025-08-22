import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUsers, FaHome, FaBookmark, FaMoneyBillWave, FaChartBar } from 'react-icons/fa';
import { toast } from 'react-toastify';

import AnalyticsCard from '../../components/admin/AnalyticsCard';
import AnalyticsChart from '../../components/admin/AnalyticsChart';
import AdminTable from '../../components/admin/AdminTable';
import LoadingSkeleton from '../../components/common/loading/SkeletonLoader';
import ErrorBoundary from '../../components/common/errorBoundary/ErrorBoundary';

import { fetchDashboardData } from '../../store/slices/dashboardSlice';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ✅ Get data from Redux store
  const { data, loading, error } = useSelector((state) => state.dashboard);

  // ✅ Fetch data on component mount
  useEffect(() => {
    console.log("Dashboard component mounted, dispatching fetchDashboardData...");
    dispatch(fetchDashboardData());
  }, [dispatch]);

  // ✅ Loading state
  if (loading) {
    return <LoadingSkeleton height="100vh" />;
  }

  // ✅ Error state
  if (error) {
    toast.error(`Error loading dashboard data: ${error}`);
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load dashboard data</p>
          <button 
            onClick={() => dispatch(fetchDashboardData())}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ✅ Show loading if no data yet
  if (!data) {
    return <LoadingSkeleton height="100vh" />;
  }

  // ✅ Extract data
  const { users = [], properties = [], bookings = [] } = data;

  console.log("Rendering dashboard with data:", { users, properties, bookings });

  // ✅ Chart data
  const bookingChartData = bookings.slice(0, 7).map((booking, index) => ({
    date: booking.createdAt 
      ? new Date(booking.createdAt).toLocaleDateString()
      : `Day ${index + 1}`,
    count: 1,
  }));

  const propertyTypeData = properties.reduce((acc, prop) => {
    const type = prop.type || 'Other';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});
  
  const pieData = Object.entries(propertyTypeData).map(([name, value]) => ({ name, value }));

  // ✅ Recent activity
  const recentActivity = [
    ...bookings.slice(0, 3).map((b) => ({
      id: b._id || Math.random(),
      type: 'Booking',
      description: `Booking for ${b.property?.title || 'Property'}`,
      date: b.createdAt 
        ? new Date(b.createdAt).toLocaleString()
        : 'No date available',
    })),
    ...users.slice(0, 2).map((u) => ({
      id: u._id || Math.random(),
      type: 'User',
      description: `New user: ${u.firstName || 'Unknown'} ${u.lastName || 'User'}`,
      date: u.createdAt 
        ? new Date(u.createdAt).toLocaleString()
        : 'No date available',
    })),
  ];

  const columns = [
    { field: 'type', headerName: 'Type', width: 100 },
    { field: 'description', headerName: 'Description', flex: 1 },
    { field: 'date', headerName: 'Date', width: 200 },
  ];

  // ✅ Calculate public properties (filter from all properties or use separate endpoint)
  const publicProperties = properties.filter(prop => prop.isPublic || prop.status === 'public') || [];

  return (
    <ErrorBoundary>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <button 
            onClick={() => dispatch(fetchDashboardData())}
            className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Refresh
          </button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <AnalyticsCard
            title="Total Users"
            value={users.length}
            trend="up"
            trendValue="5.2"
            icon={<FaUsers className="text-[#006644]" />}
          />
          <AnalyticsCard
            title="Total Properties"
            value={properties.length}
            trend="up"
            trendValue="3.1"
            icon={<FaHome className="text-[#006644]" />}
          />
          <AnalyticsCard
            title="Public Properties"
            value={publicProperties.length}
            trend="down"
            trendValue="1.4"
            icon={<FaBookmark className="text-[#006644]" />}
          />
          <AnalyticsCard
            title="Total Bookings"
            value={bookings.length}
            trend="up"
            trendValue="7.8"
            icon={<FaMoneyBillWave className="text-[#006644]" />}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnalyticsChart
            type="bar"
            data={bookingChartData}
            xKey="date"
            yKey="count"
            title="Bookings Over Time"
          />
          <AnalyticsChart
            type="pie"
            data={pieData}
            xKey="name"
            yKey="value"
            title="Property Types"
          />
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FaChartBar className="text-[#006644]" /> Recent Activity
          </h2>
          {recentActivity.length > 0 ? (
            <AdminTable rows={recentActivity} columns={columns} />
          ) : (
            <p className="text-gray-500 text-center py-4">No recent activity</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col md:flex-row gap-4">
          <button
            className="bg-gradient-to-r from-[#E83A17] to-[#ff4d26] text-white font-bold py-3 px-6 rounded-xl hover:from-[#c53214] hover:to-[#e03419] transition-all duration-300"
            onClick={() => navigate('/admin/properties?status=pending')}
          >
            Verify Properties
          </button>
          <button
            className="bg-gradient-to-r from-[#006644] to-[#00a876] text-white font-bold py-3 px-6 rounded-xl hover:from-[#005532] hover:to-[#008a5e] transition-all duration-300"
            onClick={() => navigate('/admin/public-properties/add')}
          >
            Add Public Property
          </button>
        </div>
      </motion.div>
    </ErrorBoundary>
  );
};

export default Dashboard;