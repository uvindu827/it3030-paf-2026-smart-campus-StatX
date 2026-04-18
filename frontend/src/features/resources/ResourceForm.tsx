import React, { useState, useEffect } from "react";
import { Resource, ResourceRequest, ResourceType, ResourceStatus } from "./resourceApi";

interface Props {
  initial?: Resource | null;
  onSubmit: (data: ResourceRequest) => Promise<void>;
  onCancel: () => void;
}

const RESOURCE_TYPES: ResourceType[] = [
  "LECTURE_HALL",
  "LABORATORY",
  "MEETING_ROOM",
  "EQUIPMENT",
];

const TYPE_LABELS: Record<ResourceType, string> = {
  LECTURE_HALL: "Lecture Hall",
  LABORATORY: "Laboratory",
  MEETING_ROOM: "Meeting Room",
  EQUIPMENT: "Equipment",
};

const ResourceForm: React.FC<Props> = ({ initial, onSubmit, onCancel }) => {
  const [form, setForm] = useState<ResourceRequest>({
    name: "",
    type: "LECTURE_HALL",
    capacity: 1,
    location: "",
    description: "",
    availabilityWindows: "",
    imageUrl: "",
    status: "ACTIVE",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name,
        type: initial.type,
        capacity: initial.capacity,
        location: initial.location,
        description: initial.description || "",
        availabilityWindows: initial.availabilityWindows || "",
        imageUrl: initial.imageUrl || "",
        status: initial.status,
      });
    }
  }, [initial]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    else if (form.name.length < 2) newErrors.name = "Name must be at least 2 characters";
    if (!form.type) newErrors.type = "Type is required";
    if (!form.capacity || form.capacity < 1) newErrors.capacity = "Capacity must be at least 1";
    if (!form.location.trim()) newErrors.location = "Location is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "capacity" ? parseInt(value) || 1 : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await onSubmit(form);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2 style={{ margin: "0 0 20px", color: "#1e293b", fontSize: "20px" }}>
          {initial ? "✏️ Edit Resource" : "➕ Add New Resource"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={gridStyle}>
            {/* Name */}
            <div style={fieldStyle}>
              <label style={labelStyle}>Resource Name *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g., Main Lecture Hall A"
                style={inputStyle(!!errors.name)}
              />
              {errors.name && <span style={errorStyle}>{errors.name}</span>}
            </div>

            {/* Type */}
            <div style={fieldStyle}>
              <label style={labelStyle}>Resource Type *</label>
              <select name="type" value={form.type} onChange={handleChange} style={inputStyle(!!errors.type)}>
                {RESOURCE_TYPES.map((t) => (
                  <option key={t} value={t}>{TYPE_LABELS[t]}</option>
                ))}
              </select>
              {errors.type && <span style={errorStyle}>{errors.type}</span>}
            </div>

            {/* Capacity */}
            <div style={fieldStyle}>
              <label style={labelStyle}>Capacity *</label>
              <input
                name="capacity"
                type="number"
                min={1}
                value={form.capacity}
                onChange={handleChange}
                style={inputStyle(!!errors.capacity)}
              />
              {errors.capacity && <span style={errorStyle}>{errors.capacity}</span>}
            </div>

            {/* Location */}
            <div style={fieldStyle}>
              <label style={labelStyle}>Location *</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g., Block A, Floor 2"
                style={inputStyle(!!errors.location)}
              />
              {errors.location && <span style={errorStyle}>{errors.location}</span>}
            </div>

            {/* Availability Windows */}
            <div style={fieldStyle}>
              <label style={labelStyle}>Availability Windows</label>
              <input
                name="availabilityWindows"
                value={form.availabilityWindows}
                onChange={handleChange}
                placeholder="e.g., Mon-Fri 08:00-18:00"
                style={inputStyle(false)}
              />
            </div>

            {/* Status */}
            <div style={fieldStyle}>
              <label style={labelStyle}>Status</label>
              <select name="status" value={form.status} onChange={handleChange} style={inputStyle(false)}>
                <option value="ACTIVE">Active</option>
                <option value="OUT_OF_SERVICE">Out of Service</option>
              </select>
            </div>

            {/* Image URL */}
            <div style={{ ...fieldStyle, gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Image URL (optional)</label>
              <input
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleChange}
                placeholder="https://..."
                style={inputStyle(false)}
              />
            </div>

            {/* Description */}
            <div style={{ ...fieldStyle, gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="Optional description..."
                style={{ ...inputStyle(false), resize: "vertical" }}
              />
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "24px" }}>
            <button type="button" onClick={onCancel} style={btnStyle("#e2e8f0", "#475569")}>
              Cancel
            </button>
            <button type="submit" disabled={loading} style={btnStyle("#6366f1", "#fff")}>
              {loading ? "Saving..." : initial ? "Update Resource" : "Create Resource"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
  padding: "20px",
};

const modalStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: "16px",
  padding: "32px",
  width: "100%",
  maxWidth: "700px",
  maxHeight: "90vh",
  overflowY: "auto",
  boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "16px",
};

const fieldStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "4px" };

const labelStyle: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: 600,
  color: "#374151",
};

const inputStyle = (hasError: boolean): React.CSSProperties => ({
  padding: "10px 12px",
  borderRadius: "8px",
  border: `1px solid ${hasError ? "#ef4444" : "#d1d5db"}`,
  fontSize: "14px",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
});

const errorStyle: React.CSSProperties = { fontSize: "12px", color: "#ef4444" };

const btnStyle = (bg: string, color: string): React.CSSProperties => ({
  background: bg,
  color,
  border: "none",
  borderRadius: "8px",
  padding: "10px 24px",
  fontSize: "14px",
  fontWeight: 600,
  cursor: "pointer",
});

export default ResourceForm;