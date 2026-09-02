import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { User, Phone, ArrowRight } from "lucide-react";

interface AccessGateModalProps {
  isOpen: boolean;
  onAccessGranted: (userData: { name: string; phone: string }) => void;
}

export function AccessGateModal({ isOpen, onAccessGranted }: AccessGateModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Trigger form reveal after initial text dissolve sequence (3 seconds)
  useEffect(() => {
    if (isOpen) {
      setShowForm(false);
      const timer = setTimeout(() => {
        setShowForm(true);
      }, 3000); // 3.0s after video & title display
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/\D/g, "").slice(0, 9);
    setPhone(cleaned);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!phone || phone.length < 8 || phone.length > 9) {
      setError("Please enter a valid phone number (up to 9 digits).");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await fetch("/api/lead-capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          source: "Website Access Gate",
        }),
      }).catch((err) => console.error("Lead capture failed:", err));

      try {
        localStorage.setItem("badass_access_granted", "true");
        localStorage.setItem("badass_user_name", name.trim());
        localStorage.setItem("badass_user_phone", phone.trim());
      } catch (e) {
        console.error("Local storage error:", e);
      }

      onAccessGranted({ name: name.trim(), phone: phone.trim() });
    } catch (err: any) {
      console.error(err);
      onAccessGranted({ name: name.trim(), phone: phone.trim() });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black overflow-hidden"
        >
          {/* Background Loop Video (lp.mp4) */}
          <video
            src="/lp.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-90 scale-100 filter brightness-110 contrast-105"
          />

          {/* Cinematic Dark Gradient Overlay (lighter for maximum video visibility) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

          {/* Cinematic Intro & Form Content Container */}
          <div className="relative z-10 w-full max-w-md flex flex-col items-center text-center p-6 sm:p-10">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="mb-6"
            >
              <img
                src="/logo.webp"
                alt="Badass Designs"
                className="w-48 h-48 sm:w-60 sm:h-60 object-contain invert brightness-125 mx-auto drop-shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            {/* Step 1: "BADASS DESIGNS" (Dissolve In) */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.4 }}
              className="font-display font-black text-3xl sm:text-4xl tracking-tight text-white uppercase drop-shadow-lg"
            >
              BADASS DESIGNS
            </motion.h1>

            {/* Step 2: "FOR THOSE WHO KNOW" */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 1.6 }}
              className="font-mono text-xs sm:text-sm text-neutral-300 tracking-[0.25em] uppercase mt-2 mb-8 drop-shadow-md"
            >
              FOR THOSE WHO KNOW.
            </motion.p>

            {/* Step 3: Name & Phone Number Form (Appears afterwards) */}
            <AnimatePresence>
              {showForm && (
                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="w-full bg-neutral-950/90 border border-white/20 rounded-[32px] p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-black/80"
                >
                  <div className="mb-5 space-y-1 text-center">
                    <h3 className="font-display font-bold text-sm uppercase tracking-wider text-white">
                      Enter October Drop Access
                    </h3>
                    <p className="font-mono text-[11px] text-neutral-400">
                      Provide your name and WhatsApp number to unlock the batch.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <div className="p-2.5 bg-red-950/50 border border-red-500/40 rounded-2xl text-red-200 text-xs font-mono text-center">
                        {error}
                      </div>
                    )}

                    {/* Full Name */}
                    <div className="relative flex items-center">
                      <User size={15} className="absolute left-4 text-neutral-500" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Full Name"
                        className="w-full bg-neutral-900 border border-white/15 focus:border-white rounded-2xl py-3.5 pl-11 pr-4 text-xs text-white placeholder-neutral-500 focus:outline-none transition-all font-sans text-center"
                      />
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-1">
                      <div className="relative flex items-center">
                        <Phone size={15} className="absolute left-4 text-neutral-500" />
                        <input
                          type="tel"
                          required
                          maxLength={9}
                          value={phone}
                          onChange={handlePhoneChange}
                          placeholder="WhatsApp Number (e.g. 679798568)"
                          className="w-full bg-neutral-900 border border-white/15 focus:border-white rounded-2xl py-3.5 pl-11 pr-4 text-xs text-white placeholder-neutral-500 focus:outline-none transition-all font-mono text-center"
                        />
                      </div>
                      {phone.length > 0 && (
                        <span className="text-[10px] font-mono text-neutral-500 block text-center">
                          {phone.length}/9 digits
                        </span>
                      )}
                    </div>

                    {/* Enter Button */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3.5 px-5 bg-white text-black hover:bg-neutral-200 font-display font-black text-xs uppercase tracking-wider rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 disabled:opacity-50 mt-3"
                    >
                      {submitting ? (
                        <span>Entering Home...</span>
                      ) : (
                        <>
                          <span>Enter Home</span>
                          <ArrowRight size={14} />
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

