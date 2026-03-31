import React, { useState } from "react";
import "../HotelBooking/hotelbooking.css";

const HotelBooking: React.FC = () => {
  const [name, setName] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="hotel-booking-container">
      <h1>🏨 Hotel Booking Management</h1>
      <p>Plan your stay with ease and comfort.</p>

      {!submitted ? (
        <form className="booking-form" onSubmit={handleSubmit}>
          <label>
            Full Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label>
            Check‑In Date:
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              required
            />
          </label>

          <label>
            Check‑Out Date:
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              required
            />
          </label>

          <label>
            Guests:
            <input
              type="number"
              min="1"
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              required
            />
          </label>

          <button type="submit">Confirm Booking</button>
        </form>
      ) : (
        <div className="confirmation">
          <h2>✅ Booking Confirmed!</h2>
          <p>
            Thank you, <strong>{name}</strong>. Your stay from{" "}
            <strong>{checkIn}</strong> to <strong>{checkOut}</strong> for{" "}
            <strong>{guests}</strong> guest(s) has been reserved.
          </p>
        </div>
      )}
    </div>
  );
};

export default HotelBooking;
