import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HotelBooking from "./features/HotelBooking/hotelbooking";
import ResourcesPage from "./features/resources/ResourcesPage";
// import "./App.css";

function App() {
  useEffect(() => {
    fetch("http://localhost:8080")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.text();
      })
      .then((data) => console.log(data))
      .catch((err) => console.error(err));
  }, []);

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