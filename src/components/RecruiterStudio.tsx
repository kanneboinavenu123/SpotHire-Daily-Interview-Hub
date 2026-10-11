import React, { useState } from 'react';
import { Building2, PlusCircle, Users, CheckCircle2, ArrowRight, LogOut, ShieldCheck } from 'lucide-react';
import { InterviewPass, Drive, RecruiterSession } from '../types/index.ts';

interface RecruiterStudioProps {
  passes: InterviewPass[];
  recruiterSession?: RecruiterSession | null;
  onLogout?: () => void;
  onUpdateStage: (passId: string, stageIndex: number, note: string) => Promise<void>;
  onCreateDrive: (driveData: Partial<Drive>) => Promise<void>;
  onVerifyGateToken: (token: string, note?: string) => Promise<void>;
}

export const RecruiterStudio: React.FC<RecruiterStudioProps> = ({
  passes,
  recruiterSession,
  onLogout,
  onUpdateStage,
  onCreateDrive,
  onVerifyGateToken,
}) => {
  const [subTab, setSubTab] = useState<'applicants' | 'create'>('applicants');

  // Gate Scanner State (Fix #2.1)
  const [gateTokenInput, setGateTokenInput] = useState('');
  const [isVerifyingGate, setIsVerifyingGate] = useState(false);
  const [gateFeedback, setGateFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form State - initialized with recruiter company if available
  const [companyName, setCompanyName] = useState(recruiterSession?.company_name || '');
  const [roleTitle, setRoleTitle] = useState('');
  const [dateCategory, setDateCategory] = useState<'Today' | 'Tomorrow' | 'Weekend'>('Today');
  const [format, setFormat] = useState<'walk-in' | 'virtual'>('walk-in');
  const [venueOrLink, setVenueOrLink] = useState('');
  const [salaryRange, setSalaryRange] = useState('');
  const [vacancies, setVacancies] = useState(5);
  const [eligibility, setEligibility] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  const handleGateVerify = async (e?: React.FormEvent, directToken?: string) => {
    if (e) e.preventDefault();
    const token = directToken || gateTokenInput.trim();
    if (!token) return;

    try {
      setIsVerifyingGate(true);
      setGateFeedback(null);
      await onVerifyGateToken(token);
      setGateFeedback({
        type: 'success',
        message: `Token "${token}" verified! Candidate admitted & directed to Interview Bay.`,
      });
      setGateTokenInput('');
    } catch (err: any) {
      setGateFeedback({
        type: 'error',
        message: err.message || 'Token verification failed. Check code and try again.',
      });
    } finally {
      setIsVerifyingGate(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !roleTitle.trim()) return;

    try {
      setIsPublishing(true);
      await onCreateDrive({
        company_name: companyName.trim(),
        role_title: roleTitle.trim(),
        date_category: dateCategory,
        interview_type: format,
        venue_or_link:
          venueOrLink.trim() ||
          (format === 'virtual' ? 'https://meet.google.com/drive-meet' : 'Indiranagar 100ft Road, Bengaluru'),
        salary_range: salaryRange.trim() || '₹6.0 - 10.0 LPA',
        vacancies: Number(vacancies) || 4,
        eligibility: eligibility.trim() || 'Degree in Computer Science or equivalent hands-on experience',
      });

      // Reset form
      setCompanyName('');
      setRoleTitle('');
      setVenueOrLink('');
      setSalaryRange('');
      setEligibility('');
      setSubTab('applicants');
    } catch (err) {
      console.error(err);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Studio Header Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-md">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              Recruiter Control Hub
            </span>
          </div>
          <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md font-mono border border-slate-700">
            SpotHire Verified
          </span>
        </div>
        <h2 className="text-base font-bold">Publish & Manage Daily Drives</h2>
        <p className="text-xs text-slate-300 mt-1">
          Deploy walk-in slots in under 2 minutes. Instantly update applicant stages and verify venue check-in tokens.
        </p>

        {recruiterSession && (
          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-[10px]">
                {recruiterSession.company_name[0]}
              </div>
              <div>
                <span className="font-bold text-slate-200 block text-[11px] leading-tight">
                  {recruiterSession.name}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {recruiterSession.company_name} · {recruiterSession.email}
                </span>
              </div>
            </div>
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="text-[10px] font-bold text-rose-400 hover:text-rose-300 bg-rose-950/60 hover:bg-rose-900/60 border border-rose-800/60 px-2 py-1 rounded-lg transition"
              >
                Sign Out
              </button>
            )}
          </div>
        )}
      </div>

      {/* Sub Tabs */}
      <div className="flex rounded-xl bg-slate-200/80 p-1 text-xs font-bold">
        <button
          type="button"
          onClick={() => setSubTab('applicants')}
          className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
            subTab === 'applicants'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Applicants Queue ({passes.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setSubTab('create')}
          className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
            subTab === 'create'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>+ Post New Drive</span>
        </button>
      </div>

      {/* View A: Applicants Queue */}
      {subTab === 'applicants' && (
        <div className="space-y-3.5">
          {/* Fix #2.1: Gate Reception Scanner & Token Validator */}
          <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Gate Security & Reception Desk Scanner</span>
              </span>
              <span className="text-[10px] font-mono text-slate-500">Venue Gate Check-in</span>
            </div>

            <form onSubmit={handleGateVerify} className="flex items-center space-x-2">
              <input
                type="text"
                value={gateTokenInput}
                onChange={(e) => setGateTokenInput(e.target.value)}
                placeholder="Enter Token or Pass ID (e.g. AUTH-RZP-9041-IN)"
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono uppercase focus:bg-white focus:outline-none focus:border-blue-600"
              />
              <button
                type="submit"
                disabled={isVerifyingGate || !gateTokenInput.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-xs flex items-center space-x-1 disabled:opacity-50 shrink-0"
              >
                <span>{isVerifyingGate ? 'Verifying...' : 'Admit Candidate'}</span>
              </button>
            </form>

            {/* Quick-admit chips of candidates awaiting gate check-in */}
            {passes.filter((p) => !p.checked_in && !p.is_cancelled).length > 0 && (
              <div className="pt-1 flex items-center space-x-1.5 overflow-x-auto no-scrollbar text-[10px]">
                <span className="text-slate-400 font-medium shrink-0">Awaiting Arrival:</span>
                {passes
                  .filter((p) => !p.checked_in && !p.is_cancelled)
                  .map((p) => (
                    <button
                      key={p.pass_id}
                      type="button"
                      onClick={() => handleGateVerify(undefined, p.qr_token)}
                      className="bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 rounded-lg px-2 py-0.5 whitespace-nowrap transition"
                    >
                      {p.candidate_name} ({p.pass_id})
                    </button>
                  ))}
              </div>
            )}

            {/* Verification Result Feedback */}
            {gateFeedback && (
              <div
                className={`p-2.5 rounded-xl text-xs font-medium flex items-center justify-between ${
                  gateFeedback.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                <span>{gateFeedback.message}</span>
                <button
                  type="button"
                  onClick={() => setGateFeedback(null)}
                  className="text-xs font-bold px-1 hover:opacity-75"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-medium">
            <span>Today's Live Queue ({passes.length})</span>
            <span>Update pass status in real-time</span>
          </div>

          {passes.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 text-center border border-slate-200 text-xs text-slate-500">
              No candidates have claimed passes yet today.
            </div>
          ) : (
            passes.map((pass) => {
              const isCancelled = pass.is_cancelled || pass.stage_index === 6;
              const isRejected = pass.stage_index === 5;

              return (
                <div
                  key={pass.pass_id}
                  className={`bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-xs space-y-3 ${
                    isCancelled ? 'opacity-80 bg-slate-50/70' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 text-xs">{pass.candidate_name}</span>
                        <span className="font-mono text-[10px] text-slate-400">{pass.pass_id}</span>
                      </div>
                      <div className="text-[11px] text-blue-700 font-semibold mt-0.5">
                        {pass.company_name} · {pass.selected_slot}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        {pass.candidate_phone}
                        {pass.candidate_link && (
                          <span>
                            {' '}
                            ·{' '}
                            <a
                              href={pass.candidate_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              Profile
                            </a>
                          </span>
                        )}
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${
                        isCancelled
                          ? 'bg-slate-200 text-slate-700'
                          : isRejected
                          ? 'bg-rose-100 text-rose-800'
                          : pass.stage_index === 4
                          ? 'bg-emerald-100 text-emerald-800'
                          : pass.checked_in
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {isCancelled
                        ? 'No-Show / Cancelled'
                        : isRejected
                        ? 'Did Not Clear'
                        : pass.stage_index === 4
                        ? 'Offer Extended'
                        : pass.checked_in
                        ? 'Admitted at Venue'
                        : 'Awaiting Check-in'}
                    </span>
                  </div>

                  {/* Stage Progression Buttons (Fix #2.2: Added Did Not Clear & No-Show) */}
                  {!isCancelled && (
                    <div className="space-y-1.5 pt-1 border-t border-slate-100">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        Update Candidate Stage:
                      </span>
                      <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateStage(pass.pass_id, 1, 'Doc Screening Cleared. Verified candidate CV.')
                          }
                          className={`py-1.5 px-2 rounded-lg font-bold transition ${
                            pass.stage_index === 1
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          Doc Screening
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateStage(pass.pass_id, 3, 'Currently in Technical Round with Engineering Team.')
                          }
                          className={`py-1.5 px-2 rounded-lg font-bold transition ${
                            pass.stage_index === 3
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          In-Progress
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateStage(pass.pass_id, 4, 'Offer Extended! Congratulations on clearing all rounds.')
                          }
                          className={`py-1.5 px-2 rounded-lg font-bold transition ${
                            pass.stage_index === 4
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          Decision / Offer
                        </button>
                      </div>

                      {/* Rejection & No-Show Handlers */}
                      <div className="grid grid-cols-2 gap-1.5 text-[10px] pt-0.5">
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateStage(pass.pass_id, 5, 'Did not clear Round 1 technical assessment.')
                          }
                          className={`py-1 px-2 rounded-lg font-bold transition ${
                            pass.stage_index === 5
                              ? 'bg-rose-600 text-white'
                              : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                          }`}
                        >
                          ✕ Did Not Clear
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateStage(pass.pass_id, 6, 'Candidate was absent / marked No-Show.')
                          }
                          className={`py-1 px-2 rounded-lg font-bold transition ${
                            pass.stage_index === 6
                              ? 'bg-slate-700 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                          }`}
                        >
                          ⊘ Mark No-Show
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* View B: Post New Drive Form */}
      {subTab === 'create' && (
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3.5">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            Create Rapid Interview Drive
          </h3>

          <form onSubmit={handleFormSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Company Name</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Razorpay, Zepto, Flipkart"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Role Title</label>
              <input
                type="text"
                required
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                placeholder="e.g. Junior Frontend Developer"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Interview Date</label>
                <select
                  value={dateCategory}
                  onChange={(e) => setDateCategory(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-medium focus:outline-none focus:border-blue-600"
                >
                  <option value="Today">Today (Immediate)</option>
                  <option value="Tomorrow">Tomorrow</option>
                  <option value="Weekend">This Weekend</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Drive Format</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-medium focus:outline-none focus:border-blue-600"
                >
                  <option value="walk-in">In-Person Walk-in</option>
                  <option value="virtual">Virtual Google Meet</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                {format === 'virtual' ? 'Virtual Meeting Link' : 'Venue Address / Location'}
              </label>
              <input
                type="text"
                required
                value={venueOrLink}
                onChange={(e) => setVenueOrLink(e.target.value)}
                placeholder={
                  format === 'virtual'
                    ? 'https://meet.google.com/xyz-drive-2026'
                    : 'e.g. Koramangala 4th Block, Bengaluru'
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Salary Range</label>
                <input
                  type="text"
                  required
                  value={salaryRange}
                  onChange={(e) => setSalaryRange(e.target.value)}
                  placeholder="e.g. ₹5.0 - 8.5 LPA"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-none focus:border-blue-600"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Open Vacancies</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={vacancies}
                  onChange={(e) => setVacancies(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Eligibility Criteria</label>
              <input
                type="text"
                required
                value={eligibility}
                onChange={(e) => setEligibility(e.target.value)}
                placeholder="e.g. 0-2 yrs exp, B.Tech/BCA/B.Sc, JavaScript"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-none focus:border-blue-600"
              />
            </div>

            <button
              type="submit"
              disabled={isPublishing}
              className="w-full mt-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold py-2.5 rounded-xl shadow-md transition flex items-center justify-center space-x-1.5 disabled:opacity-60"
            >
              <span>{isPublishing ? 'Publishing...' : 'Publish Drive & Open Passes'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
