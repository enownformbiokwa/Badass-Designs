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
  const [isChecking, setIsChecking] = useState(true);
  const [isAlreadyLoggedIn, setIsAlreadyLoggedIn] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Check portal registration status on open
  useEffect(() => {
    if (!isOpen) return;

    let isCancelled = false;

    async function checkRegistration() {
      setIsChecking(true);
      try {
        const storedName = localStorage.getItem("badass_user_name") || "";
        const storedPhone = localStorage.getItem("badass_user_phone") || "";

        if (storedName) setName(storedName);
        if (storedPhone) setPhone(storedPhone);

        if (!storedName && !storedPhone) {
          if (!isCancelled) {
            setIsAlreadyLoggedIn(false);
            setIsChecking(false);
          }
          return;
        }

        // Query the server to check if this user is actively registered in the portal leads database
        const res = await fetch("/api/lead-check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: storedName, phone: storedPhone }),
        });

        const data = await res.json().catch(() => ({ registered: false }));

        if (isCancelled) return;

        if (data && data.registered) {
          // Found inside portal leads array -> Initiate percentage loading modal!
          if (data.referralCode) {
            localStorage.setItem("badass_user_referral_code", data.referralCode);
          }
          setIsAlreadyLoggedIn(true);
          setIsChecking(false);
          startLoader(data.name || storedName, data.phone || storedPhone);
        } else {
          // Not registered in portal leads array (or deleted from portal)
          try {
            localStorage.removeItem("badass_access_granted");
            localStorage.removeItem("badass_user_name");
            localStorage.removeItem("badass_user_phone");
          } catch {}

          setIsAlreadyLoggedIn(false);
          setIsChecking(false);
        }
      } catch (err) {
        console.error("Registration check error:", err);
        if (!isCancelled) {
          setIsAlreadyLoggedIn(false);
          setIsChecking(false);
        }
      }
    }

    checkRegistration();

    return () => {
      isCancelled = true;
    };
  }, [isOpen]);

  const startLoader = (confirmedName: string, confirmedPhone: string) => {
    setLoadingProgress(0);
    const startTime = Date.now();
    const duration = 2000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(100, Math.floor((elapsed / duration) * 100));
      setLoadingProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          onAccessGranted({ name: confirmedName || "VIP", phone: confirmedPhone || "" });
        }, 250);
      }
    }, 25);
  };

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
      const activeReferrer = localStorage.getItem("badass_referred_by") || "";
      const res = await fetch("/api/lead-capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          source: "Website Access Gate",
          referredBy: activeReferrer || undefined,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to register lead.");
      }

      const resData = await res.json().catch(() => ({}));

      try {
        localStorage.setItem("badass_access_granted", "true");
        localStorage.setItem("badass_user_name", name.trim());
        localStorage.setItem("badass_user_phone", phone.trim());
        if (resData.referralCode) {
          localStorage.setItem("badass_user_referral_code", resData.referralCode);
        }
      } catch (e) {
        console.error("Local storage error:", e);
      }

      // Now registered in portal leads -> initiate percentage loader!
      setIsAlreadyLoggedIn(true);
      startLoader(name.trim(), phone.trim());
    } catch (err: any) {
      console.error(err);
      setError("Could not register access. Please try again.");
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
                className="w-44 h-44 sm:w-56 sm:h-56 object-contain invert brightness-125 mx-auto drop-shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            {isChecking ? (
              /* Brief instant verify state */
              <div className="flex flex-col items-center space-y-3 py-6">
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <p className="font-mono text-[10px] text-neutral-400 tracking-[0.25em] uppercase">
                  VERIFYING BATCH ACCESS...
                </p>
              </div>
            ) : isAlreadyLoggedIn ? (
              /* ALREADY LOGGED IN (REGISTERED IN PORTAL): Brand title first, followed by stylish percentage loader directly under FOR THOSE WHO KNOW. */
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full flex flex-col items-center"
              >
                {/* Brand Titles: Badass Designs / BADASS DESIGNS / FOR THOSE WHO KNOW. */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-center space-y-2 mb-8"
                >
                  <p className="font-mono text-xs sm:text-sm text-neutral-300 tracking-[0.35em] uppercase font-light drop-shadow-md">
                    Badass Designs
                  </p>
                  <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl tracking-tight text-white uppercase drop-shadow-xl">
                    BADASS DESIGNS
                  </h1>
                  <p className="font-mono text-xs sm:text-sm text-neutral-300 tracking-[0.28em] uppercase drop-shadow-md pt-1">
                    FOR THOSE WHO KNOW.
                  </p>
                </motion.div>

                {/* Stylish Loader Directly Under "FOR THOSE WHO KNOW." */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="w-full max-w-sm flex flex-col items-center px-2"
                >
                  {/* Glassmorphic Luxury Loader Container */}
                  <div className="w-full bg-neutral-950/85 border border-white/20 rounded-2xl p-5 sm:p-6 backdrop-blur-2xl shadow-2xl shadow-black/90 relative overflow-hidden">
                    {/* Ambient Top Glow Line */}
                    <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />

                    {/* Top Status Header */}
                    <div className="flex items-center justify-between text-[11px] font-mono tracking-widest text-neutral-400 mb-3.5">
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${loadingProgress === 100 ? 'bg-emerald-400' : 'bg-white'} opacity-75`} />
                          <span className={`relative inline-flex rounded-full h-2 w-2 ${loadingProgress === 100 ? 'bg-emerald-400' : 'bg-white'}`} />
                        </span>
                        <span className="uppercase text-[10px] text-neutral-200 font-semibold tracking-[0.2em]">
                          {loadingProgress === 100
                            ? "ACCESS UNLOCKED"
                            : loadingProgress > 65
                            ? "VERIFYING VIP ACCESS"
                            : loadingProgress > 30
                            ? "DECRYPTING ARCHIVE"
                            : "INITIALIZING VAULT"}
                        </span>
                      </div>
                      <span className="text-white font-mono font-bold text-sm tabular-nums tracking-wider drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]">
                        {loadingProgress}%
                      </span>
                    </div>

                    {/* Progress Track with Laser Tip Glow */}
                    <div className="relative w-full h-2.5 bg-neutral-900/90 rounded-full p-0.5 border border-white/20 shadow-inner overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-neutral-500 via-neutral-200 to-white rounded-full transition-all duration-75 ease-out shadow-[0_0_18px_rgba(255,255,255,0.95)] relative"
                        style={{ width: `${loadingProgress}%` }}
                      >
                        {/* Leading Edge Sparkle */}
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_12px_#fff] blur-[0.5px]" />
                      </div>
                    </div>

                    {/* Footer Micro-details */}
                    <div className="flex items-center justify-between pt-3.5 mt-2 text-[10px] font-mono text-neutral-400 border-t border-white/5">
                      <span className="tracking-wider">BATCH // OCT.2026</span>
                      <span className="text-neutral-300 font-medium">
                        {name ? `WELCOME, ${name.toUpperCase()}` : "EXCLUSIVE ARCHIVE"}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              /* NOT REGISTERED IN PORTAL: Display Name and Phone entry fields */
              <div className="w-full flex flex-col items-center">
                {/* Brand Titles */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center space-y-1 mb-6"
                >
                  <h1 className="font-display font-black text-3xl sm:text-4xl tracking-tight text-white uppercase drop-shadow-lg">
                    BADASS DESIGNS
                  </h1>
                  <p className="font-mono text-xs sm:text-sm text-neutral-300 tracking-[0.25em] uppercase pt-1 drop-shadow-md">
                    FOR THOSE WHO KNOW.
                  </p>
                </motion.div>

                {/* Name & Phone Number Form */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                  className="w-full bg-neutral-950/90 border border-white/20 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-black/80"
                >
                  <div className="mb-5 space-y-1 text-center">
                    {typeof window !== "undefined" && localStorage.getItem("badass_referred_by") && (
                      <div className="mb-2 py-1 px-3 bg-white/10 border border-white/20 rounded-full text-white text-[10px] font-mono inline-flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        <span>VIP Invite Active: Referred by #{localStorage.getItem("badass_referred_by")}</span>
                      </div>
                    )}
                    <h3 className="font-display font-bold text-sm uppercase tracking-wider text-white">
                      Enter October Drop Access
                    </h3>
                    <p className="font-mono text-[11px] text-neutral-400">
                      Provide your name and WhatsApp number to unlock the batch.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <div className="p-2.5 bg-red-950/50 border border-red-500/40 rounded-xl text-red-200 text-xs font-mono text-center">
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
                        className="w-full bg-neutral-900 border border-white/15 focus:border-white rounded-xl py-3.5 pl-11 pr-4 text-xs text-white placeholder-neutral-500 focus:outline-none transition-all font-sans text-center"
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
                          className="w-full bg-neutral-900 border border-white/15 focus:border-white rounded-xl py-3.5 pl-11 pr-4 text-xs text-white placeholder-neutral-500 focus:outline-none transition-all font-mono text-center"
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
                      className="w-full py-3.5 px-5 bg-white text-black hover:bg-neutral-200 font-display font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 disabled:opacity-50 mt-3"
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
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

