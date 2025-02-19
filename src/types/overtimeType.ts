import { Employee, User } from "./apps/userTypes";

export interface Overtime {
    id: number;
    employee_id: number;
    overtime_date: string;
    start_time: string;
    end_time: string;
    hours: number;
    remark: string;
    status: 'approved' | 'rejected' | 'pending';
    approved_at: string | null;
    rejected_at: string | null;
    rejection_reason: string | null;
    created_by: number;
    created_at: string;
    updated_at: string;
    employee: Employee;
    approver: User;
    rejecter: User | null;
  }
