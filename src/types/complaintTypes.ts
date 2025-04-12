import { Company } from "./companyTypes";

export interface Complaint {
  id: number;
  title: string;
  complaint_date: string;
  formatted_date: string;
  description: string;
  complaint_from_id: number;
  complaint_against_id: number;
  complaint_from: {
    id: number;
    name: string;
    employee_id: string;
    designation: string;
    department: string;
  };
  complaint_against: {
    id: number;
    name: string;
    employee_id: string;
    designation: string;
    department: string;
  };
  created_at: string;
  updated_at: string;
  created_by: number;
  company?: Company;
}

export const defaultFormValuesComplaint = {
  title: '',
  complaint_date: '',
  formatted_date: '',
  description: '',
  complaint_from_id: 0,
  complaint_against_id: 0,
  complaint_from: {
    id: 0,
    name: '',
    employee_id: '',
    designation: '',
    department: ''
  },
  complaint_against: {
    id: 0,
    name: '',
    employee_id: '',
    designation: '',
    department: ''
  },
  created_at: '',
  updated_at: '',
  created_by: 0,
  company: undefined, 
};
