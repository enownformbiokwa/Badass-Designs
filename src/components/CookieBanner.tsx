import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Cookie, Shield } from "lucide-react";

interface CookieBannerProps {
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
}

export function CookieBanner({ onOpenPrivacy, onOpenTerms }: CookieBannerProps) {
  const [consentState, setConsentState] = useState<"pending" | "accepted" | "declined">("pending");

  useEffect(() => {
    const saved = localStorage.getItem("badass_cookie_consent");
    if (saved === "accepted" || saved === "declined") {
      setConsentState(saved);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("badass_cookie_consent", "accepted");
    setConsentState("accepted");
  };

  const handleDecline = () => {
    localStorage.setItem("badass_cookie_consent", "declined");
    setConsentState("declined");
  };

  if (consentState !== "pending") return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-5 bg-neutral-950/95 backdrop-blur-md border-t border-white/15 shadow-2xl"
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-neutral-900 rounded-xl border border-white/10 text-white shrink-0 mt-0.5">
              <Cookie size={18} />
            </div>
            <div className="space-y-1">
              <span className="font-display font-bold text-white uppercase text-sm">
                Cookie & Privacy Agreement
              </span>
              <p className="text-neutral-400 leading-relaxed max-w-2xl">
                We use local storage and basic cookies to ensure smooth preorder cart functionality, persistent user preferences, and secure drop authentication. By clicking "Accept", you agree to our{" "}
                <button
                  onClick={onOpenPrivacy}
                  className="text-white underline hover:text-neutral-200 cursor-pointer"
                >
                  Privacy Policy
                </button>{" "}
                and{" "}
                <button
                  onClick={onOpenTerms}
                  className="text-white underline hover:text-neutral-200 cursor-pointer"
                >
                  Terms
                </button>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto justify-end">
            <button
              onClick={handleDecline}
              className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-white/10 uppercase tracking-wider transition-colors cursor-pointer"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="px-5 py-2.5 rounded-xl bg-white text-black font-display font-bold hover:bg-neutral-200 uppercase tracking-wider transition-colors cursor-pointer shadow-lg"
            >
              Accept Cookies
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
