// client/src/App.jsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserLayout from './layouts/UserLayout';
import HomePage from './pages/HomePage';
import TrackingPage from './pages/TrackingPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute'
import CustomerDashboardPage from './pages/CustomerDashboardPage';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminServiceListPage from './pages/AdminServiceListPage';
import AdminRateTariffPage from './pages/AdminRateTariffPage';
import ServiceForm from './components/ServiceForm';
import RateTariffForm from './components/RateTariffForm';
import AdminShipmentListPage from './pages/AdminShipmentListPage';
import AdminShipmentForm from './components/AdminShipmentForm';
import AdminTrackingUpdatePage from './pages/AdminTrackingUpdatePage';
import AdminQuoteListPage from './pages/AdminQuoteListPage';
import AdminQuoteDetailsPage from './pages/AdminQuoteDetailsPage'

function App() {
  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES(uses UserLayout) */}
        <Route path='/' element={<UserLayout><HomePage /></UserLayout>} />
        <Route path='/tracking/:trackingNumber?' element={<UserLayout><TrackingPage /></UserLayout>} />
        <Route path='/services' element={<UserLayout><ServicesPage /></UserLayout>} />
        <Route path='/contact' element={<UserLayout><ContactPage /></UserLayout>} />

        {/*keeping login/register simple outside the main layout for focused UX */}
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} /> 

        {/* PROTECTED CUSTOMER ROUTES (Uses ProtectedRoute + UserLayout) */}
        <Route path='/account/dashboard' element={<ProtectedRoute><UserLayout><CustomerDashboardPage /></UserLayout></ProtectedRoute>} />


        {/* PROTECTED ADMIN ROUTES (Uses ProtectedRoute + AdminLayout) */}
        <Route path='/admin/dashboard' element={<ProtectedRoute isAdmin={true}><AdminLayout><AdminDashboardPage /></AdminLayout></ProtectedRoute>} />
        
        <Route path='/admin/services' element={<ProtectedRoute isAdmin={true}><AdminLayout><AdminServiceListPage /></AdminLayout></ProtectedRoute>} />
        <Route path='/admin/services/create' element={<ProtectedRoute isAdmin={true}><AdminLayout><ServiceForm /></AdminLayout></ProtectedRoute>} />
        <Route path='/admin/services/:id/edit' element={<ProtectedRoute isAdmin={true}><AdminLayout><ServiceForm /></AdminLayout></ProtectedRoute>} />

        <Route path='/admin/rates' element={<ProtectedRoute isAdmin={true}><AdminLayout><AdminRateTariffPage /></AdminLayout></ProtectedRoute>} />
        <Route path='/admin/rates/create' element={<ProtectedRoute isAdmin={true}><AdminLayout><RateTariffForm /></AdminLayout></ProtectedRoute>} />
        <Route path='/admin/rates/:id/edit' element={<ProtectedRoute isAdmin={true}><AdminLayout><RateTariffForm /></AdminLayout></ProtectedRoute>} />

        <Route path='/admin/shipments' element={<ProtectedRoute isAdmin={true}><AdminLayout><AdminShipmentListPage /></AdminLayout></ProtectedRoute>} />
        <Route path='/admin/shipments/create' element={<ProtectedRoute isAdmin={true}><AdminLayout><AdminShipmentForm /></AdminLayout></ProtectedRoute>} />
        <Route path='/admin/shipments/:id/track' element={<ProtectedRoute isAdmin={true}><AdminLayout><AdminTrackingUpdatePage /></AdminLayout></ProtectedRoute>} />
        <Route path='/admin/shipments/create' element={<ProtectedRoute isAdmin={true}><AdminLayout><AdminShipmentForm /></AdminLayout></ProtectedRoute>} />

        <Route path="/admin/quotes" element={<ProtectedRoute isAdmin={true}><AdminLayout><AdminQuoteListPage /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/quotes/:id" element={<ProtectedRoute isAdmin={true}><AdminLayout><AdminQuoteDetailsPage /></AdminLayout></ProtectedRoute>} />

        
        {/* 404 Route */}
        <Route path='*' element={<UserLayout>
          <h1 className="text-2xl! text-center! py-20! text-red-600 dark:text-red-400">404 Page Not Found.</h1>
          
          </UserLayout>} />
      </Routes>
    </Router>
  );
}

export default App;