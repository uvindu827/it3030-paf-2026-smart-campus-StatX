import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';

// Components & Layouts
import Navbar from "./components/Navbar";
import AdminLayout from './layouts/AdminLayout';

// User Pages
import HomePage from "./pages/HomePage";
import BookingListPage from "./pages/BookingListPage";
import AddBookingPage from "./pages/AddBookingPage";
import EditBookingPage from "./pages/EditBookingPage";
import BookingDetailsPage from "./pages/BookingDetailsPage";
import TicketListPage from "./pages/TicketListPage";
import NotificationsPage from "./pages/NotificationPage";
import NotificationSettingsPage from "./pages/NotificationSettings";
import UserManagement from "./pages/admin/UserManagement";

// ✨ NEW SEPARATED TICKET PAGES ✨
import CreateTicket from "./components/CreateTicket";
import AdminTicketDetails from "./components/AdminTicketDetails";

// Resource Pages
import ResourcesPage from "./features/resources/ResourcesPage";
import UserResourcesPage from "./features/resources/UserResourcesPage";

// Auth Pages
import Login from "./pages/Login";
import LoginSuccess from "./pages/LoginSuccess";

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBookingManagement from './pages/admin/AdminBookingManagement';

/**
 * AppContent handles the conditional rendering of the Navbar 
 * and defines the routing structure.
 */
function AppContent() {
  const location = useLocation();
  
  // Define pages where the Navbar should NOT be displayed
  const isAuthPage = location.pathname === '/login' || location.pathname === '/login-success';
  
  // Check if user is logged in by looking for the role in storage
  const isAuthenticated = !!localStorage.getItem("role");

  return (
    <>
      {/* 1. Show Navbar only for logged-in users and non-auth pages */}
      {!isAuthPage && <Navbar />}

      <div className="w-full min-h-screen">
        <Routes>
          {/* ROOT REDIRECT */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* PUBLIC / AUTH ROUTES */}
          <Route path="/login" element={<Login />} />
          <Route path="/login-success" element={<LoginSuccess />} />

          {/* PROTECTED USER ROUTES */}
          <Route 
            path="/home" 
            element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/bookings" 
            element={isAuthenticated ? <BookingListPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/add-booking" 
            element={isAuthenticated ? <AddBookingPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/edit-booking/:id" 
            element={isAuthenticated ? <EditBookingPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/booking/:id" 
            element={isAuthenticated ? <BookingDetailsPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/tickets" 
            element={isAuthenticated ? <TicketListPage /> : <Navigate to="/login" />} 
          />
          
          {/* ✨ OUR NEW ROUTES ✨ */}
          <Route 
            path="/create-ticket" 
            element={isAuthenticated ? <CreateTicket /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/ticket/:id" 
            element={isAuthenticated ? <AdminTicketDetails /> : <Navigate to="/login" />} 
          />

          <Route 
            path="/resources" 
            element={isAuthenticated ? <ResourcesPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/browse" 
            element={isAuthenticated ? <UserResourcesPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/notifications" 
            element={isAuthenticated ? <NotificationsPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/notification-settings" 
            element={isAuthenticated ? <NotificationSettingsPage /> : <Navigate to="/login" />} 
          />

          {/* PROTECTED ADMIN ROUTES */}
          <Route 
            path="/admin" 
            element={isAuthenticated ? <AdminLayout /> : <Navigate to="/login" />}
          >
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="bookings" element={<AdminBookingManagement />} />
            <Route path="/admin/users" element={<UserManagement />} />
          </Route>

          {/* CATCH-ALL REDIRECT */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </div>
    </>
  );
}

/**
 * Root App Component
 */
function App() {
  return (
    <Router>
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        theme="light"
      />
      <AppContent />
    </Router>
  );
}

export default App;