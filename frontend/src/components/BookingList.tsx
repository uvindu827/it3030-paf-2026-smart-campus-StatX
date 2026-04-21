import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { Booking } from "../types/booking";
import "../App.css";

interface BookingListProps {
  bookings: Booking[];
  onDelete: (id: number) => void;
}

type SortField =
  | "id"
  | "resourceName"
  | "requestedBy"
  | "bookingDate"
  | "expectedAttendees"
  | "status";

function BookingList({ bookings, onDelete }: BookingListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("");
  const [sortField, setSortField] = useState<SortField>("bookingDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredBookings = useMemo(() => {
    if (!bookings) return [];

    return bookings.filter((booking) => {
      const matchesSearch =
        booking.resourceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.requestedBy?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.purpose?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" || booking.status === statusFilter;

      const matchesDate =
        !dateFilter || booking.bookingDate === dateFilter;

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [bookings, searchTerm, statusFilter, dateFilter]);

  const sortedBookings = useMemo(() => {
    const sorted = [...filteredBookings];

    sorted.sort((a, b) => {
      let aValue: string | number = "";
      let bValue: string | number = "";

      switch (sortField) {
        case "id":
          aValue = a.id ?? 0;
          bValue = b.id ?? 0;
          break;
        case "resourceName":
          aValue = a.resourceName ?? "";
          bValue = b.resourceName ?? "";
          break;
        case "requestedBy":
          aValue = a.requestedBy ?? "";
          bValue = b.requestedBy ?? "";
          break;
        case "bookingDate":
          aValue = a.bookingDate ?? "";
          bValue = b.bookingDate ?? "";
          break;
        case "expectedAttendees":
          aValue = a.expectedAttendees ?? 0;
          bValue = b.expectedAttendees ?? 0;
          break;
        case "status":
          aValue = a.status ?? "";
          bValue = b.status ?? "";
          break;
        default:
          break;
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      return sortDirection === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });

    return sorted;
  }, [filteredBookings, sortField, sortDirection]);

  const totalPages = Math.ceil(sortedBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBookings = sortedBookings.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const totalBookings = bookings?.length || 0;
  const pendingBookings =
    bookings?.filter((booking) => booking.status === "PENDING").length || 0;
  const approvedBookings =
    bookings?.filter((booking) => booking.status === "APPROVED").length || 0;
  const totalAttendees =
    bookings?.reduce(
      (sum, booking) => sum + (booking.expectedAttendees || 0),
      0
    ) || 0;

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "status-badge approved";
      case "REJECTED":
        return "status-badge rejected";
      case "PENDING":
        return "status-badge pending";
      default:
        return "status-badge";
    }
  };

  const getSortIndicator = (field: SortField) => {
    if (sortField !== field) return "↕";
    return sortDirection === "asc" ? "↑" : "↓";
  };

  const handleDelete = (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this booking?"
    );
    if (confirmed) {
      onDelete(id);
    }
  };

  return (
    <div className="booking-dashboard">
      <div className="booking-dashboard-header">
        <div>
          <h1 className="booking-dashboard-title">Booking Management</h1>
          <p className="booking-dashboard-subtitle">
            Manage campus resource reservations, monitor statuses, and handle
            booking operations efficiently.
          </p>
        </div>

        <Link to="/add-booking" className="add-booking-btn">
          + Add Booking
        </Link>
      </div>

      <div className="booking-stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Bookings</div>
          <div className="stat-value">{totalBookings}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Pending Requests</div>
          <div className="stat-value">{pendingBookings}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Approved Bookings</div>
          <div className="stat-value">{approvedBookings}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Total Attendees</div>
          <div className="stat-value">{totalAttendees}</div>
        </div>
      </div>

      <div className="booking-controls">
        <div className="control-group search-group">
          <label htmlFor="search">Search</label>
          <input
            id="search"
            type="text"
            placeholder="Search by resource, requester, or purpose"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="control-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="control-group reset-group">
          <label>&nbsp;</label>
          <button
            className="reset-btn"
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("ALL");
              setDateFilter("");
              setSortField("bookingDate");
              setSortDirection("asc");
              setCurrentPage(1);
            }}
          >
            Reset Filters
          </button>
        </div>
      </div>

      <div className="booking-table-card">
        <div className="table-top-bar">
          <h2>Booking List</h2>
          <span className="table-result-text">
            Showing {sortedBookings.length} booking
            {sortedBookings.length !== 1 ? "s" : ""}
          </span>
        </div>

        {currentBookings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📅</div>
            <h3>No bookings found</h3>
            <p>Try changing your search or filters, or create a new booking.</p>
            <Link to="/add-booking" className="add-booking-btn empty-btn">
              + Create Booking
            </Link>
          </div>
        ) : (
          <>
            <div className="table-wrapper">
              <table className="booking-table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort("id")}>
                      ID {getSortIndicator("id")}
                    </th>
                    <th onClick={() => handleSort("resourceName")}>
                      Resource {getSortIndicator("resourceName")}
                    </th>
                    <th onClick={() => handleSort("requestedBy")}>
                      Requested By {getSortIndicator("requestedBy")}
                    </th>
                    <th onClick={() => handleSort("bookingDate")}>
                      Date {getSortIndicator("bookingDate")}
                    </th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Purpose</th>
                    <th onClick={() => handleSort("expectedAttendees")}>
                      Attendees {getSortIndicator("expectedAttendees")}
                    </th>
                    <th onClick={() => handleSort("status")}>
                      Status {getSortIndicator("status")}
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {currentBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>{booking.id}</td>
                      <td>{booking.resourceName}</td>
                      <td>{booking.requestedBy}</td>
                      <td>{booking.bookingDate}</td>
                      <td>{booking.startTime}</td>
                      <td>{booking.endTime}</td>
                      <td className="purpose-cell">{booking.purpose}</td>
                      <td>{booking.expectedAttendees}</td>
                      <td>
                        <span className={getStatusBadgeClass(booking.status)}>
                          {booking.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <Link
                            to={`/booking/${booking.id}`}
                            className="action-btn view-btn"
                            title="View Booking"
                          >
                            View
                          </Link>

                          <Link
                            to={`/edit-booking/${booking.id}`}
                            className="action-btn edit-btn"
                            title="Edit Booking"
                          >
                            Edit
                          </Link>

                          <button
                            className="action-btn delete-btn"
                            onClick={() => booking.id && handleDelete(booking.id)}
                            title="Delete Booking"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pagination-bar">
              <span>
                Showing {startIndex + 1}–
                {Math.min(startIndex + itemsPerPage, sortedBookings.length)} of{" "}
                {sortedBookings.length}
              </span>

              <div className="pagination-controls">
                <button
                  className="pagination-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  Previous
                </button>

                <span className="page-indicator">
                  Page {currentPage} of {totalPages || 1}
                </span>

                <button
                  className="pagination-btn"
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default BookingList;