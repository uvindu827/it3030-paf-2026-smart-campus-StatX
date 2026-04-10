import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import AddBookingPage from "./pages/AddBookingPage";
import EditBookingPage from "./pages/EditBookingPage";
import BookingDetailsPage from "./pages/BookingDetailsPage";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/add-booking" element={<AddBookingPage />} />
          <Route path="/edit-booking/:id" element={<EditBookingPage />} />
          <Route path="/booking/:id" element={<BookingDetailsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;