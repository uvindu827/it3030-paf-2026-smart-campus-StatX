// frontend/src/pages/HomePage.tsx

import { Link } from "react-router-dom";
import NotificationBell from "../components/NotificationBell";

function HomePage() {
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
            <div className="hidden space-x-6 md:flex">
              <Link to="/" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Home</Link>
              <Link to="/bookings" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Bookings</Link>
              <Link to="/notifications" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Notifications</Link>
            </div>
            <div className="h-6 w-px bg-slate-200"></div>
            <NotificationBell />
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 shadow-sm">
              PS
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
          The central hub for all your academic resource needs. Manage bookings, 
          track maintenance, and stay informed with real-time updates.
        </p>
      </header>

      {/* MAIN CONTENT */}
      <main className="mx-auto max-w-7xl px-6 pb-24">
        <div className="mb-8 flex items-center gap-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Available Modules</h3>
          <div className="h-px flex-1 bg-slate-200"></div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          
          {/* Booking Module Card */}
          <div className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
            <div>
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl group-hover:bg-blue-600 group-hover:animate-pulse transition-colors">
                📅
              </div>
              <h2 className="text-xl font-bold text-slate-900">Resource Booking</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">
                Instantly reserve lecture halls, laboratories, or audio-visual equipment. 
                View live availability and manage your schedule.
              </p>
            </div>
            <div className="mt-8 flex items-center justify-between">
              <Link to="/bookings" className="text-sm font-semibold text-blue-600 hover:underline">View Schedule</Link>
              <Link to="/add-booking" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-md hover:bg-blue-700 transition-all">
                New Booking
              </Link>
            </div>
          </div>

          {/* Notifications Module Card */}
          <div className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
            <div>
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-2xl group-hover:bg-purple-600 transition-colors">
                🔔
              </div>
              <h2 className="text-xl font-bold text-slate-900">Live Notifications</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">
                Receive instant feedback on booking approvals, system maintenance windows, 
                and urgent campus announcements.
              </p>
            </div>
            <div className="mt-8 flex items-center justify-between">
              <Link to="/notifications" className="text-sm font-semibold text-purple-600 hover:underline">View All</Link>
              <Link to="/notification-settings" className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all">
                Settings
              </Link>
            </div>
          </div>

          {/* Coming Soon Ticket Card */}
          <div className="relative flex flex-col rounded-2xl border border-slate-100 bg-slate-50/50 p-8 grayscale opacity-75">
            <div>
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-200 text-2xl text-slate-400">
                🎫
              </div>
              <h2 className="text-xl font-bold text-slate-400">Support Tickets</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Report technical issues or facility maintenance requests directly to 
                the administrative team.
              </p>
            </div>
            <div className="mt-8">
              <span className="inline-flex items-center rounded-full bg-slate-200 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Coming Soon
              </span>
            </div>
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-sm text-slate-500">
            © 2026 SmartCampus Management System | Crafted for Higher Education Efficiency
          </p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;