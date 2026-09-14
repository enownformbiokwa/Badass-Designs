import React from "react";
import { MessageCircle, Instagram, Globe, Sparkles, ArrowUpRight, Users } from "lucide-react";
import { BRAND_MANIFESTO } from "../data/pieces";
import { motion } from "motion/react";

export function ContactSection() {
  const CONTACT_LINKS = [
    {
      title: "Community",
      subtitle: "VIP WhatsApp Group",
      handle: "Join Group",
      url: BRAND_MANIFESTO.whatsappCommunityUrl,
      icon: <Users size={22} />,
    },
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

      {/* Structured Editorial Contact Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 max-w-4xl mx-auto">
        {CONTACT_LINKS.map((item, idx) => (
          <motion.a
            key={item.title}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.06 }}
            className="p-5 rounded-2xl bg-neutral-950 border border-white/10 hover:border-white/30 flex flex-col items-start justify-between text-left group transition-all shadow-lg relative"
          >
            <div className="flex items-center justify-between w-full mb-4">
              <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-colors">
                {item.icon}
              </div>
              <ArrowUpRight size={16} className="text-neutral-500 group-hover:text-white transition-colors" />
            </div>

            <div>
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
                {item.subtitle}
              </span>
              <span className="font-display font-black text-white text-base uppercase tracking-tight block mt-0.5">
                {item.title}
              </span>
              <span className="text-xs font-mono text-neutral-300 mt-1 block truncate">
                {item.handle}
              </span>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
