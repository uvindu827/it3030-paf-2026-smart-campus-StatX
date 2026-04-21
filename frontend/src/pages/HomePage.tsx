// frontend/src/pages/HomePage.tsx

import { Link } from "react-router-dom";
import NotificationBell from "../components/NotificationBell";

function HomePage() {
  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar">
        <h2>SmartCampus Management System</h2>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/bookings">Bookings</Link>
          <Link to="/add-booking">Add Booking</Link>
          <Link to="/notifications" className="nav-link-notifications">
            Notifications
          </Link>
          
          {/* ✅ NOTIFICATION BELL - Added here */}
          <NotificationBell />
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="container">
        <div className="page">
          <h1>Welcome to SmartCampus Management System</h1>

          <p className="home-text">
            This system helps manage campus operations efficiently. Use the
            navigation menu to access different modules of the system.
          </p>

          {/* MODULE CARDS GRID */}
          <div className="modules-grid">
            {/* Booking Module Card */}
            <div className="module-card">
              <div className="module-icon">📅</div>
              <h2>Booking Management</h2>
              <p>
                Manage resource bookings, create new reservations, update existing
                bookings, and view booking details.
              </p>
              <div className="button-group">
                <Link to="/bookings" className="btn primary-btn">
                  View Bookings
                </Link>
                <Link to="/add-booking" className="btn success-btn">
                  Add Booking
                </Link>
              </div>
            </div>

            {/* Notifications Module Card */}
            <div className="module-card">
              <div className="module-icon">🔔</div>
              <h2>Notifications</h2>
              <p>
                Stay updated with real-time notifications about your bookings,
                tickets, and system updates.
              </p>
              <div className="button-group">
                <Link to="/notifications" className="btn primary-btn">
                  View Notifications
                </Link>
                <Link to="/notification-settings" className="btn secondary-btn">
                  Settings
                </Link>
              </div>
            </div>

            {/* Placeholder for future modules */}
            <div className="module-card coming-soon">
              <div className="module-icon">🎫</div>
              <h2>Ticket Management</h2>
              <p>
                Create and manage maintenance tickets and incident reports
                (Coming Soon)
              </p>
              <span className="coming-soon-badge">Coming Soon</span>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <p>© 2026 SmartCampus Management System | PAF Project</p>
      </footer>
    </>
  );
}

export default HomePage;