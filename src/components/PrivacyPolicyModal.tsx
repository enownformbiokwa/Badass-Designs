import React from "react";
import { motion } from "motion/react";
import { X, ShieldCheck, Lock, Eye, Database } from "lucide-react";

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PrivacyPolicyModal({ isOpen, onClose }: PrivacyPolicyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-neutral-950 border border-white/20 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-neutral-900 rounded-xl border border-white/10 text-white">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 className="font-display font-black text-xl text-white uppercase">
                Privacy Policy
              </h2>
              <span className="text-xs font-mono text-neutral-400">
                Badass Designs · Buea, Cameroon
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4 font-mono text-xs sm:text-sm text-neutral-300 leading-relaxed">
          <p>
            At Badass Designs ("we", "our", "us"), we respect your privacy and are committed to protecting any personal information you share when reserving our limited streetwear drops.
          </p>

          <div className="space-y-2">
            <h3 className="font-display font-bold text-white uppercase text-sm flex items-center gap-2">
              <Database size={15} className="text-neutral-400" />
              <span>1. Information We Collect</span>
            </h3>
            <p className="text-neutral-400">
              When you submit a preorder reservation or join our drop list, we collect essential fulfillment details: your full name, phone number (for MTN/Orange Money deposit verification and delivery updates), email address, and chosen delivery location in Buea, Douala, Yaoundé, or worldwide.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-display font-bold text-white uppercase text-sm flex items-center gap-2">
              <Lock size={15} className="text-neutral-400" />
              <span>2. How We Use Your Data</span>
            </h3>
            <p className="text-neutral-400">
              Your information is used strictly for internal order fulfillment, verifying mobile money deposit confirmations, coordinating secure pickups/deliveries, and notifying you when future drops release. We never sell, rent, or share your data with third-party advertisers.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-display font-bold text-white uppercase text-sm flex items-center gap-2">
              <Eye size={15} className="text-neutral-400" />
              <span>3. Cookies & Local Storage</span>
            </h3>
            <p className="text-neutral-400">
              Our website uses basic local storage preferences to remember your cookie consent choice, cart items, and active selections. You can decline cookies via our banner, though certain interactive features may require temporary session storage.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-display font-bold text-white uppercase text-sm flex items-center gap-2">
              <ShieldCheck size={15} className="text-neutral-400" />
              <span>4. Contact Us</span>
            </h3>
            <p className="text-neutral-400">
              For any privacy inquiries or to request removal of captured drop list information, contact our headquarters in Buea, Cameroon or reach out via WhatsApp at +237 679 798 568.
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 pt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white text-black font-display font-black text-xs uppercase rounded-xl hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            I Understand
          </button>
        </div>
      </motion.div>
    </div>
  );
}
