import { Employee, User } from "./apps/userTypes";
import { Company } from "./companyTypes";

export interface Overtime {
    id: number;
    employee_id: number;
    title: string;
    overtime_date: string;
    start_time: string;
    end_time: string;
    hours: number | string;
    rate: number | string;
    remark: string;
    status: 'approved' | 'rejected' | 'pending' | string;
    approved_at: string | null;
    rejected_at: string | null;
    rejection_reason: string | null;
    created_by: number;
    created_at: string;
    updated_at: string;
    employee: Employee;
    approver: User;
    rejecter: User | null;
    company?: Company;
  }


export const defaultFormValuesOvertime =  {
  employee_id: 0,
  title: '',
  overtime_date: '',
  start_time: '',
  end_time: '',
  hours: '',
  rate: '',
  remark: '',
  status: 'pending',
  rejection_reason: '',
  created_by: 0, 
  company: undefined, 
}
