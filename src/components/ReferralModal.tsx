import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Copy, 
  Check, 
  MessageCircle, 
  ExternalLink,
  Users,
  Trophy,
  RefreshCw,
  Crown
} from "lucide-react";

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerReferralCode?: string;
  customerPhone?: string;
  customerName?: string;
}

interface LeaderboardEntry {
  rank: number;
  code: string;
  name: string;
  ordersCount: number;
  leadsCount: number;
  isWinner: boolean;
}

interface ReferralStats {
  identifier: string;
  totalLeadsCount: number;
  totalOrdersCount: number;
  rank: number | null;
  isTop3: boolean;
  tierReward: string;
  nextMilestone: string;
  top3Leaderboard?: LeaderboardEntry[];
  recentLeads?: Array<{ name: string; timestamp: string; source: string }>;
  recentOrders?: Array<{ orderId: string; product: string; timestamp: string; depositAmount: number }>;
}

export function ReferralModal({ 
  isOpen, 
  onClose, 
  customerReferralCode, 
  customerPhone, 
  customerName 
}: ReferralModalProps) {
  const [copiedDirectText, setCopiedDirectText] = useState(false);
  const [copiedWaLink, setCopiedWaLink] = useState(false);

  // Active user details (editable in modal if not yet set)
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [activeTab, setActiveTab] = useState<"whatsapp" | "leaderboard" | "community">("whatsapp");

  // Live referral stats
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // WhatsApp Community link
  const whatsappCommunityUrl = "https://chat.whatsapp.com/D9cylrMF05SKAONofCRPij";

  // Sync details from props / localStorage
  useEffect(() => {
    if (!isOpen) return;

    try {
      const storedPhone = customerPhone || localStorage.getItem("badass_user_phone") || customerReferralCode || "";
      const storedName = customerName || localStorage.getItem("badass_user_name") || "";
      const storedCode = localStorage.getItem("badass_user_referral_code") || "";

      const resolvedPhone = (storedPhone || storedCode || "679798568").replace(/\D/g, "");
      setPhone(resolvedPhone || "679798568");
      setName(storedName || "Enownfor Mbi-Okwa");

      if (resolvedPhone) {
        fetchReferralStats(resolvedPhone);
      }
    } catch (e) {
      console.error(e);
      setPhone("679798568");
      setName("Enownfor Mbi-Okwa");
    }
  }, [isOpen, customerPhone, customerName, customerReferralCode]);

  const fetchReferralStats = async (identifier: string) => {
    if (!identifier) return;
    setLoadingStats(true);
    try {
      const res = await fetch(`/api/my-referrals?identifier=${encodeURIComponent(identifier)}`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Failed to load referral stats:", err);
    } finally {
      setLoadingStats(false);
    }
  };

  if (!isOpen) return null;

  // Compute clean display values
  const cleanName = (name || "Enownfor Mbi-Okwa").trim();
  const cleanPhone = (phone || "679798568").trim();
  const activeReferralCode = cleanPhone;

  // Exact requested WhatsApp message format:
  // "Hello Badass Designs, (Name)(Number) sent me and I'd like to join the journey"
  const directBrandText = `Hello Badass Designs, ${cleanName} (${cleanPhone}) sent me and I'd like to join the journey`;
  const directBrandWhatsappUrl = `https://wa.me/237679798568?text=${encodeURIComponent(directBrandText)}`;

  const handleCopyDirectText = () => {
    navigator.clipboard.writeText(directBrandText);
    setCopiedDirectText(true);
    setTimeout(() => setCopiedDirectText(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.95, y: 15 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 15 }}
        className="bg-neutral-950 max-w-xl w-full rounded-[28px] overflow-hidden border border-white/20 shadow-2xl p-5 sm:p-7 relative text-white space-y-5 my-auto max-h-[92vh] flex flex-col"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white text-xs font-mono cursor-pointer px-2.5 py-1 bg-neutral-900 border border-neutral-800 rounded-lg transition-colors z-10"
        >
          [× Close]
        </button>

        {/* Header */}
        <div className="text-center space-y-1.5 pt-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/15 text-[10px] font-mono uppercase tracking-widest text-neutral-200">
            <Trophy size={12} className="text-white" />
            <span>Drop 002 Free Piece Race</span>
          </div>

          <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
            VIP WhatsApp Referral Pass
          </h2>
          
          <p className="text-xs font-mono text-neutral-400 max-w-md mx-auto">
            Refer friends via WhatsApp. The <strong className="text-white font-bold">Top 3 referrers</strong> on the leaderboard win a <strong className="text-white">100% Free Piece from Drop 002</strong>!
          </p>
        </div>

        {/* Identity & Personalization Bar */}
        <div className="bg-neutral-900/80 border border-white/10 rounded-2xl p-3.5 space-y-2.5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 text-xs">
              <div className="w-8 h-8 rounded-full bg-white text-black font-black flex items-center justify-center text-[11px] shadow">
                VIP
              </div>
              <div>
                <div className="font-bold text-white flex items-center gap-1.5">
                  <span>{cleanName}</span>
                  <span className="text-[10px] font-mono text-neutral-400">({cleanPhone})</span>
                </div>
                <div className="text-[10px] font-mono text-neutral-400">
                  Referral ID: <strong className="text-white">{activeReferralCode}</strong>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <div className="px-2.5 py-1 bg-white/5 border border-white/10 text-neutral-300 rounded-lg text-[10px] font-mono font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                <span>Active Pass</span>
              </div>
            </div>
          </div>

          {/* Quick inline name / phone editor if user wants to change how their name appears */}
          <div className="pt-2 border-t border-white/5 grid grid-cols-2 gap-2 text-[11px] font-mono">
            <div>
              <label className="text-neutral-500 block text-[9px] uppercase">Your Name in Message</label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  localStorage.setItem("badass_user_name", e.target.value);
                }}
                placeholder="e.g. Enow"
                className="w-full bg-black/60 border border-white/10 rounded-lg px-2.5 py-1 text-white text-xs focus:border-white/40 outline-none"
              />
            </div>
            <div>
              <label className="text-neutral-500 block text-[9px] uppercase">Your WhatsApp Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  localStorage.setItem("badass_user_phone", e.target.value);
                }}
                placeholder="e.g. 679798568"
                className="w-full bg-black/60 border border-white/10 rounded-lg px-2.5 py-1 text-white text-xs focus:border-white/40 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Navigation Tabs (Clean unified monochrome active states) */}
        <div className="grid grid-cols-3 gap-1.5 bg-neutral-900 p-1 rounded-2xl border border-white/10 text-xs font-mono">
          <button
            onClick={() => setActiveTab("whatsapp")}
            className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "whatsapp" 
                ? "bg-white text-black font-bold shadow-md" 
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <MessageCircle size={14} />
            <span className="truncate">WhatsApp Pass</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("leaderboard");
              if (activeReferralCode) fetchReferralStats(activeReferralCode);
            }}
            className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "leaderboard" 
                ? "bg-white text-black font-bold shadow-md" 
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <Trophy size={14} />
            <span className="truncate">Top 3 Race</span>
          </button>

          <button
            onClick={() => setActiveTab("community")}
            className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "community" 
                ? "bg-white text-black font-bold shadow-md" 
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <Users size={14} />
            <span className="truncate">Community</span>
          </button>
        </div>

        {/* TAB 1: WHATSAPP REFERRAL ENGINE */}
        {activeTab === "whatsapp" && (
          <div className="space-y-4 overflow-y-auto pr-1">
            {/* Direct Brand WhatsApp Text */}
            <div className="bg-neutral-900/60 border border-white/10 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-300 font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  Direct WhatsApp Referral Link
                </span>
                <span className="text-[10px] font-mono text-neutral-500">Tap to Open WhatsApp</span>
              </div>

              <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                Click this card to open WhatsApp directly with your personalized referral message:
              </p>

              {/* The message itself IS the WhatsApp link */}
              <a
                href={directBrandWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group block p-4 bg-black/90 hover:bg-neutral-900 border border-white/15 hover:border-white/30 rounded-2xl transition-all shadow-lg relative cursor-pointer"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 text-neutral-300 font-mono text-xs font-bold">
                    <MessageCircle size={15} className="text-white shrink-0" />
                    <span>WhatsApp Pass Link</span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-300 bg-white/10 px-2 py-0.5 rounded-full border border-white/15 group-hover:bg-white group-hover:text-black transition-colors flex items-center gap-1 font-medium">
                    <span>Tap to Send</span>
                    <ExternalLink size={10} />
                  </span>
                </div>

                <div className="text-xs sm:text-sm font-mono text-white italic font-semibold leading-relaxed py-1.5 border-y border-white/10 my-1">
                  "{directBrandText}"
                </div>

                <div className="mt-2.5 flex items-center justify-between gap-2 text-xs font-mono">
                  <span className="text-[10px] text-neutral-500 truncate">
                    wa.me/237679798568
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleCopyDirectText();
                      }}
                      className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[11px] font-mono rounded-lg transition-colors flex items-center gap-1 cursor-pointer border border-white/5"
                    >
                      {copiedDirectText ? <Check size={12} className="text-white" /> : <Copy size={12} />}
                      <span>{copiedDirectText ? "Copied" : "Copy Message"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        navigator.clipboard.writeText(directBrandWhatsappUrl);
                        setCopiedWaLink(true);
                        setTimeout(() => setCopiedWaLink(false), 2000);
                      }}
                      className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[11px] font-mono rounded-lg transition-colors flex items-center gap-1 cursor-pointer border border-white/5"
                    >
                      {copiedWaLink ? <Check size={12} className="text-white" /> : <Copy size={12} />}
                      <span>{copiedWaLink ? "Link Copied!" : "Copy Link"}</span>
                    </button>
                  </div>
                </div>
              </a>

              {/* WhatsApp Action Button */}
              <a
                href={directBrandWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 bg-white hover:bg-neutral-200 text-black font-display font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <MessageCircle size={16} />
                <span>Open in WhatsApp</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        )}

        {/* TAB 2: TOP 3 LEADERBOARD & FREE PIECE RACE (DROP 002 PRIZE) */}
        {activeTab === "leaderboard" && (
          <div className="space-y-4 overflow-y-auto pr-1">
            {/* Grand Prize Banner */}
            <div className="p-4 bg-neutral-900/80 rounded-2xl border border-white/15 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-mono uppercase text-neutral-300 font-bold">
                  <Crown size={15} className="text-white" />
                  <span>Grand Prize: Free Piece from Drop 002</span>
                </div>
                {stats?.isTop3 && (
                  <span className="bg-white text-black font-black text-[10px] font-mono px-2 py-0.5 rounded-full uppercase">
                    In Winning Spot!
                  </span>
                )}
              </div>

              <div className="font-display font-black text-lg text-white">
                {stats?.isTop3 
                  ? `You are ranked #${stats.rank} on the Leaderboard!` 
                  : stats?.rank 
                    ? `Current Standing: Rank #${stats.rank}` 
                    : "Top 3 Referrers win a 100% Free Piece from Drop 002"}
              </div>

              <p className="text-[11px] font-mono text-neutral-400">
                {stats?.nextMilestone || "Share your referral link on WhatsApp to climb the rankings and win from Drop 002!"}
              </p>
            </div>

            {/* Current Top 3 Podium Cards */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase text-neutral-400 tracking-wider flex items-center justify-between">
                <span>Current Top 3 Qualifying Referrers</span>
                <span className="text-white font-bold">Drop 002 Prize</span>
              </span>

              <div className="grid grid-cols-3 gap-2 text-center font-mono">
                {/* 2nd Place */}
                <div className="bg-neutral-900/60 border border-white/10 rounded-2xl p-3 space-y-1 relative">
                  <div className="w-6 h-6 mx-auto rounded-full bg-neutral-800 border border-white/15 text-neutral-300 font-bold text-xs flex items-center justify-center">
                    2
                  </div>
                  <div className="text-[11px] font-bold text-white truncate pt-1">
                    {stats?.top3Leaderboard?.[1]?.name || "Open Spot"}
                  </div>
                  <div className="text-[10px] text-neutral-400">
                    {stats?.top3Leaderboard?.[1] ? `${stats.top3Leaderboard[1].ordersCount} orders` : "Claim #2"}
                  </div>
                  <span className="inline-block text-[9px] font-bold text-neutral-300 bg-neutral-800 px-1.5 py-0.5 rounded border border-white/5">
                    Free Drop 002
                  </span>
                </div>

                {/* 1st Place (Top Spot) */}
                <div className="bg-neutral-900 border border-white/40 rounded-2xl p-3 space-y-1 relative shadow-lg">
                  <div className="w-7 h-7 mx-auto rounded-full bg-white text-black font-black text-xs flex items-center justify-center shadow">
                    <Crown size={14} />
                  </div>
                  <div className="text-xs font-bold text-white truncate pt-1">
                    {stats?.top3Leaderboard?.[0]?.name || "Open Spot"}
                  </div>
                  <div className="text-[10px] text-neutral-300">
                    {stats?.top3Leaderboard?.[0] ? `${stats.top3Leaderboard[0].ordersCount} orders` : "Claim #1"}
                  </div>
                  <span className="inline-block text-[9px] font-black text-black bg-white px-2 py-0.5 rounded">
                    Free Drop 002 + VIP
                  </span>
                </div>

                {/* 3rd Place */}
                <div className="bg-neutral-900/60 border border-white/10 rounded-2xl p-3 space-y-1 relative">
                  <div className="w-6 h-6 mx-auto rounded-full bg-neutral-800 border border-white/15 text-neutral-400 font-bold text-xs flex items-center justify-center">
                    3
                  </div>
                  <div className="text-[11px] font-bold text-white truncate pt-1">
                    {stats?.top3Leaderboard?.[2]?.name || "Open Spot"}
                  </div>
                  <div className="text-[10px] text-neutral-400">
                    {stats?.top3Leaderboard?.[2] ? `${stats.top3Leaderboard[2].ordersCount} orders` : "Claim #3"}
                  </div>
                  <span className="inline-block text-[9px] font-bold text-neutral-300 bg-neutral-800 px-1.5 py-0.5 rounded border border-white/5">
                    Free Drop 002
                  </span>
                </div>
              </div>
            </div>

            {/* My Personal Stats */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <div className="bg-neutral-900/60 border border-white/10 rounded-xl p-3 text-center">
                <span className="text-[10px] font-mono uppercase text-neutral-400 block">Signups Driven</span>
                <span className="text-xl font-bold font-display text-white">{stats ? stats.totalLeadsCount : 0}</span>
              </div>
              <div className="bg-neutral-900/60 border border-white/10 rounded-xl p-3 text-center">
                <span className="text-[10px] font-mono uppercase text-neutral-400 block">Preorders Driven</span>
                <span className="text-xl font-bold font-display text-white">{stats ? stats.totalOrdersCount : 0}</span>
              </div>
            </div>

            {/* Refresh Button */}
            <div className="text-center pt-1">
              <button
                onClick={() => activeReferralCode && fetchReferralStats(activeReferralCode)}
                disabled={loadingStats}
                className="text-[11px] font-mono text-neutral-400 hover:text-white inline-flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RefreshCw size={11} className={loadingStats ? "animate-spin" : ""} />
                <span>Refresh Live Leaderboard</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: WHATSAPP COMMUNITY */}
        {activeTab === "community" && (
          <div className="space-y-4 overflow-y-auto pr-1">
            {/* WhatsApp Community Direct Join Card */}
            <div className="p-4 bg-neutral-900/80 rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-display font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                  <Users size={15} />
                  <span>Badass VIP WhatsApp Community</span>
                </span>
                <span className="text-[9px] font-mono bg-white/10 text-neutral-300 px-2 py-0.5 rounded-full border border-white/10">
                  Private Group
                </span>
              </div>

              <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                Join our private VIP WhatsApp Community to receive direct drop release times, secret restocks, and exclusive drop announcements.
              </p>

              <a
                href={whatsappCommunityUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 bg-white hover:bg-neutral-200 text-black font-display font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <MessageCircle size={16} />
                <span>Join Official WhatsApp Community</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
