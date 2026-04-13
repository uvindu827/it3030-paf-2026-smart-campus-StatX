import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HotelBooking from "./features/HotelBooking/hotelbooking";
import ResourcesPage from "./features/resources/ResourcesPage";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HotelBooking />} />
          <Route path="/resources" element={<ResourcesPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;