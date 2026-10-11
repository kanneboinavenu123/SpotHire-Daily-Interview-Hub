import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Check, Sparkles, Smartphone, Monitor } from 'lucide-react';
import { StatusBar } from './components/StatusBar.tsx';
import { Header } from './components/Header.tsx';
import { LiveAlertBanner } from './components/LiveAlertBanner.tsx';
import { DateFilterStrip } from './components/DateFilterStrip.tsx';
import { DriveCard } from './components/DriveCard.tsx';
import { PassesView } from './components/PassesView.tsx';
import { RecruiterStudio } from './components/RecruiterStudio.tsx';
import { ReferralsView } from './components/ReferralsView.tsx';
import { BookingModal } from './components/BookingModal.tsx';
import { QrModal } from './components/QrModal.tsx';
import { MysqlStudioModal } from './components/MysqlStudioModal.tsx';
import { RecruiterAuthModal } from './components/RecruiterAuthModal.tsx';
import { BottomNav } from './components/BottomNav.tsx';
import {
  fetchDrives,
  createDrive,
  fetchPasses,
  createPass,
  cancelPass,
  verifyGateToken,
  updatePassStage,
  checkInPass,
  fetchReferrals,
  recordShare,
} from './services/api.ts';
import { Drive, InterviewPass, ReferralData, RecruiterSession } from './types/index.ts';

