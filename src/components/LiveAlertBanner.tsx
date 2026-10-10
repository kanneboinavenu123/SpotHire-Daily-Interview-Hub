import React from 'react';

interface LiveAlertBannerProps {
  totalWalkIns?: number;
}

export const LiveAlertBanner: React.FC<LiveAlertBannerProps> = ({ totalWalkIns = 9 }) => {
  return (
    <div className="bg-gradient-to-r from-[#172554] via-[#1e1b4b] to-[#1e3a8a] text-white rounded-2xl p-4 shadow-md relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-1.5">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase text-blue-200 bg-white/10 px-2.5 py-0.5 rounded-full backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            LIVE TODAY
          </span>
          <span className="text-xs font-mono text-blue-200 font-medium">
            {totalWalkIns} Active Walk-ins
          </span>
        </div>
        <h2 className="text-base font-bold text-white mt-1 leading-snug">
          Instant Same-Day Interview Drives
        </h2>
        <p className="text-xs text-blue-100/90 mt-1 leading-relaxed">
          Skip resume black holes. Reserve your interview slot now & claim your Digital Pass.
        </p>
      </div>
      {/* Decorative ambient lighting */}
      <div className="absolute -right-6 -bottom-8 w-28 h-28 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
    </div>
  );
};
