import { Branch } from "./branchTypes";

export interface Department {
    id: number;
    branch_id: number;
    name: string;
    created_by: number;
    created_at: string;
    updated_at: string;
    branch: Branch;
  }


  export const defaultFormValuesDepartment= {
    branch_id: 0,
    name: '',
    created_by: 0,
    created_at: '', 
    updated_at: '',
  }
