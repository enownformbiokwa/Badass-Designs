import React from "react";
import { motion } from "motion/react";
import { Layers, MessageCircle } from "lucide-react";

interface BehindTheScenesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BehindTheScenesModal({ isOpen, onClose }: BehindTheScenesModalProps) {
  if (!isOpen) return null;

  const milestones = [
    {
      stage: "PHASE 01 · THE VISION & SKETCH",
      title: "Vegeta Stencil v3 Deconstruction",
      desc: "Brutalist typography paired with high-contrast stenciled character lines.",
      badge: "DESIGN COMPLETE",
      tag: "24 Concept Iterations"
    },
    {
      stage: "PHASE 02 · TEXTILE ENGINEERING",
      title: "240 GSM Heavy Combed Cotton",
      desc: "Selected 240 GSM heavyweight fabric blend holding structured drop shoulder drape without sagging.",
      badge: "FABRIC LOCKED",
      tag: "Zero-Shrinkage Certified"
    },
    {
      stage: "PHASE 03 · PRINT QUALITY TEST",
      title: "High-Density DTF Print",
      desc: "Wash tests conducted to ensure prints withstand 50+ wash cycles without cracking.",
      badge: "LAB TESTED",
      tag: "50+ Wash Tested"
    },
    {
      stage: "PHASE 04 · PACKAGING & SERIALS",
      title: "Matte-Black Collector Box & Card",
      desc: "Packaged in rigid collector box with serialized metal-finish founder membership card.",
      badge: "IN PRODUCTION",
      tag: "Limited to 50"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, y: 15 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 15 }}
        className="bg-neutral-950 max-w-2xl w-full rounded-2xl overflow-hidden border border-white/20 shadow-2xl p-6 md:p-8 relative text-white space-y-5 max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white text-xs font-mono cursor-pointer px-2 py-1 bg-neutral-900 border border-neutral-800 rounded"
        >
          [× Close]
        </button>

        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300 font-mono text-[10px] uppercase font-bold tracking-widest">
            <Layers size={12} />
            <span>Behind-The-Scenes Production Diary</span>
          </div>
          <h3 className="font-display font-black text-2xl md:text-3xl tracking-tight text-white uppercase mt-1">
            The Craft Behind Drop 001
          </h3>
          <p className="text-xs font-mono text-neutral-400 max-w-md mx-auto">
            From raw cotton selection to precision DTF printing and custom serial packaging.
          </p>
        </div>

        {/* Milestones */}
        <div className="space-y-3">
          {milestones.map((m, idx) => (
            <div
              key={idx}
              className="bg-neutral-900/60 border border-white/10 rounded-xl p-4 transition-all duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                <span className="text-[10px] font-mono font-bold text-white uppercase tracking-wider">
                  {m.stage}
                </span>
                <span className="text-[9px] font-mono bg-white/10 text-neutral-300 px-2 py-0.5 rounded w-fit">
                  {m.tag}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mb-1 font-mono">
                {m.title}
              </h4>
              <p className="text-xs font-mono text-neutral-300 leading-relaxed">
                {m.desc}
              </p>
            </div>
          ))}
        </div>

        {/* WhatsApp community invite */}
        <div className="p-4 bg-neutral-900 border border-white/15 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <div className="text-xs font-bold text-white font-mono flex items-center justify-center sm:justify-start gap-1.5">
              <MessageCircle size={14} />
              <span>Want Live Production Updates?</span>
            </div>
            <p className="text-[11px] font-mono text-neutral-400">
              Join the VIP WhatsApp group for workshop clips and fabric unboxings.
            </p>
          </div>
          <a
            href="https://wa.me/237682226871?text=Hello%20Badass%20Designs,%20I'd%20like%20to%20follow%20the%20Drop%20001%20production%20updates!"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-white text-black hover:bg-neutral-200 rounded-lg font-mono text-xs font-bold uppercase tracking-wider shrink-0 transition-colors"
          >
            Join Community
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}
