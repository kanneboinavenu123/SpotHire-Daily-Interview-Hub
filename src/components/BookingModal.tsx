import React, { useState } from 'react';
import { X, CheckCircle, Clock } from 'lucide-react';
import { Drive } from '../types/index.ts';

interface BookingModalProps {
  drive: Drive | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmBooking: (bookingData: {
    drive_id: string;
    candidate_name: string;
    candidate_phone: string;
    candidate_link?: string;
    selected_slot: string;
  }) => Promise<void>;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  drive,
  isOpen,
  onClose,
  onConfirmBooking,
}) => {
  if (!isOpen || !drive) return null;

  const [selectedSlot, setSelectedSlot] = useState<string>(
    drive.time_slots.find((s) => s.available)?.time || drive.time_slots[0]?.time || '10:00 AM - 11:00 AM'
  );
  const [candidateName, setCandidateName] = useState('Kavya Sharma');
  const [candidatePhone, setCandidatePhone] = useState('+91 98765 43210');
  const [candidateLink, setCandidateLink] = useState('https://linkedin.com/in/kavya-sharma-dev');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (drive.remaining_slots <= 0) {
      setErrorMsg('This drive is sold out. No slots remain.');
      return;
    }

    const cleanPhone = candidatePhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number for pass confirmation.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onConfirmBooking({
        drive_id: drive.id,
        candidate_name: candidateName.trim(),
        candidate_phone: candidatePhone.trim(),
        candidate_link: candidateLink.trim(),
        selected_slot: selectedSlot,
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to reserve slot. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 transition-opacity">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 space-y-4 max-h-[92vh] overflow-y-auto animate-in fade-in slide-in-from-bottom duration-200">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              Fast Pass Booking
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-1">
              Select Slot · {drive.company_name}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drive Overview */}
        <div className="text-xs bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
          <div className="font-bold text-slate-900">{drive.role_title}</div>
          <div className="text-slate-500 font-medium">
            {drive.date_category} ({drive.exact_date_display}) · {drive.interview_type.toUpperCase()}
          </div>
          <div className="text-slate-600 truncate">{drive.venue_or_link}</div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Time Slot Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2 flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>Choose Preferred Time Window</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {drive.time_slots.map((slot) => {
                const isSelected = slot.time === selectedSlot;
                return (
                  <button
                    key={slot.id}
                    type="button"
                    disabled={!slot.available}
                    onClick={() => setSelectedSlot(slot.time)}
                    className={`p-2.5 rounded-xl text-left border text-xs font-semibold transition ${
                      !slot.available
                        ? 'opacity-40 bg-slate-100 border-slate-200 cursor-not-allowed'
                        : isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-mono text-[11px] leading-tight">
                      {slot.time.split(' - ')[0]}
                    </div>
                    <div
                      className={`text-[9px] mt-0.5 ${
                        isSelected ? 'text-blue-100' : 'text-slate-500'
                      }`}
                    >
                      {slot.available ? 'Slot Available' : 'Full / Waitlist'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Candidate Form Fields */}
          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Your Full Name</label>
              <input
                type="text"
                required
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                placeholder="e.g. Kavya Sharma"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Mobile Number (For Pass SMS/WhatsApp Alert)
              </label>
              <input
                type="tel"
                required
                value={candidatePhone}
                onChange={(e) => setCandidatePhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Resume / LinkedIn / GitHub Profile
              </label>
              <input
                type="url"
                value={candidateLink}
                onChange={(e) => setCandidateLink(e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          {/* Validation / Duplication / Full Error Banner */}
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-3 text-xs flex items-start space-x-2 animate-in fade-in">
              <span className="text-rose-600 font-bold shrink-0">⚠️</span>
              <div className="leading-relaxed font-medium">{errorMsg}</div>
            </div>
          )}

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold py-3 rounded-2xl shadow-md text-xs flex items-center justify-center space-x-2 transition disabled:opacity-60"
          >
            <CheckCircle className="w-4 h-4" />
            <span>{isSubmitting ? 'Reserving Slot...' : 'Claim Digital Boarding Pass'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
