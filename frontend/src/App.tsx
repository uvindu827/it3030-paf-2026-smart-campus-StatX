import React, { useEffect} from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import BookingListPage from "./pages/BookingListPage";
import AddBookingPage from "./pages/AddBookingPage";
import EditBookingPage from "./pages/EditBookingPage";
import BookingDetailsPage from "./pages/BookingDetailsPage";
import Login from "./pages/Login";
import LoginSuccess from "./pages/LoginSuccess";
import ResourcesPage from "./features/resources/ResourcesPage";
import UserResourcesPage from "./features/resources/UserResourcesPage";
//import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/bookings" element={<BookingListPage />} />
          <Route path="/add-booking" element={<AddBookingPage />} />
          <Route path="/edit-booking/:id" element={<EditBookingPage />} />
          <Route path="/booking/:id" element={<BookingDetailsPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login-success" element={<LoginSuccess/>} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/browse" element={<UserResourcesPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;