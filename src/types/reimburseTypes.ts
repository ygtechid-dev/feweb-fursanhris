import { Employee, User } from "./apps/userTypes";
import { Company } from "./companyTypes";

export interface ReimbursementCategory {
  id: number;
  name: string;
  description: string;
  max_amount: number | null;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface Reimbursement {
  id: number;
  employee_id: number;
  request_number: string;
  title?: string;
  description: string;
  remark: string;
  amount: string;
  receipt_path: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  transaction_date: string;
  requested_at: string;
  approved_by: number | null;
  approved_at: string | null;
  rejected_by: number | null;
  rejected_at: string | null;
  paid_by: number | null;
  paid_at: string | null;
  payment_method: string | null;
  notes: string;
  category_id: number;
  created_at: string;
  updated_at: string;
  category: ReimbursementCategory;
  employee: Employee;
  approver: User | null;
  rejecter: User | null;
  payer: User | null;
  created_by: number;
  company?: Company;
}

// Default values for Reimbursement
export const defaultReimbursementValues: Partial<Reimbursement> = {
  employee_id: 0,
  title: '',
  description: '',
  remark: "",
  amount: '',
  status: 'pending', // Explicitly type as a literal
  transaction_date: '',
  // notes: '',
  category_id: 0,
  created_by: 0,
  receipt_path: '',
  company: undefined,
};
