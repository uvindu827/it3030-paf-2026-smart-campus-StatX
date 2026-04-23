import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import BookingListPage from "./pages/BookingListPage";
import AddBookingPage from "./pages/AddBookingPage";
import EditBookingPage from "./pages/EditBookingPage";
import BookingDetailsPage from "./pages/BookingDetailsPage";
import Login from "./pages/Login";
import LoginSuccess from "./pages/LoginSuccess";
import TicketListPage from "./pages/TicketListPage";
import TicketDashboard from './components/TicketDashboard';
import ResourcesPage from "./features/resources/ResourcesPage";
import UserResourcesPage from "./features/resources/UserResourcesPage";
import NotificationsPage from "./pages/NotificationPage";
import NotificationSettingsPage from "./pages/NotificationSettings";

import AdminLayout from './layouts/AdminLayout';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBookingManagement from './pages/admin/AdminBookingManagement';


function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/login-success';

  return (
    <>
      {/* 1. Hide Navbar on Login pages */}
      {!isAuthPage && <Navbar />}

      {/* 2. REMOVED "container" class - using w-full min-h-screen instead */}
      <div className="w-full min-h-screen">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/bookings" element={<BookingListPage />} />
          <Route path="/add-booking" element={<AddBookingPage />} />
          <Route path="/edit-booking/:id" element={<EditBookingPage />} />
          <Route path="/booking/:id" element={<BookingDetailsPage />} />
          <Route path="/tickets" element={<TicketListPage />} />
          <Route path="/ticket-dashboard" element={<TicketDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login-success" element={<LoginSuccess/>} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/browse" element={<UserResourcesPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/notification-settings" element={<NotificationSettingsPage />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="bookings" element={<AdminBookingManagement />} />
          </Route>

        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />
      <AppContent />
    </Router>
  );
}

export default App;