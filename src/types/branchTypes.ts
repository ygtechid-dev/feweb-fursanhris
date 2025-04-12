import { Company } from "./companyTypes";

export interface Branch {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  created_by: number;
  company?: Company;
}

// Untuk array dari branches
export type Branches = Branch[];

export const defaultFormValuesBranch = {
  name: '',
  created_at: '',
  updated_at: '',
  created_by: 0,
  company: undefined, 
}
