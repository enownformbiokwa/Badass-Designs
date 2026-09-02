import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, MessageCircle, Instagram, Sparkles } from "lucide-react";
import { BRAND_MANIFESTO } from "../data/pieces";

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SignatureModal({ isOpen, onClose }: SignatureModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-md cursor-pointer"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-md bg-neutral-950 border border-white/15 rounded-2xl p-6 sm:p-8 z-10 space-y-6 shadow-2xl text-center"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-900 transition-colors"
            >
              <X size={18} />
            </button>

            {/* Badass Monogram */}
            <div className="mx-auto w-12 h-12 rounded-xl bg-neutral-900 border border-white/15 flex items-center justify-center text-white">
              <Sparkles size={20} />
            </div>

            {/* Founder Note */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400">
                Founder Statement
              </span>
              <h3 className="font-display font-black text-2xl text-white uppercase tracking-tight">
                Badass Designs
              </h3>
              <p className="text-xs text-neutral-300 font-mono leading-relaxed italic max-w-sm mx-auto">
                "Clothing is armor. When you step into a Badass piece, you're not just wearing anime-infused streetwear, you're embodying unyielding pride, discipline, and uncompromising authenticity."
              </p>
            </div>

            {/* Signature Box */}
            <div className="p-4 bg-neutral-900/60 border border-white/10 rounded-xl space-y-1.5">
              <div className="font-display font-black text-base text-white tracking-widest uppercase">
                VON ENOWNFOR M.
              </div>
              <div className="text-[11px] font-mono text-neutral-400">
                Founder & Lead Designer · Buea, Cameroon
              </div>
              <div className="text-xs font-mono font-bold text-white tracking-[0.2em] uppercase pt-1">
                FOR THOSE WHO KNOW.
              </div>
            </div>

            {/* Direct Channels */}
            <div className="flex justify-center gap-2.5 pt-1">
              <a
                href={BRAND_MANIFESTO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-neutral-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors"
              >
                <MessageCircle size={13} />
                <span>WhatsApp</span>
              </a>

              <a
                href={BRAND_MANIFESTO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-neutral-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors"
              >
                <Instagram size={13} />
                <span>Instagram</span>
              </a>

              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-black uppercase font-mono tracking-wider transition-colors cursor-pointer"
              >
                Enter
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
