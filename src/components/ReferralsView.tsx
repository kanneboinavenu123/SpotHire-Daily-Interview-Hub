import React, { useState } from 'react';
import { Copy, MessageCircle, Share2, Check, Star } from 'lucide-react';
import { ReferralData } from '../types/index.ts';

interface ReferralsViewProps {
  referralData: ReferralData;
  onShare: () => Promise<void>;
  onShowToast: (message: string) => void;
}

export const ReferralsView: React.FC<ReferralsViewProps> = ({
  referralData,
  onShare,
  onShowToast,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyCode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(referralData.ref_code);
    }
    setCopiedCode(true);
    onShowToast('Referral code copied to clipboard!');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = async () => {
    await onShare();
    const url = `https://spothire.app/drive?ref=${referralData.ref_code}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
    setCopiedLink(true);
    onShowToast('Invite link copied with Priority Pass badge!');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleWhatsAppShare = async () => {
    await onShare();
    const text = encodeURIComponent(
      `Hey! SpotHire has walk-in interview drives happening today. I reserved my Digital Boarding Pass. Claim your fast-track slot here: https://spothire.app/drive?ref=${referralData.ref_code}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    onShowToast('Sharing invite on WhatsApp...');
  };

  return (
    <div className="space-y-4">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-indigo-950 via-blue-950 to-slate-900 text-white rounded-2xl p-4 shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <span className="inline-block text-[10px] font-mono uppercase tracking-wider text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded mb-2 font-bold">
            Fast-Track Pass Program
          </span>
          <h2 className="text-lg font-bold">Share Drives. Skip Waiting Lines.</h2>
          <p className="text-xs text-slate-200 mt-1 leading-relaxed">
            When 2 friends claim daily interview passes using your invite link, you unlock the{' '}
            <span className="text-amber-300 font-bold">Priority Walk-in Badge</span> for same-day
            front-of-queue priority check-in.
          </p>
        </div>
        <div className="absolute -right-6 -top-6 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Referral Stats Cards */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] text-slate-500 font-medium">Invites Sent</div>
          <div className="text-lg font-bold font-mono text-slate-900 mt-0.5">
            {referralData.shares_count}
          </div>
        </div>
        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-[11px] text-slate-500 font-medium">Passes Booked</div>
          <div className="text-lg font-bold font-mono text-emerald-600 mt-0.5">
            {referralData.bookings_count}
          </div>
        </div>
        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="text-[11px] text-slate-500 font-medium">Priority Queue</div>
          <div className="text-xs font-bold text-amber-700 bg-amber-50 rounded-lg py-1 mt-0.5 flex items-center justify-center space-x-1">
            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
            <span>UNLOCKED</span>
          </div>
        </div>
      </div>

      {/* Personal Pass Code Card */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Your Personal Referral Pass Code</h3>

        <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono text-xs font-bold text-blue-700">
          <span>{referralData.ref_code}</span>
          <button
            type="button"
            onClick={handleCopyCode}
            className="text-xs font-sans font-bold bg-white text-slate-700 border border-slate-300 px-2.5 py-1 rounded-lg hover:bg-slate-100 transition flex items-center space-x-1"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <div className="space-y-2 pt-1">
          <label className="block text-xs font-semibold text-slate-700">
            Pre-Formatted WhatsApp & Message Invite
          </label>
          <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-200 leading-relaxed font-mono">
            "Hey! SpotHire has walk-in interview drives running today in Bangalore. I reserved my Digital Boarding Pass. Use my link to claim your slot with fast-track check-in: https://spothire.app/drive?ref={referralData.ref_code}"
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Share WhatsApp</span>
            </button>
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition"
            >
              <Share2 className="w-4 h-4" />
              <span>{copiedLink ? 'Link Copied!' : 'Copy Invite Link'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Verified Trust Statistics */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 text-xs space-y-1.5">
        <div className="flex items-center space-x-2 text-slate-800 font-bold">
          <span className="text-emerald-600 font-mono text-sm">94%</span>
          <span>Candidates report same-day feedback on SpotHire</span>
        </div>
        <p className="text-slate-500 leading-relaxed">
          Every drive is pre-vetted with certified venue capacity, registered HR contacts, and guaranteed slot allocation.
        </p>
      </div>
    </div>
  );
};
