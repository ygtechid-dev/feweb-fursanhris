import { Employee } from "./apps/userTypes";
import { Company } from "./companyTypes";

export interface Asset {
  id: number;
  employee_id: number;
  name: string;
  brand: string;
  warranty_status: string;
  buying_date: string;
  image: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  employee: Employee;
  company?: Company;
}

export const defaultFormValuesAsset = {
  employee_id: 0,
  name: '',
  brand: '',
  warranty_status: '0',
  buying_date: '',
  image: '',
  created_by: 0,
  company: undefined,
}
