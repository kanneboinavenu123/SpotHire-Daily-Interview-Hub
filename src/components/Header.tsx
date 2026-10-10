import React from 'react';
import { Zap, User, Building2, Database } from 'lucide-react';

interface HeaderProps {
  currentRole: 'candidate' | 'recruiter';
  onRoleChange: (role: 'candidate' | 'recruiter') => void;
  onOpenMysqlStudio: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentRole, onRoleChange, onOpenMysqlStudio }) => {
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

        {/* Right side controls: MySQL Studio pill & Dual-Mode Role Toggle */}
        <div className="flex items-center space-x-2">
          {/* Quick MySQL Database Button */}
          <button
            onClick={onOpenMysqlStudio}
            title="Inspect MySQL Schema & Run SQL Queries"
            className="hidden xs:flex items-center space-x-1 text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-full border border-slate-200 transition"
          >
            <Database className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-mono text-[10px]">MySQL</span>
          </button>

          {/* Seeker / Studio toggle pill from Image 1 */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-full border border-slate-200">
            <button
              onClick={() => onRoleChange('candidate')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-all flex items-center space-x-1 ${
                currentRole === 'candidate'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className={`w-3.5 h-3.5 ${currentRole === 'candidate' ? 'text-blue-600' : 'text-slate-400'}`} />
              <span>Seeker</span>
            </button>
            <button
              onClick={() => onRoleChange('recruiter')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-all flex items-center space-x-1 ${
                currentRole === 'recruiter'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className={`w-3.5 h-3.5 ${currentRole === 'recruiter' ? 'text-blue-600' : 'text-slate-400'}`} />
              <span>Studio</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
