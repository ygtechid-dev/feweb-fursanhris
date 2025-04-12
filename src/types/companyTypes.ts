export interface Company {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    email_verified_at: string;
    type: string;
    company_id: string;
    avatar: string;
    lang: string;
    plan: number;
    plan_expire_date: string | null;
    storage_limit: number;
    last_login: string | null;
    is_active: number;
    active_status: number;
    is_login_enable: number;
    dark_mode: number;
    messenger_color: string;
    is_disable: number;
    created_by: string;
    created_at: string;
    updated_at: string;
  }
