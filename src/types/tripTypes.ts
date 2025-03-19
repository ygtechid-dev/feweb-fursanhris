export interface Trip {
  id: number;
  employee_id: number;
  employee_name: string;
  start_date: string;
  end_date: string;
  purpose_of_visit: string;
  place_of_visit: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export const defaultFormValuesTrip = {
  employee_id: 0,
  employee_name: '',
  start_date: '',
  end_date: '',
  purpose_of_visit: '',
  place_of_visit: '',
  description: '',
  created_at: '',
  updated_at: ''
};
