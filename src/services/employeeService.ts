// services/employeeService.ts
import axiosInstance from '@/libs/axios';
import axiosFileInstance from '@/libs/axiosFileInstance';
import { Branch, Department, Designation, Employee, EmployeeFormData } from '@/types/apps/userTypes';


export interface EmployeeResponse {
  data: Employee[];
  // Add pagination or other response metadata if your API returns them
  meta?: {
    total?: number;
    per_page?: number;
    current_page?: number;
    last_page?: number;
  };
}

export const getEmployees = async (params?: {
  page?: number;
  per_page?: number;
  search?: string;
  // Add other filter parameters as needed
}): Promise<EmployeeResponse> => {
  try {
    const response = await axiosInstance.get('/web/employees', { params });
    return response?.data;
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};

export const postEmployees = async (datas:any): Promise<any> => {
  try {
    const response = await axiosInstance.post('/web/employees', datas);
    return response?.data;
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};

// For file uploads
export const postEmployeesWithFiles = async (formData: FormData): Promise<any> => {
  try {
    const response = await axiosFileInstance.post('/web/employees', formData);
    return response?.data;
  } catch (error) {
    console.error('Error creating employee with files:', error);
    throw error;
  }
};

export const getEmployeeById = async (id: string) => {
  const response = await axiosInstance.get(`/web/employees/${id}`)
  console.log({data: response?.data})
  return response?.data
}

export const updateEmployee = async (id: string, data: EmployeeFormData) => {
  const response = await axiosInstance.put(`/web/employees/${id}`, data)
  return response?.data
}

export const updateEmployeeSalary = async (id: number, data: any) => {
  const response = await axiosInstance.put(`/web/employees/${id}/update-employee-salary`, data)
  return response?.data
}

export const deleteEmployee = async (id: number): Promise<any> => {
  try {
    const response = await axiosInstance.delete(`/web/employees/${id}`);
    return response?.data;
  } catch (error) {
    console.error('Error deleting employee:', error);
    throw error;
  }
};



export const fetchBranches = async (): Promise<Branch[]> => {
  const response = await axiosInstance.get('/branches')
  return response.data.data
}

export const exportEmployeeSalary = async (): Promise<any> => {
  const response = await axiosInstance.get('/web/export-salary-component')
  return response.data
}
export const postImportSalaryComnponent = async (formData: FormData): Promise<any> => {
  try {
    const response = await axiosFileInstance.post('/web/import-salary-component', formData);
    return response?.data;
  } catch (error) {
    console.error('Error importing salary component with files:', error);
    throw error;
  }
};

export const fetchDepartmentsByBranch = async (branchId: string): Promise<Department[]> => {
  const response = await axiosInstance.get(`/departments`, {
    params: { branch_id: branchId }
  })
  return response.data.data
}

export const fetchDesignationsByDepartment = async (
  branchId: string,
  departmentId: string
): Promise<Designation[]> => {
  const response = await axiosInstance.get(`/designations`, {
    params: {
      branch_id: branchId,
      department_id: departmentId
    }
  })
  return response.data.data
}
