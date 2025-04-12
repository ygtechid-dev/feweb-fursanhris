import { Company } from "./companyTypes";

export interface AttendanceEmployee {
    id?: number;
    date: string;
    employee_name: string;
    clock_in: string | null;
    clock_in_location: string | null;
    clock_in_latitude: string | null;
    clock_in_longitude: string | null;
    clock_in_photo: string | null;
    clock_in_notes: string | null;
    clock_out: string | null;
    clock_out_location: string | null;
    clock_out_latitude: string | null;
    clock_out_longitude: string | null;
    clock_out_photo: string | null;
    clock_out_notes: string | null;
    status: 'Present' | 'Absent' | 'Late' | 'Early';
    late: string;
    early_leaving: string;
    timezone: string;
    overtime: string;
    total_rest: string;
    clock_in_formatted: string | null;
    clock_out_formatted: string | null;
    created_by: number;
    company?: Company;
}
