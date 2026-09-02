import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShoppingBag, 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight, 
  ShieldCheck
} from "lucide-react";
import { BagItem } from "../types";

interface PreorderBagDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: BagItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onProceedToCheckout: () => void;
}

export function PreorderBagDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout
}: PreorderBagDrawerProps) {
  const totalAmount = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0);
  const requiredDeposit = items.reduce((sum, item) => sum + 3500 * item.quantity, 0);
  const balanceDue = Math.max(0, totalAmount - requiredDeposit);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 cursor-pointer"
          />

          {/* Slide-in Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-neutral-950 border-l border-white/15 z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-neutral-900/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-white/15 flex items-center justify-center text-white">
                  <ShoppingBag size={16} />
                </div>
                <div>
                  <h3 className="font-display font-black text-sm uppercase text-white tracking-wide">
                    Preorder Bag
                  </h3>
                  <span className="text-[11px] font-mono text-neutral-400">
                    {totalUnits} {totalUnits === 1 ? "item" : "items"} selected
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Bag Items List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
              {items.length === 0 ? (
                <div className="py-16 text-center text-neutral-500 space-y-3">
                  <ShoppingBag size={36} className="mx-auto text-neutral-600" />
                  <p className="text-sm font-display uppercase tracking-wider text-neutral-400">
                    Your Preorder Bag is Empty
                  </p>
                  <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                    Explore pieces in the catalogue and add your preferred size and colorway.
                  </p>
                </div>
              ) : (
                items.map((item, idx) => (
                  <div
                    key={`${item.pieceId}-${item.size}-${item.color}-${idx}`}
                    className="p-3 bg-neutral-900/70 border border-white/10 rounded-xl flex gap-3 items-center relative"
                  >
                    <img
                      src={item.image}
                      alt={item.pieceName}
                      className="w-16 h-20 object-cover rounded-lg bg-neutral-950 border border-white/10 shrink-0"
                      referrerPolicy="no-referrer"
                    />

                    <div className="flex-1 min-w-0 space-y-1">
                      <h4 className="font-display font-bold text-xs uppercase text-white truncate">
                        {item.pieceName}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-400">
                        <span>Size: <strong className="text-white">{item.size}</strong></span>
                        <span>•</span>
                        <span>Color: <strong className="text-white">{item.color}</strong></span>
                      </div>
                      <div className="font-mono text-xs font-bold text-white">
                        {(item.unitPrice * item.quantity).toLocaleString()} XAF
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 pt-1">
                        <div className="flex items-center border border-white/15 rounded-lg bg-neutral-950 p-0.5">
                          <button
                            onClick={() => onUpdateQuantity(idx, item.quantity - 1)}
                            className="w-6 h-6 rounded text-neutral-400 hover:text-white flex items-center justify-center cursor-pointer"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="px-2 text-xs font-mono font-bold text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                            className="w-6 h-6 rounded text-neutral-400 hover:text-white flex items-center justify-center cursor-pointer"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(idx)}
                          className="text-neutral-500 hover:text-red-400 p-1 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Bottom Checkout Action */}
            {items.length > 0 && (
              <div className="p-4 sm:p-5 border-t border-white/10 bg-neutral-900/90 space-y-3">
                <div className="space-y-1.5 font-mono text-xs">
                  <div className="flex justify-between text-neutral-400">
                    <span>Total Preorder Value:</span>
                    <span className="text-white font-bold">{totalAmount.toLocaleString()} XAF</span>
                  </div>
                  <div className="flex justify-between text-white font-bold">
                    <span>Deposit (3,500 XAF/piece):</span>
                    <span>{requiredDeposit.toLocaleString()} XAF</span>
                  </div>
                  <div className="flex justify-between text-neutral-400 text-[11px]">
                    <span>Balance upon Delivery:</span>
                    <span>{balanceDue.toLocaleString()} XAF</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onProceedToCheckout();
                  }}
                  className="w-full py-3.5 px-4 bg-white text-black hover:bg-neutral-200 font-display font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-[0.99]"
                >
                  <span>Proceed to Preorder</span>
                  <ArrowRight size={15} />
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-neutral-500">
                  <ShieldCheck size={12} className="text-neutral-400" />
                  <span>Secure reservation with local pickup or direct delivery</span>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
