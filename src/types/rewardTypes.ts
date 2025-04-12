import { Employee } from "./apps/userTypes";
import { Company } from "./companyTypes";

export interface RewardType {
  id: number;
  name?: string;
  description?: string;
}

// Main Reward interface
export interface Reward {
  id: number;
  employee_id: number | string;
  reward_type_id: number | string;
  date: string; // ISO date string format
  gift?: string | null;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
  
  // Relations (optional, present when loaded)
  employee?: Employee;
  reward_type?: RewardType;
  created_by: number;
  company?: Company;
}

export const defaultFormValuesReward = {
  employee_id: 0,
  reward_type_id: 0,
  date: '', // ISO date string format
  gift: '',
  description: '',
  created_at: '',
  updated_at: '',
  created_by: 0,
  company: undefined, 
  // Relations are optional and typically not included in default form values
  // employee: undefined,
  // reward_type: undefined
};
