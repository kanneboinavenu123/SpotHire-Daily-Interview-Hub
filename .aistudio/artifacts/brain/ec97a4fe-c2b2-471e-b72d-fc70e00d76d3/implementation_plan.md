# SpotHire Role-Based Access Control: Discrete Seeker & Recruiter Portals

Separate Job Seeker and Recruiter experiences with email/password authentication, persistent sessions, and complete isolation of the Recruiter Studio from job seekers.

## User Review & Critical Decisions

> [!IMPORTANT]
> Based on your answers during Phase 1, the following choices are locked in:
> - **Authentication Method:** Full email and password login system with pre-seeded demo recruiter accounts for rapid testing.
> - **Seeker Navigation Isolation:** The Recruiter Studio tab and controls are completely hidden for Job Seekers. Seekers see only candidate features (Drives, My Passes, Refer & Skip).
> - **Session Management:** Recruiter sessions persist in browser storage with an explicit Logout button in the header to return to Job Seeker mode.

---

## 1. Overview & Core Concept

- **What It Does:** Creates two dedicated user experiences within SpotHire:
  1. **Job Seeker Portal:** Zero recruiter clutter. Job seekers browse walk-in drives, reserve interview slots, manage boarding passes, and share referral links.
  2. **Recruiter Studio Portal:** Authenticated workspace where verified company recruiters manage the applicant queue, validate venue gate tokens, advance candidate stages, and publish new drives.
- **Target Audience:** Job seekers looking for immediate interview drives, and HR/talent acquisition teams running daily walk-in events.
- **Key Value:** Protects applicant privacy, prevents accidental candidate tampering with interview stages, and delivers a clean, distraction-free interface for both personas.

---

## 2. User Experience & Visual Design

### A. Job Seeker Experience (Default State)
- **Top Header:** Clean brand header displaying `SpotHire WALK-INS` and a subtle, discrete link: **"Recruiter Sign In"**. The old "Seeker / Studio" toggle pill is removed for seekers.
- **Bottom Navigation:** Exactly 3 seeker-only tabs:
  - `Drives` (Briefcase icon)
  - `My Passes` (Ticket icon with live badge)
  - `Refer & Skip` (Share icon)
- **Zero Recruiter Leaks:** The Recruiter Studio, candidate queue, and gate scanner are completely inaccessible and unrendered in the seeker navigation.

### B. Recruiter Authentication Flow
- Clicking **"Recruiter Sign In"** opens an authenticated modal dialog:
  - **Email & Password Fields** with instant validation.
  - **1-Tap Demo Logins:** Quick buttons to instantly log in as pre-configured company recruiters (e.g., *Razorpay TA Lead* or *Zepto Operations HR*).
  - **New Recruiter Registration:** Tab to sign up a new recruiter with company name, email, and password.

### C. Recruiter Studio Experience (Authenticated State)
- **Top Header:**
  - Displays the logged-in recruiter’s company badge (e.g., `Razorpay Studio` or `Zepto Studio`).
  - Prominent **"Log Out"** button to terminate the session and revert to Seeker view.
- **Bottom Navigation:**
  - Unlocks the 4th tab: **`Studio`** (Building icon with verified badge).
- **Control Hub Access:**
  - Full access to the Gate Reception Scanner & Token Validator.
  - Live Applicants Queue with 5-stage progression and Rejection/No-Show controls.
  - Rapid Drive Creator form.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Full Email/Password vs. PIN Gate**
  - *Chosen Approach:* Full email and password authentication with local storage session persistence and demo shortcuts.
  - *Why:* Meets enterprise expectations for corporate recruiting tools while demo shortcuts maintain zero friction during testing.
- **Decision 2: Total Navigation Hiding vs. Locked Tab**
  - *Chosen Approach:* Complete removal of the Studio tab for unauthenticated seekers.
  - *Why:* Prevents UI clutter and eliminates confusion for job seekers who shouldn't see recruiter workflows.

---

## 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                    SpotHire Client App                      │
└──────────────────────────────┬──────────────────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
   [Job Seeker Portal]                 [Recruiter Studio Portal]
   • Drives Feed (Read-only)           (Requires Authenticated State)
   • Slot Reservation Modal            • Gate Reception Scanner
   • Digital Boarding Passes           • Live Applicants Queue
   • Refer & Skip Hub                  • Stage Advancement (0..6)
                                       • Rapid Drive Creator
            │                                     │
            └──────────────────┬──────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                  Client Auth & Session Store                │
│       (Role state, recruiter profile, token in storage)      │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   Node.js Express Backend                   │
│   • POST /api/auth/login        • GET /api/passes           │
│   • POST /api/auth/register     • POST /api/passes/verify   │
│   • GET  /api/drives            • POST /api/passes/cancel   │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      MySQL Data Store                       │
│  [recruiter_accounts] [drives] [interview_passes] [referrals]│
└─────────────────────────────────────────────────────────────┘
```

### Data Model Additions
1. **`recruiter_accounts` Table (MySQL Schema):**
   - `id`: Unique identifier (e.g. `rec-1`)
   - `email`: Recruiter corporate email (e.g. `pooja@razorpay.com`)
   - `company_name`: Associated company name
   - `password_hash`: Password verification
   - `role`: `'recruiter' | 'admin'`
   - `created_at`: Timestamp
2. **Client State Structure:**
   - `currentUser: { role: 'seeker' | 'recruiter', email?: string, company?: string } | null`
   - Stored in browser storage so refreshing the page preserves the logged-in recruiter session until explicit logout.
