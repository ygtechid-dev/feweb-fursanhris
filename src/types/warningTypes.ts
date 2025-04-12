import { Company } from "./companyTypes";

export interface Warning {
  id: number;
  subject: string;
  description: string;
  warning_to_id: number;
  warning_by_id: number;
  warning_date_raw: string;
  warning_date: {
    raw: string;
    formatted: string;
  };
  warning_to: {
    id: number;
    name: string;
    employee_id: string;
    email: string;
    user: {
      id: number;
      name: null | string;
    };
  };
  warning_by: {
    id: number;
    name: string;
    employee_id: string;
    user: {
      id: number;
      name: null | string;
    };
  };
  created_at: {
    raw: string;
    formatted: string;
  };
  updated_at: {
    raw: string;
    formatted: string;
  };
   created_by: number;
  company?: Company;
}

export const defaultFormValuesWarning = {
  subject: '',
  description: '',
  warning_date: {
    raw: '',
    formatted: ''
  },
  warning_to_id: 0,
  warning_by_id: 0,
  warning_date_raw: '',
  warning_to: {
    id: 0,
    name: '',
    employee_id: '',
    email: '',
    user: {
      id: 0,
      name: null
    }
  },
  warning_by: {
    id: 0,
    name: '',
    employee_id: '',
    user: {
      id: 0,
      name: null
    }
  },
  created_at: {
    raw: '',
    formatted: ''
  },
  updated_at: {
    raw: '',
    formatted: ''
  },
  created_by: 0,
  company: undefined, 
};
