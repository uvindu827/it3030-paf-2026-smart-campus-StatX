import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/v1/resources";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  };
};

export interface Resource {
  id: number;
  name: string;
  type: string;
  location: string;
  capacity: number;
  status: string;
}

// Get all resources
export const getAllResources = async (): Promise<Resource[]> => {
  const response = await axios.get<Resource[]>(API_BASE_URL, getAuthHeaders());
  return response.data;
};

// Create a new resource
export const createResource = async (resourceData: any): Promise<Resource> => {
  const response = await axios.post<Resource>(API_BASE_URL, resourceData, getAuthHeaders());
  return response.data;
};

// Update status (e.g., mark as out-of-service)
export const updateResourceStatus = async (id: number, action: 'active' | 'out-of-service'): Promise<Resource> => {
  const response = await axios.patch<Resource>(`${API_BASE_URL}/${id}/status?action=${action}`, {}, getAuthHeaders());
  return response.data;
};