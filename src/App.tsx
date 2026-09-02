import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShoppingBag,
  Check,
  MapPin,
  Mail,
  User,
  Phone,
  Layers,
  CheckCircle2,
  Lock,
  ShieldCheck,
  Flame,
  ArrowRight,
  ChevronRight,
  Clock,
  Share2,
  Award,
  ChevronDown,
  ChevronUp,
  Sparkles
} from "lucide-react";

import { 
  Piece, 
  BagItem, 
  OrderConfirmation 
} from "./types";

import { PIECES_DATA, BRAND_MANIFESTO } from "./data/pieces";

import { Navigation, NavTab } from "./components/Navigation";
import { PreorderBagDrawer } from "./components/PreorderBagDrawer";
import { PieceDetailModal } from "./components/PieceDetailModal";
import { AccessGateModal } from "./components/AccessGateModal";
import { SignatureModal } from "./components/SignatureModal";
import { DropCountdown } from "./components/DropCountdown";
import { ColorwayGalleryCarousel } from "./components/ColorwayGalleryCarousel";
import { DropSystemExplainer } from "./components/DropSystemExplainer";
import { ContactSection } from "./components/ContactSection";
import { FounderOfferStack } from "./components/FounderOfferStack";
import { ProductionTracker } from "./components/ProductionTracker";
import { OwnerPortalModal } from "./components/OwnerPortalModal";
import { DeliveryDepositPhases } from "./components/DeliveryDepositPhases";
import { AboutView } from "./components/AboutView";
import { PrivacyPolicyModal } from "./components/PrivacyPolicyModal";
import { TermsModal } from "./components/TermsModal";
import { CookieBanner } from "./components/CookieBanner";

const POPULAR_LOCATIONS = [
  "UB Junction (Direct Pickup), Buea, Cameroon",
  "Campaign Street 7 (Direct Pickup), Buea, Cameroon",
  "Molyko, Buea, Cameroon",
  "Clerks Quarters, Buea, Cameroon",
  "Bokwango, Buea, Cameroon",
  "Down Beach, Limbe, Cameroon",
  "Akwa, Douala, Cameroon",
  "Bonanjo, Douala, Cameroon",
  "Bonapriso, Douala, Cameroon",
  "Makepe, Douala, Cameroon",
  "Bastos, Yaoundé, Cameroon",
  "Omnisports, Yaoundé, Cameroon",
  "Tsinga, Yaoundé, Cameroon",
  "Commercial Avenue, Bamenda, Cameroon",
  "Bafoussam Centre, Cameroon",
  "Kribi Town, Cameroon",
];

