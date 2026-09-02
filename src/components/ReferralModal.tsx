import React, { useState } from "react";
import { motion } from "motion/react";
import { Copy, Check, MessageCircle, Gift, ArrowRight } from "lucide-react";

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerReferralCode?: string;
}

export function ReferralModal({ isOpen, onClose, customerReferralCode }: ReferralModalProps) {
  const [copied, setCopied] = useState(false);
  const code = customerReferralCode || "FOUNDER-2026";
  const shareUrl = `${window.location.origin}?ref=${code}`;
  const whatsappMsg = `Check out Drop 001 from Badass Designs (Vegeta Stencil Tee) - limited to only 50 Founder pieces! Use my invite code [${code}] to claim founder benefits: ${shareUrl}`;

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

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
        className="bg-neutral-950 max-w-lg w-full rounded-2xl overflow-hidden border border-white/20 shadow-2xl p-6 md:p-8 relative text-white space-y-5 max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white text-xs font-mono cursor-pointer px-2 py-1 bg-neutral-900 border border-neutral-800 rounded"
        >
          [× Close]
        </button>

        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-full bg-neutral-900 border border-white/20 flex items-center justify-center mx-auto text-white mb-2">
            <Gift size={20} />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
            Founder Rewards Program
          </span>
          <h3 className="font-display font-black text-2xl md:text-3xl tracking-tight text-white uppercase mt-1">
            Invite Friends & Unlock Free Gear
          </h3>
          <p className="text-xs font-mono text-neutral-300 max-w-sm mx-auto">
            Share your unique Founder Invite Link. When friends preorder, you unlock guaranteed rewards.
          </p>
        </div>

        {/* 3 Tier Rewards */}
        <div className="space-y-2">
          <div className="p-3 bg-neutral-900/60 border border-white/10 rounded-xl flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase text-neutral-400 block">Tier 1 · 1 Friend</span>
              <div className="font-display font-bold text-xs uppercase text-white">Badass Vinyl Sticker Pack</div>
            </div>
            <span className="text-[10px] font-mono bg-white/10 text-white px-2 py-0.5 rounded">1 Invite</span>
          </div>

          <div className="p-3 bg-neutral-900/60 border border-white/10 rounded-xl flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase text-neutral-400 block">Tier 2 · 2 Friends</span>
              <div className="font-display font-bold text-xs uppercase text-white">Limited Edition Snapback Cap</div>
            </div>
            <span className="text-[10px] font-mono bg-white/10 text-white px-2 py-0.5 rounded">2 Invites</span>
          </div>

          <div className="p-3 bg-neutral-900/80 border border-white/30 rounded-xl flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase text-white font-bold block">Tier 3 · 3 Friends</span>
              <div className="font-display font-bold text-xs uppercase text-white">100% Free Drop 002 T-Shirt</div>
            </div>
            <span className="text-[10px] font-mono bg-white text-black font-bold px-2 py-0.5 rounded">3 Invites</span>
          </div>
        </div>

        {/* Link Share Box */}
        <div className="p-3.5 bg-neutral-900 border border-white/15 rounded-xl space-y-2">
          <div className="text-[10px] font-mono uppercase text-neutral-400">Your Personal Invite Link</div>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="w-full bg-neutral-950 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-neutral-300 font-mono focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-white text-black hover:bg-neutral-200 text-xs font-mono font-bold rounded-lg transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>
        </div>

        <a
          href={`https://wa.me/?text=${encodeURIComponent(whatsappMsg)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 px-4 bg-white text-black hover:bg-neutral-200 font-display font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
        >
          <MessageCircle size={15} />
          <span>Share Link on WhatsApp</span>
        </a>
      </motion.div>
    </motion.div>
  );
}
