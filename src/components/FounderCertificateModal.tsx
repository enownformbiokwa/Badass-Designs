import React, { useState } from "react";
import { motion } from "motion/react";
import { Crown, Download, MessageCircle, Gift, CheckCircle2, Copy, Check, ShieldCheck } from "lucide-react";
import { OrderConfirmation } from "../types";

interface FounderCertificateModalProps {
  order: OrderConfirmation | null;
  onClose: () => void;
  onOpenReferral: () => void;
}

export function FounderCertificateModal({ order, onClose, onOpenReferral }: FounderCertificateModalProps) {
  const [copiedCode, setCopiedCode] = useState(false);

  if (!order) return null;

  const founderNumStr = String(order.founderNumber || 1).padStart(2, "0");
  const dateFormatted = new Date(order.timestamp).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const handleCopyCode = () => {
    navigator.clipboard.writeText(order.referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const whatsappLink = `https://wa.me/237682226871?text=${encodeURIComponent(
    `Hello Badass Designs! I just secured Founder Preorder #${order.orderId} (Founder No. ${founderNumStr}/50) for ${order.quantity}x ${order.product} (${order.color}, Size ${order.size}). Please send the MoMo deposit instructions!`
  )}`;

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
        className="bg-neutral-950 max-w-xl w-full rounded-2xl overflow-hidden border border-white/20 shadow-2xl p-6 md:p-8 relative text-white space-y-5 max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white text-xs font-mono cursor-pointer px-2 py-1 bg-neutral-900 border border-neutral-800 rounded"
        >
          [× Close]
        </button>

        {/* Certificate Card */}
        <div className="bg-neutral-900/60 border border-white/20 rounded-2xl p-6 md:p-7 relative overflow-hidden shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Crown size={18} className="text-white" />
              <span className="font-mono text-xs uppercase tracking-widest text-neutral-300 font-bold">
                Drop 001 Founder Certificate
              </span>
            </div>
            <span className="font-mono text-xs bg-white text-black font-bold px-2 py-0.5 rounded">
              No. {founderNumStr} / 50
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-neutral-500">Certified Owner</span>
            <div className="font-display font-black text-xl md:text-2xl text-white tracking-wide uppercase">
              {order.name}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/10 text-xs font-mono">
            <div>
              <span className="text-neutral-500 text-[10px] block">ORDER ID</span>
              <span className="text-white font-bold">{order.orderId}</span>
            </div>
            <div>
              <span className="text-neutral-500 text-[10px] block">DATE</span>
              <span className="text-white">{dateFormatted}</span>
            </div>
            <div>
              <span className="text-neutral-500 text-[10px] block">DEPOSIT</span>
              <span className="text-white font-bold">{order.depositAmount?.toLocaleString()} XAF</span>
            </div>
            <div>
              <span className="text-neutral-500 text-[10px] block">LOCATION</span>
              <span className="text-white truncate block">{order.location}</span>
            </div>
          </div>

          <div className="p-3 bg-neutral-950 border border-white/10 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-neutral-400 block">YOUR FOUNDER REFERRAL CODE</span>
              <span className="font-mono font-black text-sm text-white tracking-wider">{order.referralCode}</span>
            </div>
            <button
              onClick={handleCopyCode}
              className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-white/15 rounded-lg text-xs font-mono text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedCode ? <Check size={13} /> : <Copy size={13} />}
              <span>{copiedCode ? "Copied" : "Copy"}</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 bg-white text-black hover:bg-neutral-200 font-display font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            <MessageCircle size={16} />
            <span>Send MoMo Confirmation on WhatsApp</span>
          </a>

          <button
            onClick={onOpenReferral}
            className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 border border-white/15 text-neutral-300 hover:text-white rounded-xl text-xs font-mono flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Gift size={14} />
            <span>Invite Friends & Unlock Free Merch</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
