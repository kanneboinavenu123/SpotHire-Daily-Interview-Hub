import { Drive, InterviewPass, ReferralData, SqlQueryResult, RecruiterSession } from '../types/index.ts';

export async function loginRecruiter(email: string, password: string): Promise<RecruiterSession> {
  const res = await fetch('/api/auth/recruiter-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Login failed' }));
    throw new Error(err.error || 'Invalid credentials');
  }
  return await res.json();
}

export async function registerRecruiter(data: {
  email: string;
  password: string;
  name: string;
  company_name: string;
}): Promise<RecruiterSession> {
  const res = await fetch('/api/auth/recruiter-register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Registration failed' }));
    throw new Error(err.error || 'Registration failed');
  }
  return await res.json();
}

export async function fetchDrives(): Promise<Drive[]> {
  try {
    const res = await fetch('/api/drives');
    if (!res.ok) throw new Error('Failed to fetch drives');
    return await res.json();
  } catch (err) {
    console.warn('API error, using initial dataset:', err);
    return getFallbackDrives();
  }
}

export async function createDrive(driveData: Partial<Drive>): Promise<Drive> {
  const res = await fetch('/api/drives', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(driveData),
  });
  if (!res.ok) throw new Error('Failed to create drive');
  return await res.json();
}

export async function fetchPasses(): Promise<InterviewPass[]> {
  try {
    const res = await fetch('/api/passes');
    if (!res.ok) throw new Error('Failed to fetch passes');
    return await res.json();
  } catch (err) {
    console.warn('API error, using initial passes:', err);
    return getFallbackPasses();
  }
}

export async function createPass(bookingData: {
  drive_id: string;
  candidate_name: string;
  candidate_phone: string;
  candidate_link?: string;
  selected_slot: string;
}): Promise<InterviewPass> {
  const res = await fetch('/api/passes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingData),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to create pass' }));
    throw new Error(err.error || 'Failed to create pass');
  }
  return await res.json();
}

export async function cancelPass(passId: string): Promise<{ pass: InterviewPass; drive: Drive }> {
  const res = await fetch(`/api/passes/${passId}/cancel`, {
    method: 'POST',
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to cancel pass' }));
    throw new Error(err.error || 'Failed to cancel pass');
  }
  return await res.json();
}

export async function verifyGateToken(token: string, gateNote?: string): Promise<InterviewPass> {
  const res = await fetch('/api/passes/verify-gate-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, gate_note: gateNote }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Invalid token' }));
    throw new Error(err.error || 'Failed to verify token');
  }
  return await res.json();
}

export async function updatePassStage(passId: string, stageIndex: number, recruiterNote?: string): Promise<InterviewPass> {
  const res = await fetch(`/api/passes/${passId}/stage`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stage_index: stageIndex, recruiter_note: recruiterNote }),
  });
  if (!res.ok) throw new Error('Failed to update stage');
  return await res.json();
}

export async function checkInPass(passId: string): Promise<InterviewPass> {
  const res = await fetch(`/api/passes/${passId}/checkin`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to check-in');
  return await res.json();
}

export async function fetchReferrals(): Promise<ReferralData> {
  try {
    const res = await fetch('/api/referrals');
    if (!res.ok) throw new Error('Failed to fetch referrals');
    return await res.json();
  } catch (err) {
    return {
      id: 1,
      ref_code: 'SPOT-PRIORITY-8821',
      candidate_name: 'Kavya Sharma',
      shares_count: 6,
      bookings_count: 3,
      priority_unlocked: true,
    };
  }
}

export async function recordShare(): Promise<ReferralData> {
  const res = await fetch('/api/referrals/share', { method: 'POST' });
  if (!res.ok) throw new Error('Failed to record share');
  return await res.json();
}

export async function fetchSqlSchema(): Promise<{ database: string; schemaSql: string; tables: string[] }> {
  const res = await fetch('/api/sql/schema');
  if (!res.ok) throw new Error('Failed to fetch schema');
  return await res.json();
}

export async function executeSqlQuery(query: string): Promise<SqlQueryResult> {
  const res = await fetch('/api/sql/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Query failed' }));
    throw new Error(err.error || 'Query failed');
  }
  return await res.json();
}

