import React, { useState } from "react";
import { useResources } from "./useResources";
import { Resource, ResourceType } from "./resourceApi";
import ResourceDetailModal from "./ResourceDetailModal";

// ─── CONSTANTS & STYLES ──────────────────────────────────────────────────────

const TYPE_ICONS_MAP: Record<string, string> = {
  LECTURE_HALL: "🏛️",
  LABORATORY: "🔬",
  MEETING_ROOM: "🤝",
  EQUIPMENT: "🎥",
};

const TYPE_LABELS_MAP: Record<string, string> = {
  LECTURE_HALL: "Lecture Hall",
  LABORATORY: "Laboratory",
  MEETING_ROOM: "Meeting Room",
  EQUIPMENT: "Equipment",
};

const filterInputStyle: React.CSSProperties = {
  padding: "8px 12px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  fontSize: "13px",
  outline: "none",
  minWidth: "160px",
  flex: 1,
};

// ─── RESOURCE CARD COMPONENT ────────────────────────────────────────────────

interface UserCardProps {
  resource: Resource;
  onViewDetail: (resource: Resource) => void;
  onBook: (resource: Resource) => void;
  onReportIssue: (resource: Resource) => void;
}

const UserResourceCard: React.FC<UserCardProps> = ({ resource, onViewDetail, onBook, onReportIssue }) => {
  return (
    <div 
      style={{
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      {/* Visual Header */}
      <div style={{
        width: "100%", height: "100px",
        background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
        borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px",
      }}>
        {TYPE_ICONS_MAP[resource.type] || "🏢"}
      </div>

      <div style={{ fontSize: "11px", fontWeight: 700, color: "#6366f1", textTransform: "uppercase" }}>
        {TYPE_LABELS_MAP[resource.type]}
      </div>

      <h3 style={{ margin: 0, fontSize: "18px", color: "#1e293b" }}>{resource.name}</h3>
      
      <div style={{ fontSize: "13px", color: "#64748b" }}>
        📍 {resource.location} • 👥 Cap: {resource.capacity}
      </div>

      {/* Main Actions */}
      <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
        <button
          onClick={() => onViewDetail(resource)}
          style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid #e2e8f0", cursor: "pointer" }}
        >
          Details
        </button>
        <button
          onClick={() => onBook(resource)}
          style={{ 
            flex: 2, padding: "8px", borderRadius: "6px", border: "none", 
            background: "#4f46e5", color: "white", fontWeight: "bold", cursor: "pointer" 
          }}
        >
          📅 Book Now
        </button>
      </div>

      {/* Secondary Action */}
      <button
        onClick={() => onReportIssue(resource)}
        style={{
          background: "none", border: "none", color: "#94a3b8", fontSize: "12px", 
          textDecoration: "underline", cursor: "pointer", marginTop: "4px"
        }}
      >
        Report an issue
      </button>
    </div>
  );
};

// ─── MAIN PAGE COMPONENT ────────────────────────────────────────────────────

const UserResourcesPage: React.FC = () => {
  const { resources, loading, error, filters, setFilters } = useResources();
  const [viewingResource, setViewingResource] = useState<Resource | null>(null);

  const activeResources = resources.filter((r) => r.status === "ACTIVE");

  /**
   * Navigate to Add Booking Page
   * Passes resourceId and resourceName via URL Search Params
   */
  const handleBook = (resource: Resource) => {
    const params = new URLSearchParams({
      resourceId: resource.id.toString(),
      resourceName: resource.name
    });
    // Navigates to your booking module
    window.location.href = `/add-booking?${params.toString()}`;
  };

  /**
   * Navigate to Ticket Page
   */
  const handleReportIssue = (resource: Resource) => {
    const params = new URLSearchParams({
      resId: resource.id.toString(),
      resName: resource.name
    });
    window.location.href = `/create-ticket?${params.toString()}`;
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "24px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 800 }}>🏢 Campus Resources</h1>
        <p style={{ color: "#64748b" }}>Select a resource to start your booking</p>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
         <input
          placeholder="Search resources..."
          onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
          style={filterInputStyle}
        />
      </div>

      {/* Grid */}
      {loading ? (
        <p>Loading resources...</p>
      ) : (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", 
          gap: "20px" 
        }}>
          {activeResources.map((resource) => (
            <UserResourceCard
              key={resource.id}
              resource={resource}
              onViewDetail={setViewingResource}
              onBook={handleBook}
              onReportIssue={handleReportIssue}
            />
          ))}
        </div>
      )}

      {viewingResource && (
        <ResourceDetailModal 
          resource={viewingResource} 
          onClose={() => setViewingResource(null)} 
        />
      )}
    </div>
  );
};

export default UserResourcesPage;