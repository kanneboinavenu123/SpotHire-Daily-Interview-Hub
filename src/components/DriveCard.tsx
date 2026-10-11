import React from 'react';
import { MapPin, Share2, ArrowRight } from 'lucide-react';
import { Drive } from '../types/index.ts';

interface DriveCardProps {
  drive: Drive;
  onBookSlot: (drive: Drive) => void;
  onShare: (drive: Drive) => void;
}

export const DriveCard: React.FC<DriveCardProps> = ({ drive, onBookSlot, onShare }) => {
  const isWalkIn = drive.interview_type === 'walk-in';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm hover:shadow transition-all space-y-3">
      {/* Top Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center space-x-3 min-w-0">
          <div
            className={`w-11 h-11 rounded-xl ${drive.logo_bg} text-white font-bold flex items-center justify-center text-lg shadow-sm shrink-0`}
          >
            {drive.logo_initial}
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-medium truncate">
              <span className="font-bold text-slate-900 text-sm">{drive.company_name}</span>
              <span>·</span>
              <span>{drive.date_category}</span>
            </div>
            <button
              type="button"
              onClick={() => onBookSlot(drive)}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 text-left leading-snug line-clamp-2 mt-0.5"
            >
              {drive.role_title}
            </button>
          </div>
        </div>

        {/* Format Badge top-right */}
        <div className="shrink-0">
          {isWalkIn ? (
            <span className="inline-flex items-center text-[10px] font-bold text-emerald-800 bg-[#e6fbf2] border border-emerald-200/80 px-2 py-0.5 rounded-md whitespace-nowrap">
              📍 In-Person Walk-in
            </span>
          ) : (
            <span className="inline-flex items-center text-[10px] font-bold text-purple-800 bg-purple-50 border border-purple-200/80 px-2 py-0.5 rounded-md whitespace-nowrap">
              📹 Virtual Meet
            </span>
          )}
        </div>
      </div>

      {/* Package, Vacancies & Remaining Slots */}
      <div className="text-xs text-slate-500 font-medium flex flex-wrap items-center gap-y-1 gap-x-2 pt-0.5">
        <span className="text-slate-900 font-bold">{drive.salary_range}</span>
        <span>·</span>
        <span>{drive.vacancies} Vacancies</span>
        <span>·</span>
        {drive.remaining_slots <= 0 ? (
          <span className="text-rose-700 font-bold bg-rose-50 border border-rose-200 px-2 py-0.5 rounded font-mono text-[11px]">
            Housefull · 0 slots left
          </span>
        ) : (
          <span className="text-amber-800 font-semibold bg-amber-50 border border-amber-100/80 px-1.5 py-0.5 rounded font-mono text-[11px]">
            {drive.remaining_slots} slots left
          </span>
        )}
      </div>

      {/* Location / Venue Bar matching Image 1 */}
      <div className="bg-slate-50/90 rounded-xl px-3 py-2 text-xs text-slate-600 border border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center space-x-2 truncate">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{drive.venue_or_link}</span>
        </div>
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono shrink-0">
          {drive.date_category.toUpperCase()}
        </span>
      </div>

      {/* Interview Process Flow */}
      <div className="text-[11px] text-slate-500 space-y-1">
        <div className="font-semibold text-slate-700">Interview Process:</div>
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
          {drive.rounds.map((round, idx) => (
            <React.Fragment key={idx}>
              <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium whitespace-nowrap text-[11px]">
                {round.name}
              </span>
              {idx < drive.rounds.length - 1 && (
                <span className="text-slate-300 text-xs">→</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Action Buttons matching Image 1 */}
      <div className="pt-1 flex items-center space-x-2">
        <button
          type="button"
          disabled={drive.remaining_slots <= 0}
          onClick={() => onBookSlot(drive)}
          className={`flex-1 text-xs font-bold py-2.5 rounded-xl shadow-xs transition flex items-center justify-center space-x-1.5 ${
            drive.remaining_slots <= 0
              ? 'bg-slate-200 text-slate-500 border border-slate-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white shadow-sm'
          }`}
        >
          <span>{drive.remaining_slots <= 0 ? 'Drive Full · 0 Slots Remaining' : 'Book Interview Slot'}</span>
          {drive.remaining_slots > 0 && <ArrowRight className="w-3.5 h-3.5" />}
        </button>
        <button
          type="button"
          onClick={() => onShare(drive)}
          className="w-10 h-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition shrink-0"
          title="Share interview drive with friend"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
