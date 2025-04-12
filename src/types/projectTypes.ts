import { Employee } from "./apps/userTypes";
import { Company } from "./companyTypes";

interface Member {
    id: number;
    name: string;
    email: string;
    avatar: string;
    type: string;
    employee_data: Employee | null;
    assigned_by?: number;
    assigned_at?: string;
  }
  
export interface Project {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  status: "active" | "on_hold" | "completed";
  progress: number;
  members_count: number;
  members?: Member[];
  tasks_count: number;
  completed_tasks: number;
  created_at: string;
  updated_at: string;
  selected_member?: Member[]; // Add this for form handling
  created_by: number;
  company?: Company;
}

export const defaultFormValuesProject = {
  name: '',
  description: '',
  start_date: '',
  end_date: '',
  status: '0' as "active" | "on_hold" | "completed",
  progress: 0,
  members_count: 0,
  members: [],
  tasks_count: 0,
  completed_tasks: 0,
  created_at: '',
  updated_at: '',
  created_by: 0,
  company: undefined, 
};
