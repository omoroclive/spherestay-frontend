import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'react-toastify/dist/ReactToastify.css';

// Components
import AuthLayout from './components/common/authenticationLayout';
import RegisterUser from '@/pages/auth/RegisterUser';
//import RegisterUser from '@/pages/auth/RegisterUser';
import RegisterHost from '@/pages/auth/registerHosts';
import ForgotPassword from '@/pages/auth/forgotPassword'; // Ensure this matches the file name
import MainLayout from '@/components/common/mainLayout';
import Home from '@/pages/Home/home';
import Account from '@/pages/Profile/Account';
import SubmitVerification from '@/pages/auth/submitVerification';
import UploadPhoto from '@/pages/auth/uploadPhoto';
import ResetPassword from '@/pages/auth/resetPassword';
import UpdatePassword from '@/pages/auth/updatePassword';
import UpdateProfile from '@/pages/auth/updateProfile';
import PropertyDetail from '@/pages/propertiesDetails/propertiesDetails'; 
import Properties from '@/pages/properties/Properties';
import SearchResults from '@/pages/search/SearchResults';
import PublicProperties from '@/pages/publicProperties/publicProperties';
import PublicPropertiesDetails from '@/pages/publicProperties/publicPropertiesDetails';
import ListProperty from '@/pages/propertyListing/listProperty';
import Contact from '@/pages/contact/contact';
import Help from '@/pages/help/Help';
import About from '@/pages/about/About';
import MyProperties from '@/pages/properties/myProperties';
import Wishlist from '@/pages/properties/Wishlist';
import Policy from '@/pages/policy/Policy';
import Terms from '@/pages/terms/terms';
import Login from '@/pages/auth/Login';

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
          <Route path='/wishlist' element={<Wishlist/>} />
          <Route path='/contact' element={<Contact />} />
          <Route path="/help" element={<Help />} />
          <Route path='/about' element={<About />} />
          <Route path='/policy' element={<Policy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/account" element={<Account />}>
            <Route path="update-profile" element={<UpdateProfile />} />
            <Route path="update-password" element={<UpdatePassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route path="upload-photo" element={<UploadPhoto />} />
            <Route path="submit-verification" element={<SubmitVerification />} />
          </Route>
          {/* Other routes remain unchanged */}
        </Route>
        
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
        <Route path="/search" element={<SearchResults />} />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;