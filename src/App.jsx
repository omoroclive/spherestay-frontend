import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'react-toastify/dist/ReactToastify.css';

// Components
import AuthLayout from './components/common/authenticationLayout';
import RegisterUser from '@/pages/auth/RegisterUser';
import RegisterHost from '@/pages/auth/RegisterHosts';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import MainLayout from '@/components/common/mainLayout';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminGuard from '@/components/admin/AdminGuard';
import Home from '@/pages/home/Home';
import Account from '@/pages/profile/Account';
import SubmitVerification from '@/pages/auth/SubmitVerification';
import UploadPhoto from '@/pages/auth/UploadPhoto';
import ResetPassword from '@/pages/auth/ResetPassword';
import UpdatePassword from '@/pages/auth/UpdatePassword';
import UpdateProfile from '@/pages/auth/UpdateProfile';
import PropertyDetail from '@/pages/propertiesDetails/PropertiesDetails';
import Properties from '@/pages/properties/Properties';
import SearchResults from '@/pages/search/SearchResults';
import PublicProperties from '@/pages/publicProperties/PublicProperties';
import PublicPropertiesDetails from '@/pages/publicProperties/PublicPropertiesDetails';
import ListProperty from '@/pages/propertyListing/ListProperty';
import Contact from '@/pages/contact/Contact';
import Help from '@/pages/help/Help';
import About from '@/pages/about/About';
import MyProperties from '@/pages/properties/MyProperties';
import Wishlist from '@/pages/properties/Wishlist';
import Policy from '@/pages/policy/Policy';
import Terms from '@/pages/terms/Terms';
import Login from '@/pages/auth/Login';
import Checkout from './pages/properties/Checkout';
import Dashboard from '@/pages/admin/Dashboard';
import Users from '@/pages/admin/Users';
import AdminProperties from '@/pages/admin/Properties';
import Bookings from '@/pages/admin/Bookings';
import AdminPublicProperties from '@/pages/admin/PublicProperties';
import Employees from '@/pages/admin/Employees';
import Accommodation from './pages/properties/Accomodation';
import CulturalTour from './pages/properties/CulturalTour';
import Beach from './pages/properties/Beach';
import Experience from './pages/properties/Experience';
import Transport from './pages/properties/Transport';

// Create a QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  const location = useLocation();
  const isAuthRoute = ['/login', '/register', '/forgot-password', '/register-host'].includes(location.pathname);

  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className={isAuthRoute ? 'mt-4' : 'mt-12 sm:mt-16 md:mt-20'}
        toastClassName="rounded-lg shadow-md max-w-[90vw] mx-auto"
      />
      <Routes>
        {/* Auth Routes - No Header */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterUser />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/register-host" element={<RegisterHost />} />
        </Route>

        {/* Main App Routes - With Header */}
        <Route element={<MainLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/list-property" element={<ListProperty />} />
          <Route path="/properties/:id" element={<PropertyDetail />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/public-properties" element={<PublicProperties />} />
          <Route path="/publicPropertiesdetails/:id" element={<PublicPropertiesDetails />} />
          <Route path="/my-properties" element={<MyProperties />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/help" element={<Help />} />
          <Route path="/about" element={<About />} />
          <Route path="/policy" element={<Policy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path='/accommodation' element={<Accommodation />} />
          <Route path='/culture' element={<CulturalTour />} />
          <Route path='/beach' element={<Beach />} />
          <Route path='/experience' element={<Experience />} />
          <Route path='/transport' element={<Transport />}  />
          <Route path="/account" element={<Account />}>
            <Route path="update-profile" element={<UpdateProfile />} />
            <Route path="update-password" element={<UpdatePassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route path="upload-photo" element={<UploadPhoto />} />
            <Route path="submit-verification" element={<SubmitVerification />} />
          </Route>
        </Route>

       {/* Admin Routes - With Admin Layout and Guard */}
<Route element={<AdminGuard />}>
  <Route element={<AdminLayout />}>
    <Route path="/admin/dashboard" element={<Dashboard />} />
    <Route path="/admin/users" element={<Users />} />
    <Route path="/admin/properties" element={<AdminProperties />} />
    <Route path="/admin/bookings" element={<Bookings />} />
    <Route path="/admin/public-properties" element={<AdminPublicProperties />} />
    <Route path="/admin/employees" element={<Employees />} />
  </Route>
</Route>


        {/* Default and catch-all routes */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;