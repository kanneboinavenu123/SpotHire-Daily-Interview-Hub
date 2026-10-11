import React from 'react';
import { Briefcase, Ticket, Building2, Share2 } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'drives' | 'passes' | 'studio' | 'referrals';
  onTabChange: (tab: 'drives' | 'passes' | 'studio' | 'referrals') => void;
  hasPassesNotification?: boolean;
  isRecruiter?: boolean;
  isExpandedLayout?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  hasPassesNotification = true,
  isRecruiter = false,
  isExpandedLayout = false,
}) => {
  return (
    <nav className={`fixed bottom-0 left-0 right-0 ${isExpandedLayout ? 'max-w-xl' : 'max-w-md'} mx-auto bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-2 px-3 z-40 flex items-center justify-around shadow-lg transition-all duration-300`}>
      {/* Tab 1: Drives */}
      <button
        type="button"
        onClick={() => onTabChange('drives')}
        className={`flex flex-col items-center justify-center w-16 py-1 transition-all ${
          activeTab === 'drives' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-700'
        }`}
      >
        <Briefcase className="w-5 h-5 mb-0.5" strokeWidth={activeTab === 'drives' ? 2.5 : 2} />
        <span className="text-[10px] font-bold">Drives</span>
      </button>

      {/* Tab 2: My Passes */}
      <button
        type="button"
        onClick={() => onTabChange('passes')}
        className={`relative flex flex-col items-center justify-center w-16 py-1 transition-all ${
          activeTab === 'passes' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-700'
        }`}
      >
        {hasPassesNotification && (
          <span className="absolute top-0 right-3.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
        )}
        <Ticket className="w-5 h-5 mb-0.5" strokeWidth={activeTab === 'passes' ? 2.5 : 2} />
        <span className="text-[10px] font-bold">My Passes</span>
      </button>

      {/* Tab 3: Recruiter Studio - ONLY visible if authenticated as a recruiter */}
      {isRecruiter && (
        <button
          type="button"
          onClick={() => onTabChange('studio')}
          className={`flex flex-col items-center justify-center w-16 py-1 transition-all ${
            activeTab === 'studio' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-700'
          }`}
        >
          <Building2 className="w-5 h-5 mb-0.5" strokeWidth={activeTab === 'studio' ? 2.5 : 2} />
          <span className="text-[10px] font-bold">Studio</span>
        </button>
      )}

      {/* Tab 4: Refer & Skip */}
      <button
        type="button"
        onClick={() => onTabChange('referrals')}
        className={`flex flex-col items-center justify-center w-16 py-1 transition-all ${
          activeTab === 'referrals' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-700'
        }`}
      >
        <Share2 className="w-5 h-5 mb-0.5" strokeWidth={activeTab === 'referrals' ? 2.5 : 2} />
        <span className="text-[10px] font-bold">Refer & Skip</span>
      </button>
    </nav>
  );
};
