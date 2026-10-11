-- =======================================================
-- SpotHire: Daily Direct Interview Passes Database Schema
-- Dialect: MySQL 8.0+
-- =======================================================

CREATE DATABASE IF NOT EXISTS spothire_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE spothire_db;

-- 1. Interview Drives Table
CREATE TABLE IF NOT EXISTS drives (
  id VARCHAR(64) PRIMARY KEY,
  company_name VARCHAR(120) NOT NULL,
  logo_bg VARCHAR(32) NOT NULL DEFAULT 'bg-blue-600',
  logo_initial VARCHAR(4) NOT NULL,
  role_title VARCHAR(180) NOT NULL,
  date_category ENUM('Today', 'Tomorrow', 'Weekend') NOT NULL DEFAULT 'Today',
  exact_date_display VARCHAR(64) NOT NULL,
  interview_type ENUM('walk-in', 'virtual') NOT NULL DEFAULT 'walk-in',
  venue_or_link VARCHAR(255) NOT NULL,
  salary_range VARCHAR(64) NOT NULL,
  vacancies INT NOT NULL DEFAULT 5,
  remaining_slots INT NOT NULL DEFAULT 4,
  eligibility TEXT NOT NULL,
  time_slots_json JSON NOT NULL,
  rounds_json JSON NOT NULL,
  hr_name VARCHAR(120) DEFAULT 'Talent Acquisition Team',
  hr_phone VARCHAR(32) DEFAULT '+91 98840 12091',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_date_type (date_category, interview_type)
) ENGINE=InnoDB;

-- 2. Digital Boarding Passes / Applicant Bookings Table
CREATE TABLE IF NOT EXISTS interview_passes (
  pass_id VARCHAR(64) PRIMARY KEY,
  drive_id VARCHAR(64) NOT NULL,
  candidate_name VARCHAR(120) NOT NULL,
  candidate_phone VARCHAR(32) NOT NULL,
  candidate_link VARCHAR(255),
  selected_slot VARCHAR(64) NOT NULL,
  stage_index TINYINT NOT NULL DEFAULT 2, -- 0: Applied, 1: Screening, 2: Slot Confirmed, 3: In Progress, 4: Offer Extended
  checked_in BOOLEAN NOT NULL DEFAULT FALSE,
  qr_token VARCHAR(64) NOT NULL UNIQUE,
  recruiter_note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (drive_id) REFERENCES drives(id) ON DELETE CASCADE,
  INDEX idx_candidate_phone (candidate_phone)
) ENGINE=InnoDB;

-- 3. Referrals & Fast-Track Priority Program Table
CREATE TABLE IF NOT EXISTS referrals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ref_code VARCHAR(64) NOT NULL UNIQUE,
  candidate_name VARCHAR(120) NOT NULL,
  shares_count INT NOT NULL DEFAULT 6,
  bookings_count INT NOT NULL DEFAULT 3,
  priority_unlocked BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 4. Recruiter & Company Studio Accounts Table
