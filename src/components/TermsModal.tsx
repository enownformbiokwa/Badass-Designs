import React from "react";
import { motion } from "motion/react";
import { X, FileText, CheckCircle, AlertCircle, Shield } from "lucide-react";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TermsModal({ isOpen, onClose }: TermsModalProps) {
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
              <FileText size={20} />
            </div>
            <div>
              <h2 className="font-display font-black text-xl text-white uppercase">
                Terms and Conditions
              </h2>
              <span className="text-xs font-mono text-neutral-400">
                Badass Designs · October Drop Collection
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
            Welcome to Badass Designs. By placing a preorder reservation or interacting with our release platform, you agree to the following terms and conditions.
          </p>

          <div className="space-y-2">
            <h3 className="font-display font-bold text-white uppercase text-sm flex items-center gap-2">
              <CheckCircle size={15} className="text-neutral-400" />
              <span>1. Preorder Deposit Structure</span>
            </h3>
            <p className="text-neutral-400">
              Each piece in the October Drop is produced in strict, limited runs. A mandatory deposit of <strong>3,500 XAF</strong> is required via MTN MoMo or Orange Money to lock your serial number and secure production. The remaining balance of <strong>1,000 XAF</strong> is payable upon handover or delivery.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-display font-bold text-white uppercase text-sm flex items-center gap-2">
              <Shield size={15} className="text-neutral-400" />
              <span>2. Quality & Craftsmanship Standard</span>
            </h3>
            <p className="text-neutral-400">
              All garments are crafted from 240 GSM combed cotton with high-definition wash-proof DTF prints tested for 40+ wash cycles. We guarantee structural integrity and pristine stitching upon handover.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-display font-bold text-white uppercase text-sm flex items-center gap-2">
              <AlertCircle size={15} className="text-neutral-400" />
              <span>3. Drop Lifecycle & Archiving</span>
            </h3>
            <p className="text-neutral-400">
              Once an active drop window closes, pieces transition to the Archive and are permanently retired. Preorders locked during the active drop window will be fulfilled according to the scheduled delivery phases in Buea and nationwide.
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 pt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white text-black font-display font-black text-xs uppercase rounded-xl hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            I Accept Terms
          </button>
        </div>
      </motion.div>
    </div>
  );
}