// Fallback datasets for instant preview resilience
function getFallbackDrives(): Drive[] {
  return [
    {
      id: 'drive-1',
      company_name: 'Razorpay',
      logo_bg: 'bg-blue-600',
      logo_initial: 'R',
      role_title: 'Associate Frontend Engineer (React/Tailwind)',
      date_category: 'Today',
      exact_date_display: 'March 30, 2026',
      interview_type: 'walk-in',
      venue_or_link: 'Razorpay HQ, SJR Cyber L1, Koramangala, Bengaluru',
      salary_range: '₹8.5 - 12.0 LPA',
      vacancies: 6,
      remaining_slots: 4,
      eligibility: '0-2 yrs exp, B.Tech/BCA/B.Sc, JavaScript/CSS core concepts',
      time_slots: [
        { id: 's1', time: '10:00 AM - 11:00 AM', available: true },
        { id: 's2', time: '11:30 AM - 12:30 PM', available: true },
        { id: 's3', time: '02:00 PM - 03:00 PM', available: false },
        { id: 's4', time: '03:30 PM - 04:30 PM', available: true },
      ],
      rounds: [
        { num: 1, name: 'Machine Coding (60m)', desc: 'Build an interactive UI component' },
        { num: 2, name: 'Technical Discussion', desc: 'JS event loop, Web Vitals, API state' },
        { num: 3, name: 'Culture & Hiring Fit', desc: 'Team collaboration & problem solving' },
      ],
      hr_name: 'Pooja Iyer (TA Lead)',
      hr_phone: '+91 98840 12091',
    },
    {
      id: 'drive-2',
      company_name: 'Zepto',
      logo_bg: 'bg-purple-600',
      logo_initial: 'Z',
      role_title: 'Full-Stack Operations & Systems Associate',
      date_category: 'Today',
      exact_date_display: 'March 30, 2026',
      interview_type: 'walk-in',
      venue_or_link: 'Zepto Hub 04, HSR Layout Sector 2, Bengaluru',
      salary_range: '₹6.0 - 9.0 LPA',
      vacancies: 8,
      remaining_slots: 9,
      eligibility: 'Any graduate / engineer, SQL, rapid problem solving, immediate joiners',
      time_slots: [
        { id: 'z1', time: '10:30 AM - 11:30 AM', available: true },
        { id: 'z2', time: '01:00 PM - 02:00 PM', available: true },
        { id: 'z3', time: '03:00 PM - 04:00 PM', available: true },
      ],
      rounds: [
        { num: 1, name: 'Aptitude & SQL Case', desc: 'Logistics optimization scenarios' },
        { num: 2, name: 'Operations Tech Round', desc: 'Process scaling & error handling' },
        { num: 3, name: 'On-Spot Offer Desk', desc: 'Document verification and offer letter' },
      ],
      hr_name: 'Rohit Verma',
      hr_phone: '+91 99120 44810',
    },
    {
      id: 'drive-3',
      company_name: 'Swiggy',
      logo_bg: 'bg-orange-500',
      logo_initial: 'S',
      role_title: 'Quality Assurance & Automation Engineer',
      date_category: 'Tomorrow',
      exact_date_display: 'March 31, 2026',
      interview_type: 'virtual',
      venue_or_link: 'https://meet.google.com/swg-qa-drive',
      salary_range: '₹7.0 - 10.5 LPA',
      vacancies: 5,
      remaining_slots: 3,
      eligibility: '1-3 yrs experience, Cypress / Playwright or manual test design',
      time_slots: [
        { id: 'sw1', time: '11:00 AM - 12:00 PM', available: true },
        { id: 'sw2', time: '02:30 PM - 03:30 PM', available: true },
      ],
      rounds: [
        { num: 1, name: 'Test Case Live Coding', desc: 'Writing reliable E2E tests' },
        { num: 2, name: 'Architectural Deep-Dive', desc: 'Edge cases and regression pipelines' },
      ],
      hr_name: 'Ananya Roy',
      hr_phone: '+91 98450 33211',
    },
    {
      id: 'drive-4',
      company_name: 'Infosys BPM',
      logo_bg: 'bg-blue-800',
      logo_initial: 'I',
      role_title: 'Cloud Infrastructure & Support Analyst',
      date_category: 'Weekend',
      exact_date_display: 'April 4, 2026',
      interview_type: 'walk-in',
      venue_or_link: 'Infosys Gate 4, Electronic City Phase 1, Bengaluru',
      salary_range: '₹4.8 - 6.5 LPA',
      vacancies: 25,
      remaining_slots: 18,
      eligibility: 'B.Tech/BE 2024/2025/2026 batches, Linux, Networking basics',
      time_slots: [
        { id: 'in1', time: '09:00 AM - 10:30 AM', available: true },
        { id: 'in2', time: '11:00 AM - 12:30 PM', available: true },
        { id: 'in3', time: '02:00 PM - 03:30 PM', available: true },
      ],
      rounds: [
        { num: 1, name: 'Aptitude & Technical MCQ', desc: 'Offline testing center' },
        { num: 2, name: 'Technical Face-to-Face', desc: 'System troubleshooting' },
        { num: 3, name: 'HR Clearance', desc: 'Joining timeline & documents' },
      ],
      hr_name: 'Siddharth N.',
      hr_phone: '+91 97721 88902',
    },
  ];
}

function getFallbackPasses(): InterviewPass[] {
  return [
    {
      pass_id: 'SP-2026-9041',
      drive_id: 'drive-1',
      company_name: 'Razorpay',
      role_title: 'Associate Frontend Engineer (React/Tailwind)',
      candidate_name: 'Kavya Sharma',
      candidate_phone: '+91 98765 43210',
      candidate_link: 'https://linkedin.com/in/kavya-sharma-dev',
      selected_slot: '10:00 AM - 11:00 AM',
      interview_type: 'walk-in',
      venue_or_link: 'Razorpay HQ, SJR Cyber L1, Koramangala, Bengaluru',
      stage_index: 2,
      checked_in: false,
      qr_token: 'AUTH-RZP-9041-IN',
      recruiter_note: 'Candidate portfolio verified. Assigned to Table 04, Room A.',
      countdown_target: new Date(Date.now() + 4 * 3600 * 1000 + 18 * 60 * 1000).toISOString(),
    },
  ];
}
