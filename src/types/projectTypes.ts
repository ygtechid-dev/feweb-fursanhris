import { Employee } from "./apps/userTypes";

interface Member {
    id: number;
    name: string;
    email: string;
    avatar: string;
    type: string;
    employee_data: Employee | null;
    assigned_by: number;
    assigned_at: string;
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
    members: Member[];
    tasks_count: number;
    completed_tasks: number;
    created_at: string;
    updated_at: string;
  }
