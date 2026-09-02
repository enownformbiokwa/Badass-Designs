import React from "react";
import { Clock, CheckCircle2, AlertCircle } from "lucide-react";

interface ProductionTrackerProps {
  currentReservedCount?: number;
}

export function ProductionTracker({ currentReservedCount = 28 }: ProductionTrackerProps) {
  const totalDropCap = 50;
  const progressPercent = Math.min(100, Math.round((currentReservedCount / totalDropCap) * 100));

  const stages = [
    { label: "Design & Patterns", status: "COMPLETED", date: "Aug 15" },
    { label: "Fabric Sampling (240 GSM)", status: "COMPLETED", date: "Aug 25" },
    { label: "Founder Preorders Open", status: "IN_PROGRESS", date: "Active Now" },
    { label: "Bulk Cutting & Print Runs", status: "SCHEDULED", date: "Oct 10" },
    { label: "Packaging & Delivery", status: "SCHEDULED", date: "Oct 25" },
  ];

  return (
    <div className="p-5 sm:p-7 bg-neutral-950 border border-white/15 rounded-2xl space-y-6 text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase bg-white/10 text-neutral-300 px-2.5 py-0.5 rounded">
            Transparency Tracker
          </span>
          <h3 className="font-display font-black text-xl sm:text-2xl uppercase tracking-tight text-white mt-1">
            Drop 001 Production & Allocation
          </h3>
        </div>

        <div className="text-right font-mono text-xs text-neutral-400">
          Reserved: <strong className="text-white font-display text-base">{currentReservedCount} / {totalDropCap}</strong> pieces
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-mono text-neutral-400">
          <span>Allocation Progress</span>
          <span className="text-white font-bold">{progressPercent}% Claimed</span>
        </div>
        <div className="h-2 bg-neutral-900 border border-white/10 rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-white rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Stages Timeline */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
        {stages.map((st, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-xl border text-xs font-mono space-y-1 ${
              st.status === "COMPLETED"
                ? "bg-neutral-900/80 border-white/20 text-neutral-300"
                : st.status === "IN_PROGRESS"
                ? "bg-white text-black border-white font-bold"
                : "bg-neutral-950 border-white/5 text-neutral-500"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] opacity-70">Step 0{idx + 1}</span>
              {st.status === "COMPLETED" && <CheckCircle2 size={12} className="text-white" />}
              {st.status === "IN_PROGRESS" && <Clock size={12} className="text-black" />}
            </div>
            <div className="font-bold text-xs truncate">{st.label}</div>
            <div className="text-[10px] opacity-80">{st.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
