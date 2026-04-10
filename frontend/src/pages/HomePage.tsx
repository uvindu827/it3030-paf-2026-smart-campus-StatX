import { Link } from "react-router-dom";

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

          {/* MODULE CARD */}
          <div className="module-card">
            <h2>Booking Management Module</h2>

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