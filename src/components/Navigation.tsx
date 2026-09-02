import React from "react";
import { 
  Home, 
  ShoppingBag, 
  Flame,
  Info
} from "lucide-react";

export type NavTab = "home" | "preorder" | "about";

interface NavigationProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  bagCount: number;
  onOpenBag: () => void;
  onOpenOwnerPortal: () => void;
}

export function Navigation({
  currentTab,
  onSelectTab,
  bagCount,
  onOpenBag,
  onOpenOwnerPortal,
}: NavigationProps) {
  return (
    <>
      {/* Desktop Sticky Vertical Sidebar */}
      <aside className="hidden lg:flex fixed left-6 top-1/2 -translate-y-1/2 z-40 flex-col items-center">
        <div className="bg-black/90 backdrop-blur-md border border-white/15 p-2.5 rounded-2xl shadow-2xl shadow-black flex flex-col gap-2.5 min-w-[76px] items-center">
          {/* Logo on sidebar (larger logo.webp) */}
          <button
            onClick={() => onSelectTab("home")}
            className="w-14 h-14 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-center text-white hover:border-white/40 transition-all cursor-pointer group p-2"
            title="Badass Designs"
          >
            <img 
              src="/logo.webp" 
              alt="Badass Designs" 
              className="w-9 h-9 object-contain invert brightness-125 group-hover:scale-110 transition-transform" 
              referrerPolicy="no-referrer"
            />
          </button>

          <div className="w-8 h-[1px] bg-white/10 my-0.5" />

          {/* HOME / MAIN FEED */}
          <button
            onClick={() => onSelectTab("home")}
            className={`w-13 h-13 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer group ${
              currentTab === "home"
                ? "bg-white text-black font-bold shadow-md shadow-white/10"
                : "text-neutral-400 hover:text-white hover:bg-white/5"
            }`}
            title="Home"
          >
            <Home size={18} />
            <span className="text-[8px] font-mono uppercase tracking-wider">Home</span>
          </button>

          {/* PREORDER DROP */}
          <button
            onClick={() => onSelectTab("preorder")}
            className={`w-13 h-13 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer relative group ${
              currentTab === "preorder"
                ? "bg-white text-black font-bold shadow-md shadow-white/10"
                : "text-neutral-400 hover:text-white hover:bg-white/5"
            }`}
            title="Preorder Drop"
          >
            <Flame size={18} />
            <span className="text-[8px] font-mono uppercase tracking-wider">Preorder</span>
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          </button>

          {/* ABOUT BRAND */}
          <button
            onClick={() => onSelectTab("about")}
            className={`w-13 h-13 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer group ${
              currentTab === "about"
                ? "bg-white text-black font-bold shadow-md shadow-white/10"
                : "text-neutral-400 hover:text-white hover:bg-white/5"
            }`}
            title="About Badass"
          >
            <Info size={18} />
            <span className="text-[8px] font-mono uppercase tracking-wider">About</span>
          </button>

          <div className="w-8 h-[1px] bg-white/10 my-0.5" />

          {/* PREORDER BAG */}
          <button
            onClick={onOpenBag}
            className="w-13 h-13 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-white/15 flex flex-col items-center justify-center gap-0.5 text-neutral-300 hover:text-white transition-all cursor-pointer relative"
            title="Preorder Bag"
          >
            <ShoppingBag size={18} />
            <span className="text-[8px] font-mono uppercase tracking-wider">Bag</span>
            {bagCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-black text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                {bagCount}
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Floating Dock */}
      <nav className="lg:hidden fixed bottom-3 left-4 right-4 z-40">
        <div className="bg-black/95 backdrop-blur-xl border border-white/20 px-4 py-2.5 rounded-2xl shadow-2xl shadow-black flex items-center justify-around">
          <button
            onClick={() => onSelectTab("home")}
            className={`flex flex-col items-center gap-1 p-1 rounded-lg cursor-pointer ${
              currentTab === "home" ? "text-white font-bold" : "text-neutral-400"
            }`}
          >
            <Home size={18} />
            <span className="text-[9px] font-mono uppercase">Home</span>
          </button>

          <button
            onClick={() => onSelectTab("preorder")}
            className={`flex flex-col items-center gap-1 p-1 rounded-lg cursor-pointer relative ${
              currentTab === "preorder" ? "text-white font-bold" : "text-neutral-400"
            }`}
          >
            <Flame size={18} />
            <span className="text-[9px] font-mono uppercase">Preorder</span>
            <span className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          </button>

          <button
            onClick={() => onSelectTab("about")}
            className={`flex flex-col items-center gap-1 p-1 rounded-lg cursor-pointer ${
              currentTab === "about" ? "text-white font-bold" : "text-neutral-400"
            }`}
          >
            <Info size={18} />
            <span className="text-[9px] font-mono uppercase">About</span>
          </button>

          <button
            onClick={onOpenBag}
            className="flex flex-col items-center gap-1 p-1 rounded-lg text-neutral-300 cursor-pointer relative"
          >
            <ShoppingBag size={18} />
            <span className="text-[9px] font-mono uppercase">Bag</span>
            {bagCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-black text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                {bagCount}
              </span>
            )}
          </button>
        </div>
      </nav>
    </>
  );
}
