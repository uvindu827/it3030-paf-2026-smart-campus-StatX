import React, { useEffect } from 'react';
import './App.css';
import HotelBooking from './features/HotelBooking/hotelbooking';

function App() {
  useEffect(() => {
    fetch("http://localhost:8080")
      .then(res => res.text())
      .then(data => console.log(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="App">
      <HotelBooking />
    </div>
  );
}

export default App;
