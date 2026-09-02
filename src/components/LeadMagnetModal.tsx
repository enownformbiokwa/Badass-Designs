import React, { useState } from "react";
import { motion } from "motion/react";
import { Download, Sparkles, Phone, CheckCircle2, ShieldCheck, User } from "lucide-react";

interface LeadMagnetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LeadMagnetModal({ isOpen, onClose }: LeadMagnetModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      setErrorMessage("Please enter your WhatsApp phone number.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/lead-capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          source: "Top 25 Wallpaper Magnet / Drop List",
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
      } else {
        setErrorMessage(data.error || "Failed to join drop list.");
      }
    } catch (err) {
      setErrorMessage("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
        className="bg-neutral-950 max-w-md w-full rounded-2xl overflow-hidden border border-white/20 shadow-2xl p-6 md:p-8 relative text-white space-y-5"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white text-xs font-mono cursor-pointer px-2 py-1 bg-neutral-900 border border-neutral-800 rounded"
        >
          [× Close]
        </button>

        {!success ? (
          <>
            <div className="text-center space-y-1">
              <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-white/20 flex items-center justify-center mx-auto text-white mb-2">
                <Download size={18} />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
                VIP Wallpaper Vault
              </span>
              <h3 className="font-display font-black text-xl md:text-2xl tracking-tight text-white uppercase mt-1">
                4K Streetwear Art Pack
              </h3>
              <p className="text-xs font-mono text-neutral-400">
                Enter your WhatsApp number to instantly download the exclusive 25-wallpaper pack.
              </p>
            </div>

            {errorMessage && (
              <div className="p-2.5 bg-neutral-900 border border-red-500/40 rounded-lg text-red-300 text-xs font-mono">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-neutral-400">Name</label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full bg-neutral-900 border border-white/15 rounded-lg py-2 pl-9 pr-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-neutral-400">WhatsApp Number *</label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+237 6xx xxx xxx"
                    className="w-full bg-neutral-900 border border-white/15 rounded-lg py-2 pl-9 pr-3 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-white text-black hover:bg-neutral-200 font-display font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
              >
                {isSubmitting ? "Unlocking..." : "Download Wallpaper Pack"}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center space-y-4 py-4">
            <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center mx-auto">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="font-display font-black text-xl text-white uppercase">
              Access Unlocked!
            </h3>
            <p className="text-xs font-mono text-neutral-300">
              Your direct wallpaper pack link is ready.
            </p>
            <a
              href="https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1600&auto=format&fit=crop"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block py-2.5 px-6 bg-white text-black font-display font-black text-xs uppercase rounded-xl hover:bg-neutral-200 transition-colors"
            >
              Open 4K Wallpapers
            </a>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