export default function App() {
  const [recruiterSession, setRecruiterSession] = useState<RecruiterSession | null>(() => {
    try {
      const stored = localStorage.getItem('spothire_recruiter');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isRecruiterAuthModalOpen, setIsRecruiterAuthModalOpen] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<'drives' | 'passes' | 'studio' | 'referrals'>('drives');
  const [dateFilter, setDateFilter] = useState<string>('Today');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'walk-in' | 'virtual'>('all');

  const [drives, setDrives] = useState<Drive[]>([]);
  const [passes, setPasses] = useState<InterviewPass[]>([]);
  const [referralData, setReferralData] = useState<ReferralData>({
    id: 1,
    ref_code: 'SPOT-PRIORITY-8821',
    candidate_name: 'Kavya Sharma',
    shares_count: 6,
    bookings_count: 3,
    priority_unlocked: true,
  });

  // Modals state
  const [selectedBookingDrive, setSelectedBookingDrive] = useState<Drive | null>(null);
  const [selectedQrPass, setSelectedQrPass] = useState<InterviewPass | null>(null);
  const [isMysqlStudioOpen, setIsMysqlStudioOpen] = useState<boolean>(false);

  // Desktop viewport container toggle
  const [isExpandedLayout, setIsExpandedLayout] = useState<boolean>(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Load initial data from Node.js / MySQL backend
  useEffect(() => {
    fetchDrives().then(setDrives);
    fetchPasses().then(setPasses);
    fetchReferrals().then(setReferralData);
  }, []);

  // Recruiter Auth Handlers
  const handleLoginSuccess = (session: RecruiterSession) => {
    setRecruiterSession(session);
    try {
      localStorage.setItem('spothire_recruiter', JSON.stringify(session));
    } catch (e) {
      console.warn(e);
    }
    setActiveTab('studio');
    showToast(`Welcome ${session.name}! Studio unlocked.`);
  };

  const handleLogoutRecruiter = () => {
    setRecruiterSession(null);
    try {
      localStorage.removeItem('spothire_recruiter');
    } catch (e) {
      console.warn(e);
    }
    setActiveTab('drives');
    showToast('Logged out of Recruiter Studio. Returned to Seeker mode.');
  };

  const handleTabChange = (tab: 'drives' | 'passes' | 'studio' | 'referrals') => {
    // Role Gate: Prevent seekers from opening studio
    if (tab === 'studio' && !recruiterSession) {
      setIsRecruiterAuthModalOpen(true);
      return;
    }
    setActiveTab(tab);
  };

  // Booking action
  const handleConfirmBooking = async (bookingData: {
    drive_id: string;
    candidate_name: string;
    candidate_phone: string;
    candidate_link?: string;
    selected_slot: string;
  }) => {
    try {
      const newPass = await createPass(bookingData);
      setPasses((prev) => [newPass, ...prev]);

      // Decrement remaining slots count in local state
      setDrives((prev) =>
        prev.map((d) =>
          d.id === bookingData.drive_id
            ? { ...d, remaining_slots: Math.max(0, d.remaining_slots - 1) }
            : d
        )
      );

      showToast(`Interview Pass ${newPass.pass_id} generated!`);
      setActiveTab('passes');
    } catch (err: any) {
      showToast(err.message || 'Failed to reserve slot');
    }
  };

  // Stage update by recruiter
  const handleUpdateStage = async (passId: string, stageIndex: number, note: string) => {
    try {
      const updated = await updatePassStage(passId, stageIndex, note);
      setPasses((prev) => prev.map((p) => (p.pass_id === passId ? updated : p)));
      showToast(`Applicant moved to Stage ${stageIndex + 1}!`);
    } catch (err: any) {
      showToast('Failed to update stage');
    }
  };

  // Venue Check-in simulation
  const handleCheckInSuccess = async (passId: string) => {
    try {
      const verified = await checkInPass(passId);
      setPasses((prev) => prev.map((p) => (p.pass_id === passId ? verified : p)));
      showToast('Venue check-in verified! Token authenticated.');
    } catch (err: any) {
      showToast('Failed to verify token');
    }
  };

  // Fix #1.3: Cancel pass & release slot back to public drive
  const handleCancelPass = async (passId: string) => {
    try {
      const result = await cancelPass(passId);
      setPasses((prev) => prev.map((p) => (p.pass_id === passId ? result.pass : p)));
      setDrives((prev) =>
        prev.map((d) => (d.id === result.drive.id ? result.drive : d))
      );
      showToast('Pass cancelled & interview slot returned to public drive!');
    } catch (err: any) {
      showToast(err.message || 'Failed to cancel pass');
    }
  };

  // Fix #2.1: Gate reception token verification
  const handleVerifyGateToken = async (token: string, note?: string) => {
    try {
      const verified = await verifyGateToken(token, note);
      setPasses((prev) => prev.map((p) => (p.pass_id === verified.pass_id ? verified : p)));
      showToast(`Admitted! ${verified.candidate_name} cleared at gate.`);
    } catch (err: any) {
      throw err; // Propagate to RecruiterStudio feedback banner
    }
  };

  // Recruiter post new drive
  const handleCreateDrive = async (driveData: Partial<Drive>) => {
    try {
      const newDrive = await createDrive(driveData);
      setDrives((prev) => [newDrive, ...prev]);
      showToast(`Drive for "${newDrive.company_name}" published live!`);
    } catch (err: any) {
      showToast('Failed to publish drive');
    }
  };

  // Share drive
  const handleShareDrive = async (drive: Drive) => {
    try {
      await recordShare();
      setReferralData((prev) => ({ ...prev, shares_count: prev.shares_count + 1 }));
      const text = `Walk-in interview drive at ${drive.company_name} for ${drive.role_title} (${drive.salary_range})! Reserve your pass: https://spothire.app/drive/${drive.id}?ref=${referralData.ref_code}`;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
      }
      showToast(`Invite link for ${drive.company_name} copied!`);
    } catch (err) {
      showToast('Link copied!');
    }
  };

  // Filter drives
  const counts = {
    today: drives.filter((d) => d.date_category === 'Today').length,
    tomorrow: drives.filter((d) => d.date_category === 'Tomorrow').length,
    weekend: drives.filter((d) => d.date_category === 'Weekend').length,
  };

  const filteredDrives = drives.filter((drive) => {
    const matchesDate = dateFilter === 'All' || drive.date_category === dateFilter;
    const matchesType = typeFilter === 'all' || drive.interview_type === typeFilter;
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      !searchQuery ||
      drive.company_name.toLowerCase().includes(query) ||
      drive.role_title.toLowerCase().includes(query) ||
      drive.eligibility.toLowerCase().includes(query) ||
      drive.venue_or_link.toLowerCase().includes(query);
    return matchesDate && matchesType && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-start antialiased text-slate-900">
      {/* Top Floating Helper for Desktop Viewers (Viewport Switcher & MySQL studio indicator) */}
      <header className="w-full max-w-4xl hidden sm:flex items-center justify-between px-4 py-2 text-xs text-slate-500 font-medium select-none">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-slate-700">SpotHire Live App</span>
          <span className="text-slate-400">· Express & MySQL Backend Active</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setIsMysqlStudioOpen(true)}
            className="flex items-center space-x-1.5 bg-white border border-slate-300 hover:border-blue-500 text-slate-700 px-3 py-1 rounded-full text-xs font-bold transition shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Open MySQL Studio</span>
          </button>
          <button
            type="button"
            onClick={() => setIsExpandedLayout(!isExpandedLayout)}
            className="flex items-center space-x-1 bg-white border border-slate-300 text-slate-700 px-2.5 py-1 rounded-full text-xs font-semibold hover:bg-slate-50 transition"
          >
            {isExpandedLayout ? (
              <>
                <Smartphone className="w-3.5 h-3.5 text-slate-500" />
                <span>Mobile Frame</span>
              </>
            ) : (
              <>
                <Monitor className="w-3.5 h-3.5 text-slate-500" />
                <span>Wide View</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Responsive App Container */}
      <div
        className={`w-full ${
          isExpandedLayout ? 'max-w-xl' : 'max-w-md'
        } bg-[#F8FAFC] min-h-screen flex flex-col shadow-2xl relative overflow-x-hidden border-x border-slate-200 transition-all duration-300`}
      >
        {/* Status Bar */}
        <StatusBar />

        {/* Top Header with Role Guard */}
        <Header
          recruiterSession={recruiterSession}
          onOpenRecruiterAuth={() => setIsRecruiterAuthModalOpen(true)}
          onLogoutRecruiter={handleLogoutRecruiter}
          onOpenMysqlStudio={() => setIsMysqlStudioOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 pb-24 px-4 pt-3 overflow-y-auto no-scrollbar space-y-4">
          {/* ============================================== */}
          {/* VIEW 1: DRIVES EXPLORER (CANDIDATE VIEW)       */}
          {/* ============================================== */}
          {activeTab === 'drives' && (
            <section className="space-y-4 animate-in fade-in duration-150">
              {/* Hero Live Alert Banner matching Image 1 */}
              <LiveAlertBanner totalWalkIns={counts.today + counts.tomorrow + counts.weekend} />

              {/* Date Filter Strip */}
              <DateFilterStrip
                selectedFilter={dateFilter}
                onSelectFilter={setDateFilter}
                counts={counts}
              />

              {/* Search & Format Filter Bar matching Image 1 */}
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search role, skills, or company..."
                    className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition shadow-2xs"
                  />
                </div>
                <div className="relative shrink-0">
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value as any)}
                    aria-label="Filter interview format"
                    className="appearance-none bg-white border border-slate-200 rounded-xl pl-3 pr-7 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-600 shadow-2xs cursor-pointer"
                  >
                    <option value="all">All Formats</option>
                    <option value="walk-in">In-Person Walk-in</option>
                    <option value="virtual">Virtual Meet</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-3 pointer-events-none text-slate-400" />
                </div>
              </div>

              {/* Drive Cards List matching Image 1 */}
              <div className="space-y-3.5">
                {filteredDrives.length === 0 ? (
                  <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 space-y-2">
                    <p className="text-sm font-semibold text-slate-700">
                      No interview drives match your current filter.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setDateFilter('All');
                        setTypeFilter('all');
                        setSearchQuery('');
                      }}
                      className="text-xs text-blue-600 font-bold hover:underline"
                    >
                      Reset Filters & View All Drives
                    </button>
                  </div>
                ) : (
                  filteredDrives.map((drive) => (
                    <DriveCard
                      key={drive.id}
                      drive={drive}
                      onBookSlot={(d) => setSelectedBookingDrive(d)}
                      onShare={handleShareDrive}
                    />
                  ))
                )}
              </div>
            </section>
          )}

          {/* ============================================== */}
          {/* VIEW 2: DIGITAL INTERVIEW PASSES               */}
          {/* ============================================== */}
          {activeTab === 'passes' && (
            <section className="animate-in fade-in duration-150">
              <PassesView
                passes={passes}
                onOpenQr={(p) => setSelectedQrPass(p)}
                onSharePass={(p) => {
                  const text = `I claimed my SpotHire Digital Pass (${p.pass_id}) for ${p.company_name}! Check out walk-ins: https://spothire.app/drive?ref=${referralData.ref_code}`;
                  if (navigator.clipboard) navigator.clipboard.writeText(text);
                  showToast('Pass invite link copied!');
                }}
                onCancelPass={handleCancelPass}
                onNavigateToDrives={() => setActiveTab('drives')}
              />
            </section>
          )}

          {/* ============================================== */}
          {/* VIEW 3: RECRUITER STUDIO                       */}
          {/* ============================================== */}
          {activeTab === 'studio' && recruiterSession && (
            <section className="animate-in fade-in duration-150">
              <RecruiterStudio
                passes={passes}
                recruiterSession={recruiterSession}
                onLogout={handleLogoutRecruiter}
                onUpdateStage={handleUpdateStage}
                onCreateDrive={handleCreateDrive}
                onVerifyGateToken={handleVerifyGateToken}
              />
            </section>
          )}

          {/* ============================================== */}
          {/* VIEW 4: REFERRAL & SKIP HUB                   */}
          {/* ============================================== */}
          {activeTab === 'referrals' && (
            <section className="animate-in fade-in duration-150">
              <ReferralsView
                referralData={referralData}
                onShare={async () => {
                  await recordShare();
                  setReferralData((prev) => ({ ...prev, shares_count: prev.shares_count + 1 }));
                }}
                onShowToast={showToast}
              />
            </section>
          )}
        </main>

        {/* Bottom Navigation matching Image 1 */}
        <BottomNav
          activeTab={activeTab}
          onTabChange={handleTabChange}
          hasPassesNotification={passes.length > 0}
          isRecruiter={Boolean(recruiterSession)}
          isExpandedLayout={isExpandedLayout}
        />

        {/* Slot Booking Modal */}
        <BookingModal
          drive={selectedBookingDrive}
          isOpen={Boolean(selectedBookingDrive)}
          onClose={() => setSelectedBookingDrive(null)}
          onConfirmBooking={handleConfirmBooking}
        />

        {/* QR Code Check-in Simulator Modal */}
        <QrModal
          pass={selectedQrPass}
          isOpen={Boolean(selectedQrPass)}
          onClose={() => setSelectedQrPass(null)}
          onCheckInSuccess={handleCheckInSuccess}
        />

        {/* Recruiter Authentication & Registration Modal */}
        <RecruiterAuthModal
          isOpen={isRecruiterAuthModalOpen}
          onClose={() => setIsRecruiterAuthModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />

        {/* MySQL Database Studio Modal */}
        <MysqlStudioModal
          isOpen={isMysqlStudioOpen}
          onClose={() => setIsMysqlStudioOpen(false)}
        />

        {/* Notification Toast */}
        {toastMessage && (
          <div className="fixed top-14 left-4 right-4 max-w-sm mx-auto bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center justify-between text-xs font-semibold z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <span>{toastMessage}</span>
            <span className="text-emerald-400 font-bold ml-2">
              <Check className="w-4 h-4 inline" />
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
