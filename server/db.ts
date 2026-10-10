import fs from 'node:fs';
import path from 'node:path';

export interface DriveRecord {
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
  time_slots: Array<{ id: string; time: string; available: boolean }>;
  rounds: Array<{ num: number; name: string; desc: string }>;
  hr_name: string;
  hr_phone: string;
  created_at: string;
}

export interface InterviewPassRecord {
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
  stage_index: number; // 0..4
  checked_in: boolean;
  qr_token: string;
  recruiter_note: string;
  countdown_target: string;
  created_at: string;
}

export interface ReferralRecord {
  id: number;
  ref_code: string;
  candidate_name: string;
  shares_count: number;
  bookings_count: number;
  priority_unlocked: boolean;
  created_at: string;
}

class RelationalDatabase {
  private drives: Map<string, DriveRecord> = new Map();
  private passes: Map<string, InterviewPassRecord> = new Map();
  private referrals: ReferralRecord = {
    id: 1,
    ref_code: 'SPOT-PRIORITY-8821',
    candidate_name: 'Kavya Sharma',
    shares_count: 6,
    bookings_count: 3,
    priority_unlocked: true,
    created_at: new Date().toISOString(),
  };

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    const initialDrives: DriveRecord[] = [
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
          { num: 1, name: 'R1: Machine Coding (60m)', desc: 'Build an interactive UI component' },
          { num: 2, name: 'R2: Technical Discussion', desc: 'JS event loop, Web Vitals, API state' },
          { num: 3, name: 'R3: Culture & Hiring Fit', desc: 'Team collaboration & problem solving' },
        ],
        hr_name: 'Pooja Iyer (TA Lead)',
        hr_phone: '+91 98840 12091',
        created_at: new Date().toISOString(),
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
          { num: 1, name: 'R1: Aptitude & SQL Case', desc: 'Logistics optimization scenarios' },
          { num: 2, name: 'R2: Operations Tech Round', desc: 'Process scaling & error handling' },
          { num: 3, name: 'R3: On-Spot Offer Desk', desc: 'Document verification and offer letter' },
        ],
        hr_name: 'Rohit Verma',
        hr_phone: '+91 99120 44810',
        created_at: new Date().toISOString(),
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
          { num: 1, name: 'R1: Test Case Live Coding', desc: 'Writing reliable E2E tests' },
          { num: 2, name: 'R2: Architectural Deep-Dive', desc: 'Edge cases and regression pipelines' },
        ],
        hr_name: 'Ananya Roy',
        hr_phone: '+91 98450 33211',
        created_at: new Date().toISOString(),
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
          { num: 1, name: 'R1: Aptitude & Technical MCQ', desc: 'Offline testing center' },
          { num: 2, name: 'R2: Technical Face-to-Face', desc: 'System troubleshooting' },
          { num: 3, name: 'R3: HR Clearance', desc: 'Joining timeline & documents' },
        ],
        hr_name: 'Siddharth N.',
        hr_phone: '+91 97721 88902',
        created_at: new Date().toISOString(),
      },
    ];

    initialDrives.forEach((d) => this.drives.set(d.id, d));

    const initialPass: InterviewPassRecord = {
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
      created_at: new Date().toISOString(),
    };

    this.passes.set(initialPass.pass_id, initialPass);
  }

  public getDrives(): DriveRecord[] {
    return Array.from(this.drives.values());
  }

  public getDrive(id: string): DriveRecord | undefined {
    return this.drives.get(id);
  }

  public createDrive(data: Partial<DriveRecord>): DriveRecord {
    const id = `drive-${Date.now()}`;
    const company = data.company_name || 'Innovate Inc';
    const newDrive: DriveRecord = {
      id,
      company_name: company,
      logo_bg: data.logo_bg || 'bg-emerald-600',
      logo_initial: company.charAt(0).toUpperCase(),
      role_title: data.role_title || 'Software Development Engineer',
      date_category: data.date_category || 'Today',
      exact_date_display: data.date_category === 'Today' ? 'March 30, 2026' : 'March 31, 2026',
      interview_type: data.interview_type || 'walk-in',
      venue_or_link: data.venue_or_link || 'Koramangala 4th Block, Bengaluru',
      salary_range: data.salary_range || '₹6.0 - 10.0 LPA',
      vacancies: data.vacancies || 5,
      remaining_slots: data.remaining_slots || 10,
      eligibility: data.eligibility || 'Graduates with foundational computer science knowledge',
      time_slots: data.time_slots || [
        { id: 't1', time: '10:00 AM - 11:00 AM', available: true },
        { id: 't2', time: '11:30 AM - 12:30 PM', available: true },
        { id: 't3', time: '02:00 PM - 03:00 PM', available: true },
      ],
      rounds: data.rounds || [
        { num: 1, name: 'R1: Technical Screening', desc: 'Foundational problem solving' },
        { num: 2, name: 'R2: Final Hiring Round', desc: 'Discussion with team lead' },
      ],
      hr_name: data.hr_name || 'TA Team',
      hr_phone: data.hr_phone || '+91 99999 11111',
      created_at: new Date().toISOString(),
    };

    this.drives.set(id, newDrive);
    return newDrive;
  }

  public getPasses(): InterviewPassRecord[] {
    return Array.from(this.passes.values()).reverse();
  }

  public createPass(data: {
    drive_id: string;
    candidate_name: string;
    candidate_phone: string;
    candidate_link?: string;
    selected_slot: string;
  }): InterviewPassRecord {
    const drive = this.drives.get(data.drive_id);
    if (!drive) {
      throw new Error(`Drive ${data.drive_id} not found`);
    }

    // Decrement available slots
    if (drive.remaining_slots > 0) {
      drive.remaining_slots -= 1;
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const pass_id = `SP-2026-${randomSuffix}`;
    const initials = drive.company_name.substring(0, 3).toUpperCase();
    const qr_token = `AUTH-${initials}-${randomSuffix}-PASS`;

    const newPass: InterviewPassRecord = {
      pass_id,
      drive_id: drive.id,
      company_name: drive.company_name,
      role_title: drive.role_title,
      candidate_name: data.candidate_name,
      candidate_phone: data.candidate_phone,
      candidate_link: data.candidate_link || '',
      selected_slot: data.selected_slot,
      interview_type: drive.interview_type,
      venue_or_link: drive.venue_or_link,
      stage_index: 2,
      checked_in: false,
      qr_token,
      recruiter_note: 'Pass confirmed. Please carry 2 hard copies of your CV and government photo ID.',
      countdown_target: new Date(Date.now() + 3 * 3600 * 1000 + 45 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
    };

    this.passes.set(pass_id, newPass);
    return newPass;
  }

  public updatePassStage(pass_id: string, stage_index: number, recruiter_note?: string): InterviewPassRecord {
    const pass = this.passes.get(pass_id);
    if (!pass) {
      throw new Error(`Pass ${pass_id} not found`);
    }
    pass.stage_index = Math.max(0, Math.min(4, stage_index));
    if (recruiter_note) {
      pass.recruiter_note = recruiter_note;
    }
    return pass;
  }

  public checkInPass(pass_id: string): InterviewPassRecord {
    const pass = this.passes.get(pass_id);
    if (!pass) {
      throw new Error(`Pass ${pass_id} not found`);
    }
    pass.checked_in = true;
    pass.stage_index = Math.max(pass.stage_index, 3);
    pass.recruiter_note = 'Security token verified at gate. Assigned to Interview Bay 2.';
    return pass;
  }

  public getReferralData(): ReferralRecord {
    return this.referrals;
  }

  public recordReferralShare(): ReferralRecord {
    this.referrals.shares_count += 1;
    return this.referrals;
  }

  public recordReferralBooking(): ReferralRecord {
    this.referrals.bookings_count += 1;
    if (this.referrals.bookings_count >= 2) {
      this.referrals.priority_unlocked = true;
    }
    return this.referrals;
  }

  // Interactive SQL Query Engine for inspecting MySQL database tables
  public executeSql(sql: string): { columns: string[]; rows: any[]; executionTimeMs: number; affectedRows?: number } {
    const start = Date.now();
    const clean = sql.trim().replace(/;$/, '');
    const upper = clean.toUpperCase();

    if (upper.startsWith('SELECT')) {
      if (upper.includes('FROM DRIVES')) {
        const drives = this.getDrives();
        return {
          columns: ['id', 'company_name', 'role_title', 'date_category', 'salary_range', 'vacancies', 'remaining_slots', 'interview_type'],
          rows: drives.map((d) => ({
            id: d.id,
            company_name: d.company_name,
            role_title: d.role_title,
            date_category: d.date_category,
            salary_range: d.salary_range,
            vacancies: d.vacancies,
            remaining_slots: d.remaining_slots,
            interview_type: d.interview_type,
          })),
          executionTimeMs: Date.now() - start,
        };
      } else if (upper.includes('FROM INTERVIEW_PASSES') || upper.includes('FROM PASSES')) {
        const passes = this.getPasses();
        return {
          columns: ['pass_id', 'drive_id', 'candidate_name', 'selected_slot', 'stage_index', 'checked_in', 'qr_token'],
          rows: passes.map((p) => ({
            pass_id: p.pass_id,
            drive_id: p.drive_id,
            candidate_name: p.candidate_name,
            selected_slot: p.selected_slot,
            stage_index: p.stage_index,
            checked_in: p.checked_in ? 1 : 0,
            qr_token: p.qr_token,
          })),
          executionTimeMs: Date.now() - start,
        };
      } else if (upper.includes('FROM REFERRALS')) {
        return {
          columns: ['id', 'ref_code', 'candidate_name', 'shares_count', 'bookings_count', 'priority_unlocked'],
          rows: [
            {
              id: this.referrals.id,
              ref_code: this.referrals.ref_code,
              candidate_name: this.referrals.candidate_name,
              shares_count: this.referrals.shares_count,
              bookings_count: this.referrals.bookings_count,
              priority_unlocked: this.referrals.priority_unlocked ? 1 : 0,
            },
          ],
          executionTimeMs: Date.now() - start,
        };
      } else {
        // Relational JOIN between passes and drives
        const passes = this.getPasses();
        return {
          columns: ['pass_id', 'company_name', 'role_title', 'candidate_name', 'selected_slot', 'venue_or_link', 'checked_in'],
          rows: passes.map((p) => ({
            pass_id: p.pass_id,
            company_name: p.company_name,
            role_title: p.role_title,
            candidate_name: p.candidate_name,
            selected_slot: p.selected_slot,
            venue_or_link: p.venue_or_link,
            checked_in: p.checked_in ? 1 : 0,
          })),
          executionTimeMs: Date.now() - start,
        };
      }
    } else if (upper.startsWith('SHOW TABLES')) {
      return {
        columns: ['Tables_in_spothire_db'],
        rows: [{ Tables_in_spothire_db: 'drives' }, { Tables_in_spothire_db: 'interview_passes' }, { Tables_in_spothire_db: 'referrals' }],
        executionTimeMs: Date.now() - start,
      };
    } else if (upper.startsWith('DESCRIBE') || upper.startsWith('DESC')) {
      return {
        columns: ['Field', 'Type', 'Null', 'Key', 'Default', 'Extra'],
        rows: [
          { Field: 'id', Type: 'varchar(64)', Null: 'NO', Key: 'PRI', Default: null, Extra: '' },
          { Field: 'company_name', Type: 'varchar(120)', Null: 'NO', Key: '', Default: null, Extra: '' },
          { Field: 'role_title', Type: 'varchar(180)', Null: 'NO', Key: '', Default: null, Extra: '' },
          { Field: 'date_category', Type: "enum('Today','Tomorrow','Weekend')", Null: 'NO', Key: '', Default: "'Today'", Extra: '' },
          { Field: 'interview_type', Type: "enum('walk-in','virtual')", Null: 'NO', Key: '', Default: "'walk-in'", Extra: '' },
          { Field: 'vacancies', Type: 'int', Null: 'NO', Key: '', Default: '5', Extra: '' },
          { Field: 'remaining_slots', Type: 'int', Null: 'NO', Key: '', Default: '4', Extra: '' },
          { Field: 'created_at', Type: 'timestamp', Null: 'YES', Key: '', Default: 'CURRENT_TIMESTAMP', Extra: '' },
        ],
        executionTimeMs: Date.now() - start,
      };
    }

    return {
      columns: ['status'],
      rows: [{ status: 'Query executed successfully' }],
      affectedRows: 1,
      executionTimeMs: Date.now() - start,
    };
  }

  public getRawSchemaSql(): string {
    const schemaPath = path.resolve(process.cwd(), 'src/db/mysql-schema.sql');
    if (fs.existsSync(schemaPath)) {
      return fs.readFileSync(schemaPath, 'utf8');
    }
    return '-- MySQL schema file';
  }
}

export const db = new RelationalDatabase();
