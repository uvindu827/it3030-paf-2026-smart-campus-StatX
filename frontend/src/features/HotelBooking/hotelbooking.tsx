import React, { useState } from "react";
import "./hotelbooking.css";

const HotelBooking: React.FC = () => {
  const [name, setName] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [confirmation, setConfirmation] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const booking = { name, checkIn, checkOut, guests };

    try {
      const response = await fetch("http://localhost:8080/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(booking),
      });

      const data = await response.text();
      setConfirmation(data);
    } catch (err) {
      console.error(err);
      setConfirmation("❌ Booking failed. Please try again.");
    }
  };

  return (
    <div className="hotel-booking-container">
      <h1>🏨 Hotel Booking Management</h1>
      <p>Plan your stay with ease and comfort.</p>

      {!confirmation ? (
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
          <p>{confirmation}</p>
        </div>
      )}
    </div>
  );
};

export default HotelBooking;
