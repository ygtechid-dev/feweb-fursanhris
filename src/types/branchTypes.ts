export interface Branch {
    id: number;
    name: string;
    created_by: number;
    created_at: string;  // atau bisa juga menggunakan Date
    updated_at: string;  // atau bisa juga menggunakan Date
  }
  
  // Untuk array dari branches
export type Branches = Branch[];


export const defaultFormValuesBranch=  {
  name: '',
  created_by: 0,
  created_at: '', 
  updated_at: '',
}
