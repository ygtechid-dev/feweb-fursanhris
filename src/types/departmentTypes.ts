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
