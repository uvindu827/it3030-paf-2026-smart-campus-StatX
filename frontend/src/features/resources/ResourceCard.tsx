import React from "react";
import { Resource } from "./resourceApi";

interface Props {
  resource: Resource;
  isAdmin: boolean;
  onEdit: (resource: Resource) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (resource: Resource) => void;
  onViewDetail: (resource: Resource) => void;
}

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

const ResourceCard: React.FC<Props> = ({
  resource,
  isAdmin,
  onEdit,
  onDelete,
  onToggleStatus,
  onViewDetail,
}) => {
  const isActive = resource.status === "ACTIVE";

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
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
      {/* Status Badge */}
      <div
        style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          padding: "3px 10px",
          borderRadius: "20px",
          fontSize: "11px",
          fontWeight: 600,
          background: isActive ? "#dcfce7" : "#fee2e2",
          color: isActive ? "#16a34a" : "#dc2626",
        }}
      >
        {isActive ? "✓ Active" : "✗ Out of Service"}
      </div>

      {/* Icon + Type */}
      <div style={{ fontSize: "36px", marginBottom: "8px" }}>
        {TYPE_ICONS[resource.type] || "📦"}
      </div>
      <div
        style={{
          fontSize: "11px",
          fontWeight: 600,
          color: "#6366f1",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          marginBottom: "4px",
        }}
      >
        {TYPE_LABELS[resource.type]}
      </div>

      {/* Name */}
      <h3
        style={{
          margin: "0 0 8px",
          fontSize: "16px",
          fontWeight: 700,
          color: "#1e293b",
        }}
      >
        {resource.name}
      </h3>

      {/* Meta */}
      <div style={{ fontSize: "13px", color: "#64748b", marginBottom: "4px" }}>
        📍 {resource.location}
      </div>
      <div style={{ fontSize: "13px", color: "#64748b", marginBottom: "4px" }}>
        👥 Capacity: {resource.capacity}
      </div>
      {resource.availabilityWindows && (
        <div style={{ fontSize: "13px", color: "#64748b", marginBottom: "4px" }}>
          🕐 {resource.availabilityWindows}
        </div>
      )}
      {resource.description && (
        <p
          style={{
            fontSize: "12px",
            color: "#94a3b8",
            marginTop: "8px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {resource.description}
        </p>
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: "8px", marginTop: "16px", flexWrap: "wrap" }}>
        <button
          onClick={() => onViewDetail(resource)}
          style={btnStyle("#6366f1", "#fff")}
        >
          View Details
        </button>
        {isAdmin && (
          <>
            <button
              onClick={() => onEdit(resource)}
              style={btnStyle("#f59e0b", "#fff")}
            >
              Edit
            </button>
            <button
              onClick={() => onToggleStatus(resource)}
              style={btnStyle(isActive ? "#dc2626" : "#16a34a", "#fff")}
            >
              {isActive ? "Disable" : "Enable"}
            </button>
            <button
              onClick={() => {
                if (window.confirm(`Delete "${resource.name}"?`)) onDelete(resource.id);
              }}
              style={btnStyle("#ef4444", "#fff")}
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const btnStyle = (bg: string, color: string): React.CSSProperties => ({
  background: bg,
  color,
  border: "none",
  borderRadius: "6px",
  padding: "6px 12px",
  fontSize: "12px",
  fontWeight: 600,
  cursor: "pointer",
  transition: "opacity 0.2s",
});

export default ResourceCard;