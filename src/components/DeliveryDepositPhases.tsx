import React from "react";
import { motion } from "motion/react";
import { 
  Truck, 
  MapPin, 
  CreditCard, 
  CheckCircle2, 
  ArrowRight,
  Layers
} from "lucide-react";

interface DeliveryDepositPhasesProps {
  onPreorderClick?: () => void;
  compact?: boolean;
}

export function DeliveryDepositPhases({ onPreorderClick, compact = false }: DeliveryDepositPhasesProps) {
  const PHASES = [
    {
      num: "01",
      title: "Deposit Lock",
      amount: "3,500 XAF",
      label: "Initial Deposit",
      desc: "Locks your size, colorway, and serial slot from the limited 50-piece batch via MTN / Orange Money.",
      points: [
        "MTN MoMo / Orange Money",
        "Instant digital reservation code",
        "WhatsApp verification"
      ],
      icon: <CreditCard className="w-5 h-5 text-white" />,
    },
    {
      num: "02",
      title: "Batch Crafting",
      amount: "240 GSM",
      label: "Combed Cotton",
      desc: "Heavyweight combed cotton fabric cutting, 1\" neck ribbing, and wash-tested HD DTF printing.",
      points: [
        "Heavyweight boxy structure",
        "Wash-proof HD DTF matrix",
        "Strict quality inspection"
      ],
      icon: <Layers className="w-5 h-5 text-white" />,
    },
    {
      num: "03",
      title: "Handover & Balance",
      amount: "1,000 XAF",
      label: "Due at Dispatch / Pickup",
      desc: "Balance settled at Buea pickup or upon agency courier dispatch across Cameroon.",
      points: [
        "Direct Pickup: UB Junction & Campaign Street 7",
        "Nationwide agency express delivery",
        "No settlement upon inspection"
      ],
      icon: <Truck className="w-5 h-5 text-white" />,
    },
  ];

  if (compact) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-30px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="bg-neutral-950 border border-white/10 rounded-[32px] p-6 sm:p-7 space-y-5 shadow-xl"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
          <div>
            <h4 className="font-display font-bold text-sm sm:text-base text-white uppercase tracking-wider">
              Deposit & Delivery Breakdown
            </h4>
            <p className="text-xs text-neutral-400 font-mono">
              Phased fulfillment steps for your preorder
            </p>
          </div>
          <span className="text-xs font-mono text-neutral-300 bg-neutral-900 border border-white/10 px-3 py-1 rounded-full w-fit">
            Total: 4,500 XAF (3,500 XAF now + 1,000 XAF balance)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PHASES.map((p, idx) => (
            <motion.div 
              key={p.num} 
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="p-4 bg-neutral-900/90 rounded-[20px] border border-white/10 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                  <span className="font-bold text-white uppercase">Phase {p.num}</span>
                  <span className="text-white font-bold bg-black/60 px-2 py-0.5 rounded border border-white/10">{p.amount}</span>
                </div>
                <h5 className="font-display font-bold text-sm text-white uppercase">{p.title}</h5>
                <p className="text-xs font-mono text-neutral-400 leading-relaxed">
                  {p.desc}
                </p>
              </div>

              <ul className="text-[11px] font-mono text-neutral-400 space-y-1.5 pt-2 border-t border-white/5">
                {p.points.map((pt, i) => (
                  <li key={i} className="flex items-center gap-1.5 text-neutral-300">
                    <CheckCircle2 size={12} className="text-white shrink-0" />
                    <span className="truncate">{pt}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 text-xs font-mono text-neutral-400 border-t border-white/10">
          <div className="flex items-center gap-2 text-neutral-300">
            <MapPin size={14} className="text-white shrink-0" />
            <span>Direct Pickup Only at UB Junction and Campaign Street 7 · Nationwide Courier</span>
          </div>
          <span className="text-white font-semibold text-xs">
            3,500 XAF Deposit · 1,000 XAF on Dispatch/Pickup
          </span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.section 
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="bg-neutral-950 border border-white/15 rounded-[36px] p-6 sm:p-9 md:p-10 space-y-8 shadow-2xl relative overflow-hidden"
    >
      {/* Header without the button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-1.5">
          <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest block">
            Fulfillment Transparency
          </span>
          <h3 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
            Delivery & Deposit Breakdown
          </h3>
          <p className="text-xs sm:text-sm text-neutral-300 font-mono leading-relaxed">
            Phased fulfillment: 3,500 XAF deposit now, 1,000 XAF balance at dispatch/pickup.
          </p>
        </div>

        <div className="font-mono text-left md:text-right bg-neutral-900/80 border border-white/10 p-3.5 rounded-2xl w-fit md:w-auto">
          <span className="text-[10px] text-neutral-400 uppercase block tracking-wider font-bold">Drop Total</span>
          <span className="font-display font-black text-2xl text-white">4,500 XAF</span>
        </div>
      </div>

      {/* 3 Phase Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        {PHASES.map((phase, idx) => (
          <motion.div
            key={phase.num}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.12 }}
            className="p-6 rounded-[26px] bg-neutral-900/90 border border-white/10 hover:border-white/30 transition-all flex flex-col justify-between space-y-4 shadow-lg"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-xl bg-black border border-white/20 flex items-center justify-center font-mono font-bold text-xs text-white shadow">
                  {phase.num}
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 bg-black/50 px-2.5 py-1 rounded-full border border-white/5">
                  {phase.label}
                </span>
              </div>

              <div>
                <h4 className="font-display font-bold text-base text-white uppercase">
                  {phase.title}
                </h4>
                <div className="font-display font-black text-xl text-white mt-1">
                  {phase.amount}
                </div>
              </div>

              <p className="text-xs text-neutral-300 font-mono leading-relaxed">
                {phase.desc}
              </p>
            </div>

            <div className="pt-3 border-t border-white/10 space-y-1.5">
              <ul className="space-y-1.5 text-xs font-mono text-neutral-300">
                {phase.points.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 size={13} className="text-white shrink-0 mt-0.5" />
                    <span className="leading-tight">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pickup & Courier footer bar */}
      <div className="p-5 bg-black/80 rounded-[24px] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
            <MapPin size={15} className="text-white shrink-0" />
            <span>Buea Handover & Nationwide Shipping</span>
          </div>
          <p className="text-neutral-300 text-xs leading-relaxed max-w-2xl">
            <strong className="text-white">Direct Pickup:</strong> UB Junction and Campaign Street 7 only. <br />
            <strong className="text-white">Nationwide:</strong> Douala, Yaoundé, Bamenda, Bafoussam, Limbe & all regions via agency courier. No settlement upon inspection.
          </p>
        </div>

        {onPreorderClick && (
          <button
            onClick={onPreorderClick}
            className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-white text-black hover:bg-neutral-200 font-display font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 shadow-lg scale-[1.01] hover:scale-[1.03]"
          >
            <span>Preorder (3,500 XAF)</span>
            <ArrowRight size={15} />
          </button>
        )}
      </div>
    </motion.section>
  );
}
