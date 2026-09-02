import React from "react";
import { Sparkles, Archive, Lock } from "lucide-react";

export function DropSystemExplainer() {
  return (
    <div className="p-6 md:p-8 bg-neutral-950 border border-white/15 rounded-2xl space-y-6">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300 text-xs font-mono uppercase tracking-wider">
          <Sparkles size={13} />
          <span>The Badass Release Philosophy</span>
        </div>
        <h3 className="font-display font-black text-2xl md:text-3xl text-white uppercase tracking-tight">
          Drop → Archive → Retired
        </h3>
        <p className="text-xs md:text-sm text-neutral-400 leading-relaxed font-mono">
          We do not believe in fake panic. Pieces remain available in our Archive, but <strong>being early gives you the best price and complete founder perks</strong>.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* State 1: DROP */}
        <div className="p-5 bg-neutral-900/60 border border-white/30 rounded-xl space-y-3 relative">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold bg-white text-black px-2 py-0.5 rounded uppercase">
              Current Drop
            </span>
            <span className="font-display font-black text-white text-lg">
              4,500 XAF
            </span>
          </div>

          <h4 className="font-display font-bold text-white text-base uppercase">
            01. Drop Phase
          </h4>

          <ul className="space-y-1.5 text-xs text-neutral-300 font-mono">
            <li className="flex items-center gap-1.5 text-white">
              <span>✦</span> The physical piece
            </li>
            <li className="flex items-center gap-1.5 text-white">
              <span>✦</span> Drop-exclusive packaging
            </li>
            <li className="flex items-center gap-1.5 text-white">
              <span>✦</span> Founder Gift Draw entry
            </li>
            <li className="flex items-center gap-1.5 text-white">
              <span>✦</span> Serialized collectible card
            </li>
            <li className="flex items-center gap-1.5 text-white">
              <span>✦</span> Lifetime early drop access
            </li>
          </ul>

          <div className="pt-2 border-t border-white/10 text-[11px] text-neutral-400 font-mono">
            Active during announced countdown window.
          </div>
        </div>

        {/* State 2: ARCHIVE */}
        <div className="p-5 bg-neutral-900/40 border border-white/10 rounded-xl space-y-3 relative">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded uppercase">
              Archive Order
            </span>
            <span className="font-display font-black text-white text-lg">
              5,000 XAF
            </span>
          </div>

          <h4 className="font-display font-bold text-white text-base uppercase flex items-center gap-1.5">
            <Archive size={16} />
            <span>02. The Archive</span>
          </h4>

          <ul className="space-y-1.5 text-xs text-neutral-400 font-mono">
            <li className="flex items-center gap-1.5">
              <span>•</span> The physical piece
            </li>
            <li className="flex items-center gap-1.5">
              <span>•</span> Standard brand packaging
            </li>
            <li className="flex items-center gap-1.5 line-through text-neutral-600">
              <span>✕</span> Founder Gift Draw entry
            </li>
            <li className="flex items-center gap-1.5 line-through text-neutral-600">
              <span>✕</span> Serialized metal card
            </li>
          </ul>

          <div className="pt-2 border-t border-white/10 text-[11px] text-neutral-400 font-mono">
            Produced on-demand with slightly higher price.
          </div>
        </div>

        {/* State 3: RETIRED */}
        <div className="p-5 bg-neutral-950 border border-white/5 rounded-xl space-y-3 opacity-60">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono bg-neutral-900 text-neutral-500 px-2 py-0.5 rounded uppercase">
              Vaulted
            </span>
            <span className="font-display font-black text-neutral-500 text-lg">
              Archived
            </span>
          </div>

          <h4 className="font-display font-bold text-neutral-400 text-base uppercase flex items-center gap-1.5">
            <Lock size={16} />
            <span>03. Retired</span>
          </h4>

          <ul className="space-y-1.5 text-xs text-neutral-500 font-mono">
            <li>Never reprinted</li>
            <li>Preserved in museum archive</li>
            <li>Gen-1 collector status</li>
          </ul>

          <div className="pt-2 border-t border-white/5 text-[11px] text-neutral-600 font-mono">
            Permanent closure after season end.
          </div>
        </div>
      </div>
    </div>
  );
}
