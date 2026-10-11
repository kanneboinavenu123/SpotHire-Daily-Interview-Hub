import React from 'react';
import { Zap, Building2, Database, Lock, LogOut } from 'lucide-react';
import { RecruiterSession } from '../types/index.ts';

interface HeaderProps {
  recruiterSession: RecruiterSession | null;
  onOpenRecruiterAuth: () => void;
  onLogoutRecruiter: () => void;
  onOpenMysqlStudio: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  recruiterSession,
  onOpenRecruiterAuth,
  onLogoutRecruiter,
  onOpenMysqlStudio,
}) => {
  return (
    <header className="px-4 py-3 bg-white border-b border-slate-200/80 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        {/* Brand Lockup matching Image 1 */}
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/25 shrink-0">
            <Zap className="w-5 h-5 fill-white stroke-white" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h1 className="font-extrabold text-slate-900 text-lg leading-tight tracking-tight">
                SpotHire
              </h1>
              <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded leading-none">
                WALK-INS
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium leading-none mt-0.5">
              Daily Direct Interview Passes
            </p>
          </div>
        </div>

        {/* Right side controls: MySQL Studio pill & Recruiter Portal Guard */}
        <div className="flex items-center space-x-2">
          {/* Quick MySQL Database Button */}
          <button
            type="button"
            onClick={onOpenMysqlStudio}
            title="Inspect MySQL Schema & Run SQL Queries"
            className="hidden xs:flex items-center space-x-1 text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-full border border-slate-200 transition"
          >
            <Database className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-mono text-[10px]">MySQL</span>
          </button>

          {/* Conditional Role Authentication Control */}
          {recruiterSession ? (
            <div className="flex items-center space-x-1.5">
              <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-blue-800 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
                <Building2 className="w-3 h-3 text-blue-600" />
                <span className="truncate max-w-[80px] xs:max-w-[110px]">{recruiterSession.company_name} Studio</span>
              </span>
              <button
                type="button"
                onClick={onLogoutRecruiter}
                className="flex items-center space-x-1 text-xs font-bold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2.5 py-1 rounded-xl transition shadow-2xs"
                title="Log out of Recruiter Studio"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenRecruiterAuth}
              className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full border border-slate-200 transition shadow-2xs"
            >
              <Lock className="w-3 h-3 text-slate-500" />
              <span>Recruiter Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
