import React, { useState } from "react";
import { useResources } from "./useResources";
import { Resource, ResourceType } from "./resourceApi";
import ResourceDetailModal from "./ResourceDetailModal";

// ─── CONSTANTS & STYLES ──────────────────────────────────────────────────────

const TYPE_OPTIONS: { value: ResourceType | ""; label: string }[] = [
  { value: "", label: "All Types" },
  { value: "LECTURE_HALL", label: "Lecture Hall" },
  { value: "LABORATORY", label: "Laboratory" },
  { value: "MEETING_ROOM", label: "Meeting Room" },
  { value: "EQUIPMENT", label: "Equipment" },
];

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
        transition: "transform 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      {/* Visual Header - Image or Icon */}
      {resource.imageUrl ? (
        <img
          src={resource.imageUrl}
          alt={resource.name}
          style={{ width: "100%", height: "120px", objectFit: "cover", borderRadius: "8px" }}
          onError={(e) => { (e.currentTarget.style.display = "none"); }}
        />
      ) : (
        <div style={{
          width: "100%", height: "100px",
          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
          borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px",
        }}>
          {TYPE_ICONS_MAP[resource.type] || "🏢"}
        </div>
      )}

      <div style={{ 
        display: "inline-flex", background: "#ede9fe", color: "#6366f1", 
        padding: "2px 8px", borderRadius: "12px", fontSize: "10px", 
        fontWeight: 700, textTransform: "uppercase", width: "fit-content" 
      }}>
        {TYPE_LABELS_MAP[resource.type]}
      </div>

      <h3 style={{ margin: 0, fontSize: "18px", color: "#1e293b", fontWeight: 700 }}>{resource.name}</h3>
      
      <div style={{ fontSize: "13px", color: "#64748b", display: "flex", flexDirection: "column", gap: "4px" }}>
        <span>📍 {resource.location}</span>
        <span>👥 Capacity: <strong>{resource.capacity}</strong></span>
      </div>

      {/* Main Actions */}
      <div style={{ display: "flex", gap: "8px", marginTop: "auto", paddingTop: "10px" }}>
        <button
          onClick={() => onViewDetail(resource)}
          style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", fontWeight: 600, color: "#475569" }}
        >
          Details
        </button>
        <button
          onClick={() => onBook(resource)}
          style={{ 
            flex: 2, padding: "10px", borderRadius: "8px", border: "none", 
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)", 
            color: "white", fontWeight: "bold", cursor: "pointer" 
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
          textDecoration: "underline", cursor: "pointer", marginTop: "4px", textAlign: "center"
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

  // Only show ACTIVE resources
  const activeResources = resources.filter((r) => r.status === "ACTIVE");

  const handleBook = (resource: Resource) => {
    const params = new URLSearchParams({
      resourceId: resource.id.toString(),
      resourceName: resource.name
    });
    window.location.href = `/add-booking?${params.toString()}`;
  };

  const handleReportIssue = (resource: Resource) => {
    const params = new URLSearchParams({
      resId: resource.id.toString(),
      resName: resource.name
    });
    window.location.href = `/create-ticket?${params.toString()}`;
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "24px" }}>
      
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 800, color: "#1e293b" }}>
            🏢 Campus Resources
        </h1>
        <p style={{ color: "#64748b", margin: "4px 0 0" }}>Select a resource to start your booking</p>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        gap: "16px",
        marginBottom: "24px"
      }}>
        {[
            { label: "Available", value: activeResources.length, color: "#6366f1" },
            { label: "Halls", value: activeResources.filter(r => r.type === "LECTURE_HALL").length, color: "#16a34a" },
            { label: "Labs", value: activeResources.filter(r => r.type === "LABORATORY").length, color: "#f59e0b" },
            { label: "Rooms", value: activeResources.filter(r => r.type === "MEETING_ROOM").length, color: "#0ea5e9" },
            { label: "Equipment", value: activeResources.filter(r => r.type === "EQUIPMENT").length, color: "#ec4899" },
        ].map((s) => (
            <div key={s.label} style={{
                background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px",
                padding: "16px", borderLeft: `4px solid ${s.color}`,
            }}>
                <div style={{ fontSize: "20px", fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", fontWeight: 600 }}>{s.label}</div>
            </div>
        ))}
      </div>

      {/* Advanced Filters */}
      <div style={{ 
        display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center",
        background: "#fff", padding: "16px", borderRadius: "12px", 
        border: "1px solid #e2e8f0", marginBottom: "24px" 
      }}>
         <input
          placeholder="🔍 Search name..."
          value={filters.keyword || ""}
          onChange={(e) => setFilters({ ...filters, keyword: e.target.value || undefined })}
          style={filterInputStyle}
        />

        <select
          value={filters.type || ""}
          onChange={(e) => setFilters({ ...filters, type: (e.target.value as ResourceType) || undefined })}
          style={filterInputStyle}
        >
          {TYPE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        <input
          placeholder="📍 Location..."
          value={filters.location || ""}
          onChange={(e) => setFilters({ ...filters, location: e.target.value || undefined })}
          style={filterInputStyle}
        />

        <input
          type="number"
          placeholder="👥 Min Cap"
          value={filters.minCapacity || ""}
          onChange={(e) => setFilters({ ...filters, minCapacity: e.target.value ? parseInt(e.target.value) : undefined })}
          style={{ ...filterInputStyle, maxWidth: "100px" }}
        />

        {Object.values(filters).some(v => v !== undefined && v !== "") && (
          <button
            onClick={() => setFilters({})}
            style={{ background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "8px", padding: "8px 12px", cursor: "pointer", fontWeight: 600, fontSize: "12px" }}
          >
            ✕ Clear
          </button>
        )}
      </div>

      {/* Grid Content */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#6366f1", fontWeight: 600 }}>
            Loading resources...
        </div>
      ) : error ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#dc2626" }}>
            <h3>Error loading resources</h3>
            <p>{error}</p>
        </div>
      ) : activeResources.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px" }}>
            <p style={{ color: "#94a3b8", fontSize: "18px" }}>No resources found matching your criteria.</p>
        </div>
      ) : (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", 
          gap: "24px" 
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