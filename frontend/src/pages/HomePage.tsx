import { Link } from "react-router-dom";
import NotificationBell from "../components/NotificationBell";

function HomePage() {
  const userName = localStorage.getItem("userName") || "User";
  const initials = userName.split(" ").map(n => n[0]).join("").toUpperCase();
  const role = localStorage.getItem("role");

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎓</span>
            <h2 className="text-xl font-bold tracking-tight text-blue-600">SmartCampus</h2>
          </div>

          <div className="flex items-center gap-8">
            <div className="hidden space-x-6 md:flex items-center">
              <Link to="/home" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Home</Link>
              <Link to="/resources" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Resources</Link>
              <Link to="/bookings" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Bookings</Link>
              
              {/* Conditional Admin Link */}
              {role === 'ROLE_ADMIN' && (
                <Link to="/admin" className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg hover:bg-blue-100 transition-all">
                  🛡️ Admin Panel
                </Link>
              )}
            </div>
            
            <div className="h-6 w-px bg-slate-200"></div>
            
            {/* The Notification Bell - Hidden for Admin to prevent 500 errors */}
            {role !== 'ROLE_ADMIN' && <NotificationBell />}
            
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 shadow-sm border border-blue-200">
              {initials}
            </div>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="mx-auto max-w-4xl px-6 pt-20 pb-12 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
          Simplify Your <span className="text-blue-600">Campus Life</span>
        </h1>
        <p className="mt-6 text-lg leading-8 text-slate-600">
          The central hub for all academic resources. 
          {role === 'ROLE_ADMIN' ? " You are currently viewing the User Interface." : " Manage your bookings and stay informed."}
        </p>
      </header>

      {/* MAIN CONTENT */}
      <main className="mx-auto max-w-7xl px-6 pb-24">
        <div className="mb-8 flex items-center gap-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Modules</h3>
          <div className="h-px flex-1 bg-slate-200"></div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Resource Inventory */}
          <div className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
            <div>
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-2xl group-hover:bg-emerald-600 transition-colors">🏛️</div>
              <h2 className="text-xl font-bold text-slate-900">Campus Resources</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">Browse the full catalog of lecture halls, labs, and equipment.</p>
            </div>
            <div className="mt-8 flex items-center justify-between">
              <Link to="/resources" className="text-sm font-semibold text-emerald-600 hover:underline">Explore All</Link>
            </div>
          </div>

          {/* Booking Module */}
          <div className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
            <div>
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl group-hover:bg-blue-600 transition-colors">📅</div>
              <h2 className="text-xl font-bold text-slate-900">Resource Booking</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">Instantly reserve facilities or view your current schedule.</p>
            </div>
            <div className="mt-8 flex items-center justify-between">
              <Link to="/bookings" className="text-sm font-semibold text-blue-600 hover:underline">My Bookings</Link>
              <Link to="/add-booking" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 transition-all">New Booking</Link>
            </div>
          </div>

          {/* Notifications / Admin Action */}
          <div className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
            <div>
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-2xl group-hover:bg-purple-600 transition-colors">🔔</div>
              <h2 className="text-xl font-bold text-slate-900">Stay Updated</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">Get real-time feedback on your requests and campus alerts.</p>
            </div>
            <div className="mt-8 flex items-center justify-between">
              <Link to="/notifications" className="text-sm font-semibold text-purple-600 hover:underline">View Notifications</Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white py-12 text-center text-sm text-slate-500">
        © 2026 SmartCampus Management System
      </footer>
    </div>
  );
}

export default HomePage;