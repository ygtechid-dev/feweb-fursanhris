export interface Termination {
  id: number;
  employee: {
    id: number;
    name: string;
    employee_id: string;
    department: string;
    designation: string;
  };
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
}

export const defaultFormValuesTermination = {
  id: 0,
  employee: {
    id: 0,
    name: '',
    employee_id: '',
    department: '',
    designation: ''
  },
  termination_type: '',
  termination_date: '',
  notice_date: '',
  reason: '',
  description: '',
  status: '',
  is_mobile_access_allowed: false,
  terminated_by: {
    id: 0,
    name: ''
  },
  documents: null,
  created_at: '',
  updated_at: ''
};
