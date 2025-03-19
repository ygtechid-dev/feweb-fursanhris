import { Employee } from "./apps/userTypes";

export interface RewardType {
  id: number;
  name?: string;
  description?: string;
}

// Main Reward interface
export interface Reward {
  id: number;
  employee_id: number;
  reward_type_id: number;
  date: string; // ISO date string format
  gift?: string | null;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
  
  // Relations (optional, present when loaded)
  employee?: Employee;
  reward_type?: RewardType;
}


export const defaultFormValuesBranch=  {
  name: '',
  created_by: 0,
  created_at: '', 
  updated_at: '',
}
