import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api/v1";

export type ResourceType = "LECTURE_HALL" | "LABORATORY" | "MEETING_ROOM" | "EQUIPMENT";
export type ResourceStatus = "ACTIVE" | "OUT_OF_SERVICE";

export interface Resource {
  id: number;
  name: string;
  type: ResourceType;
  capacity: number;
  location: string;
  description?: string;
  availabilityWindows?: string;
  status: ResourceStatus;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResourceRequest {
  name: string;
  type: ResourceType;
  capacity: number;
  location: string;
  description?: string;
  availabilityWindows?: string;
  status?: ResourceStatus;
  imageUrl?: string;
}

export interface ResourceFilters {
  type?: ResourceType;
  minCapacity?: number;
  location?: string;
  status?: ResourceStatus;
  keyword?: string;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const resourceApi = {
  getAll: (filters?: ResourceFilters) =>
    axios.get<Resource[]>(`${BASE_URL}/resources`, {
      params: filters,
      headers: getAuthHeaders(),
    }),

  getById: (id: number) =>
    axios.get<Resource>(`${BASE_URL}/resources/${id}`, {
      headers: getAuthHeaders(),
    }),

  create: (data: ResourceRequest) =>
    axios.post<Resource>(`${BASE_URL}/resources`, data, {
      headers: getAuthHeaders(),
    }),

  update: (id: number, data: ResourceRequest) =>
    axios.put<Resource>(`${BASE_URL}/resources/${id}`, data, {
      headers: getAuthHeaders(),
    }),

  updateStatus: (id: number, action: "active" | "out-of-service") =>
    axios.patch<Resource>(
      `${BASE_URL}/resources/${id}/status`,
      null,
      { params: { action }, headers: getAuthHeaders() }
    ),

  delete: (id: number) =>
    axios.delete(`${BASE_URL}/resources/${id}`, {
      headers: getAuthHeaders(),
    }),
};