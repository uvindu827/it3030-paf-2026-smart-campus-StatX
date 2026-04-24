import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Updated to match your Java Backend Enums
const priorityClasses = {
  CRITICAL: "bg-red-100 text-red-700",
  HIGH: "bg-red-100 text-red-700",
  MEDIUM: "bg-amber-100 text-amber-700",
  LOW: "bg-blue-100 text-blue-700",
};

const statusDotClasses = {
  OPEN: "bg-slate-400",
  IN_PROGRESS: "bg-blue-500",
  RESOLVED: "bg-emerald-500",
  CLOSED: "bg-slate-800",
};

function TicketList() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ✨ DYNAMIC DASHBOARD CALCULATIONS ✨
  // We make sure to check both uppercase and Title case just in case the backend formatting changes!
  const highPriorityCount = tickets.filter(t => t.priority?.toUpperCase() === 'HIGH' || t.priority?.toUpperCase() === 'CRITICAL').length;
  const inProgressCount = tickets.filter(t => t.status?.toUpperCase() === 'OPEN' || t.status?.toUpperCase() === 'IN_PROGRESS').length;
  const unassignedCount = tickets.filter(t => !t.assignedTo).length; 
  const resolvedCount = tickets.filter(t => t.status?.toUpperCase() === 'RESOLVED' || t.status?.toUpperCase() === 'CLOSED').length;

  // We moved this INSIDE the function so it can see your calculations above!
  const ticketStats = [
    { id: 1, label: "High Priority", value: highPriorityCount, accent: "text-red-600", iconBg: "bg-red-50", icon: "!" },
    { id: 2, label: "In Progress", value: inProgressCount, accent: "text-amber-600", iconBg: "bg-amber-50", icon: "◉" },
    { id: 3, label: "Unassigned", value: unassignedCount, accent: "text-slate-700", iconBg: "bg-slate-100", icon: "📋" },
    { id: 4, label: "Resolved Today", value: resolvedCount, accent: "text-blue-600", iconBg: "bg-blue-50", icon: "✓" },
  ];

  // Fetch real tickets from database
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/tickets");
        if (response.ok) {
          const data = await response.json();
          setTickets(data);
        } else {
          console.error("Failed to fetch ticket list.");
        }
      } catch (error) {
        console.error("API Connection Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, []);

  // Helper to format Java LocalDateTime to a clean string
  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* HEADER */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Active Tickets</h1>
            <p className="text-sm text-slate-500">Monitor and manage real-time campus security incidents and requests.</p>
          </div>
          <button
            type="button"
            // Fixed the route here to match our new setup!
            onClick={() => navigate('/create-ticket')}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800"
          >
            <span className="text-lg leading-none">+</span>
            Create New Ticket
          </button>
        </div>

        {/* STATS ROW */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {ticketStats.map((stat) => (
            <div key={stat.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <span className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold ${stat.iconBg} ${stat.accent}`}>
                  {stat.icon}
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{stat.label}</p>
                  <p className="mt-1 text-3xl font-extrabold text-slate-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* TABLE COMPONENT */}
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm md:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button className="rounded-full bg-blue-900 px-4 py-1.5 text-xs font-semibold text-white">All Tickets</button>
              <button className="rounded-full px-4 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-100">Emergency Only</button>
            </div>
            <div className="text-xs text-slate-400">Sort / Filter</div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-2">
              <thead>
                <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <th className="px-3 py-2">Ticket ID</th>
                  <th className="px-3 py-2">Category</th>
                  <th className="px-3 py-2">Priority</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Date &amp; Time</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan="6" className="text-center py-8 text-slate-500 animate-pulse">Loading live tickets...</td></tr>
                ) : tickets.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-8 text-slate-500">No active tickets found.</td></tr>
                ) : (
                  tickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      // Fixed the route here to match our new setup!
                      onClick={() => navigate(`/ticket/${ticket.id}`)}
                      className="cursor-pointer rounded-xl bg-white text-sm text-slate-700 outline outline-1 outline-slate-100 transition hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-sm"
                    >
                      <td className="rounded-l-xl px-3 py-3 font-semibold text-blue-900">#{ticket.id}</td>
                      <td className="px-3 py-3 font-medium">{ticket.category}</td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${priorityClasses[ticket.priority?.toUpperCase()] || "bg-slate-100 text-slate-700"}`}>
                          {ticket.priority?.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span className="inline-flex items-center gap-2 font-medium">
                          <span className={`h-2.5 w-2.5 rounded-full ${statusDotClasses[ticket.status?.toUpperCase()] || "bg-slate-300"}`} />
                          {/* Replaces underscores with spaces (e.g. IN_PROGRESS -> IN PROGRESS) */}
                          {ticket.status?.toUpperCase().replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-slate-500">{formatDateTime(ticket.createdAt)}</td>
                      <td className="rounded-r-xl px-3 py-3 text-right text-slate-400">⋮</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <p>Showing {tickets.length} active tickets</p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default TicketList;