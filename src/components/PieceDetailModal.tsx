import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  ShoppingBag, 
  ShieldCheck, 
  Share2, 
  Maximize2,
  Plus,
  Minus,
  Check,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Piece } from "../types";
import { COLOR_POSE_GALLERIES } from "../data/pieces";
import { ReviewsSection } from "./ReviewsSection";

interface PieceDetailModalProps {
  piece: Piece | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToPreorder: (piece: Piece, size: string, color: string, quantity: number) => void;
  onDirectPreorder: (piece: Piece, size: string, color: string, quantity: number) => void;
}

export function PieceDetailModal({
  piece,
  isOpen,
  onClose,
  onAddToPreorder,
  onDirectPreorder
}: PieceDetailModalProps) {
  const [selectedColor, setSelectedColor] = useState<string>("Black/White");
  const [selectedSize, setSelectedSize] = useState<string>("L");
  const [currentPoseIdx, setCurrentPoseIdx] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [openAccordion, setOpenAccordion] = useState<"story" | "fabric" | "delivery" | "reviews" | null>("story");
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Sync selectedColor when piece changes
  useEffect(() => {
    if (piece) {
      setSelectedColor(piece.colors[0] || "Black/White");
      setSelectedSize(piece.sizes[2] || piece.sizes[0] || "L");
      setCurrentPoseIdx(0);
    }
  }, [piece]);

  // Retrieve gallery images for current selected color
  const colorPhotos = piece
    ? piece.colorGalleries?.[selectedColor] ||
      COLOR_POSE_GALLERIES[selectedColor] ||
      [piece.images.front, piece.images.back]
    : [];

  // Auto-cycle through pose images
  useEffect(() => {
    if (!isOpen || !piece || isHovered || isZoomOpen || colorPhotos.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentPoseIdx((prev) => (prev + 1) % colorPhotos.length);
    }, 3200);

    return () => clearInterval(timer);
  }, [isOpen, piece, isHovered, isZoomOpen, colorPhotos.length]);

  const currentImageUrl = colorPhotos[currentPoseIdx] || colorPhotos[0] || "";
  const currentPrice = piece ? (piece.status === "CURRENT" ? piece.dropPrice : piece.archivePrice) : 0;

  const handleNextPose = () => {
    if (colorPhotos.length === 0) return;
    setCurrentPoseIdx((prev) => (prev + 1) % colorPhotos.length);
  };

  const handlePrevPose = () => {
    if (colorPhotos.length === 0) return;
    setCurrentPoseIdx((prev) => (prev - 1 + colorPhotos.length) % colorPhotos.length);
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    setCurrentPoseIdx(0);
  };

  const handleAdd = () => {
    if (!piece) return;
    onAddToPreorder(piece, selectedSize, selectedColor, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const handleShare = () => {
    if (!piece) return;
    const shareText = `Check out the ${piece.name} in ${selectedColor} from Badass Designs ("For Those Who Know")! Drop Price: ${currentPrice.toLocaleString()} XAF. Visit: https://badassdesigns.netlify.app/`;
    const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, "_blank");
  };

  const toggleAccordion = (key: "story" | "fabric" | "delivery" | "reviews") => {
    setOpenAccordion((prev) => (prev === key ? null : key));
  };

  return (
    <AnimatePresence>
      {isOpen && piece && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-4xl bg-neutral-950 border border-white/15 rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[92vh] flex flex-col"
          >
            {/* Top Bar */}
            <div className="p-3.5 sm:p-4 border-b border-white/10 flex items-center justify-between bg-neutral-900/60 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase bg-neutral-900 border border-white/10 text-neutral-300 px-2.5 py-0.5 rounded">
                  {piece.category}
                </span>
                <span className="text-[10px] font-mono font-bold bg-white text-black px-2 py-0.5 rounded">
                  October Drop
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-white/15 text-neutral-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Share on WhatsApp"
                >
                  <Share2 size={13} />
                  <span className="hidden sm:inline">Share</span>
                </button>

                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg bg-neutral-900 border border-white/15 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Color Image Carousel & Angles */}
              <div className="space-y-3">
                {/* Main Carousel Display */}
                <div 
                  className="relative aspect-[4/5] bg-neutral-900 rounded-2xl overflow-hidden border border-white/10 group flex items-center justify-center"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={`${selectedColor}-${currentPoseIdx}`}
                      src={currentImageUrl}
                      alt={`${piece.name} - ${selectedColor} - Angle ${currentPoseIdx + 1}`}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </AnimatePresence>

                  {/* Prev / Next Carousel Controls */}
                  {colorPhotos.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevPose}
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/70 border border-white/20 text-white flex items-center justify-center hover:bg-black transition-colors cursor-pointer"
                        title="Previous Angle"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button
                        onClick={handleNextPose}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/70 border border-white/20 text-white flex items-center justify-center hover:bg-black transition-colors cursor-pointer"
                        title="Next Angle"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </>
                  )}

                  {/* Zoom Action */}
                  <button
                    onClick={() => setIsZoomOpen(true)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-black/70 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center hover:bg-black transition-colors cursor-pointer"
                    title="Zoom High-Res"
                  >
                    <Maximize2 size={14} />
                  </button>

                  <div className="absolute bottom-3 left-3 text-[11px] font-mono bg-black/80 backdrop-blur-sm border border-white/15 px-2.5 py-1 rounded-full text-white">
                    {selectedColor} · Angle {currentPoseIdx + 1}/{colorPhotos.length}
                  </div>
                </div>

                {/* Thumbnail View Switcher */}
                {colorPhotos.length > 1 && (
                  <div className="grid grid-cols-3 gap-2">
                    {colorPhotos.map((url, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentPoseIdx(idx)}
                        className={`relative aspect-[4/3] rounded-xl overflow-hidden border transition-all cursor-pointer ${
                          currentPoseIdx === idx
                            ? "border-white ring-2 ring-white/50"
                            : "border-white/10 opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={url}
                          alt={`Angle ${idx + 1}`}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute bottom-1 right-1 bg-black/80 px-1 py-0.5 rounded text-[8px] font-mono text-white">
                          Angle {idx + 1}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Essential Info & Dropdown Specs */}
              <div className="flex flex-col space-y-4">
                {/* Title & Price */}
                <div>
                  <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                    {piece.animeSource}
                  </div>
                  <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-tight mt-0.5">
                    {piece.name}
                  </h2>

                  <div className="flex items-baseline gap-2.5 mt-2">
                    <span className="font-display font-black text-2xl text-white">
                      {currentPrice.toLocaleString()} XAF
                    </span>
                    <span className="text-xs font-mono text-neutral-400">
                      (Drop Preorder Price · 3,500 XAF Deposit)
                    </span>
                  </div>
                </div>

                {/* Color Selection - Variety Color Choices */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-mono uppercase text-neutral-400">
                      Color: <span className="text-white font-bold">{selectedColor}</span>
                    </label>
                    <span className="text-[10px] font-mono text-neutral-400">
                      {colorPhotos.length} angles available
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {piece.colors.map((c) => (
                      <button
                        key={c}
                        onClick={() => handleColorChange(c)}
                        className={`px-3 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer text-left flex items-center justify-between ${
                          selectedColor === c
                            ? "bg-white text-black font-bold border border-white shadow-md"
                            : "bg-neutral-900 text-neutral-300 border border-white/10 hover:border-white/30"
                        }`}
                      >
                        <span>{c}</span>
                        {selectedColor === c && <Check size={13} />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Selection */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase text-neutral-400">
                    Size: <span className="text-white font-bold">{selectedSize}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {piece.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`min-w-[40px] px-3 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer text-center ${
                          selectedSize === s
                            ? "bg-white text-black font-bold border border-white"
                            : "bg-neutral-900 text-neutral-300 border border-white/10 hover:border-white/30"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity & Preorder CTA */}
                <div className="space-y-2.5 pt-2">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-white/15 rounded-2xl bg-neutral-900 p-1">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-8 h-8 rounded-xl text-neutral-400 hover:text-white flex items-center justify-center cursor-pointer"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-3 font-mono font-bold text-white text-sm">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-8 h-8 rounded-xl text-neutral-400 hover:text-white flex items-center justify-center cursor-pointer"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      onClick={handleAdd}
                      className={`flex-1 py-3 px-4 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        addedAnimation
                          ? "bg-neutral-200 text-black"
                          : "bg-white hover:bg-neutral-200 text-black"
                      }`}
                    >
                      {addedAnimation ? (
                        <>
                          <Check size={16} />
                          <span>Added to Bag!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={16} />
                          <span>Add {selectedColor} to Bag</span>
                        </>
                      )}
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      onClose();
                      onDirectPreorder(piece, selectedSize, selectedColor, quantity);
                    }}
                    className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 border border-white/20 text-white rounded-2xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Direct 1-Click Preorder ({selectedColor})</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

                {/* Dropdown Accordions for Secondary Details */}
                <div className="pt-3 border-t border-white/10 space-y-2">
                  <div className="text-[11px] font-mono text-neutral-400 uppercase">
                    More Details & Specifications
                  </div>

                  {/* Accordion 1: The Story */}
                  <div className="border border-white/10 rounded-2xl overflow-hidden bg-neutral-900/40">
                    <button
                      onClick={() => toggleAccordion("story")}
                      className="w-full p-3.5 flex items-center justify-between text-left text-xs font-mono text-white hover:bg-white/5 cursor-pointer"
                    >
                      <span>The Story & Design Inspiration</span>
                      {openAccordion === "story" ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    {openAccordion === "story" && (
                      <div className="p-3.5 pt-0 text-xs font-mono text-neutral-300 leading-relaxed border-t border-white/5">
                        <p>{piece.story}</p>
                      </div>
                    )}
                  </div>

                  {/* Accordion 2: The Fabric & Care */}
                  <div className="border border-white/10 rounded-2xl overflow-hidden bg-neutral-900/40">
                    <button
                      onClick={() => toggleAccordion("fabric")}
                      className="w-full p-3.5 flex items-center justify-between text-left text-xs font-mono text-white hover:bg-white/5 cursor-pointer"
                    >
                      <span>Fabric, GSM & Care Specs</span>
                      {openAccordion === "fabric" ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    {openAccordion === "fabric" && (
                      <div className="p-3.5 pt-0 text-xs font-mono text-neutral-300 leading-relaxed border-t border-white/5 space-y-2">
                        <div className="grid grid-cols-2 gap-2 text-[11px] pt-2">
                          <div className="p-2 bg-neutral-900 rounded-xl border border-white/5">
                            <span className="text-neutral-500 block">Composition</span>
                            <span className="text-white font-bold">{piece.fabric.composition}</span>
                          </div>
                          <div className="p-2 bg-neutral-900 rounded-xl border border-white/5">
                            <span className="text-neutral-500 block">Weight</span>
                            <span className="text-white font-bold">{piece.fabric.weight}</span>
                          </div>
                        </div>
                        <ul className="space-y-1 text-[11px] text-neutral-400">
                          {piece.fabric.features.map((f, i) => (
                            <li key={i} className="flex items-center gap-1.5">
                              <span className="text-white">✦</span> {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Accordion 3: Delivery Timeline */}
                  <div className="border border-white/10 rounded-2xl overflow-hidden bg-neutral-900/40">
                    <button
                      onClick={() => toggleAccordion("delivery")}
                      className="w-full p-3.5 flex items-center justify-between text-left text-xs font-mono text-white hover:bg-white/5 cursor-pointer"
                    >
                      <span>Delivery & Deposit Breakdown</span>
                      {openAccordion === "delivery" ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    {openAccordion === "delivery" && (
                      <div className="p-3.5 pt-0 text-xs font-mono text-neutral-300 leading-relaxed border-t border-white/5 space-y-2 pt-2">
                        <p className="text-[11px] text-neutral-400">{piece.delivery.timeline}</p>
                        <p className="text-[11px] text-neutral-300">
                          <strong>Buea:</strong> {piece.delivery.bueaPickup}
                        </p>
                        <p className="text-[11px] text-neutral-300">
                          <strong>Nationwide:</strong> {piece.delivery.nationwideShipping}
                        </p>
                        <div className="text-[11px] text-white flex items-center gap-1.5 pt-1">
                          <ShieldCheck size={13} />
                          <span>{piece.delivery.paymentNote}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Accordion 4: Customer Reviews */}
                  <div className="border border-white/10 rounded-2xl overflow-hidden bg-neutral-900/40">
                    <button
                      onClick={() => toggleAccordion("reviews")}
                      className="w-full p-3.5 flex items-center justify-between text-left text-xs font-mono text-white hover:bg-white/5 cursor-pointer"
                    >
                      <span>Customer Reviews ({piece.reviews?.length || 0})</span>
                      {openAccordion === "reviews" ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    {openAccordion === "reviews" && (
                      <div className="p-3.5 pt-0 border-t border-white/5 pt-2">
                        <ReviewsSection pieceId={piece.id} pieceName={piece.name} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Full-screen Zoom Modal */}
          {isZoomOpen && (
            <div
              className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
              onClick={() => setIsZoomOpen(false)}
            >
              <img
                src={currentImageUrl}
                alt={piece.name}
                className="max-w-full max-h-[90vh] object-contain rounded-2xl"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={() => setIsZoomOpen(false)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-neutral-900 border border-white/20 text-white flex items-center justify-center cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
          )}
        </div>
      )}
    </AnimatePresence>
  );
}