CREATE TABLE IF NOT EXISTS recruiter_accounts (
  id VARCHAR(64) PRIMARY KEY,
  email VARCHAR(160) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(120) NOT NULL,
  company_name VARCHAR(120) NOT NULL,
  role VARCHAR(32) NOT NULL DEFAULT 'recruiter',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Pre-seeded Initial Records
INSERT INTO drives (
  id, company_name, logo_bg, logo_initial, role_title, date_category, exact_date_display, interview_type,
  venue_or_link, salary_range, vacancies, remaining_slots, eligibility, time_slots_json, rounds_json, hr_name, hr_phone
) VALUES
(
  'drive-1', 'Razorpay', 'bg-blue-600', 'R', 'Associate Frontend Engineer (React/Tailwind)',
  'Today', 'March 30, 2026', 'walk-in', 'Razorpay HQ, SJR Cyber L1, Koramangala, Bengaluru',
  '₹8.5 - 12.0 LPA', 6, 4, '0-2 yrs exp, B.Tech/BCA/B.Sc, JavaScript/CSS core concepts',
  '[{"id":"s1","time":"10:00 AM - 11:00 AM","available":true},{"id":"s2","time":"11:30 AM - 12:30 PM","available":true},{"id":"s3","time":"02:00 PM - 03:00 PM","available":false},{"id":"s4","time":"03:30 PM - 04:30 PM","available":true}]',
  '[{"num":1,"name":"Machine Coding (60m)","desc":"Build an interactive UI component"},{"num":2,"name":"Technical Discussion","desc":"JS event loop, Web Vitals, API state"},{"num":3,"name":"Culture & Hiring Fit","desc":"Team collaboration & problem solving"}]',
  'Pooja Iyer (TA Lead)', '+91 98840 12091'
),
(
  'drive-2', 'Zepto', 'bg-purple-600', 'Z', 'Full-Stack Operations & Systems Associate',
  'Today', 'March 30, 2026', 'walk-in', 'Zepto Hub 04, HSR Layout Sector 2, Bengaluru',
  '₹6.0 - 9.0 LPA', 8, 9, 'Any graduate / engineer, SQL, rapid problem solving, immediate joiners',
  '[{"id":"z1","time":"10:30 AM - 11:30 AM","available":true},{"id":"z2","time":"01:00 PM - 02:00 PM","available":true},{"id":"z3","time":"03:00 PM - 04:00 PM","available":true}]',
  '[{"num":1,"name":"Aptitude & SQL Case","desc":"Logistics optimization scenarios"},{"num":2,"name":"Operations Tech Round","desc":"Process scaling & error handling"},{"num":3,"name":"On-Spot Offer Desk","desc":"Document verification and offer letter"}]',
  'Rohit Verma', '+91 99120 44810'
),
(
  'drive-3', 'Swiggy', 'bg-orange-500', 'S', 'Quality Assurance & Automation Engineer',
  'Tomorrow', 'March 31, 2026', 'virtual', 'https://meet.google.com/swg-qa-drive',
  '₹7.0 - 10.5 LPA', 5, 3, '1-3 yrs experience, Cypress / Playwright or manual test design',
  '[{"id":"sw1","time":"11:00 AM - 12:00 PM","available":true},{"id":"sw2","time":"02:30 PM - 03:30 PM","available":true}]',
  '[{"num":1,"name":"Automated Test Case Live Round","desc":"Writing reliable E2E tests"},{"num":2,"name":"Architectural Interview","desc":"Edge cases and regression pipelines"}]',
  'Ananya Roy', '+91 98450 33211'
),
(
  'drive-4', 'Infosys BPM', 'bg-blue-800', 'I', 'Cloud Infrastructure & Support Analyst',
  'Weekend', 'April 4, 2026', 'walk-in', 'Infosys Gate 4, Electronic City Phase 1, Bengaluru',
  '₹4.8 - 6.5 LPA', 25, 18, 'B.Tech/BE 2024/2025/2026 batches, Linux, Networking basics',
  '[{"id":"in1","time":"09:00 AM - 10:30 AM","available":true},{"id":"in2","time":"11:00 AM - 12:30 PM","available":true},{"id":"in3","time":"02:00 PM - 03:30 PM","available":true}]',
  '[{"num":1,"name":"Aptitude & Technical MCQ","desc":"Offline testing center"},{"num":2,"name":"Technical Face-to-Face","desc":"System troubleshooting"},{"num":3,"name":"HR Clearance","desc":"Joining timeline & documents"}]',
  'Siddharth N.', '+91 97721 88902'
)
ON DUPLICATE KEY UPDATE company_name=VALUES(company_name);

INSERT INTO interview_passes (
  pass_id, drive_id, candidate_name, candidate_phone, candidate_link,
  selected_slot, stage_index, checked_in, qr_token, recruiter_note
) VALUES (
  'SP-2026-9041', 'drive-1', 'Kavya Sharma', '+91 98765 43210', 'https://linkedin.com/in/kavya-sharma-dev',
  '10:00 AM - 11:00 AM', 2, FALSE, 'AUTH-RZP-9041-IN', 'Candidate portfolio verified. Assigned to Table 04, Room A.'
)
ON DUPLICATE KEY UPDATE candidate_name=VALUES(candidate_name);

INSERT INTO referrals (
  id, ref_code, candidate_name, shares_count, bookings_count, priority_unlocked
) VALUES (
  1, 'SPOT-PRIORITY-8821', 'Kavya Sharma', 6, 3, TRUE
)
ON DUPLICATE KEY UPDATE ref_code=VALUES(ref_code);
