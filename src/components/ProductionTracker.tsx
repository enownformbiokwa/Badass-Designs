import React from "react";
import { Clock, CheckCircle2, ShieldCheck, Box } from "lucide-react";

export function ProductionTracker() {
  const stages = [
    { label: "Fabric & Color Lab", status: "COMPLETED", detail: "240 GSM Combed Cotton verified" },
    { label: "Fit & Wash Prototype", status: "COMPLETED", detail: "Zero shrinkage & crack testing passed" },
    { label: "Preorder Window", status: "IN_PROGRESS", detail: "Open until batch capacity is reached" },
    { label: "Cut & High-Density Print", status: "SCHEDULED", detail: "Precision multi-pass printing" },
    { label: "Quality Handover", status: "SCHEDULED", detail: "Agency dispatch & Buea direct pickup" },
  ];

  return (
    <div className="p-5 sm:p-7 bg-neutral-950 border border-white/15 rounded-2xl space-y-6 text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase bg-white/10 text-neutral-300 px-2.5 py-0.5 rounded">
            Fulfillment Integrity
          </span>
          <h3 className="font-display font-black text-xl sm:text-2xl uppercase tracking-tight text-white mt-1">
            Production Roadmap & Quality Milestones
          </h3>
        </div>

        <div className="flex items-center gap-2 text-neutral-400 font-mono text-xs">
          <ShieldCheck size={15} className="text-white" />
          <span>Strict 50-Piece Batch Cap per Drop</span>
        </div>
      </div>

      {/* Production Principles Note */}
      <div className="p-3.5 bg-neutral-900/60 border border-white/10 rounded-xl flex items-start gap-3 text-xs font-mono text-neutral-300 leading-relaxed">
        <Box size={16} className="text-white shrink-0 mt-0.5" />
        <p>
          We manufacture in strictly limited batches to guarantee meticulous seam tension, 240 GSM weight density, and zero graphic fading. No mass overproduction.
        </p>
      </div>

      {/* Stages Timeline */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-1">
        {stages.map((st, idx) => (
          <div
            key={idx}
            className={`p-3.5 rounded-xl border text-xs font-mono space-y-1.5 ${
              st.status === "COMPLETED"
                ? "bg-neutral-900/70 border-white/20 text-neutral-300"
                : st.status === "IN_PROGRESS"
                ? "bg-white text-black border-white font-bold"
                : "bg-neutral-950 border-white/5 text-neutral-500"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] opacity-70">Phase 0{idx + 1}</span>
              {st.status === "COMPLETED" && <CheckCircle2 size={13} className="text-white" />}
              {st.status === "IN_PROGRESS" && <Clock size={13} className="text-black" />}
            </div>
            <div className="font-bold text-xs">{st.label}</div>
            <div className="text-[10px] leading-tight opacity-75">{st.detail}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
