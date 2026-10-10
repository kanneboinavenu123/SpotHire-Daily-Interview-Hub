import React, { useEffect, useState } from 'react';
import { QrCode, Share2, Clock, Check, Sparkles } from 'lucide-react';
import { InterviewPass } from '../types/index.ts';

interface PassesViewProps {
  passes: InterviewPass[];
  onOpenQr: (pass: InterviewPass) => void;
  onSharePass: (pass: InterviewPass) => void;
  onNavigateToDrives: () => void;
}

const STAGE_STEPS = [
  { key: 'applied', label: 'Applied' },
  { key: 'screening', label: 'Doc Screening' },
  { key: 'slot_confirmed', label: 'Slot Confirmed' },
  { key: 'in_round', label: 'In Progress' },
  { key: 'offer_extended', label: 'Decision Made' },
];

export const PassesView: React.FC<PassesViewProps> = ({
  passes,
  onOpenQr,
  onSharePass,
  onNavigateToDrives,
}) => {
  // Live ticking countdown timer for passes
  const [timeLefts, setTimeLefts] = useState<Record<string, string>>({});

  useEffect(() => {
    const updateCountdowns = () => {
      const updated: Record<string, string> = {};
      const now = Date.now();

      passes.forEach((pass) => {
        const target = new Date(pass.countdown_target).getTime();
        const diff = target - now;
        if (diff <= 0) {
          updated[pass.pass_id] = '00h 00m 00s (Live Now)';
        } else {
          const h = Math.floor(diff / (1000 * 60 * 60));
          const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const s = Math.floor((diff % (1000 * 60)) / 1000);
          updated[pass.pass_id] = `${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
        }
      });
      setTimeLefts(updated);
    };

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 1000);
    return () => clearInterval(interval);
  }, [passes]);

  if (passes.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 space-y-3 my-4">
        <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto text-2xl">
          🎫
        </div>
        <h3 className="font-bold text-slate-800 text-base">No Active Interview Passes</h3>
        <p className="text-xs text-slate-500 max-w-xs mx-auto">
          You haven't reserved an interview slot for today yet. Explore active walk-in drives and claim your pass!
        </p>
        <button
          type="button"
          onClick={onNavigateToDrives}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition"
        >
          Discover Today's Drives
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">Digital Interview Passes</h2>
          <p className="text-xs text-slate-500">Boarding passes for verified venue access & tracking</p>
        </div>
        <button
          type="button"
          onClick={onNavigateToDrives}
          className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition"
        >
          + Book Another
        </button>
      </div>

      <div className="space-y-5">
        {passes.map((pass) => {
          const isChecked = pass.checked_in;
          const statusLabel = STAGE_STEPS[pass.stage_index]?.label || 'Confirmed';
          const countdown = timeLefts[pass.pass_id] || '04h 18m 22s';

          return (
            <div
              key={pass.pass_id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-md relative overflow-hidden transition-all"
            >
              {/* Pass Top Section (Aviation Boarding Pass Visual Language) */}
              <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white p-4 relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-blue-200 bg-white/10 px-2 py-0.5 rounded">
                    SPOT-PASS · {pass.pass_id}
                  </span>
                  <span
                    className={`text-xs font-bold ${
                      isChecked ? 'bg-emerald-500' : 'bg-amber-500'
                    } text-white px-2.5 py-0.5 rounded-full shadow-sm flex items-center space-x-1`}
                  >
                    <span>{isChecked ? '✓ Verified at Venue' : statusLabel}</span>
                  </span>
                </div>

                <div className="flex items-start justify-between">
                  <div className="min-w-0 pr-2">
                    <h3 className="text-lg font-extrabold tracking-tight text-white leading-tight">
                      {pass.company_name}
                    </h3>
                    <p className="text-xs text-blue-100 font-medium truncate mt-0.5">
                      {pass.role_title}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-mono text-blue-200 block uppercase">
                      Gate / Slot
                    </span>
                    <span className="text-xs font-mono font-bold text-white bg-white/20 px-2 py-0.5 rounded">
                      {pass.selected_slot.split(' - ')[0]}
                    </span>
                  </div>
                </div>

                {/* Live Countdown Timer */}
                <div className="mt-3 bg-black/25 backdrop-blur-sm rounded-xl p-2.5 flex items-center justify-between border border-white/10">
                  <div className="flex items-center space-x-1.5 text-xs text-blue-200">
                    <Clock className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                    <span className="font-medium text-[11px]">Drive Starts In:</span>
                  </div>
                  <div className="font-mono text-xs font-bold text-amber-300 tracking-wider">
                    {countdown}
                  </div>
                </div>
              </div>

              {/* Perforated Tear-off Middle Line with Edge Notches */}
              <div className="relative bg-white py-2">
                <div className="ticket-notch-left" />
                <div className="ticket-notch-right" />
                <div className="ticket-dash" />
              </div>

              {/* Pass Details & 5-Step Stage Progression Tracker */}
              <div className="p-4 space-y-4 pt-1">
                {/* Candidate & Slot Info Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-semibold uppercase">
                      Candidate
                    </span>
                    <span className="font-bold text-slate-800">{pass.candidate_name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-semibold uppercase">
                      Date & Timing
                    </span>
                    <span className="font-bold text-slate-800 font-mono text-[11px]">
                      {pass.selected_slot}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block text-[10px] font-semibold uppercase">
                      Interview Venue
                    </span>
                    <span className="font-medium text-slate-700 truncate block">
                      {pass.venue_or_link}
                    </span>
                  </div>
                </div>

                {/* 5-Step Stage Progression Tracker */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-2.5">
                    <span>Live Stage Tracker</span>
                    <span className="text-blue-600 font-mono text-[11px]">
                      Stage {pass.stage_index + 1} of 5
                    </span>
                  </div>
                  <div className="flex items-center justify-between relative px-1">
                    {/* Progress track */}
                    <div className="absolute top-2.5 left-4 right-4 h-0.5 bg-slate-200 -z-0">
                      <div
                        className="h-full bg-blue-600 transition-all duration-500"
                        style={{ width: `${(pass.stage_index / 4) * 100}%` }}
                      />
                    </div>

                    {STAGE_STEPS.map((step, idx) => {
                      const isDone = idx < pass.stage_index;
                      const isCurrent = idx === pass.stage_index;
                      return (
                        <div key={step.key} className="flex flex-col items-center relative z-10 w-12 text-center">
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                              isDone
                                ? 'bg-emerald-600 text-white'
                                : isCurrent
                                ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                                : 'bg-slate-200 text-slate-500'
                            }`}
                          >
                            {isDone ? <Check className="w-3 h-3 stroke-[3]" /> : idx + 1}
                          </div>
                          <span
                            className={`text-[9px] font-semibold mt-1 leading-tight ${
                              isCurrent ? 'text-blue-700 font-bold' : 'text-slate-500'
                            }`}
                          >
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recruiter Live Note */}
                <div className="bg-blue-50/80 border border-blue-100 rounded-xl p-2.5 text-xs text-blue-900 flex items-start space-x-2">
                  <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[11px] block">Recruiter Studio Note:</span>
                    <span className="text-[11px] text-blue-800 font-medium">
                      {pass.recruiter_note || 'Slot reserved. Please arrive 15 minutes before your slot time.'}
                    </span>
                  </div>
                </div>

                {/* Actions: Show QR Token & Share Pass */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => onOpenQr(pass)}
                    className="bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-sm transition"
                  >
                    <QrCode className="w-4 h-4 text-emerald-400" />
                    <span>{isChecked ? 'View QR Token' : 'Show Check-in QR'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onSharePass(pass)}
                    className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition"
                  >
                    <Share2 className="w-4 h-4 text-blue-600" />
                    <span>Share Pass Invite</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
