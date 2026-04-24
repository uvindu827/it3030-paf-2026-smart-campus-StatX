import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Ticket, AlertTriangle, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

// Simplified to just text colors!
const priorityClasses = {
  CRITICAL: "text-red-600",
  HIGH: "text-red-600",
  MEDIUM: "text-orange-500",
  LOW: "text-blue-500",
};

const statusDotClasses = {
  OPEN: "bg-slate-400",
  IN_PROGRESS: "bg-blue-500",
  RESOLVED: "bg-emerald-400",
  CLOSED: "bg-slate-800",
};

function TicketList() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // ✨ NEW: State to track which tab is active
  const [activeTab, setActiveTab] = useState('ALL');

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

  // 🌟 INNOVATION: Smart Dashboard Calculations
  const activeTicketsCount = tickets.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length;
  const highPriorityCount = tickets.filter(t => t.priority?.toUpperCase() === 'HIGH' || t.priority?.toUpperCase() === 'CRITICAL').length;
  const resolvedCount = tickets.filter(t => t.status?.toUpperCase() === 'RESOLVED' || t.status?.toUpperCase() === 'CLOSED').length;
  
  // Calculate Overdue (Tickets older than 24 hours that aren't resolved)
  const overdueTicketsCount = tickets.filter(t => {
    if (t.status === 'RESOLVED' || t.status === 'CLOSED') return false;
    const ticketAgeHours = (new Date() - new Date(t.createdAt)) / (1000 * 60 * 60);
    return ticketAgeHours > 24;
  }).length;

  // ✨ NEW: Filter tickets based on the selected tab
  const displayTickets = activeTab === 'EMERGENCY' 
    ? tickets.filter(t => t.priority?.toUpperCase() === 'HIGH' || t.priority?.toUpperCase() === 'CRITICAL')
    : tickets;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* HEADER */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Active Tickets</h1>
            <p className="text-sm text-slate-500">Monitor and manage real-time campus security incidents and requests.</p>
          </div>
        </div>

        {/* ✨ UPGRADED ADMIN KPI DASHBOARD ✨ */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 mt-4">
          
          {/* 1. Active Tickets Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500 rounded-l-2xl"></div>
            <div className="flex justify-between items-start pl-2">
              <div>
                <p className="text-[11px] font-black text-slate-400 tracking-widest uppercase mb-1">Active Workload</p>
                <h3 className="text-3xl font-black text-slate-800">{activeTicketsCount}</h3>
                <p className="text-xs font-medium text-slate-500 mt-2">Tickets Pending</p>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
                <Ticket className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* 2. High Priority Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-orange-500 rounded-l-2xl"></div>
            <div className="flex justify-between items-start pl-2">
              <div>
                <p className="text-[11px] font-black text-slate-400 tracking-widest uppercase mb-1">High Priority</p>
                <h3 className="text-3xl font-black text-slate-800">{highPriorityCount}</h3>
                <p className="text-xs font-medium text-slate-500 mt-2">Needs Attention</p>
              </div>
              <div className="p-3 bg-orange-50 text-orange-600 rounded-xl group-hover:scale-110 transition-transform">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* 3. Overdue Card */}
          <div className="bg-white rounded-2xl p-6 border border-red-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500 rounded-l-2xl"></div>
            <div className="flex justify-between items-start pl-2">
              <div>
                <p className="text-[11px] font-black text-red-400 tracking-widest uppercase mb-1">Overdue Tickets</p>
                <h3 className="text-3xl font-black text-red-600">{overdueTicketsCount}</h3>
                <p className="text-xs font-bold text-red-400 mt-2">&gt; 24h unresolved</p>
              </div>
              <div className="p-3 bg-red-50 text-red-600 rounded-xl group-hover:scale-110 transition-transform animate-pulse">
                <Clock className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* 4. Resolved Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500 rounded-l-2xl"></div>
            <div className="flex justify-between items-start pl-2">
              <div>
                <p className="text-[11px] font-black text-slate-400 tracking-widest uppercase mb-1">Resolved Total</p>
                <h3 className="text-3xl font-black text-slate-800">{resolvedCount}</h3>
                <p className="text-xs font-medium text-slate-500 mt-2">Tickets Completed</p>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
          </div>

        </div>

        {/* ✨ UPGRADED TICKET TABLE ✨ */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-8">
          
          {/* Table Header / Filters */}
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
            <div className="flex gap-2 bg-slate-50 p-1 rounded-xl border border-slate-100">
              <button 
                onClick={() => setActiveTab('ALL')}
                className={`px-5 py-2 rounded-lg text-xs tracking-wide transition-colors ${activeTab === 'ALL' ? 'bg-white text-indigo-700 font-black shadow-sm' : 'text-slate-500 hover:text-slate-700 font-bold'}`}
              >
                All Tickets
              </button>
              <button 
                onClick={() => setActiveTab('EMERGENCY')}
                className={`px-5 py-2 rounded-lg text-xs tracking-wide transition-colors ${activeTab === 'EMERGENCY' ? 'bg-white text-indigo-700 font-black shadow-sm' : 'text-slate-500 hover:text-slate-700 font-bold'}`}
              >
                Emergency Only
              </button>
            </div>
          </div>

          {/* Actual Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Ticket ID</th>
                  <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Category</th>
                  <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Priority</th>
                  <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Status</th>
                  <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr><td colSpan="5" className="text-center py-8 text-slate-500 animate-pulse font-medium">Loading live tickets...</td></tr>
                ) : displayTickets.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-8 text-slate-500 font-medium">No tickets found for this filter.</td></tr>
                ) : (
                  displayTickets.map((ticket) => {
                    // ✨ INNOVATION: Row-level Overdue calculation
                    const isResolved = ticket.status?.toUpperCase() === 'RESOLVED' || ticket.status?.toUpperCase() === 'CLOSED';
                    const ticketAgeHours = (new Date() - new Date(ticket.createdAt)) / (1000 * 60 * 60);
                    const isOverdue = !isResolved && ticketAgeHours > 24;

                    return (
                      <tr
                        key={ticket.id}
                        onClick={() => navigate(`/ticket/${ticket.id}`)}
                        className={`hover:bg-slate-50 transition-colors group cursor-pointer ${isOverdue ? 'bg-red-50/30' : ''}`}
                      >
                        <td className="py-4 px-6">
                          <span className="text-sm text-slate-700 transition-colors">#{ticket.id}</span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm text-slate-700">{ticket.category}</div>
                        </td>
                        <td className="py-4 px-6">
                          {/* 💅 FIXED: Font now perfectly matches Status column! */}
                          <span className={`text-xs font-bold tracking-wide uppercase ${priorityClasses[ticket.priority?.toUpperCase()] || "text-slate-500"}`}>
                            {ticket.priority?.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${statusDotClasses[ticket.status?.toUpperCase()] || "bg-slate-300"}`}></span>
                            <span className={`text-xs font-bold tracking-wide ${isResolved ? 'text-emerald-700' : 'text-slate-600'}`}>
                              {ticket.status?.toUpperCase().replace('_', ' ')}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          {/* 💅 FIXED: Date column flexes to push the subtle overdue icon to the right edge */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-500">
                              {formatDateTime(ticket.createdAt)}
                            </span>
                            {isOverdue && (
                              <AlertCircle className="w-4 h-4 text-slate-400 opacity-70" title="Overdue Ticket" />
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs font-semibold text-slate-400">
            <p>Showing {displayTickets.length} tickets</p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default TicketList;