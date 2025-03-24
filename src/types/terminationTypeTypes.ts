// Termination Type interface
export interface TerminationType {
  id: number;
  name: string;
  created_by: number;
  created_at: string; // ISO date string format
  updated_at: string; // ISO date string format
}

// Default values for TerminationType form
export const defaultFormValuesTerminationType = {
  id: 0,
  name: '',
  created_by: 0,
  created_at: '',
  updated_at: ''
};
