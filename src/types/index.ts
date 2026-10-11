export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

export interface RoundInfo {
  num: number;
  name: string;
  desc: string;
}

export interface Drive {
  id: string;
  company_name: string;
  logo_bg: string;
  logo_initial: string;
  role_title: string;
  date_category: 'Today' | 'Tomorrow' | 'Weekend';
  exact_date_display: string;
  interview_type: 'walk-in' | 'virtual';
  venue_or_link: string;
  salary_range: string;
  vacancies: number;
  remaining_slots: number;
  eligibility: string;
  time_slots: TimeSlot[];
  rounds: RoundInfo[];
  hr_name: string;
  hr_phone: string;
  created_at?: string;
}

export interface InterviewPass {
  pass_id: string;
  drive_id: string;
  company_name: string;
  role_title: string;
  candidate_name: string;
  candidate_phone: string;
  candidate_link: string;
  selected_slot: string;
  interview_type: 'walk-in' | 'virtual';
  venue_or_link: string;
  stage_index: number; // 0: Applied, 1: Screening, 2: Slot Confirmed, 3: In Progress, 4: Offer Extended, 5: Did Not Clear, 6: No-Show
  checked_in: boolean;
  qr_token: string;
  recruiter_note: string;
  countdown_target: string;
  is_cancelled?: boolean;
  created_at?: string;
}

export interface ReferralData {
  id: number;
  ref_code: string;
  candidate_name: string;
  shares_count: number;
  bookings_count: number;
  priority_unlocked: boolean;
}

export interface SqlQueryResult {
  columns: string[];
  rows: any[];
  executionTimeMs: number;
  affectedRows?: number;
}

export interface RecruiterSession {
  id: string;
  email: string;
  name: string;
  company_name: string;
  role: string;
  token: string;
}
