import React from "react";
import { MessageCircle, Instagram, Globe, Sparkles, ArrowUpRight } from "lucide-react";
import { BRAND_MANIFESTO } from "../data/pieces";
import { motion } from "motion/react";

export function ContactSection() {
  const CONTACT_LINKS = [
    {
      title: "WhatsApp",
      subtitle: "Official Concierge",
      handle: "+237 679 798 568",
      url: BRAND_MANIFESTO.whatsappUrl,
      icon: <MessageCircle size={22} />,
    },
    {
      title: "Instagram",
      subtitle: "Lookbook & Drops",
      handle: "@badass_designs.cm",
      url: BRAND_MANIFESTO.instagramUrl,
      icon: <Instagram size={22} />,
    },
    {
      title: "TikTok",
      subtitle: "Behind The Scenes",
      handle: "@badass_designs.cm",
      url: BRAND_MANIFESTO.tiktokUrl,
      icon: <Globe size={22} />,
    },
  ];

  return (
    <div className="space-y-6 text-center">
      <div className="max-w-xl mx-auto space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300 text-xs font-mono uppercase tracking-wider">
          <Sparkles size={12} />
          <span>Community & Direct Channels</span>
        </div>
        <h3 className="font-display font-black text-2xl md:text-3xl text-white uppercase tracking-tight">
          Connect With Badass
        </h3>
        <p className="text-xs text-neutral-400 font-mono">
          Reach our studio in Buea or connect with the community across official channels.
        </p>
      </div>

      {/* Circular Contact Cards with Drop down & bounce up animation */}
      <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-8 pt-2">
        {CONTACT_LINKS.map((item, idx) => (
          <motion.a
            key={item.title}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.4, delay: idx * 0.1 }}
            className="w-40 h-40 sm:w-44 sm:h-44 rounded-full bg-neutral-950 border border-white/15 hover:border-white/50 flex flex-col items-center justify-center p-4 text-center group hover:scale-105 transition-all shadow-xl relative overflow-hidden"
          >
            {/* Subtle inner hover glow */}
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-full pointer-events-none" />

            {/* Icon Circle */}
            <div className="w-11 h-11 rounded-full bg-neutral-900 border border-white/15 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-colors mb-2">
              {item.icon}
            </div>

            <span className="font-display font-black text-white text-sm uppercase tracking-wide">
              {item.title}
            </span>

            <span className="text-[10px] font-mono text-neutral-400 truncate max-w-[120px] mt-0.5">
              {item.handle}
            </span>

            <div className="inline-flex items-center gap-0.5 text-[10px] font-mono text-white/70 group-hover:text-white mt-1.5">
              <span>Open</span>
              <ArrowUpRight size={11} />
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
