// Type Imports
import type { ThemeColor } from '@core/types'
import { Company } from '../companyTypes'

export type UsersType = {
  id: number
  role: string
  email: string
  status: string
  avatar: string
  company: string
  country: string
  contact: string
  fullName: string
  password: string
  username: string
  currentPlan: string
  avatarColor?: ThemeColor
  billing: string
}

// Define nested object interfaces first
export interface Branch {
  id: number
  name: string
  created_by: number
  created_at: string
  updated_at: string
}

export interface Department {
  id: number
  branch_id: number
  name: string
  created_by: number
  created_at: string
  updated_at: string
}

export interface Designation {
  id: number
  branch_id: number
  department_id: number
  name: string
  created_by: number
  created_at: string
  updated_at: string
}

export interface User {
  id: number
  first_name: string
  name?: string
  last_name: string
  email: string;
  password: string;
  email_verified_at: string
  type: string
  company_id: number | null
  avatar: string
  lang: string
  plan: string | null
  plan_expire_date: string | null
  storage_limit: number
  last_login: string | null
  is_active: number
  active_status: number
  is_login_enable: number
  dark_mode: number
  messenger_color: string
  is_disable: number
  created_by: string
  created_at: string
  updated_at: string
}

export interface EmployeeFormData {
  // Personal Details
  name: string;
  phone: string;
  dob: string;
  gender: 'male' | 'female' | string;
  email: string;
  password: string;
  address: string;
  employee_id?: string;
  
  // Company Details
  branch_id: string
  department_id: string
  designation_id: string
  company_doj: string
  salary?: string;
  status: string;
  
  // Bank Account
  account_holder_name: string
  account_number: string
  bank_name: string
  bank_identifier_code: string
  branch_location: string
  tax_payer_id: string | null
  
  // Documents
  documents: null | any
}

export interface Employee {
  id: number
  user_id: number
  name: string
  dob: string
  gender: string
  phone: string
  address: string
  email: string
  password: string
  employee_id: string
  branch_id: number
  department_id: number
  designation_id: number
  company_doj: string
  documents: null | any
  account_holder_name: string
  account_number: string
  bank_name: string
  bank_identifier_code: string
  branch_location: string
  tax_payer_id: string | null
  salary_type: string | null
  account_type: string | null
  salary: number
  net_salary?: number
  is_active: number
  created_by: number
  created_at: string
  updated_at: string
  branch: Branch
  department: Department
  designation: Designation
  user: User
  company?: Company;
}
