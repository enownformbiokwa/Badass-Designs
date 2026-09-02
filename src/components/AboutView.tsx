import React from "react";
import { motion } from "motion/react";
import { 
  ShieldCheck, 
  MapPin, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Flame,
  Truck
} from "lucide-react";

interface AboutViewProps {
  onPreorderClick: () => void;
}

export function AboutView({ onPreorderClick }: AboutViewProps) {
  return (
    <div className="space-y-16 sm:space-y-24 max-w-4xl mx-auto py-8 sm:py-12">
      {/* Centralized Hero Header */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-center space-y-6"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-neutral-300 text-xs font-mono shadow-sm">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span>Buea, Cameroon · Est. 2026</span>
        </div>
        
        <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl text-white uppercase tracking-tight">
          Badass Designs
        </h1>

        <p className="text-base sm:text-lg text-neutral-400 font-mono tracking-wider max-w-md mx-auto">
          FOR THOSE WHO KNOW.
        </p>
      </motion.section>

      {/* Centralized Brand Narrative & Standards */}
      <motion.section 
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="bg-neutral-950 border border-white/15 rounded-[40px] p-8 sm:p-12 md:p-16 space-y-16 relative overflow-hidden shadow-2xl"
      >
        {/* The Philosophy - Centralized */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest block">
            The Philosophy
          </span>
          <h2 className="font-display font-black text-2xl sm:text-4xl text-white uppercase tracking-tight">
            Structure. Attitude. Craft.
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 font-mono leading-relaxed pt-2">
            Heavyweight anime streetwear engineered in Buea. No generic merchandise. Pure architectural drape and wash-proof direct pigment matrixes.
          </p>
        </div>

        {/* 3 Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="p-6 sm:p-7 bg-neutral-900/80 rounded-[26px] border border-white/10 hover:border-white/25 transition-all text-center space-y-3 shadow-lg"
          >
            <div className="w-10 h-10 mx-auto rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-white">
              <Layers size={18} />
            </div>
            <span className="text-[10px] uppercase text-neutral-400 font-bold tracking-widest block">01 · Weight</span>
            <h3 className="font-display font-bold text-white text-base uppercase">240 GSM Combed</h3>
            <p className="text-xs text-neutral-400 font-mono leading-relaxed">
              Dense zero-transparency drape that holds sharp boxy structure perpetually.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="p-6 sm:p-7 bg-neutral-900/80 rounded-[26px] border border-white/10 hover:border-white/25 transition-all text-center space-y-3 shadow-lg"
          >
            <div className="w-10 h-10 mx-auto rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-white">
              <Sparkles size={18} />
            </div>
            <span className="text-[10px] uppercase text-neutral-400 font-bold tracking-widest block">02 · Matrix</span>
            <h3 className="font-display font-bold text-white text-base uppercase">HD DTF Fusion</h3>
            <p className="text-xs text-neutral-400 font-mono leading-relaxed">
              Deep pigment bonding tested for 40+ wash cycles without cracking.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="p-6 sm:p-7 bg-neutral-900/80 rounded-[26px] border border-white/10 hover:border-white/25 transition-all text-center space-y-3 shadow-lg"
          >
            <div className="w-10 h-10 mx-auto rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-white">
              <ShieldCheck size={18} />
            </div>
            <span className="text-[10px] uppercase text-neutral-400 font-bold tracking-widest block">03 · Scarcity</span>
            <h3 className="font-display font-bold text-white text-base uppercase">50-Piece Batch</h3>
            <p className="text-xs text-neutral-400 font-mono leading-relaxed">
              Capped serialized collections for verified founding collectors.
            </p>
          </motion.div>
        </div>

        {/* The Phased Drop System - Centralized */}
        <div className="border-t border-white/10 pt-14 space-y-10">
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest block">
              Fulfillment
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
              Phased Release Model
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs font-mono">
            <motion.div 
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="p-6 bg-neutral-900/90 rounded-[24px] border border-white/10 text-center space-y-2.5 shadow-md"
            >
              <div className="w-8 h-8 mx-auto rounded-full bg-black border border-white/20 flex items-center justify-center font-bold text-white text-xs">
                1
              </div>
              <h4 className="font-display font-bold text-white text-sm uppercase">Lock Deposit</h4>
              <p className="text-neutral-400 text-xs leading-relaxed">
                3,500 XAF via MTN / Orange Money secures size and serial.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="p-6 bg-neutral-900/90 rounded-[24px] border border-white/10 text-center space-y-2.5 shadow-md"
            >
              <div className="w-8 h-8 mx-auto rounded-full bg-black border border-white/20 flex items-center justify-center font-bold text-white text-xs">
                2
              </div>
              <h4 className="font-display font-bold text-white text-sm uppercase">Batch Craft</h4>
              <p className="text-neutral-400 text-xs leading-relaxed">
                240 GSM cutting, precision ribbing, and HD DTF pigment curing.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="p-6 bg-neutral-900/90 rounded-[24px] border border-white/10 text-center space-y-2.5 shadow-md"
            >
              <div className="w-8 h-8 mx-auto rounded-full bg-black border border-white/20 flex items-center justify-center font-bold text-white text-xs">
                3
              </div>
              <h4 className="font-display font-bold text-white text-sm uppercase">Handover</h4>
              <p className="text-neutral-400 text-xs leading-relaxed">
                1,000 XAF balance settled at pickup or agency courier dispatch.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Centralized Location & Action Footnote */}
        <div className="border-t border-white/10 pt-12 text-center space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-white font-mono text-xs uppercase font-bold tracking-wider">
              <MapPin size={16} />
              <span>Buea Handover Points</span>
            </div>
            <p className="text-neutral-400 font-mono text-xs max-w-md mx-auto">
              UB Junction & Campaign Street 7 · Nationwide Cameroon Delivery
            </p>
          </div>

          <div className="pt-2 flex justify-center">
            <button
              onClick={onPreorderClick}
              className="py-4 px-8 rounded-full bg-white text-black hover:bg-neutral-200 font-display font-black text-xs uppercase tracking-wider flex items-center gap-2.5 transition-all cursor-pointer shadow-xl hover:scale-105"
            >
              <span>Explore October Drop</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
