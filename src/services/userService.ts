import axiosInstance from "@/libs/axios"
import { User } from "@/types/apps/userTypes";
import { Role } from "@/types/userTypes"

export const getUsers = async (params?: {
  page?: number;
  per_page?: number;
  search?: string;
  // Add other filter parameters as needed
}): Promise<any> => {
  try {
    const response = await axiosInstance.get('/web/get-users', { params });
    return response?.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const postUser = async (datas:any): Promise<any> => {
    try {
      const response = await axiosInstance.post('/web/users', { ...datas });
      return response?.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
};

export const updateUser = async (userId: number, userData: Partial<User>) => {
    try {
      const response = await axiosInstance.put(`/web/users/${userId}`, { ...userData });
      return response?.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
};

export const deleteUser = async (id: number): Promise<any> => {
    try {
        const response = await axiosInstance.delete(`/web/users/${id}`);
      return response?.data;
    } catch (error) {
      console.error('Error deleting users:', error);
      throw error;
    }
};

export const fetchRoles = async (): Promise<Role[]> => {
    const response = await axiosInstance.get('/web/roles')
    return response.data.data
  }
