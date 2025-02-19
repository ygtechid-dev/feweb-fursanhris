import { Employee } from "./apps/userTypes";

export interface LeaveType {
    id: number;
    title: string;
    days: number;
    created_by: number;
    created_at: string;
    updated_at: string;
  }
  
  export interface Leave {
    id: number;
    employee_id: number;
    leave_type_id: number;
    applied_on: string;
    start_date: string;
    end_date: string;
    total_leave_days: string;
    leave_reason: string;
    emergency_contact: string;
    remark: string;
    status: 'pending' | 'approved' | 'rejected';
    approved_at: string | null;
    rejected_at: string | null;
    created_by: number;
    created_at: string;
    updated_at: string;
    employee: Employee;
    leave_type: LeaveType;
    approver: null | any;
    rejecter: null | any;
  }
