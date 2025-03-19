export interface EmployeeSalary {
    id: number;
    user_id: number;
    name: string;
    dob: string;
    gender: string;
    phone: string;
    address: string;
    email: string;
    password: string;
    employee_id: string;
    branch_id: number;
    department_id: number;
    designation_id: number;
    company_doj: string;
    documents: null | any; // Bisa diganti dengan tipe yang lebih spesifik sesuai kebutuhan
    account_holder_name: string;
    account_number: string;
    bank_name: string;
    bank_identifier_code: string;
    branch_location: string;
    tax_payer_id: null | string;
    salary_type: string;
    account_type: null | string;
    salary: number;
    is_active: number;
    created_by: number;
    created_at: string;
    updated_at: string;
  }
