export interface Promotion {
  id: number;
  employee_id: number;
  employee_name: string;
  employee_code: string;
  designation_id: number;
  designation_name: string;
  promotion_title: string;
  promotion_date: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export const defaultFormValuesPromotion = {
  employee_id: 0,
  employee_name: '',
  employee_code: '',
  designation_id: 0,
  designation_name: '',
  promotion_title: '',
  promotion_date: '',
  description: '',
  created_at: '',
  updated_at: ''
};
