import React from 'react';

interface DateFilterStripProps {
  selectedFilter: string;
  onSelectFilter: (filter: string) => void;
  counts: {
    today: number;
    tomorrow: number;
    weekend: number;
  };
}

export const DateFilterStrip: React.FC<DateFilterStripProps> = ({
  selectedFilter,
  onSelectFilter,
  counts,
}) => {
  return (
    <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1 pt-0.5 -mx-4 px-4">
      {/* Today's Drives */}
      <button
        type="button"
        onClick={() => onSelectFilter('Today')}
        className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
          selectedFilter === 'Today'
            ? 'bg-slate-900 text-white shadow-sm'
            : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
        }`}
      >
        <span>Today's Drives</span>
        <span
          className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
            selectedFilter === 'Today'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          {counts.today}
        </span>
      </button>

      {/* Tomorrow */}
      <button
        type="button"
        onClick={() => onSelectFilter('Tomorrow')}
        className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
          selectedFilter === 'Tomorrow'
            ? 'bg-slate-900 text-white shadow-sm'
            : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
        }`}
      >
        <span>Tomorrow</span>
        <span
          className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
            selectedFilter === 'Tomorrow'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          {counts.tomorrow}
        </span>
      </button>

      {/* Weekend Mega-Drive */}
      <button
        type="button"
        onClick={() => onSelectFilter('Weekend')}
        className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
          selectedFilter === 'Weekend'
            ? 'bg-slate-900 text-white shadow-sm'
            : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
        }`}
      >
        <span>Weekend Mega-Drive</span>
        <span
          className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
            selectedFilter === 'Weekend'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          {counts.weekend}
        </span>
      </button>

      {/* All Drives */}
      <button
        type="button"
        onClick={() => onSelectFilter('All')}
        className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
          selectedFilter === 'All'
            ? 'bg-slate-900 text-white shadow-sm'
            : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
        }`}
      >
        <span>All Drives</span>
      </button>
    </div>
  );
};
