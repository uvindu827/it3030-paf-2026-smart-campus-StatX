import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import BookingListPage from "./pages/BookingListPage";
import AddBookingPage from "./pages/AddBookingPage";
import EditBookingPage from "./pages/EditBookingPage";
import BookingDetailsPage from "./pages/BookingDetailsPage";
import Login from "./pages/Login";
import LoginSuccess from "./pages/LoginSuccess";
import TicketListPage from "./pages/TicketListPage";
import ResourcesPage from "./features/resources/ResourcesPage";
import UserResourcesPage from "./features/resources/UserResourcesPage";

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
          <Route path="/tickets" element={<TicketListPage />} />
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