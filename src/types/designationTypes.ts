import { Company } from "./companyTypes";
import { Department } from "./departmentTypes";

export interface Designation {
    id: number;
    branch_id: number;
    department_id: number;
    name: string;
    created_by: number;
    created_at: string;
    updated_at: string;
    department: Department;
    company?: Company;
  }

export const defaultFormValuesDesignation = {
  branch_id: 0,
  department_id: 0,
  name: '',
  created_by: 0,
  created_at: '', 
  updated_at: '',
  company: undefined, // Menambahkan company sebagai undefined untuk nilai default
};
