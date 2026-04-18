import { useState, useEffect, useCallback } from "react";
import { resourceApi, Resource, ResourceRequest, ResourceFilters } from "./resourceApi";

export const useResources = (initialFilters?: ResourceFilters) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ResourceFilters>(initialFilters || {});

  const fetchResources = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await resourceApi.getAll(filters);
      setResources(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch resources.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const createResource = async (data: ResourceRequest) => {
    const response = await resourceApi.create(data);
    setResources((prev) => [...prev, response.data]);
    return response.data;
  };

  const updateResource = async (id: number, data: ResourceRequest) => {
    const response = await resourceApi.update(id, data);
    setResources((prev) => prev.map((r) => (r.id === id ? response.data : r)));
    return response.data;
  };

  const deleteResource = async (id: number) => {
    await resourceApi.delete(id);
    setResources((prev) => prev.filter((r) => r.id !== id));
  };

  const toggleStatus = async (id: number, current: "ACTIVE" | "OUT_OF_SERVICE") => {
    const action = current === "ACTIVE" ? "out-of-service" : "active";
    const response = await resourceApi.updateStatus(id, action);
    setResources((prev) => prev.map((r) => (r.id === id ? response.data : r)));
    return response.data;
  };

  return {
    resources,
    loading,
    error,
    filters,
    setFilters,
    refetch: fetchResources,
    createResource,
    updateResource,
    deleteResource,
    toggleStatus,
  };
};