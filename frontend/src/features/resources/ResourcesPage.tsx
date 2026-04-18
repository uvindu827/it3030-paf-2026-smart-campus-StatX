import React, { useState } from "react";
import { useResources } from "./useResources";
import { Resource, ResourceRequest, ResourceType, ResourceStatus } from "./resourceApi";
import ResourceCard from "./ResourceCard";
import ResourceForm from "./ResourceForm";
import ResourceDetailModal from "./ResourceDetailModal";

// Replace this with your actual auth hook / context
const useAuth = () => ({
  user: { role: "ADMIN" }, // Change to "USER" for regular user view
});

const TYPE_OPTIONS: { value: ResourceType | ""; label: string }[] = [
  { value: "", label: "All Types" },
  { value: "LECTURE_HALL", label: "Lecture Hall" },
  { value: "LABORATORY", label: "Laboratory" },
  { value: "MEETING_ROOM", label: "Meeting Room" },
  { value: "EQUIPMENT", label: "Equipment" },
];

const ResourcesPage: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const { resources, loading, error, filters, setFilters, createResource, updateResource, deleteResource, toggleStatus } =
    useResources();

  const [showForm, setShowForm] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [viewingResource, setViewingResource] = useState<Resource | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreate = async (data: ResourceRequest) => {
    try {
      await createResource(data);
      setShowForm(false);
      showToast("Resource created successfully! ✓");
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to create resource.", "error");
    }
  };

  const handleUpdate = async (data: ResourceRequest) => {
    if (!editingResource) return;
    try {
      await updateResource(editingResource.id, data);
      setEditingResource(null);
      showToast("Resource updated successfully! ✓");
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to update resource.", "error");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteResource(id);
      showToast("Resource deleted.");
    } catch {
      showToast("Failed to delete resource.", "error");
    }
  };

  const handleToggleStatus = async (resource: Resource) => {
    try {
      await toggleStatus(resource.id, resource.status);
      showToast(`Resource marked as ${resource.status === "ACTIVE" ? "Out of Service" : "Active"}.`);
    } catch {
      showToast("Failed to update status.", "error");
    }
  };

  const activeFiltersCount = Object.values(filters).filter((v) => v !== undefined && v !== "").length;

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "24px" }}>
      {/* Toast */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            background: toast.type === "success" ? "#16a34a" : "#dc2626",
            color: "#fff",
            padding: "12px 20px",
            borderRadius: "8px",
            zIndex: 2000,
            fontWeight: 600,
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          }}
        >
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 800, color: "#1e293b" }}>
            🏢 Facilities & Assets
          </h1>
          <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: "14px" }}>
            Manage campus resources, rooms, and equipment
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => { setEditingResource(null); setShowForm(true); }}
            style={{
              background: "#6366f1",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              padding: "12px 24px",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            ＋ Add Resource
          </button>
        )}
      </div>

      {/* Stats Bar */}
      <StatsBar resources={resources} />

      {/* Filters */}
      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          padding: "16px 20px",
          marginBottom: "24px",
          border: "1px solid #e2e8f0",
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {/* Keyword Search */}
        <input
          placeholder="🔍 Search by name..."
          value={filters.keyword || ""}
          onChange={(e) => setFilters({ ...filters, keyword: e.target.value || undefined })}
          style={filterInputStyle}
        />

        {/* Type Filter */}
        <select
          value={filters.type || ""}
          onChange={(e) => setFilters({ ...filters, type: (e.target.value as ResourceType) || undefined })}
          style={filterInputStyle}
        >
          {TYPE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {/* Location Filter */}
        <input
          placeholder="📍 Filter by location..."
          value={filters.location || ""}
          onChange={(e) => setFilters({ ...filters, location: e.target.value || undefined })}
          style={filterInputStyle}
        />

        {/* Min Capacity */}
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

        {/* Status Filter */}
        <select
          value={filters.status || ""}
          onChange={(e) => setFilters({ ...filters, status: (e.target.value as ResourceStatus) || undefined })}
          style={filterInputStyle}
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="OUT_OF_SERVICE">Out of Service</option>
        </select>

        {/* Clear Filters */}
        {activeFiltersCount > 0 && (
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
            ✕ Clear ({activeFiltersCount})
          </button>
        )}
      </div>

      {/* Results count */}
      <div style={{ fontSize: "13px", color: "#64748b", marginBottom: "16px" }}>
        Showing {resources.length} resource{resources.length !== 1 ? "s" : ""}
      </div>

      {/* Content */}
      {loading ? (
        <LoadingGrid />
      ) : error ? (
        <ErrorState message={error} />
      ) : resources.length === 0 ? (
        <EmptyState isAdmin={isAdmin} onAdd={() => setShowForm(true)} />
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          {resources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              isAdmin={isAdmin}
              onEdit={(r) => { setEditingResource(r); setShowForm(true); }}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
              onViewDetail={setViewingResource}
            />
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <ResourceForm
          initial={editingResource}
          onSubmit={editingResource ? handleUpdate : handleCreate}
          onCancel={() => { setShowForm(false); setEditingResource(null); }}
        />
      )}

      {/* Detail Modal */}
      {viewingResource && (
        <ResourceDetailModal resource={viewingResource} onClose={() => setViewingResource(null)} />
      )}
    </div>
  );
};

