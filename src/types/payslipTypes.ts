import { Employee } from "./apps/userTypes";
import { Company } from "./companyTypes";

// Allowance interface
export interface Allowance {
    id: number;
    type: 'permanent' | 'monthly' | string;
    year: number | null;
    month: string | null;
    title: string;
    amount: string;
    created_at: string;
    created_by: number;
    updated_at: string;
    employee_id: number;
  }
  
  // Deduction interface
  export  interface Deduction {
    id: number;
    type: 'permanent' | 'monthly' | string;
    year: number | null;
    month: string | null;
    title: string;
    amount: string;
    created_at: string;
    created_by: number;
    updated_at: string;
    employee_id: number;
  }
  
  // Overtime interface
  export  interface Overtime {
    id: number;
    rate: number;
    type: string | null;
    hours: number;
    title: string | null;
    remark: string;
    status: 'approved' | 'rejected' | string;
    end_time: string;
    created_at: string;
    created_by: number;
    start_time: string;
    updated_at: string;
    approved_at: string | null;
    approved_by: number | null;
    employee_id: number;
    rejected_at: string | null;
    rejected_by: number | null;
    overtime_date: string;
    number_of_days: number;
    rejection_reason: string | null;
  }

  
  // Main Payslip interface
  export  interface Payslip {
    id: number;
    employee_id: number;
    payslip_number: string;
    month: string;
    year: string;
    salary_type: 'monthly' | 'hourly' | string;
    basic_salary: string;
    total_allowance: string;
    total_deduction: string;
    total_overtime: string;
    allowance: string; // JSON string that will be parsed to Allowance[]
    deduction: string; // JSON string that will be parsed to Deduction[]
    overtime: string;  // JSON string that will be parsed to Overtime[]
    net_salary: string;
    payment_status: 'paid' | 'unpaid' | string;
    payment_date: string | null;
    payment_method: 'cash' | 'bank_transfer' | string | null;
    note: string | null;
    file_url: string | null;
    created_by: number;
    created_at: string;
    updated_at: string;
    employee: Employee;
    company?: Company;
  }
  
  // Helper functions to parse JSON strings
  export  function parseAllowances(allowanceJson: string): Allowance[] {
    return JSON.parse(allowanceJson);
  }
  
  export function parseDeductions(deductionJson: string): Deduction[] {
    return JSON.parse(deductionJson);
  }
  
  export function parseOvertimes(overtimeJson: string): Overtime[] {
    return JSON.parse(overtimeJson);
  }
  
  // Example usage
  // const payslip: Payslip = response[0];
  // const allowances: Allowance[] = parseAllowances(payslip.allowance);
  // const deductions: Deduction[] = parseDeductions(payslip.deduction);
  // const overtimes: Overtime[] = parseOvertimes(payslip.overtime);

  // Default values for Allowance
export const defaultFormValuesAllowance = {
  type: '',
  year: null,
  month: null,
  title: '',
  amount: '',
  created_at: '',
  created_by: 0,
  updated_at: '',
  employee_id: 0
};

// Default values for Deduction
export const defaultFormValuesDeduction = {
  type: '',
  year: null,
  month: null,
  title: '',
  amount: '',
  created_at: '',
  created_by: 0,
  updated_at: '',
  employee_id: 0
};

// Default values for Overtime
export const defaultFormValuesOvertime = {
  rate: 0,
  type: null,
  hours: 0,
  title: null,
  remark: '',
  status: '',
  end_time: '',
  created_at: '',
  created_by: 0,
  start_time: '',
  updated_at: '',
  approved_at: null,
  approved_by: null,
  employee_id: 0,
  rejected_at: null,
  rejected_by: null,
  overtime_date: '',
  number_of_days: 0,
  rejection_reason: null
};

// Default values for Payslip
export const defaultFormValuesPayslip = {
  employee_id: 0,
  payslip_number: '',
  month: '',
  year: '',
  salary_type: '',
  basic_salary: '',
  total_allowance: '',
  total_deduction: '',
  total_overtime: '',
  allowance: '[]', // Empty JSON array string
  deduction: '[]', // Empty JSON array string
  overtime: '[]', // Empty JSON array string
  net_salary: '',
  payment_status: '',
  payment_date: null,
  payment_method: null,
  note: null,
  file_url: null,
  created_by: 0,
  created_at: '',
  updated_at: '',
  employee: {} as Employee
};
