import { Company } from "./companyTypes";

export interface Termination {
  id: number;
  employee: {
    id: number;
    name: string;
    employee_id: string;
    department: string;
    designation: string;
  };
  employee_id: number;
  termination_type_id: number;
  terminated_by_id: number;
  termination_type: string;
  termination_date: string;
  notice_date: string;
  reason: string;
  description: string;
  status: string;
  is_mobile_access_allowed: boolean;
  terminated_by: {
    id: number;
    name: string;
  };
  documents: null | any;
  created_at: string;
  updated_at: string;
  created_by: number;
  company?: Company;
}

export const defaultFormValuesTermination = {
  employee: {
    id: 0,
    name: '',
    employee_id: '',
    department: '',
    designation: ''
  },
  employee_id: 0,
  termination_type_id: 0,
  terminated_by_id: 0,
  termination_type: '',
  termination_date: '',
  notice_date: '',
  reason: '',
  description: '',
  status: '0',
  is_mobile_access_allowed: false,
  terminated_by: {
    id: 0,
    name: ''
  },
  documents: null,
  created_at: '',
  updated_at: '',
  created_by: 0,
  company: undefined,
};