export function App() {
  // Navigation: 2 streamlined tabs (Home and Preorder)
  const [currentTab, setCurrentTab] = useState<NavTab>("home");
  const [selectedPieceForDetail, setSelectedPieceForDetail] = useState<Piece | null>(null);

  // Access Gate state
  const [isAccessGateOpen, setIsAccessGateOpen] = useState(true);
  const [visitorName, setVisitorName] = useState<string>("");
  const [visitorPhone, setVisitorPhone] = useState<string>("");

  // Bag (Cart) State
  const [bag, setBag] = useState<BagItem[]>(() => {
    try {
      const saved = localStorage.getItem("badass_preorder_bag");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isBagOpen, setIsBagOpen] = useState(false);

  // Modals state
  const [isSignatureOpen, setIsSignatureOpen] = useState(false);
  const [isOwnerPortalOpen, setIsOwnerPortalOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  // Preorder form state
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerLocation, setCustomerLocation] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("Vegeta Stencil Tee / Black/White");
  const [selectedSize, setSelectedSize] = useState("L");
  const [selectedColor, setSelectedColor] = useState("Black/White");
  const [preorderQty, setPreorderQty] = useState(1);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [confirmedOrder, setConfirmedOrder] = useState<OrderConfirmation | null>(null);

  // Accordion dropdown states for secondary information
  const [activeDropdown, setActiveDropdown] = useState<"system" | "fabric" | "perks" | "tracker" | "manifesto" | null>(null);

  const toggleDropdown = (key: "system" | "fabric" | "perks" | "tracker" | "manifesto") => {
    setActiveDropdown((prev) => (prev === key ? null : key));
  };

  // Check access gate on mount (always show cinematic preloader on load)
  useEffect(() => {
    try {
      const storedName = localStorage.getItem("badass_user_name") || "";
      const storedPhone = localStorage.getItem("badass_user_phone") || "";

      if (storedName) {
        setVisitorName(storedName);
        setCustomerName(storedName);
      }
      if (storedPhone) {
        setVisitorPhone(storedPhone);
        setCustomerPhone(storedPhone);
      }

      setIsAccessGateOpen(true);
    } catch (e) {
      console.error(e);
      setIsAccessGateOpen(true);
    }
  }, []);

  const handleAccessGranted = (data: { name: string; phone: string }) => {
    setVisitorName(data.name);
    setVisitorPhone(data.phone);
    setCustomerName(data.name);
    setCustomerPhone(data.phone);
    setIsAccessGateOpen(false);
  };

  // Sync bag to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("badass_preorder_bag", JSON.stringify(bag));
    } catch (e) {
      console.error("Failed to save bag to localStorage:", e);
    }
  }, [bag]);

  // Bag operations
  const handleAddToBag = (piece: Piece, size: string, color: string, quantity: number) => {
    const existingIndex = bag.findIndex(
      (item) => item.pieceId === piece.id && item.size === size && item.color === color
    );

    const price = piece.status === "CURRENT" ? piece.dropPrice : piece.archivePrice;

    if (existingIndex > -1) {
      const updated = [...bag];
      updated[existingIndex].quantity += quantity;
      setBag(updated);
    } else {
      const newItem: BagItem = {
        pieceId: piece.id,
        pieceName: piece.name,
        image: piece.images.front,
        color: color,
        size: size,
        quantity: quantity,
        unitPrice: price,
        status: piece.status,
      };
      setBag([...bag, newItem]);
    }
  };

  const handleUpdateBagQty = (index: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveBagItem(index);
      return;
    }
    const updated = [...bag];
    updated[index].quantity = quantity;
    setBag(updated);
  };

  const handleRemoveBagItem = (index: number) => {
    const updated = bag.filter((_, i) => i !== index);
    setBag(updated);
  };

  // Direct 1-click preorder from detail view or carousel
  const handleDirectPreorder = (piece: Piece, size: string, color: string, quantity: number) => {
    setSelectedProduct(piece.name);
    setSelectedSize(size);
    setSelectedColor(color);
    setPreorderQty(quantity);
    setCurrentTab("preorder");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Preorder calculations
  const isBagMode = bag.length > 0;
  const bagTotalAmount = bag.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const bagDepositAmount = bag.reduce((sum, item) => sum + 3500 * item.quantity, 0); // 3,500 XAF deposit per piece
  const bagBalanceDue = Math.max(0, bagTotalAmount - bagDepositAmount);

  const singlePrice = 4500; // October Drop price
  const singleTotalAmount = singlePrice * preorderQty;
  const singleDepositAmount = 3500 * preorderQty; // 3,500 XAF deposit
  const singleBalanceDue = Math.max(0, singleTotalAmount - singleDepositAmount);

  const activeTotalAmount = isBagMode ? bagTotalAmount : singleTotalAmount;
  const activeDepositAmount = isBagMode ? bagDepositAmount : singleDepositAmount;
  const activeBalanceDue = isBagMode ? bagBalanceDue : singleBalanceDue;

  // Handle preorder submit
  const handleSubmitPreorder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !customerLocation.trim()) {
      setOrderError("Please fill in your Name, Phone number, and Delivery Location.");
      return;
    }

    if (!termsAccepted) {
      setOrderError("Please accept the terms to complete your preorder.");
      return;
    }

    setSubmitting(true);
    setOrderError("");

    try {
      const payload = {
        name: customerName.trim(),
        email: customerEmail.trim() || `${customerName.toLowerCase().replace(/\s+/g, '')}@badass.client`,
        phone: customerPhone.trim(),
        location: customerLocation.trim(),
        product: isBagMode ? `Bag (${bag.length} items: ${bag.map(b => `${b.pieceName} [${b.size}/${b.color}] x${b.quantity}`).join(', ')})` : `${selectedProduct} (${selectedColor})`,
        items: isBagMode ? bag : undefined,
        quantity: isBagMode ? bag.reduce((s, i) => s + i.quantity, 0) : preorderQty,
        size: isBagMode ? "Multi-Bag" : selectedSize,
        color: isBagMode ? "Multi-Bag" : selectedColor,
        totalAmount: activeTotalAmount,
        depositAmount: activeDepositAmount,
        balanceDue: activeBalanceDue,
      };

      const res = await fetch("/api/preorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Failed to process preorder. Please try again.");
      }

      setConfirmedOrder(result.order);
      setBag([]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      console.error("Order error:", err);
      setOrderError(err.message || "Something went wrong while connecting. Please retry.");
    } finally {
      setSubmitting(false);
    }
  };

  const heroPiece = PIECES_DATA[0]; // Vegeta Stencil Tee / Black/White

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black flex flex-col relative overflow-x-hidden">
      {/* Background Video Loop (Dimmed) */}
      <video
        src="/lp.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover opacity-15 pointer-events-none z-0 filter brightness-75"
      />

      {/* Background Subtle Ambience */}
      <div className="fixed inset-0 bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none z-0" />

      {/* Access Gate Modal */}
      <AccessGateModal
        isOpen={isAccessGateOpen}
        onAccessGranted={handleAccessGranted}
      />

      {/* Global Navigation Component */}
      <Navigation
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        bagCount={bag.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenBag={() => setIsBagOpen(true)}
        onOpenOwnerPortal={() => setIsOwnerPortalOpen(true)}
      />

      {/* Slide-in Preorder Bag Drawer */}
      <PreorderBagDrawer
        isOpen={isBagOpen}
        onClose={() => setIsBagOpen(false)}
        items={bag}
        onUpdateQuantity={handleUpdateBagQty}
        onRemoveItem={handleRemoveBagItem}
        onProceedToCheckout={() => {
          setCurrentTab("preorder");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      {/* Piece Detail Modal */}
      <PieceDetailModal
        piece={selectedPieceForDetail}
        isOpen={Boolean(selectedPieceForDetail)}
        onClose={() => setSelectedPieceForDetail(null)}
        onAddToPreorder={handleAddToBag}
        onDirectPreorder={handleDirectPreorder}
      />

      {/* Founder Signature Modal */}
      <SignatureModal
        isOpen={isSignatureOpen}
        onClose={() => setIsSignatureOpen(false)}
      />

      {/* Owner Portal Modal */}
      <OwnerPortalModal
        isOpen={isOwnerPortalOpen}
        onClose={() => setIsOwnerPortalOpen(false)}
      />

      {/* ========================================================================= */}
      {/* TOP NAVBAR: CENTERED PROMINENT LOGO (NO TEXT BESIDE IT)                   */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-30 bg-black/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3 flex items-center justify-between">
        {/* Left Side: Clean Drop Indicator */}
        <div className="w-24 sm:w-32 flex items-center">
          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest hidden sm:inline">
            OCTOBER DROP
          </span>
        </div>

        {/* Center: Brand Logo ONLY (Prominent & Larger) */}
        <div 
          onClick={() => {
            setCurrentTab("home");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="cursor-pointer group flex items-center justify-center"
          title="Badass Designs - Home"
        >
          <img
            src="/logo.webp"
            alt="Badass Designs"
            className="w-14 h-14 sm:w-16 sm:h-16 object-contain invert brightness-125 group-hover:scale-105 transition-transform"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Right Side: Quick Preorder & Bag Buttons */}
        <div className="w-24 sm:w-32 flex items-center justify-end gap-2 font-mono text-xs">
          <button
            onClick={() => {
              setCurrentTab("preorder");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="hidden sm:inline-flex bg-white hover:bg-neutral-200 text-black font-black px-3.5 py-2 rounded-xl uppercase tracking-wider text-xs items-center gap-1.5 transition-all cursor-pointer shadow-md"
          >
            <Flame size={13} />
            <span>Preorder</span>
          </button>

          <button
            onClick={() => setIsBagOpen(true)}
            className="relative w-10 h-10 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-white/15 flex items-center justify-center text-white transition-colors cursor-pointer"
            title="Open Preorder Bag"
          >
            <ShoppingBag size={17} />
            {bag.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-black font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                {bag.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 z-10 pb-24 lg:pb-12 lg:pl-28 max-w-6xl mx-auto w-full px-4 sm:px-6 md:px-8 py-6">
        
        {/* ========================================================================= */}
        {/* TAB 1: HOME (Calm, Minimal, October Drop Showcase + Collapsible Specs)    */}
        {/* ========================================================================= */}
        {currentTab === "home" && (
          <div className="space-y-14 sm:space-y-20">
            
            {/* Hero Section: October Drop Headline */}
            <motion.section 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-center space-y-5 max-w-3xl mx-auto pt-4 sm:pt-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-neutral-300 text-xs font-mono uppercase tracking-widest shadow-sm">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span>OCTOBER DROP · 240 GSM HEAVYWEIGHT</span>
              </div>

              <h1 className="font-display font-black text-3xl sm:text-5xl md:text-6xl tracking-tight text-white uppercase leading-tight">
                For Those Who Know.
              </h1>

              <p className="text-xs sm:text-sm md:text-base text-neutral-300 font-mono leading-relaxed max-w-xl mx-auto">
                Exclusive limited-batch anime streetwear tees engineered in Buea, Cameroon. 100% compact combed cotton with high-density DTF graphics.
              </p>

              {/* Countdown on Home Page with slide up, down, up animation */}
              <motion.div 
                initial={{ y: 20 }}
                animate={{ y: [20, -10, 10, 0] }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="pt-2"
              >
                <DropCountdown targetDate="2026-10-31T23:59:59" />
              </motion.div>
            </motion.section>

            {/* Interactive Colorway & Pose Carousel Showcase */}
            <section>
              <ColorwayGalleryCarousel
                onPreorder={handleDirectPreorder}
                onAddToBag={handleAddToBag}
              />
            </section>

            {/* The October Drop Collection Grid (All 4 October Tees) */}
            <motion.section 
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-6"
            >
              <div className="flex items-end justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest block">
                    Collection
                  </span>
                  <h3 className="font-display font-black text-2xl md:text-3xl text-white uppercase tracking-tight">
                    October Drop Pieces
                  </h3>
                </div>
                <span className="text-xs font-mono text-neutral-400 bg-neutral-900 border border-white/10 px-3 py-1 rounded-full">
                  {PIECES_DATA.length} Heavyweight Tees
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {PIECES_DATA.map((piece, idx) => (
                  <motion.div
                    key={piece.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.08 }}
                    whileHover={{ y: -6, scale: 1.01 }}
                    onClick={() => setSelectedPieceForDetail(piece)}
                    className="bg-neutral-950 border border-white/10 hover:border-white/40 rounded-[24px] overflow-hidden flex flex-col group cursor-pointer transition-all shadow-xl"
                  >
                    {/* Tee Image */}
                    <div className="aspect-[4/5] bg-neutral-900 overflow-hidden relative">
                      <img
                        src={piece.images.front}
                        alt={piece.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3 bg-white text-black text-[9px] font-mono font-black uppercase px-2.5 py-0.5 rounded-full shadow">
                        October Drop
                      </div>
                      <div className="absolute bottom-3 right-3 bg-black/85 backdrop-blur-md border border-white/15 px-2.5 py-1 rounded-full text-xs font-mono font-bold text-white shadow">
                        {piece.dropPrice.toLocaleString()} XAF
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-4 sm:p-5 space-y-2 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block truncate">
                          {piece.animeSource}
                        </span>
                        <h4 className="font-display font-bold text-white text-sm sm:text-base uppercase truncate">
                          {piece.name}
                        </h4>
                      </div>

                      <div className="pt-2.5 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                        <span className="text-neutral-400 text-[11px]">
                          {piece.colors.length} colorways
                        </span>
                        <span className="text-white font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                          <span>View</span>
                          <ChevronRight size={13} />
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Delivery and Deposit Breakdown in Phases */}
            <DeliveryDepositPhases 
              onPreorderClick={() => {
                setCurrentTab("preorder");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />

            {/* ===================================================================== */}
            {/* DROPDOWN ACCORDIONS (Less on-screen info, clean dropdowns for specs) */}
            {/* ===================================================================== */}
            <motion.section 
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4 pt-6 border-t border-white/10"
            >
              <div className="text-center max-w-lg mx-auto space-y-1.5 mb-6">
                <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
                  Specifications & Brand Standards
                </span>
                <h3 className="font-display font-black text-2xl text-white uppercase tracking-tight">
                  Details & Transparency
                </h3>
              </div>

               {/* Accordion 1: The Drop System (Slide Right) */}
              <motion.div 
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="border border-white/10 rounded-[24px] overflow-hidden bg-neutral-950 shadow-md"
              >
                <button
                  onClick={() => toggleDropdown("system")}
                  className="w-full p-5 sm:p-6 flex items-center justify-between text-left font-display font-bold text-sm sm:text-base uppercase text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Sparkles size={18} className="text-white" />
                    <span>The Release System (Drop → Archive → Retired)</span>
                  </div>
                  {activeDropdown === "system" ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {activeDropdown === "system" && (
                  <div className="p-5 sm:p-7 border-t border-white/10 pt-4">
                    <DropSystemExplainer />
                  </div>
                )}
              </motion.div>

              {/* Accordion 2: 240 GSM Fabric Philosophy (Slide Left) */}
              <motion.div 
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="border border-white/10 rounded-[24px] overflow-hidden bg-neutral-950 shadow-md"
              >
                <button
                  onClick={() => toggleDropdown("fabric")}
                  className="w-full p-5 sm:p-6 flex items-center justify-between text-left font-display font-bold text-sm sm:text-base uppercase text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Layers size={18} className="text-white" />
                    <span>240 GSM Heavyweight Fabric & Construction Specs</span>
                  </div>
                  {activeDropdown === "fabric" ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {activeDropdown === "fabric" && (
                  <div className="p-5 sm:p-7 border-t border-white/10 text-xs sm:text-sm font-mono text-neutral-300 space-y-4 leading-relaxed">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 bg-neutral-900 rounded-[18px] border border-white/10 space-y-1.5">
                        <span className="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider">Weight Standard</span>
                        <strong className="text-white text-base">240 GSM Combed Cotton</strong>
                        <p className="text-xs text-neutral-400 leading-relaxed">Structured silhouette that retains boxy drape without clinging.</p>
                      </div>
                      <div className="p-4 bg-neutral-900 rounded-[18px] border border-white/10 space-y-1.5">
                        <span className="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider">Print Method</span>
                        <strong className="text-white text-base">High-Density DTF</strong>
                        <p className="text-xs text-neutral-400 leading-relaxed">Multi-pass pigment matrix wash-tested for 40+ cycles without cracking.</p>
                      </div>
                      <div className="p-4 bg-neutral-900 rounded-[18px] border border-white/10 space-y-1.5">
                        <span className="text-neutral-400 block text-[10px] uppercase font-bold tracking-wider">Collar Construction</span>
                        <strong className="text-white text-base">1-Inch Reinforced Rib</strong>
                        <p className="text-xs text-neutral-400 leading-relaxed">Double-stitched ribbed crewneck that stays tight and flat.</p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Accordion 3: Founder Offer Stack & Guarantee (Slide Right) */}
              <motion.div 
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="border border-white/10 rounded-[24px] overflow-hidden bg-neutral-950 shadow-md"
              >
                <button
                  onClick={() => toggleDropdown("perks")}
                  className="w-full p-5 sm:p-6 flex items-center justify-between text-left font-display font-bold text-sm sm:text-base uppercase text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Award size={18} className="text-white" />
                    <span>Founder Privileges & 100% Fit Guarantee</span>
                  </div>
                  {activeDropdown === "perks" ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {activeDropdown === "perks" && (
                  <div className="p-5 sm:p-7 border-t border-white/10 pt-4">
                    <FounderOfferStack
                      onPreorderClick={() => {
                        setCurrentTab("preorder");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    />
                  </div>
                )}
              </motion.div>

              {/* Accordion 4: Production Tracker (Slide Left) */}
              <motion.div 
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="border border-white/10 rounded-[24px] overflow-hidden bg-neutral-950 shadow-md"
              >
                <button
                  onClick={() => toggleDropdown("tracker")}
                  className="w-full p-5 sm:p-6 flex items-center justify-between text-left font-display font-bold text-sm sm:text-base uppercase text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Clock size={18} className="text-white" />
                    <span>Production & Batch Allocation Status</span>
                  </div>
                  {activeDropdown === "tracker" ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {activeDropdown === "tracker" && (
                  <div className="p-5 sm:p-7 border-t border-white/10 pt-4">
                    <ProductionTracker currentReservedCount={31} />
                  </div>
                )}
              </motion.div>

              {/* Accordion 5: Brand Manifesto & Founder Signature (Slide Right) */}
              <motion.div 
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="border border-white/10 rounded-[24px] overflow-hidden bg-neutral-950 shadow-md"
              >
                <button
                  onClick={() => toggleDropdown("manifesto")}
                  className="w-full p-5 sm:p-6 flex items-center justify-between text-left font-display font-bold text-sm sm:text-base uppercase text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={18} className="text-white" />
                    <span>Brand Manifesto · Buea, Cameroon</span>
                  </div>
                  {activeDropdown === "manifesto" ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {activeDropdown === "manifesto" && (
                  <div className="p-5 sm:p-7 border-t border-white/10 text-xs sm:text-sm font-mono text-neutral-300 space-y-4 leading-relaxed">
                    <p>
                      Badass Designs was created in Buea to bring authentic, unapologetic anime culture into premium streetwear. We do not make generic merchandise. We create visual armor for those who live with discipline, pride, and purpose.
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <div>
                        <span className="font-display font-bold text-white text-sm uppercase block">Von Enownfor M.</span>
                        <span className="text-xs text-neutral-400">Founder & Lead Designer</span>
                      </div>
                      <button
                        onClick={() => setIsSignatureOpen(true)}
                        className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-white/15 text-white text-xs font-mono transition-colors cursor-pointer"
                      >
                        View Signature
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.section>

            {/* Direct Channels / Contact */}
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <ContactSection />
            </motion.section>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: PREORDER (Streamlined Form, Deposit Calculation, MoMo Payment)     */}
        {/* ========================================================================= */}
        {currentTab === "preorder" && (
          <div className="space-y-8 max-w-3xl mx-auto">
            
            {/* Header */}
            <div className="space-y-2 text-center">
              <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
                Direct Preorder Reservation
              </span>
              <h1 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
                Reserve October Drop
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 font-mono max-w-lg mx-auto">
                Secure your 240 GSM piece with a 3,500 XAF deposit. The remaining 1,000 XAF is paid upon handover in Buea or nationwide delivery across Cameroon.
              </p>
            </div>

            {/* Subtle 360° Poses & Colorway Selection with High Border Radius & Tee Specs */}
            {!confirmedOrder && (
              <ColorwayGalleryCarousel
                subtle
                selectedColorProp={selectedColor}
                onColorChangeProp={(color) => {
                  setSelectedColor(color);
                  const matched = PIECES_DATA.find(p => p.colors.includes(color) || p.name.includes(color));
                  if (matched) setSelectedProduct(matched.name);
                }}
                selectedSizeProp={selectedSize}
                onSizeChangeProp={setSelectedSize}
                selectedQtyProp={preorderQty}
                onQtyChangeProp={setPreorderQty}
                onPreorder={(piece, size, color, qty) => {
                  setSelectedProduct(piece.name);
                  setSelectedSize(size);
                  setSelectedColor(color);
                  setPreorderQty(qty);
                }}
                onAddToBag={handleAddToBag}
              />
            )}

            {/* If Order Confirmed Screen */}
            {confirmedOrder ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-neutral-950 border border-white/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl"
              >
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center font-bold">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <span className="text-xs font-mono text-neutral-400">Order ID: #{confirmedOrder.orderId}</span>
                    <h2 className="font-display font-black text-2xl text-white uppercase">
                      Preorder Reserved!
                    </h2>
                  </div>
                </div>

                <div className="p-4 bg-neutral-900 rounded-2xl space-y-2 text-xs font-mono border border-white/10">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Client:</span>
                    <span className="text-white font-bold">{confirmedOrder.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Phone:</span>
                    <span className="text-white">{confirmedOrder.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Delivery Point:</span>
                    <span className="text-white">{confirmedOrder.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Piece Reserved:</span>
                    <span className="text-white font-bold">{confirmedOrder.product}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Size / Color:</span>
                    <span className="text-white">{confirmedOrder.size} / {confirmedOrder.color}</span>
                  </div>
                  <div className="border-t border-white/10 pt-2 flex justify-between">
                    <span className="text-neutral-400">Required Deposit (3,500 XAF/piece):</span>
                    <span className="text-white font-black text-sm">{confirmedOrder.depositAmount.toLocaleString()} XAF</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Balance upon delivery:</span>
                    <span>{confirmedOrder.balanceDue.toLocaleString()} XAF</span>
                  </div>
                </div>

                {/* Mobile Money Deposit Instructions */}
                <div className="p-5 bg-neutral-900 border border-white/15 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2">
                    <Flame size={16} className="text-white" />
                    <h4 className="font-display font-bold text-white text-sm uppercase">
                      Confirm Deposit via Mobile Money
                    </h4>
                  </div>
                  <p className="text-xs font-mono text-neutral-300 leading-relaxed">
                    Send the <strong>{confirmedOrder.depositAmount.toLocaleString()} XAF</strong> deposit to the official Badass treasury line to lock your serial number:
                  </p>
                  <div className="p-3 bg-black rounded-xl border border-white/10 font-mono text-xs text-white flex items-center justify-between">
                    <div>
                      <span className="text-neutral-500 block text-[10px]">MTN MoMo / Orange Money:</span>
                      <strong className="text-sm">+237 679 798 568</strong>
                      <span className="text-neutral-400 block text-[10px]">Account Name: Von Enownfor M.</span>
                    </div>
                  </div>
                </div>

                {/* Delivery and Deposit Breakdown Phases */}
                <DeliveryDepositPhases compact />

                {/* WhatsApp Confirmation Link */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <a
                    href={`https://wa.me/237679798568?text=${encodeURIComponent(
                      `Hello Badass Designs! I just reserved my October Drop piece.\n\nOrder ID: #${confirmedOrder.orderId}\nName: ${confirmedOrder.customerName}\nPiece: ${confirmedOrder.product}\nDeposit: ${confirmedOrder.depositAmount} XAF\nDelivery: ${confirmedOrder.location}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3.5 px-4 bg-white hover:bg-neutral-200 text-black font-display font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
                  >
                    <span>Send WhatsApp Confirmation</span>
                    <ArrowRight size={14} />
                  </a>

                  <button
                    onClick={() => {
                      setConfirmedOrder(null);
                      setCurrentTab("home");
                    }}
                    className="py-3.5 px-5 bg-neutral-900 hover:bg-neutral-800 border border-white/15 text-neutral-300 hover:text-white font-mono text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Explore More Pieces
                  </button>
                </div>
              </motion.div>
            ) : (
              /* Preorder Form Container */
              <div className="bg-neutral-950 border border-white/15 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
                
                {/* Form Mode Selector: Single Item vs Multi-Bag */}
                {bag.length > 0 ? (
                  <div className="p-4 bg-neutral-900/80 border border-white/15 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShoppingBag size={16} className="text-white" />
                        <span className="font-display font-bold text-sm text-white uppercase">
                          Ordering From Preorder Bag ({bag.length} items)
                        </span>
                      </div>
                      <button
                        onClick={() => setIsBagOpen(true)}
                        className="text-xs font-mono text-neutral-400 hover:text-white underline cursor-pointer"
                      >
                        Edit Bag
                      </button>
                    </div>

                    <div className="text-xs font-mono text-neutral-400 divide-y divide-white/5 pt-1">
                      {bag.map((item, i) => (
                        <div key={i} className="py-1.5 flex justify-between">
                          <span>{item.pieceName} ({item.size} · {item.color}) x{item.quantity}</span>
                          <span className="text-white">{(item.unitPrice * item.quantity).toLocaleString()} XAF</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Clean Selection Summary Badge (Replaces redundant dropdowns) */
                  <div className="p-4 bg-neutral-900/70 border border-white/15 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                        Selected Piece (Configured Above)
                      </span>
                      <div className="font-display font-bold text-sm text-white uppercase flex items-center gap-2">
                        <span>{selectedProduct}</span>
                        <span className="px-2 py-0.5 rounded-full bg-white/10 text-neutral-300 text-[11px] font-mono lowercase">
                          {selectedColor}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="px-2.5 py-1 rounded-lg bg-black border border-white/15 text-neutral-300 text-xs">
                        Size: <strong className="text-white">{selectedSize}</strong>
                      </div>
                      <div className="px-2.5 py-1 rounded-lg bg-black border border-white/15 text-neutral-300 text-xs">
                        Qty: <strong className="text-white">{preorderQty}</strong>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmitPreorder} className="space-y-4">
                  {orderError && (
                    <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-red-200 text-xs font-mono">
                      {orderError}
                    </div>
                  )}

                  {/* Customer Information Form */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono text-neutral-300 uppercase tracking-wider">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                        <input
                          type="text"
                          required
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="Karl Enownfor"
                          className="w-full bg-neutral-900 border border-white/15 focus:border-white rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder-neutral-600 focus:outline-none transition-all font-sans"
                        />
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono text-neutral-300 uppercase tracking-wider">
                        WhatsApp Phone Number *
                      </label>
                      <div className="relative">
                        <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                        <input
                          type="tel"
                          required
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="679798568"
                          className="w-full bg-neutral-900 border border-white/15 focus:border-white rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder-neutral-600 focus:outline-none transition-all font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email & Location */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Optional Email */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider">
                        Email Address (Optional)
                      </label>
                      <div className="relative">
                        <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                        <input
                          type="email"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          placeholder="karl@badass.client"
                          className="w-full bg-neutral-900 border border-white/15 focus:border-white rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder-neutral-600 focus:outline-none transition-all font-sans"
                        />
                      </div>
                    </div>

                    {/* Delivery Location */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono text-neutral-300 uppercase tracking-wider">
                        Delivery City / Pickup Point *
                      </label>
                      <div className="relative">
                        <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                        <input
                          type="text"
                          required
                          value={customerLocation}
                          onChange={(e) => setCustomerLocation(e.target.value)}
                          placeholder="e.g. Molyko Buea or Akwa Douala"
                          list="locations-list"
                          className="w-full bg-neutral-900 border border-white/15 focus:border-white rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder-neutral-600 focus:outline-none transition-all font-sans"
                        />
                        <datalist id="locations-list">
                          {POPULAR_LOCATIONS.map((loc) => (
                            <option key={loc} value={loc} />
                          ))}
                        </datalist>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Breakdown Summary */}
                  <div className="p-4 bg-neutral-900 border border-white/10 rounded-2xl space-y-2 font-mono text-xs">
                    <div className="flex justify-between text-neutral-400">
                      <span>Total Piece Value:</span>
                      <span className="text-white">{activeTotalAmount.toLocaleString()} XAF</span>
                    </div>
                    <div className="flex justify-between text-white font-bold">
                      <span>Required Reservation Deposit (3,500 XAF/piece):</span>
                      <span className="text-base text-white">{activeDepositAmount.toLocaleString()} XAF</span>
                    </div>
                    <div className="flex justify-between text-neutral-400 text-[11px] pt-1 border-t border-white/5">
                      <span>Remaining balance due on handover:</span>
                      <span>{activeBalanceDue.toLocaleString()} XAF</span>
                    </div>
                  </div>

                  {/* Terms Checkbox */}
                  <label className="flex items-start gap-2.5 text-xs font-mono text-neutral-400 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-0.5 rounded bg-neutral-900 border-white/20 text-white focus:ring-0 cursor-pointer"
                    />
                    <span>
                      I understand the piece is reserved with a 3,500 XAF deposit, with 1,000 XAF balance due upon delivery.
                    </span>
                  </label>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 px-4 bg-white text-black hover:bg-neutral-200 font-display font-black text-xs uppercase tracking-wider rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-[0.99] disabled:opacity-50"
                  >
                    {submitting ? (
                      <span>Reserving Preorder...</span>
                    ) : (
                      <>
                        <span>Submit Preorder Reservation ({activeDepositAmount.toLocaleString()} XAF Deposit)</span>
                        <ArrowRight size={15} />
                      </>
                    )}
                  </button>
                  <p className="text-center font-mono text-[11px] text-neutral-500 tracking-tight pt-1">
                    * Exclusive items only obtainable via preorder drop window.
                  </p>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: ABOUT (Subtle, Refined Brand Narrative & Standards)                */}
        {/* ========================================================================= */}
        {currentTab === "about" && (
          <AboutView 
            onPreorderClick={() => {
              setCurrentTab("preorder");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}
      </main>

      {/* Discrete Footer with Subtle Owner Portal Link */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 0.8 }}
        className="border-t border-white/10 bg-neutral-950 py-8 px-4 sm:px-8 font-mono text-xs text-neutral-500 space-y-6"
      >
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-3 text-neutral-400">
            <img src="/logo.webp" alt="Badass" className="w-9 h-9 object-contain invert brightness-125" />
            <div>
              <div className="font-display font-black uppercase tracking-wider text-white text-sm">
                Badass Designs
              </div>
              <div className="text-[11px] text-neutral-500">
                Buea, Cameroon · "FOR THOSE WHO KNOW."
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono">
            <button
              onClick={() => {
                setCurrentTab("home");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`hover:text-white transition-colors cursor-pointer ${
                currentTab === "home" ? "text-white font-bold" : "text-neutral-400"
              }`}
            >
              Home
            </button>
            <button
              onClick={() => {
                setCurrentTab("preorder");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`hover:text-white transition-colors cursor-pointer ${
                currentTab === "preorder" ? "text-white font-bold" : "text-neutral-400"
              }`}
            >
              Preorder
            </button>
            <button
              onClick={() => {
                setCurrentTab("about");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`hover:text-white transition-colors cursor-pointer ${
                currentTab === "about" ? "text-white font-bold" : "text-neutral-400"
              }`}
            >
              About
            </button>
            
            <span className="text-neutral-700">·</span>

            <button
              onClick={() => setIsPrivacyOpen(true)}
              className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              Privacy
            </button>
            <button
              onClick={() => setIsTermsOpen(true)}
              className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              Terms
            </button>
            
            <span className="text-neutral-700">·</span>

            {/* Discrete Portal Link */}
            <button
              onClick={() => setIsOwnerPortalOpen(true)}
              className="text-[11px] text-neutral-600 hover:text-neutral-400 font-mono tracking-wider transition-colors cursor-pointer"
              title="Portal"
            >
              portal
            </button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto text-center text-[10px] text-neutral-600 border-t border-white/5 pt-4">
          © {new Date().getFullYear()} Badass Designs. 240 GSM Combed Heavyweight Streetwear.
        </div>
      </motion.footer>

      {/* Legal & Cookie Modals/Banners */}
      <PrivacyPolicyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
      <CookieBanner onOpenPrivacy={() => setIsPrivacyOpen(true)} onOpenTerms={() => setIsTermsOpen(true)} />
    </div>
  );
}

export default App;
