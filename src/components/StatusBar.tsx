import React, { useEffect, useState } from 'react';
import { Wifi, Signal } from 'lucide-react';

export const StatusBar: React.FC = () => {
  const [timeStr, setTimeStr] = useState('23:26');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      setTimeStr(`${h}:${m}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-between text-xs font-semibold text-slate-600 px-4 pt-2.5 pb-2 border-b border-slate-100/60 bg-white/95 select-none">
      <span className="font-mono text-slate-800 text-xs tracking-wider">{timeStr}</span>
      <div className="flex items-center space-x-2">
        <Wifi className="w-3.5 h-3.5 text-slate-700" strokeWidth={2.4} />
        <Signal className="w-3.5 h-3.5 text-slate-700" strokeWidth={2.4} />
        <div className="flex items-center space-x-1">
          <span className="text-[11px] font-mono text-slate-800 font-bold">98%</span>
        </div>
      </div>
    </div>
  );
};
