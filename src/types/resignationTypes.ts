import { Company } from "./companyTypes";

export interface Resignation {
  id: number;
  employee_id: number;
  employee_name: string;
  notice_date: string;
  notice_date_formatted: string;
  resignation_date: string;
  resignation_date_formatted: string;
  description: string;
  document_path: string;
  status: string;
  created_at: string;
  created_at_formatted: string;
  created_by: number;
  company?: Company;
}

export const defaultFormValuesResignation = {
  employee_id: 0,
  employee_name: '',
  notice_date: '',
  notice_date_formatted: '',
  resignation_date: '',
  resignation_date_formatted: '',
  description: '',
  status: '',
  created_at: '',
  created_at_formatted: '',
  document_path: '',
  created_by: 0,
  company: undefined, 
}
