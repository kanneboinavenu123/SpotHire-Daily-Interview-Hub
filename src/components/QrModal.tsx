import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { InterviewPass } from '../types/index.ts';

interface QrModalProps {
  pass: InterviewPass | null;
  isOpen: boolean;
  onClose: () => void;
  onCheckInSuccess: (passId: string) => Promise<void>;
}

export const QrModal: React.FC<QrModalProps> = ({
  pass,
  isOpen,
  onClose,
  onCheckInSuccess,
}) => {
  if (!isOpen || !pass) return null;

  const [isVerifying, setIsVerifying] = useState(false);

  const handleSimulateScan = async () => {
    try {
      setIsVerifying(true);
      await onCheckInSuccess(pass.pass_id);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 text-center space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-6 h-6" />
        </div>

        <div>
          <h3 className="font-bold text-slate-900 text-base">
            {pass.company_name} Reception Check-in
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Show this live token to the reception desk or scan at security kiosk
          </p>
        </div>

        {/* QR Code graphic simulator */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col items-center justify-center">
          <div className="w-44 h-44 bg-white p-3 rounded-xl border border-slate-300 shadow-inner flex flex-col items-center justify-center relative overflow-hidden">
            <div className="w-full h-full grid grid-cols-7 gap-1 p-1">
              <div className="bg-slate-900 col-span-2 row-span-2 rounded-xs" />
              <div className="bg-slate-200" />
              <div className="bg-slate-900 col-span-2 row-span-2 rounded-xs" />
              <div className="bg-slate-900" />
              <div className="bg-slate-900" />
              <div className="bg-blue-600" />
              <div className="bg-slate-900" />
              <div className="bg-slate-300" />
              <div className="bg-slate-900 col-span-3 row-span-2 rounded-xs" />
              <div className="bg-slate-900" />
              <div className="bg-slate-900" />
              <div className="bg-emerald-500" />
              <div className="bg-slate-900" />
              <div className="bg-slate-200" />
              <div className="bg-slate-900 col-span-2 row-span-2 rounded-xs" />
              <div className="bg-slate-900" />
              <div className="bg-slate-900 col-span-2 row-span-2 rounded-xs" />
            </div>

            {/* Glowing laser scan line */}
            <div className="absolute inset-x-2 top-0 h-1 bg-blue-500/80 animate-pulse" />
          </div>

          <span className="font-mono text-xs font-bold text-slate-800 mt-2.5 tracking-wider">
            {pass.qr_token}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            type="button"
            disabled={isVerifying || pass.checked_in}
            onClick={handleSimulateScan}
            className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold py-2.5 rounded-xl text-xs transition shadow-md flex items-center justify-center space-x-1.5 disabled:opacity-75"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {pass.checked_in
                ? 'Already Verified at Venue'
                : isVerifying
                ? 'Scanning...'
                : 'Simulate Reception Check-in Scan'}
            </span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-slate-100 text-slate-700 font-semibold py-2 rounded-xl text-xs hover:bg-slate-200 transition"
          >
            Close Screen
          </button>
        </div>
      </div>
    </div>
  );
};
