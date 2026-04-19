import React from "react";

const ticketStats = [
  { id: 1, label: "High Priority", value: 12, accent: "text-red-600", iconBg: "bg-red-50", icon: "!" },
  { id: 2, label: "In Progress", value: 28, accent: "text-amber-600", iconBg: "bg-amber-50", icon: "◉" },
  { id: 3, label: "Unassigned", value: "05", accent: "text-slate-700", iconBg: "bg-slate-100", icon: "📋" },
  { id: 4, label: "Resolved Today", value: 43, accent: "text-blue-600", iconBg: "bg-blue-50", icon: "✓" },
];

const ticketRows = [
  { id: "TK-8821", category: "Unauthorized Access", priority: "High", status: "In Progress", dateTime: "Oct 24, 09:45 AM" },
  { id: "TK-8819", category: "Medical Assist", priority: "Medium", status: "Pending", dateTime: "Oct 24, 08:30 AM" },
  { id: "TK-8815", category: "Facility Repair", priority: "Low", status: "Resolved", dateTime: "Oct 23, 04:15 PM" },
  { id: "TK-8812", category: "HVAC Malfunction", priority: "Medium", status: "In Progress", dateTime: "Oct 23, 01:20 PM" },
  { id: "TK-8808", category: "CCTV Blindspot", priority: "High", status: "Pending", dateTime: "Oct 23, 11:05 AM" },
];

const priorityClasses = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-blue-100 text-blue-700",
};

const statusDotClasses = {
  "In Progress": "bg-blue-500",
  Pending: "bg-slate-400",
  Resolved: "bg-emerald-500",
};

function TicketList() {
  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Active Tickets</h1>
            <p className="text-sm text-slate-500">Monitor and manage real-time campus security incidents and requests.</p>
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800"
          >
            <span className="text-lg leading-none">+</span>
            Create New Ticket
          </button>
        </div>

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

        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm md:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button className="rounded-full bg-blue-900 px-4 py-1.5 text-xs font-semibold text-white">All Tickets</button>
              <button className="rounded-full px-4 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-100">Emergency Only</button>
              <button className="rounded-full px-4 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-100">Facilities</button>
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
                {ticketRows.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="cursor-pointer rounded-xl bg-white text-sm text-slate-700 outline outline-1 outline-slate-100 transition hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-sm"
                  >
                    <td className="rounded-l-xl px-3 py-3 font-semibold text-blue-900">#{ticket.id}</td>
                    <td className="px-3 py-3">{ticket.category}</td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${priorityClasses[ticket.priority]}`}>
                        {ticket.priority.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className="inline-flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${statusDotClasses[ticket.status]}`} />
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-slate-500">{ticket.dateTime}</td>
                    <td className="rounded-r-xl px-3 py-3 text-right text-slate-400">⋮</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <p>Showing {ticketRows.length} of 45 active tickets</p>
            <div className="flex items-center gap-2">
              <button className="rounded border border-slate-200 px-3 py-1 hover:bg-slate-100">Previous</button>
              <button className="rounded border border-slate-200 px-3 py-1 hover:bg-slate-100">Next</button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm lg:col-span-2">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Geospatial Ticket Distribution</h2>
              <button className="text-xs font-semibold text-blue-700 hover:text-blue-800">Full Campus Map</button>
            </div>
            <div className="flex h-52 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 via-green-50 to-slate-100 text-sm text-slate-500">
              Campus map widget placeholder
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-blue-900 to-blue-700 p-6 text-white shadow-sm">
            <p className="mb-6 text-sm uppercase tracking-wide text-blue-100">Response Time Performance</p>
            <p className="text-sm leading-6 text-blue-100">
              System average response time is currently at <span className="font-semibold text-white">4.2 minutes</span>.
              That&apos;s <span className="font-semibold text-white">12% faster</span> than last week.
            </p>
            <div className="mt-8">
              <div className="h-2 w-full rounded-full bg-blue-800">
                <div className="h-2 w-[88%] rounded-full bg-white" />
              </div>
              <p className="mt-2 text-xs font-semibold text-blue-100">88% of target speed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketList;
export { ticketRows, ticketStats };
