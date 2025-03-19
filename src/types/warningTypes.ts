export interface Warning {
  id: number;
  subject: string;
  description: string;
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
}

export const defaultFormValuesWarning = {
  id: 0,
  subject: '',
  description: '',
  warning_date: {
    raw: '',
    formatted: ''
  },
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
  }
};
