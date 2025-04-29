import { Employee } from "./apps/userTypes";
import { Company } from "./companyTypes";

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
    company?: Company;
  }

  export const defaultLeaveTypeValues: LeaveType = {
    id: 0,
    title: "",
    days: 0,
    created_by: 0,
    created_at: "",
    updated_at: ""
  };
  
  export const defaultLeaveValues: Leave = {
    id: 0,
    employee_id: 0,
    leave_type_id: 0,
    applied_on: "",
    start_date: "",
    end_date: "",
    total_leave_days: "0",
    leave_reason: "",
    emergency_contact: "",
    remark: "",
    status: "pending",
    approved_at: null,
    rejected_at: null,
    created_by: 0,
    created_at: "",
    updated_at: "",
    employee: {} as Employee,
    leave_type: defaultLeaveTypeValues,
    approver: null,
    rejecter: null,
    company: undefined
  };