// ─── Sub-components ──────────────────────────────────────────────────────────

const StatsBar: React.FC<{ resources: Resource[] }> = ({ resources }) => {
  const active = resources.filter((r) => r.status === "ACTIVE").length;
  const outOfService = resources.filter((r) => r.status === "OUT_OF_SERVICE").length;
  const totalCapacity = resources.reduce((acc, r) => acc + r.capacity, 0);

  const stats = [
    { label: "Total Resources", value: resources.length, color: "#6366f1" },
    { label: "Active", value: active, color: "#16a34a" },
    { label: "Out of Service", value: outOfService, color: "#dc2626" },
    { label: "Total Capacity", value: totalCapacity, color: "#f59e0b" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px", marginBottom: "24px" }}>
      {stats.map((s) => (
        <div
          key={s.label}
          style={{
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            padding: "16px 20px",
            borderLeft: `4px solid ${s.color}`,
          }}
        >
          <div style={{ fontSize: "24px", fontWeight: 800, color: s.color }}>{s.value}</div>
          <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
};

const LoadingGrid = () => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div
        key={i}
        style={{
          background: "#e2e8f0",
          borderRadius: "12px",
          height: "240px",
          animation: "pulse 1.5s infinite",
        }}
      />
    ))}
  </div>
);

const ErrorState: React.FC<{ message: string }> = ({ message }) => (
  <div style={{ textAlign: "center", padding: "60px 20px", color: "#dc2626" }}>
    <div style={{ fontSize: "48px" }}>⚠️</div>
    <h3>Failed to load resources</h3>
    <p style={{ color: "#94a3b8" }}>{message}</p>
  </div>
);

const EmptyState: React.FC<{ isAdmin: boolean; onAdd: () => void }> = ({ isAdmin, onAdd }) => (
  <div style={{ textAlign: "center", padding: "80px 20px" }}>
    <div style={{ fontSize: "64px" }}>🏢</div>
    <h3 style={{ color: "#1e293b", fontSize: "20px", marginTop: "16px" }}>No resources found</h3>
    <p style={{ color: "#94a3b8", marginBottom: "24px" }}>
      {isAdmin ? "Get started by adding your first resource." : "No resources match your filters."}
    </p>
    {isAdmin && (
      <button
        onClick={onAdd}
        style={{
          background: "#6366f1",
          color: "#fff",
          border: "none",
          borderRadius: "10px",
          padding: "12px 28px",
          fontSize: "14px",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        ＋ Add First Resource
      </button>
    )}
  </div>
);

const filterInputStyle: React.CSSProperties = {
  padding: "8px 12px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  fontSize: "13px",
  outline: "none",
  minWidth: "160px",
  flex: 1,
};

export default ResourcesPage;