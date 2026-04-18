import React, { useState } from "react";
import { useResources } from "./useResources";
import { Resource, ResourceType, ResourceStatus } from "./resourceApi";
import ResourceDetailModal from "./ResourceDetailModal";

const TYPE_OPTIONS: { value: ResourceType | ""; label: string }[] = [
  { value: "", label: "All Types" },
  { value: "LECTURE_HALL", label: "Lecture Hall" },
  { value: "LABORATORY", label: "Laboratory" },
  { value: "MEETING_ROOM", label: "Meeting Room" },
  { value: "EQUIPMENT", label: "Equipment" },
];

const TYPE_ICONS: Record<string, string> = {
  LECTURE_HALL: "🏛️",
  LABORATORY: "🔬",
  MEETING_ROOM: "🤝",
  EQUIPMENT: "🎥",
};

const TYPE_LABELS: Record<string, string> = {
  LECTURE_HALL: "Lecture Hall",
  LABORATORY: "Laboratory",
  MEETING_ROOM: "Meeting Room",
  EQUIPMENT: "Equipment",
};

const UserResourcesPage: React.FC = () => {
  const { resources, loading, error, filters, setFilters } = useResources();
  const [viewingResource, setViewingResource] = useState<Resource | null>(null);

  // Only show ACTIVE resources to users
  const activeResources = resources.filter((r) => r.status === "ACTIVE");

  const handleBook = (resource: Resource) => {
    // Redirect to booking page with resource info
    window.location.href = `/bookings?resourceId=${resource.id}&resourceName=${encodeURIComponent(resource.name)}`;
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "24px" }}>

      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 800, color: "#1e293b" }}>
          🏢 Available Resources
        </h1>
        <p style={{ margin: "6px 0 0", color: "#64748b", fontSize: "15px" }}>
          Browse and book campus facilities and equipment
        </p>
      </div>

      {/* Stats */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: "16px",
        marginBottom: "24px"
      }}>
        {[
          { label: "Available Resources", value: activeResources.length, color: "#6366f1" },
          { label: "Lecture Halls", value: activeResources.filter(r => r.type === "LECTURE_HALL").length, color: "#16a34a" },
          { label: "Laboratories", value: activeResources.filter(r => r.type === "LABORATORY").length, color: "#f59e0b" },
          { label: "Meeting Rooms", value: activeResources.filter(r => r.type === "MEETING_ROOM").length, color: "#0ea5e9" },
        ].map((s) => (
          <div key={s.label} style={{
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            padding: "16px 20px",
            borderLeft: `4px solid ${s.color}`,
          }}>
            <div style={{ fontSize: "24px", fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{
        background: "#fff",
        borderRadius: "12px",
        padding: "16px 20px",
        marginBottom: "24px",
        border: "1px solid #e2e8f0",
        display: "flex",
        gap: "12px",
        flexWrap: "wrap",
        alignItems: "center",
      }}>
        {/* Keyword Search */}
        <input
          placeholder="🔍 Search by name..."
          value={filters.keyword || ""}
          onChange={(e) => setFilters({ ...filters, keyword: e.target.value || undefined })}
          style={filterInputStyle}
        />

        {/* Type Filter - FR-A7 */}
        <select
          value={filters.type || ""}
          onChange={(e) => setFilters({ ...filters, type: (e.target.value as ResourceType) || undefined })}
          style={filterInputStyle}
        >
          {TYPE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {/* Location Filter - FR-A9 */}
        <input
          placeholder="📍 Filter by location..."
          value={filters.location || ""}
          onChange={(e) => setFilters({ ...filters, location: e.target.value || undefined })}
          style={filterInputStyle}
        />

        {/* Min Capacity - FR-A8 */}
        <input
          type="number"
          placeholder="👥 Min capacity"
          min={1}
          value={filters.minCapacity || ""}
          onChange={(e) =>
            setFilters({ ...filters, minCapacity: e.target.value ? parseInt(e.target.value) : undefined })
          }
          style={{ ...filterInputStyle, width: "130px" }}
        />

        {/* Clear Filters */}
        {Object.values(filters).some(v => v !== undefined && v !== "") && (
          <button
            onClick={() => setFilters({})}
            style={{
              background: "#fee2e2",
              color: "#dc2626",
              border: "none",
              borderRadius: "8px",
              padding: "8px 14px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            ✕ Clear Filters
          </button>
        )}
      </div>

      {/* Results count */}
      <div style={{ fontSize: "13px", color: "#64748b", marginBottom: "16px" }}>
        Showing {activeResources.length} available resource{activeResources.length !== 1 ? "s" : ""}
      </div>

      {/* Content */}
      {loading ? (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "20px"
        }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{
              background: "#e2e8f0",
              borderRadius: "12px",
              height: "280px",
            }} />
          ))}
        </div>
      ) : error ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#dc2626" }}>
          <div style={{ fontSize: "48px" }}>⚠️</div>
          <h3>Failed to load resources</h3>
          <p style={{ color: "#94a3b8" }}>{error}</p>
        </div>
      ) : activeResources.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <div style={{ fontSize: "64px" }}>🏢</div>
          <h3 style={{ color: "#1e293b", fontSize: "20px" }}>No resources available</h3>
          <p style={{ color: "#94a3b8" }}>No resources match your filters. Try adjusting them.</p>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "20px",
        }}>
          {activeResources.map((resource) => (
            <UserResourceCard
              key={resource.id}
              resource={resource}
              onViewDetail={setViewingResource}
              onBook={handleBook}
            />
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {viewingResource && (
        <ResourceDetailModal
          resource={viewingResource}
          onClose={() => setViewingResource(null)}
        />
      )}
    </div>
  );
};

// ─── User Resource Card ───────────────────────────────────────────────────────

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

interface UserCardProps {
  resource: Resource;
  onViewDetail: (resource: Resource) => void;
  onBook: (resource: Resource) => void;
}

const UserResourceCard: React.FC<UserCardProps> = ({ resource, onViewDetail, onBook }) => {
  return (
    <div style={{
      background: "#fff",
      border: "1px solid #e2e8f0",
      borderRadius: "12px",
      padding: "24px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      transition: "transform 0.2s, box-shadow 0.2s",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
      }}
    >
      {/* Image */}
      {resource.imageUrl ? (
        <img
          src={resource.imageUrl}
          alt={resource.name}
          style={{
            width: "100%",
            height: "160px",
            objectFit: "cover",
            borderRadius: "8px",
          }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
      ) : (
        <div style={{
          width: "100%",
          height: "120px",
          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "48px",
        }}>
          {TYPE_ICONS_MAP[resource.type] || "🏢"}
        </div>
      )}

      {/* Type badge */}
      <div style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        background: "#ede9fe",
        color: "#6366f1",
        padding: "4px 10px",
        borderRadius: "20px",
        fontSize: "11px",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        width: "fit-content",
      }}>
        {TYPE_ICONS_MAP[resource.type]} {TYPE_LABELS_MAP[resource.type]}
      </div>

      {/* Name */}
      <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#1e293b" }}>
        {resource.name}
      </h3>

      {/* Details */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <div style={{ fontSize: "13px", color: "#64748b", display: "flex", alignItems: "center", gap: "6px" }}>
          📍 <span>{resource.location}</span>
        </div>
        <div style={{ fontSize: "13px", color: "#64748b", display: "flex", alignItems: "center", gap: "6px" }}>
          👥 <span>Capacity: <strong>{resource.capacity}</strong> people</span>
        </div>
        {resource.availabilityWindows && (
          <div style={{ fontSize: "13px", color: "#64748b", display: "flex", alignItems: "center", gap: "6px" }}>
            🕐 <span>{resource.availabilityWindows}</span>
          </div>
        )}
        {resource.description && (
          <p style={{
            margin: "4px 0 0",
            fontSize: "13px",
            color: "#94a3b8",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}>
            {resource.description}
          </p>
        )}
      </div>

      {/* Available badge */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        fontSize: "12px",
        fontWeight: 600,
        color: "#16a34a",
      }}>
        <span style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: "#16a34a",
          display: "inline-block",
        }} />
        Available for Booking
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: "10px", marginTop: "auto" }}>
        <button
          onClick={() => onViewDetail(resource)}
          style={{
            flex: 1,
            padding: "10px",
            background: "#f1f5f9",
            color: "#475569",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          View Details
        </button>
        <button
          onClick={() => onBook(resource)}
          style={{
            flex: 2,
            padding: "10px",
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          📅 Book Now
        </button>
      </div>
    </div>
  );
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

export default UserResourcesPage;