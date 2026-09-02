import React, { useState } from "react";
import { Check, Shield, Gift, Crown, Layers, Download, Award, ChevronDown, ChevronUp } from "lucide-react";

interface FounderOfferStackProps {
  onPreorderClick: () => void;
  accentBg?: string;
  accentText?: string;
}

export function FounderOfferStack({ onPreorderClick }: FounderOfferStackProps) {
  const [activeTab, setActiveTab] = useState<"stack" | "guarantee">("stack");

  const stackItems = [
    {
      title: "Heavyweight 240 GSM Oversized Anime Tee",
      desc: "Vegeta Stencil v3 with crisp front & rear high-density prints on 240 GSM combed cotton.",
      value: "10,000 FCFA",
      icon: <Layers size={16} className="text-white" />,
      badge: "PHYSICAL PIECE"
    },
    {
      title: "Matte-Black Founder Packaging Box",
      desc: "Custom heavy-duty unboxing box sealed with brand holographic tape.",
      value: "3,500 FCFA",
      icon: <Gift size={16} className="text-white" />,
      badge: "COLLECTOR PACK"
    },
    {
      title: "Numbered Metal-Finish Founder Card",
      desc: "Permanently stamped serial number verifying Gen-1 brand ownership.",
      value: "5,000 FCFA",
      icon: <Crown size={16} className="text-white" />,
      badge: "LIMITED 50 PIECES"
    },
    {
      title: "Certificate of Authenticity",
      desc: "Official Certificate signed by the design team. Never restocked.",
      value: "2,500 FCFA",
      icon: <Award size={16} className="text-white" />,
      badge: "AUTHENTICITY"
    },
    {
      title: "Lifetime Priority Access to Drop 002",
      desc: "Guaranteed 24-hour early access reservation window before public drop release.",
      value: "5,000 FCFA",
      icon: <Award size={16} className="text-white" />,
      badge: "VIP ACCESS"
    },
    {
      title: "Entry into Grand Founder Draw",
      desc: "Preorders qualify to win a free heavyweight anime hoodie or 25,000 XAF voucher.",
      value: "35,000 FCFA",
      icon: <Gift size={16} className="text-white" />,
      badge: "GIVEAWAY"
    },
  ];

  return (
    <div className="bg-neutral-950 border border-white/15 rounded-2xl p-5 sm:p-7 text-white space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase bg-white/10 text-neutral-300 px-2.5 py-0.5 rounded">
            Founder Value Stack
          </span>
          <h3 className="font-display font-black text-xl sm:text-2xl uppercase tracking-tight text-white mt-1">
            Everything Included in Drop 001
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("stack")}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
              activeTab === "stack"
                ? "bg-white text-black font-bold"
                : "bg-neutral-900 text-neutral-400 hover:text-white"
            }`}
          >
            Included Perks
          </button>
          <button
            onClick={() => setActiveTab("guarantee")}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
              activeTab === "guarantee"
                ? "bg-white text-black font-bold"
                : "bg-neutral-900 text-neutral-400 hover:text-white"
            }`}
          >
            Guarantee
          </button>
        </div>
      </div>

      {activeTab === "stack" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {stackItems.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 bg-neutral-900/60 border border-white/10 rounded-xl flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-neutral-800 border border-white/10 flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <div className="flex-1 min-w-0 space-y-0.5">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-display font-bold text-xs uppercase text-white truncate">
                    {item.title}
                  </h4>
                  <span className="text-[9px] font-mono uppercase bg-white/5 text-neutral-400 px-1.5 py-0.5 rounded shrink-0">
                    {item.badge}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed font-mono">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-5 bg-neutral-900/40 border border-white/10 rounded-xl space-y-3">
          <div className="flex items-center gap-2 text-white font-display font-bold text-sm uppercase">
            <Shield size={18} />
            <span>The 100% Fit & Quality Guarantee</span>
          </div>
          <p className="text-xs text-neutral-300 font-mono leading-relaxed">
            If your piece doesn't fit your desired oversized silhouette or doesn't meet the 240 GSM heavy cotton standard, exchange it for any size free of charge within 7 days in Buea, Douala, or Yaoundé.
          </p>
        </div>
      )}

      {/* Summary Footer */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10">
        <div className="text-left font-mono text-xs text-neutral-400">
          Drop Price: <strong className="text-white text-base font-display">4,500 XAF</strong> (3,500 XAF deposit)
        </div>
        <button
          onClick={onPreorderClick}
          className="w-full sm:w-auto py-2.5 px-6 bg-white text-black hover:bg-neutral-200 font-display font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
        >
          Reserve My Founder Piece
        </button>
      </div>
    </div>
  );
}
