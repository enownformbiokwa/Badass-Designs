import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  ShoppingBag, 
  Flame, 
  X, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Info,
  Layers,
  ArrowRight
} from "lucide-react";
import { COLOR_POSE_GALLERIES, PIECES_DATA } from "../data/pieces";
import { Piece } from "../types";

interface ColorwayGalleryCarouselProps {
  onPreorder: (piece: Piece, size: string, color: string, quantity: number) => void;
  onAddToBag: (piece: Piece, size: string, color: string, quantity: number) => void;
  selectedColorProp?: string;
  onColorChangeProp?: (color: string) => void;
  selectedSizeProp?: string;
  onSizeChangeProp?: (size: string) => void;
  selectedQtyProp?: number;
  onQtyChangeProp?: (qty: number) => void;
  subtle?: boolean;
}

export const COLORWAYS = [
  { name: "Black/White", hex: "#171717", border: "#f5f5f5", badge: "#ffffff", label: "Black / White" },
  { name: "Black/Blue", hex: "#0a192f", border: "#38bdf8", badge: "#38bdf8", label: "Black / Blue" },
  { name: "Black/Gold", hex: "#1c1917", border: "#eab308", badge: "#eab308", label: "Black / Gold" },
  { name: "Black/Pink", hex: "#200f1c", border: "#f43f5e", badge: "#f43f5e", label: "Black / Pink" },
];

const POSE_LABELS = [
  "Pose 1 · Front View",
  "Pose 2 · Side & Drape",
  "Pose 3 · Full Silhouette",
];

