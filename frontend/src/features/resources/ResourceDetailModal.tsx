import React from "react";
import { Resource } from "./resourceApi";

interface Props {
  resource: Resource;
  onClose: () => void;
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

const ResourceDetailModal: React.FC<Props> = ({ resource, onClose }) => {
  const isActive = resource.status === "ACTIVE";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "32px",
          width: "100%",
          maxWidth: "540px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
          <div>
            <div style={{ fontSize: "40px" }}>{TYPE_ICONS[resource.type]}</div>
            <div style={{ fontSize: "11px", fontWeight: 600, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.5px", marginTop: "4px" }}>
              {TYPE_LABELS[resource.type]}
            </div>
            <h2 style={{ margin: "4px 0 0", color: "#1e293b", fontSize: "22px" }}>{resource.name}</h2>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer", color: "#94a3b8" }}>
            ✕
          </button>
        </div>

        {/* Image */}
        {resource.imageUrl && (
          <img
            src={resource.imageUrl}
            alt={resource.name}
            style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "8px", marginBottom: "20px" }}
          />
        )}

        {/* Details Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
          <Detail label="Status">
            <span style={{
              padding: "3px 10px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: 600,
              background: isActive ? "#dcfce7" : "#fee2e2",
              color: isActive ? "#16a34a" : "#dc2626",
            }}>
              {isActive ? "✓ Active" : "✗ Out of Service"}
            </span>
          </Detail>
          <Detail label="Capacity">{resource.capacity} people</Detail>
          <Detail label="Location">📍 {resource.location}</Detail>
          {resource.availabilityWindows && (
            <Detail label="Availability">🕐 {resource.availabilityWindows}</Detail>
          )}
          <Detail label="Created">{new Date(resource.createdAt).toLocaleDateString()}</Detail>
          <Detail label="Last Updated">{new Date(resource.updatedAt).toLocaleDateString()}</Detail>
        </div>

        {resource.description && (
          <div style={{ background: "#f8fafc", borderRadius: "8px", padding: "16px" }}>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "#64748b", marginBottom: "6px" }}>DESCRIPTION</div>
            <p style={{ margin: 0, color: "#374151", fontSize: "14px", lineHeight: 1.6 }}>{resource.description}</p>
          </div>
        )}

        <button
          onClick={onClose}
          style={{
            marginTop: "24px",
            width: "100%",
            padding: "12px",
            background: "#6366f1",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

const Detail: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div>
    <div style={{ fontSize: "11px", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", marginBottom: "4px" }}>{label}</div>
    <div style={{ fontSize: "14px", color: "#1e293b", fontWeight: 500 }}>{children}</div>
  </div>
);

export default ResourceDetailModal;