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
  }
