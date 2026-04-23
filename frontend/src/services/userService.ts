import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/v1/users";

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  }
});

export const registerAdmin = async (userData: { name: string, email: string }) => {
  const response = await axios.post(
    `${API_BASE_URL}/register-admin`, 
    userData, 
    getAuthHeaders()
  );
  return response.data;
};

export const getAllUsers = async () => {
  const response = await axios.get(API_BASE_URL, getAuthHeaders());
  return response.data;
};