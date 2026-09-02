import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface DropCountdownProps {
  targetDate?: string;
}

export function DropCountdown({ targetDate = "2026-10-31T23:59:59" }: DropCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, target - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="bg-neutral-950 border border-white/15 rounded-3xl p-5 sm:p-6 text-center max-w-2xl mx-auto shadow-2xl space-y-4">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300 text-xs font-mono uppercase tracking-widest">
        <Clock size={13} className="text-white animate-pulse" />
        <span>OCTOBER DROP · RESERVATION WINDOW CLOSES IN</span>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-md mx-auto">
        {/* Days */}
        <div className="bg-neutral-900 border border-white/10 rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center">
          <span className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight">
            {String(timeLeft.days).padStart(2, "0")}
          </span>
          <span className="text-[10px] font-mono text-neutral-400 uppercase mt-1">Days</span>
        </div>

        {/* Hours */}
        <div className="bg-neutral-900 border border-white/10 rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center">
          <span className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight">
            {String(timeLeft.hours).padStart(2, "0")}
          </span>
          <span className="text-[10px] font-mono text-neutral-400 uppercase mt-1">Hours</span>
        </div>

        {/* Minutes */}
        <div className="bg-neutral-900 border border-white/10 rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center">
          <span className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight">
            {String(timeLeft.minutes).padStart(2, "0")}
          </span>
          <span className="text-[10px] font-mono text-neutral-400 uppercase mt-1">Mins</span>
        </div>

        {/* Seconds */}
        <div className="bg-neutral-900 border border-white/10 rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center">
          <span className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight">
            {String(timeLeft.seconds).padStart(2, "0")}
          </span>
          <span className="text-[10px] font-mono text-neutral-400 uppercase mt-1">Secs</span>
        </div>
      </div>

      <p className="text-[11px] font-mono text-neutral-400">
        Strict limit: Only 50 pieces manufactured per batch · 3,500 XAF deposit required to lock serial number.
      </p>
    </div>
  );
}