export function ColorwayGalleryCarousel({ 
  onPreorder, 
  onAddToBag,
  selectedColorProp,
  onColorChangeProp,
  selectedSizeProp,
  onSizeChangeProp,
  selectedQtyProp,
  onQtyChangeProp,
  subtle = false
}: ColorwayGalleryCarouselProps) {
  const [internalColor, setInternalColor] = useState<string>("Black/White");
  const selectedColor = selectedColorProp || internalColor;

  const [internalSize, setInternalSize] = useState<string>("L");
  const selectedSize = selectedSizeProp || internalSize;

  const [internalQty, setInternalQty] = useState<number>(1);
  const selectedQty = selectedQtyProp !== undefined ? selectedQtyProp : internalQty;

  const [activePoseIdx, setActivePoseIdx] = useState<number>(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Get photos for active colorway
  const currentPhotos = COLOR_POSE_GALLERIES[selectedColor] || COLOR_POSE_GALLERIES["Black/White"] || [];
  const currentPhoto = currentPhotos[activePoseIdx] || currentPhotos[0];

  // Map to piece
  const activePiece = PIECES_DATA.find((p) => p.name.includes(selectedColor)) || PIECES_DATA.find((p) => p.colors.includes(selectedColor)) || PIECES_DATA[0];

  // Auto scroll / auto advance images without button
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActivePoseIdx((prev) => (prev + 1) % currentPhotos.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [currentPhotos.length, isHovered]);

  const handleNext = () => {
    setActivePoseIdx((prev) => (prev + 1) % currentPhotos.length);
  };

  const handlePrev = () => {
    setActivePoseIdx((prev) => (prev - 1 + currentPhotos.length) % currentPhotos.length);
  };

  const handleColorChange = (color: string) => {
    if (onColorChangeProp) {
      onColorChangeProp(color);
    } else {
      setInternalColor(color);
    }
    setActivePoseIdx(0);
  };

  const handleSizeChange = (size: string) => {
    if (onSizeChangeProp) {
      onSizeChangeProp(size);
    } else {
      setInternalSize(size);
    }
  };

  const handleQtyChange = (qty: number) => {
    if (onQtyChangeProp) {
      onQtyChangeProp(qty);
    } else {
      setInternalQty(qty);
    }
  };

  const handleAdd = () => {
    onAddToBag(activePiece, selectedSize, selectedColor, selectedQty);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  if (subtle) {
    // Subtle variant for the Preorder page: streamlined layout, extra spacious, rounded-[36px]
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="bg-neutral-950 border border-white/15 rounded-[36px] p-6 sm:p-9 md:p-10 space-y-8 shadow-2xl backdrop-blur-sm"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
            <h3 className="text-xs sm:text-sm font-mono uppercase tracking-widest text-neutral-200 font-bold">
              360° Poses & Colorway Selection
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-neutral-400 bg-neutral-900 border border-white/10 px-3 py-1.5 rounded-full">
              Angle {activePoseIdx + 1} of {currentPhotos.length}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Main Visual Frame with extreme border-radius */}
          <div 
            onMouseEnter={() => setIsHovered(true)} 
            onMouseLeave={() => setIsHovered(false)}
            className="sm:col-span-6 relative aspect-[4/5] bg-neutral-900 rounded-[28px] overflow-hidden border border-white/15 group flex items-center justify-center shadow-lg"
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={`${selectedColor}-${activePoseIdx}`}
                src={currentPhoto}
                alt={`${selectedColor} - Pose ${activePoseIdx + 1}`}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.25 }}
                className="w-full h-full object-cover select-none"
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>

            {/* Prev / Next controls */}
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/75 backdrop-blur-md border border-white/25 text-white flex items-center justify-center hover:bg-black transition-all cursor-pointer shadow-md"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/75 backdrop-blur-md border border-white/25 text-white flex items-center justify-center hover:bg-black transition-all cursor-pointer shadow-md"
            >
              <ChevronRight size={18} />
            </button>

            {/* Zoom icon */}
            <button
              type="button"
              onClick={() => setIsZoomOpen(true)}
              className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-black/75 backdrop-blur-md border border-white/25 text-white flex items-center justify-center hover:bg-black transition-all cursor-pointer"
            >
              <Maximize2 size={14} />
            </button>

            <div className="absolute bottom-3.5 left-3.5 bg-black/85 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-full text-xs font-mono text-white">
              {selectedColor} · {POSE_LABELS[activePoseIdx]}
            </div>
          </div>

          {/* Color selector, Size & Angle Switcher with slide right & bounce back animation */}
          <motion.div 
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
            className="sm:col-span-6 space-y-6"
          >
            {/* Color Swatch Grid */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono text-neutral-300 uppercase font-bold tracking-wider">
                  1. Choose Colorway:
                </span>
                <span className="text-xs font-mono text-white font-bold bg-neutral-900 border border-white/15 px-2.5 py-1 rounded-lg">
                  {selectedColor}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {COLORWAYS.map((c) => {
                  const isSelected = selectedColor === c.name;
                  return (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => handleColorChange(c.name)}
                      className={`p-3.5 rounded-[18px] border transition-all cursor-pointer flex items-center gap-2.5 text-left ${
                        isSelected
                          ? "bg-white text-black border-white font-bold shadow-lg scale-[1.02]"
                          : "bg-neutral-900/90 text-neutral-300 border-white/10 hover:border-white/30"
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border shrink-0"
                        style={{ backgroundColor: c.hex, borderColor: c.border }}
                      />
                      <span className="text-xs font-mono truncate">{c.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono text-neutral-300 uppercase font-bold tracking-wider">
                  2. Choose Size:
                </span>
                <span className="text-xs font-mono text-white font-bold">
                  {selectedSize}
                </span>
              </div>
              <div className="flex gap-2">
                {["S", "M", "L", "XL", "XXL"].map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => handleSizeChange(sz)}
                    className={`flex-1 py-2.5 rounded-xl font-mono text-xs transition-all cursor-pointer text-center ${
                      selectedSize === sz
                        ? "bg-white text-black font-bold border border-white shadow-sm"
                        : "bg-neutral-900 text-neutral-300 border border-white/10 hover:border-white/30"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono text-neutral-300 uppercase font-bold tracking-wider">
                  3. Quantity:
                </span>
                <span className="text-xs font-mono text-white font-bold">
                  {selectedQty} {selectedQty === 1 ? "Piece" : "Pieces"}
                </span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => handleQtyChange(q)}
                    className={`flex-1 py-2 rounded-xl font-mono text-xs transition-all cursor-pointer text-center ${
                      selectedQty === q
                        ? "bg-white text-black font-bold border border-white shadow-sm"
                        : "bg-neutral-900 text-neutral-400 border border-white/10 hover:border-white/30"
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* 3 Angles Thumbnails */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">
                Camera Angles ({activePoseIdx + 1} of 3)
              </span>
              <div className="grid grid-cols-3 gap-2.5">
                {currentPhotos.map((photo, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActivePoseIdx(idx)}
                    className={`relative aspect-[4/3] rounded-[16px] overflow-hidden border transition-all cursor-pointer ${
                      activePoseIdx === idx
                        ? "border-white ring-2 ring-white/50 opacity-100 shadow-md"
                        : "border-white/10 opacity-60 hover:opacity-90"
                    }`}
                  >
                    <img
                      src={photo}
                      alt={`Angle ${idx + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-1.5 right-1.5 bg-black/80 px-1.5 py-0.5 rounded text-[9px] font-mono text-white">
                      Angle {idx + 1}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Technical Tee Specifications - Just Headings in Circular Borders */}
        <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest">
              Tee Specifications & Craftsmanship
            </span>
            <span className="text-[10px] font-mono text-neutral-500 uppercase">
              Luxury Streetwear Standard
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <div className="px-4 py-2.5 rounded-full border border-white/20 bg-neutral-900/90 text-white text-xs font-mono font-bold flex items-center gap-2 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
              <span>240 GSM Combed Cotton</span>
            </div>
            <div className="px-4 py-2.5 rounded-full border border-white/20 bg-neutral-900/90 text-white text-xs font-mono font-bold flex items-center gap-2 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
              <span>HD DTF Wash-Proof</span>
            </div>
            <div className="px-4 py-2.5 rounded-full border border-white/20 bg-neutral-900/90 text-white text-xs font-mono font-bold flex items-center gap-2 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
              <span>1" Ribbed Crewneck</span>
            </div>
            <div className="px-4 py-2.5 rounded-full border border-white/20 bg-neutral-900/90 text-neutral-300 text-xs font-mono flex items-center gap-2 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 shrink-0" />
              <span>Machine Wash Cold · Hang Dry</span>
            </div>
          </div>
        </div>

        {/* Fullscreen Zoom Modal */}
        {isZoomOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setIsZoomOpen(false)}
          >
            <img
              src={currentPhoto}
              alt={selectedColor}
              className="max-w-full max-h-[90vh] object-contain rounded-[28px]"
              referrerPolicy="no-referrer"
            />
            <button
              type="button"
              onClick={() => setIsZoomOpen(false)}
              className="absolute top-5 right-5 w-11 h-11 rounded-full bg-neutral-900 border border-white/25 text-white flex items-center justify-center cursor-pointer shadow-xl"
            >
              <X size={20} />
            </button>
          </div>
        )}
      </motion.div>
    );
  }

  // Standard interactive presentation on the main Home page with generous spacing & rich typography
  return (
    <motion.div 
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="bg-neutral-950 border border-white/15 rounded-[36px] p-6 sm:p-10 md:p-12 space-y-10 sm:space-y-12 shadow-2xl relative overflow-hidden"
    >
      {/* Background Soft Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-3xl pointer-events-none -mr-32 -mt-32" />

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6 relative z-10">
        <div className="space-y-1.5">
          <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest block">
            Interactive Colorway & Fit Studio
          </span>
          <h3 className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-white uppercase tracking-tight">
            Color Selection & 360° Poses
          </h3>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-neutral-400">
          <span className="px-3.5 py-1.5 rounded-full bg-neutral-900 border border-white/15 text-neutral-300 shadow-sm">
            Angle {activePoseIdx + 1} of {currentPhotos.length}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start relative z-10">
        {/* Left / Center: Interactive Picture Carousel (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/5] bg-neutral-900 rounded-[30px] overflow-hidden border border-white/15 group flex items-center justify-center shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.img
                key={`${selectedColor}-${activePoseIdx}`}
                src={currentPhoto}
                alt={`${selectedColor} - Pose ${activePoseIdx + 1}`}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="w-full h-full object-cover select-none"
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>

            {/* Left / Right Nav Arrows */}
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/75 backdrop-blur-md border border-white/25 text-white flex items-center justify-center hover:bg-black transition-all cursor-pointer opacity-85 hover:opacity-100 shadow-lg"
              title="Previous Angle"
            >
              <ChevronLeft size={22} />
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/75 backdrop-blur-md border border-white/25 text-white flex items-center justify-center hover:bg-black transition-all cursor-pointer opacity-85 hover:opacity-100 shadow-lg"
              title="Next Angle"
            >
              <ChevronRight size={22} />
            </button>

            {/* Zoom Action */}
            <button
              type="button"
              onClick={() => setIsZoomOpen(true)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/75 backdrop-blur-md border border-white/25 text-white flex items-center justify-center hover:bg-black transition-all cursor-pointer shadow-lg"
              title="Zoom Fullscreen"
            >
              <Maximize2 size={16} />
            </button>

            {/* Current View Badge */}
            <div className="absolute bottom-4 left-4 bg-black/85 backdrop-blur-md border border-white/15 px-3.5 py-1.5 rounded-full text-xs font-mono text-white flex items-center gap-2 shadow-md">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>{POSE_LABELS[activePoseIdx]}</span>
            </div>

            {/* Pose Index Badge */}
            <div className="absolute bottom-4 right-4 bg-black/85 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-full text-xs font-mono text-white font-bold shadow-md">
              {activePoseIdx + 1} / {currentPhotos.length}
            </div>
          </div>

          {/* Thumbnail Angles Strip */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-1">
            {currentPhotos.map((photo, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActivePoseIdx(idx)}
                className={`relative aspect-[4/3] rounded-[20px] overflow-hidden border transition-all cursor-pointer ${
                  activePoseIdx === idx
                    ? "border-white ring-2 ring-white/60 shadow-lg opacity-100 scale-[1.02]"
                    : "border-white/10 opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={photo}
                  alt={`Thumbnail pose ${idx + 1}`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-1.5 right-1.5 bg-black/85 px-2 py-0.5 rounded-md text-[10px] font-mono text-white shadow">
                  Angle {idx + 1}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Color Selection Swatches, Size & Instant Action (5 cols) */}
        <div className="lg:col-span-5 space-y-7 sm:space-y-8">
          {/* Active Piece & Colorway Details */}
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase text-neutral-400 block tracking-wider">
              {activePiece.animeSource}
            </span>
            <h4 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-white uppercase tracking-tight leading-tight">
              {activePiece.name}
            </h4>
            <p className="text-xs sm:text-sm text-neutral-300 font-mono leading-relaxed">
              Crafted with 240 GSM heavyweight combed cotton and high-density DTF graphics. Select your preferred colorway and reserve your size below.
            </p>
          </div>

          {/* COLORWAY SELECTION BUTTONS */}
          <div className="space-y-3">
            <label className="text-xs font-mono uppercase text-neutral-300 flex items-center justify-between tracking-wider">
              <span>Choose Colorway:</span>
              <span className="text-white font-bold bg-neutral-900 border border-white/15 px-2.5 py-1 rounded-lg">
                {selectedColor}
              </span>
            </label>

            <div className="grid grid-cols-2 gap-3">
              {COLORWAYS.map((c) => {
                const isSelected = selectedColor === c.name;
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => handleColorChange(c.name)}
                    className={`p-3.5 sm:p-4 rounded-[20px] border transition-all cursor-pointer flex items-center gap-3 text-left ${
                      isSelected
                        ? "bg-white text-black border-white font-bold shadow-xl scale-[1.02]"
                        : "bg-neutral-900/80 text-neutral-300 border-white/10 hover:border-white/30"
                    }`}
                  >
                    <span
                      className="w-4.5 h-4.5 rounded-full border shrink-0"
                      style={{ backgroundColor: c.hex, borderColor: c.border }}
                    />
                    <span className="text-xs sm:text-sm font-mono truncate font-medium">{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SIZE SELECTION */}
          <div className="space-y-3">
            <label className="text-xs font-mono uppercase text-neutral-300 flex items-center justify-between tracking-wider">
              <span>Select Size:</span>
              <span className="text-white font-bold">{selectedSize}</span>
            </label>

            <div className="flex gap-2.5">
              {["S", "M", "L", "XL", "XXL"].map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => handleSizeChange(sz)}
                  className={`flex-1 py-3 rounded-2xl font-mono text-xs sm:text-sm transition-all cursor-pointer text-center ${
                    selectedSize === sz
                      ? "bg-white text-black font-bold border border-white shadow-md scale-105"
                      : "bg-neutral-900 text-neutral-300 border border-white/10 hover:border-white/30"
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Pricing & Deposit Banner */}
          <div className="p-5 bg-neutral-900/90 border border-white/15 rounded-[24px] flex items-center justify-between font-mono text-xs shadow-md">
            <div>
              <span className="text-neutral-400 block text-[10px] uppercase tracking-wider">October Drop Price</span>
              <span className="font-display font-black text-2xl sm:text-3xl text-white">4,500 XAF</span>
            </div>
            <div className="text-right">
              <span className="text-neutral-400 block text-[10px] uppercase tracking-wider">Deposit to Lock</span>
              <span className="text-white font-bold text-base sm:text-lg">3,500 XAF</span>
            </div>
          </div>

          {/* Preorder & Add to Bag Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={handleAdd}
              className={`flex-1 py-4 px-5 rounded-[20px] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-md ${
                addedAnimation
                  ? "bg-neutral-200 text-black"
                  : "bg-neutral-900 hover:bg-neutral-800 border border-white/20 text-white"
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check size={17} />
                  <span>Added {selectedColor}!</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={17} />
                  <span>Add {selectedColor} to Bag</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => onPreorder(activePiece, selectedSize, selectedColor, selectedQty)}
              className="flex-1 py-4 px-5 bg-white text-black hover:bg-neutral-200 rounded-[20px] font-display font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xl scale-[1.01] hover:scale-[1.02]"
            >
              <Flame size={16} />
              <span>Preorder {selectedColor}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Technical Tee Details Section with Generous Spacing */}
      <div className="mt-10 sm:mt-14 pt-8 sm:pt-10 border-t border-white/10 bg-neutral-900/50 rounded-[32px] p-6 sm:p-8 md:p-10 space-y-7 shadow-inner relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <div>
              <h4 className="font-display font-bold text-base sm:text-lg text-white uppercase tracking-wider">
                Technical Tee Specifications & GSM
              </h4>
              <p className="text-xs text-neutral-400 font-mono">
                Architectural drape and heavy cotton standards.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono uppercase bg-white/10 text-neutral-200 px-3.5 py-1.5 rounded-full border border-white/10 w-fit">
            Luxury Streetwear Standard
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 text-xs font-mono">
          {/* Box 1: Fabric & Weight */}
          <div className="p-5 sm:p-6 bg-black/75 rounded-[24px] border border-white/10 hover:border-white/25 transition-all space-y-2.5 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">Fabric & Weight</div>
              <div className="text-white font-black text-base sm:text-lg font-display uppercase">240 GSM Heavy Cotton</div>
              <p className="text-xs text-neutral-300 font-mono leading-relaxed pt-1">
                100% compact combed ring-spun cotton with ultra-dense zero-transparency drape.
              </p>
            </div>
          </div>

          {/* Box 2: Print Technology */}
          <div className="p-5 sm:p-6 bg-black/75 rounded-[24px] border border-white/10 hover:border-white/25 transition-all space-y-2.5 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">Print Durability</div>
              <div className="text-white font-black text-base sm:text-lg font-display uppercase">HD DTF Matrix</div>
              <p className="text-xs text-neutral-300 font-mono leading-relaxed pt-1">
                Wash-proof high-definition pigment fusion. Tested for 40+ wash cycles without cracking.
              </p>
            </div>
          </div>

          {/* Box 3: Collar & Stitching */}
          <div className="p-5 sm:p-6 bg-black/75 rounded-[24px] border border-white/10 hover:border-white/25 transition-all space-y-2.5 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">Collar & Seams</div>
              <div className="text-white font-black text-base sm:text-lg font-display uppercase">1" Ribbed Crewneck</div>
              <p className="text-xs text-neutral-300 font-mono leading-relaxed pt-1">
                Reinforced neckband that retains its fitted structure and never sags over time.
              </p>
            </div>
          </div>
        </div>

        {/* Care Instructions bar */}
        <div className="text-xs sm:text-sm font-mono text-neutral-300 flex items-start gap-3.5 p-4 sm:p-5 rounded-[22px] bg-black/50 border border-white/10">
          <Info size={18} className="shrink-0 text-white mt-0.5" />
          <span className="leading-relaxed">
            <strong className="text-white">Care Specs:</strong> Machine wash cold inside-out (30°C) with like colors. Hang dry in shade to preserve cotton tension. Do not iron directly over the anime graphic print.
          </span>
        </div>
      </div>

      {/* Fullscreen Zoom Modal */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setIsZoomOpen(false)}
        >
          <img
            src={currentPhoto}
            alt={selectedColor}
            className="max-w-full max-h-[90vh] object-contain rounded-[32px]"
            referrerPolicy="no-referrer"
          />
          <button
            type="button"
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-5 right-5 w-11 h-11 rounded-full bg-neutral-900 border border-white/25 text-white flex items-center justify-center cursor-pointer shadow-2xl"
          >
            <X size={20} />
          </button>
        </div>
      )}
    </motion.div>
  );
}
