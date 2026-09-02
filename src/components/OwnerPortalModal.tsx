import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Lock, 
  Download, 
  FileSpreadsheet, 
  RefreshCw, 
  Trash2, 
  CheckCircle2, 
  Copy, 
  Key, 
  ShieldCheck, 
  Users, 
  Layers, 
  MessageCircle, 
  LogOut, 
  Search, 
  Sparkles,
  AlertCircle,
  Gift,
  Trophy,
  TrendingUp,
  ArrowUpRight,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { PreorderRecord, LeadRecord } from "../types";

interface OwnerPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  ordersCount?: number;
}

export function OwnerPortalModal({ isOpen, onClose, ordersCount = 0 }: OwnerPortalModalProps) {
  const [activeTab, setActiveTab] = useState<"orders" | "leads" | "referrals" | "sheets" | "security">("orders");
  
  // Auth state - never prefill or expose PIN
  const [authToken, setAuthToken] = useState<string>(() => sessionStorage.getItem("badass_owner_token") || "");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => Boolean(sessionStorage.getItem("badass_owner_token")));
  const [pinInput, setPinInput] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

  // Data state
  const [orders, setOrders] = useState<PreorderRecord[]>([]);
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedReferrer, setExpandedReferrer] = useState<string | null>(null);

  // Sheets config state
  const [webhookUrlInput, setWebhookUrlInput] = useState<string>("");
  const [saveWebhookSuccess, setSaveWebhookSuccess] = useState<string>("");
  const [isSyncingSheets, setIsSyncingSheets] = useState<boolean>(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string>("");
  const [copiedScript, setCopiedScript] = useState<boolean>(false);

  // PIN Change state
  const [currentPin, setCurrentPin] = useState<string>("");
  const [newPin, setNewPin] = useState<string>("");
  const [confirmPin, setConfirmPin] = useState<string>("");
  const [pinChangeMsg, setPinChangeMsg] = useState<string>("");
  const [pinChangeError, setPinChangeError] = useState<string>("");

  // In-app Delete Confirmation & Action Feedback state
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "lead" | "order" | "all-leads";
    id: string;
    label?: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [actionFeedback, setActionFeedback] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Google Apps Script snippet for Google Sheets
  const googleAppsScriptSnippet = `function doPost(e) {
  try {
    var data = {};
    if (e && e.postData && e.postData.contents) {
      try { data = JSON.parse(e.postData.contents); } catch(err) { data = e.parameter || {}; }
    } else if (e && e.parameter) {
      data = e.parameter;
    }
    
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var action = data.action || "ADD_ORDER";
    
    if (action === "ADD_LEAD") {
      var leadSheet = ss.getSheetByName("Drop List Leads");
      if (!leadSheet) {
        leadSheet = ss.insertSheet("Drop List Leads");
        leadSheet.appendRow(["Lead ID", "Timestamp", "Name", "Email", "Phone", "Source", "Referral Code"]);
        leadSheet.getRange(1, 1, 1, 7).setFontWeight("bold").setBackground("#1E293B").setFontColor("#38BDF8");
      }
      leadSheet.appendRow([
        data.leadId || "LEAD-" + Math.floor(100000 + Math.random() * 900000),
        data.timestamp ? new Date(data.timestamp).toLocaleString("en-GB") : new Date().toLocaleString("en-GB"),
        data.name || "N/A",
        data.email || "N/A",
        data.phone || "N/A",
        data.source || "Top 25 Wallpaper",
        data.referralCode || ""
      ]);
      return ContentService.createTextOutput(JSON.stringify({ status: "success", leadId: data.leadId }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Default: Append Preorder to Main Sheet
    var sheet = ss.getActiveSheet();
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Founder #", "Order ID", "Date & Time", "Customer Name", "Phone / WhatsApp", 
        "Email", "Delivery Location", "Product", "Quantity", "Size", "Colorway", 
        "Total (FCFA)", "Deposit (FCFA)", "Balance (FCFA)", "Status", "Referral Code"
      ]);
      sheet.getRange(1, 1, 1, 16).setFontWeight("bold").setBackground("#171717").setFontColor("#FBBF24");
      sheet.setFrozenRows(1);
    }
    
    var dateFormatted = data.timestamp ? new Date(data.timestamp).toLocaleString("en-GB") : new Date().toLocaleString("en-GB");
    sheet.appendRow([
      "No. " + (data.founderNumber || 1) + " / 50",
      data.orderId || "BDS-" + Math.floor(100000 + Math.random() * 900000),
      dateFormatted,
      data.name || "Customer",
      data.phone || "N/A",
      data.email || "N/A",
      data.location || "N/A",
      data.product || "Vegeta Stencil Tee v3",
      Number(data.quantity) || 1,
      data.size || "XL",
      String(data.color || "").toUpperCase(),
      Number(data.totalAmount) || 5000,
      Number(data.depositAmount) || 3000,
      Number(data.balanceDue) || 2000,
      data.status || "CONFIRMED_PREORDER",
      data.referralCode || ""
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success", orderId: data.orderId }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;

  const fetchPortalData = async (token: string, silent = false) => {
    if (!token) return;
    if (!silent) setLoadingData(true);

    try {
      const headers = { "x-admin-token": token };
      const [resOrders, resLeads, resConfig] = await Promise.all([
        fetch("/api/admin/orders", { headers }),
        fetch("/api/admin/leads", { headers }),
        fetch("/api/admin/sheets-config", { headers }),
      ]);

      if (resOrders.status === 401 || resLeads.status === 401) {
        handleLogout();
        return;
      }

      if (resOrders.ok) {
        const oData = await resOrders.json();
        setOrders(oData.orders || []);
      }
      if (resLeads.ok) {
        const lData = await resLeads.json();
        setLeads(lData.leads || []);
      }
      if (resConfig.ok) {
        const cData = await resConfig.json();
        if (cData.webhookUrl) setWebhookUrlInput(cData.webhookUrl);
      }

      setLastSyncTime(new Date().toLocaleTimeString());
    } catch (e) {
      console.error("Portal data fetch error:", e);
    } finally {
      if (!silent) setLoadingData(false);
    }
  };

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput) {
      setAuthError("Please enter your Owner PIN.");
      return;
    }

    setIsAuthenticating(true);
    setAuthError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: pinInput }),
      });

      const data = await res.json();
      if (res.ok && data.token) {
        setAuthToken(data.token);
        setIsAuthenticated(true);
        sessionStorage.setItem("badass_owner_token", data.token);
        setPinInput("");
        fetchPortalData(data.token);
      } else {
        setAuthError(data.error || "Authentication failed.");
      }
    } catch (e) {
      setAuthError("Server communication failed.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = async () => {
    try {
      if (authToken) {
        await fetch("/api/admin/logout", {
          method: "POST",
          headers: { "x-admin-token": authToken },
        });
      }
    } catch (e) {}
    setAuthToken("");
    setIsAuthenticated(false);
    sessionStorage.removeItem("badass_owner_token");
    setPinInput("");
    setOrders([]);
    setLeads([]);
  };

  // Live polling every 3s when portal is open and authenticated
  useEffect(() => {
    if (isOpen && isAuthenticated && authToken) {
      fetchPortalData(authToken);
      const poll = setInterval(() => {
        fetchPortalData(authToken, true);
      }, 3000);
      return () => clearInterval(poll);
    }
  }, [isOpen, isAuthenticated, authToken]);

  // CSV download trigger
  const handleDownloadCsv = (type: "orders" | "leads" | "referrals", format: "designed" | "raw" = "designed") => {
    const url = `/api/admin/export-csv?type=${type}&format=${format}`;
    fetch(url, { headers: { "x-admin-token": authToken } })
      .then((res) => {
        if (!res.ok) throw new Error("CSV download unauthorized");
        return res.blob();
      })
      .then((blob) => {
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = type === "leads" 
          ? "badass_drop_list_leads.csv" 
          : type === "referrals"
          ? "badass_referrals_leaderboard.csv"
          : "badass_october_founder_ledger.csv";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(downloadUrl);
        setActionFeedback({ message: `Exported ${type} CSV successfully!`, type: "success" });
        setTimeout(() => setActionFeedback(null), 3500);
      })
      .catch((err) => {
        setActionFeedback({ message: "Failed to download CSV: " + err.message, type: "error" });
        setTimeout(() => setActionFeedback(null), 4000);
      });
  };

  const handleSaveWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveWebhookSuccess("");
    try {
      const res = await fetch("/api/admin/sheets-config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": authToken,
        },
        body: JSON.stringify({ webhookUrl: webhookUrlInput }),
      });
      if (res.ok) {
        setSaveWebhookSuccess("Google Sheets Webhook URL saved successfully!");
        setTimeout(() => setSaveWebhookSuccess(""), 3000);
      } else {
        setActionFeedback({ message: "Failed to save webhook URL.", type: "error" });
        setTimeout(() => setActionFeedback(null), 4000);
      }
    } catch (e) {
      setActionFeedback({ message: "Network error saving webhook URL.", type: "error" });
      setTimeout(() => setActionFeedback(null), 4000);
    }
  };

  const handleSyncAll = async () => {
    setIsSyncingSheets(true);
    setSyncStatusMsg("");
    try {
      const res = await fetch("/api/admin/sync-all-sheets", {
        method: "POST",
        headers: { "x-admin-token": authToken },
      });
      const data = await res.json();
      if (res.ok) {
        setSyncStatusMsg(`Successfully synced ${data.orderCount} preorders & ${data.leadCount} leads to your Google Sheet!`);
        setTimeout(() => setSyncStatusMsg(""), 5000);
      } else {
        setActionFeedback({ message: data.error || "Batch sync failed.", type: "error" });
        setTimeout(() => setActionFeedback(null), 4000);
      }
    } catch (e) {
      setActionFeedback({ message: "Error syncing to Google Sheet.", type: "error" });
      setTimeout(() => setActionFeedback(null), 4000);
    } finally {
      setIsSyncingSheets(false);
    }
  };

  const handleChangePin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinChangeMsg("");
    setPinChangeError("");

    if (newPin !== confirmPin) {
      setPinChangeError("New PIN and confirmation do not match.");
      return;
    }
    if (newPin.length < 4) {
      setPinChangeError("New PIN must be at least 4 digits.");
      return;
    }

    try {
      const res = await fetch("/api/admin/change-pin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": authToken,
        },
        body: JSON.stringify({ currentPin, newPin }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        setAuthToken(data.token);
        sessionStorage.setItem("badass_owner_token", data.token);
        setPinChangeMsg("Owner PIN updated securely!");
        setCurrentPin("");
        setNewPin("");
        setConfirmPin("");
        setTimeout(() => setPinChangeMsg(""), 3500);
      } else {
        setPinChangeError(data.error || "Failed to change PIN.");
      }
    } catch (e) {
      setPinChangeError("PIN update failed.");
    }
  };

  const executeDelete = async () => {
    if (!deleteTarget || !authToken) return;
    setIsDeleting(true);

    try {
      if (deleteTarget.type === "lead") {
        const res = await fetch(`/api/admin/leads/${encodeURIComponent(deleteTarget.id)}`, {
          method: "DELETE",
          headers: { "x-admin-token": authToken },
        });
        if (res.ok) {
          setLeads((prev) => prev.filter((l) => (l.leadId || "").trim() !== deleteTarget.id.trim()));
          setActionFeedback({ message: `Lead ${deleteTarget.id} deleted successfully.`, type: "success" });
        } else {
          setActionFeedback({ message: "Failed to delete lead from database.", type: "error" });
        }
      } else if (deleteTarget.type === "all-leads") {
        const res = await fetch("/api/admin/leads", {
          method: "DELETE",
          headers: { "x-admin-token": authToken },
        });
        if (res.ok) {
          setLeads([]);
          setActionFeedback({ message: "All captured drop list leads have been cleared.", type: "success" });
        } else {
          setActionFeedback({ message: "Failed to clear leads.", type: "error" });
        }
      } else if (deleteTarget.type === "order") {
        const res = await fetch(`/api/admin/orders/${encodeURIComponent(deleteTarget.id)}`, {
          method: "DELETE",
          headers: { "x-admin-token": authToken },
        });
        if (res.ok) {
          setOrders((prev) => prev.filter((o) => (o.orderId || "").trim() !== deleteTarget.id.trim()));
          setActionFeedback({ message: `Order #${deleteTarget.id} deleted successfully.`, type: "success" });
        } else {
          setActionFeedback({ message: "Failed to delete order.", type: "error" });
        }
      }
    } catch (e) {
      setActionFeedback({ message: "Network error occurred during deletion.", type: "error" });
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
      setTimeout(() => setActionFeedback(null), 4000);
    }
  };

  const handleDeleteOrder = (orderId: string, orderLabel?: string) => {
    setDeleteTarget({
      type: "order",
      id: orderId,
      label: orderLabel || `Order #${orderId}`,
    });
  };

  const handleDeleteLead = (leadId: string, leadLabel?: string) => {
    setDeleteTarget({
      type: "lead",
      id: leadId,
      label: leadLabel || `Lead ${leadId}`,
    });
  };

  const handleClearAllLeads = () => {
    if (leads.length === 0) return;
    setDeleteTarget({
      type: "all-leads",
      id: "ALL",
      label: `All ${leads.length} Drop List Leads`,
    });
  };

  if (!isOpen) return null;

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (o.name && o.name.toLowerCase().includes(q)) ||
      (o.phone && o.phone.includes(q)) ||
      (o.email && o.email.toLowerCase().includes(q)) ||
      (o.orderId && o.orderId.toLowerCase().includes(q)) ||
      (o.size && o.size.toLowerCase().includes(q)) ||
      (o.color && o.color.toLowerCase().includes(q))
    );
  });

  // Filtered leads
  const filteredLeads = leads.filter((l) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (l.name && l.name.toLowerCase().includes(q)) ||
      (l.phone && l.phone.includes(q)) ||
      (l.email && l.email.toLowerCase().includes(q)) ||
      (l.leadId && l.leadId.toLowerCase().includes(q)) ||
      (l.source && l.source.toLowerCase().includes(q)) ||
      (l.referralCode && l.referralCode.toLowerCase().includes(q))
    );
  });

  const totalUnits = orders.reduce((sum, o) => sum + (Number(o.quantity) || 1), 0);
  const totalGross = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
  const totalDeposits = orders.reduce((sum, o) => sum + (Number(o.depositAmount) || 0), 0);

  // Aggregated Referral Analytics
  interface ReferrerGroup {
    code: string;
    referrerName: string;
    referrerPhone: string;
    referrerEmail: string;
    referredOrders: PreorderRecord[];
    totalRevenue: number;
    totalDeposits: number;
    tier: number; // 0, 1, 2, 3
    tierReward: string;
  }

  const referralMap: Record<string, ReferrerGroup> = {};

  // 1. Index all founder referral codes
  orders.forEach((o) => {
    if (o.referralCode) {
      const c = o.referralCode.trim().toUpperCase();
      if (!referralMap[c]) {
        referralMap[c] = {
          code: c,
          referrerName: o.name || "Founder",
          referrerPhone: o.phone || "",
          referrerEmail: o.email || "",
          referredOrders: [],
          totalRevenue: 0,
          totalDeposits: 0,
          tier: 0,
          tierReward: "No referrals yet",
        };
      }
    }
  });

  // 2. Also register codes from drop list leads
  leads.forEach((l) => {
    if (l.referralCode) {
      const c = l.referralCode.trim().toUpperCase();
      if (!referralMap[c]) {
        referralMap[c] = {
          code: c,
          referrerName: l.name || "Drop List Lead",
          referrerPhone: l.phone || "",
          referrerEmail: l.email || "",
          referredOrders: [],
          totalRevenue: 0,
          totalDeposits: 0,
          tier: 0,
          tierReward: "No referrals yet",
        };
      }
    }
  });

  // 3. Map orders with referredBy
  orders.forEach((o) => {
    if (o.referredBy) {
      const c = o.referredBy.trim().toUpperCase();
      if (!referralMap[c]) {
        referralMap[c] = {
          code: c,
          referrerName: "Non-Buyer Promoter / Direct Link",
          referrerPhone: "",
          referrerEmail: "",
          referredOrders: [],
          totalRevenue: 0,
          totalDeposits: 0,
          tier: 0,
          tierReward: "No referrals yet",
        };
      }
      referralMap[c].referredOrders.push(o);
      referralMap[c].totalRevenue += Number(o.totalAmount) || 5000;
      referralMap[c].totalDeposits += Number(o.depositAmount) || 3000;
    }
  });

  // Calculate tiers for each referrer
  Object.values(referralMap).forEach((r) => {
    const count = r.referredOrders.length;
    if (count >= 3) {
      r.tier = 3;
      r.tierReward = "Grand Prize: 100% Free T-Shirt (Drop 002)";
    } else if (count === 2) {
      r.tier = 2;
      r.tierReward = "Tier 2: Limited Founder Snapback / Cap";
    } else if (count === 1) {
      r.tier = 1;
      r.tierReward = "Tier 1: Badass Vinyl Die-Cut Sticker Pack";
    } else {
      r.tier = 0;
      r.tierReward = "Needs 1 invite to unlock Tier 1";
    }
  });

  const activeReferralsList = Object.values(referralMap)
    .filter((r) => r.referredOrders.length > 0)
    .sort((a, b) => b.referredOrders.length - a.referredOrders.length);

  const totalReferredOrdersCount = orders.filter((o) => Boolean(o.referredBy)).length;
  const totalReferredRevenue = activeReferralsList.reduce((sum, r) => sum + r.totalRevenue, 0);
  const tier3WinnersCount = activeReferralsList.filter((r) => r.tier >= 3).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, y: 15 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 15 }}
        className="bg-neutral-950 max-w-4xl w-full rounded-2xl overflow-hidden border border-white/20 shadow-2xl p-6 md:p-8 relative text-white max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white text-xs font-mono cursor-pointer px-2.5 py-1 bg-neutral-900 border border-neutral-800 rounded"
        >
          [× Close]
        </button>

        {!isAuthenticated ? (
          // Secure Login View
          <div className="max-w-sm mx-auto text-center space-y-4 py-8">
            <div className="w-14 h-14 bg-neutral-900 border border-neutral-700 rounded-full flex items-center justify-center mx-auto text-amber-400">
              <Lock size={22} />
            </div>
            <div className="space-y-1">
              <h3 className="font-display font-black text-2xl tracking-tight text-white uppercase">
                Owner Security Portal
              </h3>
              <p className="text-xs font-mono text-neutral-400">
                Enter your private Owner PIN to unlock customer preorders and Google Sheets telemetry.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-3">
              <input
                type="password"
                required
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter Private Owner PIN"
                className="w-full bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 rounded-lg px-4 py-3 text-center font-mono text-sm focus:border-amber-400 focus:outline-none"
              />

              {authError && (
                <p className="text-xs font-mono text-red-400 bg-red-950/40 p-2 rounded border border-red-800">
                  {authError}
                </p>
              )}

              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-neutral-950 rounded-lg font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
              >
                {isAuthenticating ? "Verifying Credentials..." : "Unlock Owner Portal"}
              </button>
            </form>
            <div className="text-[10px] font-mono text-neutral-500 pt-2 flex items-center justify-center gap-1">
              <ShieldCheck size={12} className="text-emerald-400" />
              <span>Brute-Force Protected • 128-bit Session Tokens</span>
            </div>
          </div>
        ) : (
          // Authenticated Dashboard
          <div className="space-y-6 font-mono">
            {/* Header & Live Polling Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="font-display font-black text-2xl text-white uppercase">
                    BADASS STORE OWNER // OS
                  </h3>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Live Polling (3s)
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Drop 001 · October 50 Founders Collection • Last synced: {lastSyncTime || "Just now"}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchPortalData(authToken)}
                  className="p-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-700 rounded transition-colors cursor-pointer"
                  title="Refresh Data"
                >
                  <RefreshCw size={13} className={loadingData ? "animate-spin" : ""} />
                </button>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 bg-neutral-900 hover:bg-red-950 text-neutral-400 hover:text-red-300 border border-neutral-800 rounded text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <LogOut size={12} />
                  <span>Lock / Logout</span>
                </button>
              </div>
            </div>

            {/* Metric Strip ($100M Leads & Offers Metrics) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-neutral-900/80 border border-white/10 rounded-xl p-3 flex flex-col">
                <span className="text-[10px] uppercase text-neutral-400">Founder Preorders</span>
                <span className="text-xl font-bold text-white mt-1">
                  {orders.length} <span className="text-xs text-neutral-500">/ 50 Max</span>
                </span>
              </div>
              <div className="bg-neutral-900/80 border border-white/10 rounded-xl p-3 flex flex-col">
                <span className="text-[10px] uppercase text-neutral-400">Drop List Leads</span>
                <span className="text-xl font-bold text-amber-400 mt-1">
                  {leads.length} <span className="text-xs text-neutral-500">leads</span>
                </span>
              </div>
              <div className="bg-neutral-900/80 border border-white/10 rounded-xl p-3 flex flex-col">
                <span className="text-[10px] uppercase text-neutral-400">Pipeline Gross</span>
                <span className="text-xl font-bold text-emerald-400 mt-1">
                  {totalGross.toLocaleString()} <span className="text-[10px] text-neutral-500">FCFA</span>
                </span>
              </div>
              <div className="bg-neutral-900/80 border border-white/10 rounded-xl p-3 flex flex-col">
                <span className="text-[10px] uppercase text-neutral-400">Deposits Due (60%)</span>
                <span className="text-xl font-bold text-sky-400 mt-1">
                  {totalDeposits.toLocaleString()} <span className="text-[10px] text-neutral-500">FCFA</span>
                </span>
              </div>
            </div>

            {/* Feedback & Status Notification Banner */}
            {actionFeedback && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between gap-2 ${
                  actionFeedback.type === "success"
                    ? "bg-emerald-950/80 border-emerald-500/50 text-emerald-300"
                    : "bg-red-950/80 border-red-500/50 text-red-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  {actionFeedback.type === "success" ? (
                    <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle size={15} className="text-red-400 shrink-0" />
                  )}
                  <span>{actionFeedback.message}</span>
                </div>
                <button
                  onClick={() => setActionFeedback(null)}
                  className="text-neutral-400 hover:text-white text-xs px-1.5 py-0.5"
                >
                  ✕
                </button>
              </motion.div>
            )}

            {/* Navigation Tabs */}
            <div className="flex bg-neutral-900 p-1 rounded-xl border border-white/10 text-xs overflow-x-auto">
              <button
                onClick={() => setActiveTab("orders")}
                className={`flex-1 min-w-[120px] py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === "orders" ? "bg-amber-400 text-neutral-950 font-bold shadow" : "text-neutral-400 hover:text-white"
                }`}
              >
                <Layers size={13} />
                <span>Preorders ({orders.length})</span>
              </button>
              <button
                onClick={() => setActiveTab("leads")}
                className={`flex-1 min-w-[120px] py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === "leads" ? "bg-amber-400 text-neutral-950 font-bold shadow" : "text-neutral-400 hover:text-white"
                }`}
              >
                <Users size={13} />
                <span>Drop Leads ({leads.length})</span>
              </button>
              <button
                onClick={() => setActiveTab("referrals")}
                className={`flex-1 min-w-[130px] py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === "referrals" ? "bg-amber-400 text-neutral-950 font-bold shadow" : "text-neutral-400 hover:text-white"
                }`}
              >
                <Gift size={13} />
                <span>Referrals ({activeReferralsList.length})</span>
              </button>
              <button
                onClick={() => setActiveTab("sheets")}
                className={`flex-1 min-w-[120px] py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === "sheets" ? "bg-amber-400 text-neutral-950 font-bold shadow" : "text-neutral-400 hover:text-white"
                }`}
              >
                <FileSpreadsheet size={13} />
                <span>Sheets Sync</span>
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`flex-1 min-w-[110px] py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === "security" ? "bg-amber-400 text-neutral-950 font-bold shadow" : "text-neutral-400 hover:text-white"
                }`}
              >
                <Key size={13} />
                <span>PIN / Auth</span>
              </button>
            </div>

            {/* Tab 1: Preorder Registry */}
            {activeTab === "orders" && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="relative flex-1 max-w-xs">
                    <Search size={13} className="absolute left-3 top-3 text-neutral-500" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search orders by name, phone, size..."
                      className="w-full bg-neutral-900 border border-neutral-700 text-white rounded-lg pl-9 pr-3 py-2 text-xs focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownloadCsv("orders", "designed")}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded font-bold text-xs uppercase flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Download size={13} />
                      <span>Ledger CSV</span>
                    </button>
                    <button
                      onClick={() => handleDownloadCsv("orders", "raw")}
                      className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 px-3 py-2 rounded text-xs uppercase flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Download size={13} />
                      <span>Raw CSV</span>
                    </button>
                    <button
                      onClick={handleSyncAll}
                      disabled={isSyncingSheets}
                      className="bg-amber-400 hover:bg-amber-300 text-neutral-950 px-3 py-2 rounded font-bold text-xs uppercase flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <FileSpreadsheet size={13} className={isSyncingSheets ? "animate-spin" : ""} />
                      <span>Sync All to Sheet</span>
                    </button>
                  </div>
                </div>

                {syncStatusMsg && (
                  <div className="p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                    <span>{syncStatusMsg}</span>
                  </div>
                )}

                {filteredOrders.length === 0 ? (
                  <div className="text-center py-10 bg-neutral-900/50 rounded-xl border border-white/5 text-neutral-500 text-xs">
                    No orders matching search.
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-lg border border-white/10 max-h-96">
                    <table className="w-full text-left text-xs divide-y divide-white/10">
                      <thead className="bg-neutral-900 text-neutral-400 uppercase text-[10px] sticky top-0 z-10">
                        <tr>
                          <th className="p-3">Founder #</th>
                          <th className="p-3">Order ID</th>
                          <th className="p-3">Customer</th>
                          <th className="p-3">WhatsApp / Phone</th>
                          <th className="p-3">Specs</th>
                          <th className="p-3">Deposit / Total</th>
                          <th className="p-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 bg-neutral-950/60">
                        {filteredOrders.map((o) => {
                          const cleanPhone = (o.phone || "").replace(/\D/g, "");
                          const waLink = cleanPhone
                            ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                                `Hello ${o.name}, this is Badass Designs regarding your Founder Preorder #${o.orderId} (Founder No. ${o.founderNumber || 1}/50)!`
                              )}`
                            : null;
                          return (
                            <tr key={o.orderId} className="hover:bg-white/5 transition-colors">
                              <td className="p-3 font-bold text-amber-400 whitespace-nowrap">
                                No. {o.founderNumber || 1} / 50
                              </td>
                              <td className="p-3 text-neutral-300 font-bold whitespace-nowrap">{o.orderId}</td>
                              <td className="p-3 text-white whitespace-nowrap">
                                <div className="font-semibold">{o.name}</div>
                                <div className="text-[10px] text-neutral-500">{o.location}</div>
                              </td>
                              <td className="p-3 text-neutral-300 whitespace-nowrap">
                                {waLink ? (
                                  <a
                                    href={waLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-emerald-400 hover:text-emerald-300 underline font-semibold flex items-center gap-1"
                                  >
                                    <MessageCircle size={12} />
                                    <span>{o.phone}</span>
                                  </a>
                                ) : (
                                  <span>{o.phone}</span>
                                )}
                                <div className="text-[10px] text-neutral-500">{o.email}</div>
                              </td>
                              <td className="p-3 text-neutral-300 uppercase whitespace-nowrap">
                                <span className="px-1.5 py-0.5 bg-neutral-800 rounded text-[10px] mr-1">{o.quantity}x</span>
                                <span className="px-1.5 py-0.5 bg-neutral-800 rounded text-[10px] mr-1">{o.size}</span>
                                <span className="text-[10px] text-neutral-400">({(o.color || "").replace("black/", "")})</span>
                              </td>
                              <td className="p-3 text-white whitespace-nowrap">
                                <div className="font-bold text-emerald-400">{Number(o.depositAmount || 3000).toLocaleString()} FCFA</div>
                                <div className="text-[10px] text-neutral-500">Total: {Number(o.totalAmount || 5000).toLocaleString()} FCFA</div>
                              </td>
                              <td className="p-3 text-right whitespace-nowrap">
                                <button
                                  onClick={() => handleDeleteOrder(o.orderId, `Founder #${o.founderNumber || 1} · ${o.name} (${o.orderId})`)}
                                  className="text-neutral-500 hover:text-red-400 p-1.5 rounded hover:bg-red-500/10 cursor-pointer transition-colors"
                                  title="Delete Order"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Drop List Leads */}
            {activeTab === "leads" && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="relative flex-1 max-w-xs">
                    <Search size={13} className="absolute left-3 top-3 text-neutral-500" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search leads by name, email, phone..."
                      className="w-full bg-neutral-900 border border-neutral-700 text-white rounded-lg pl-9 pr-3 py-2 text-xs focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    {leads.length > 0 && (
                      <button
                        onClick={handleClearAllLeads}
                        className="bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-800/80 px-3 py-2 rounded text-xs uppercase flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Clear all leads from database"
                      >
                        <Trash2 size={13} />
                        <span>Clear All ({leads.length})</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleDownloadCsv("leads", "raw")}
                      className="bg-neutral-800 hover:bg-neutral-700 text-white px-3 py-2 rounded text-xs uppercase flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Download size={13} />
                      <span>Export Leads CSV</span>
                    </button>
                  </div>
                </div>

                {leads.length === 0 ? (
                  <div className="text-center py-10 bg-neutral-900/50 rounded-xl border border-white/5 text-neutral-500 text-xs">
                    No drop list leads captured yet.
                  </div>
                ) : filteredLeads.length === 0 ? (
                  <div className="text-center py-10 bg-neutral-900/50 rounded-xl border border-white/5 text-neutral-500 text-xs">
                    No leads matching search query "{searchQuery}".
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-lg border border-white/10 max-h-96">
                    <table className="w-full text-left text-xs divide-y divide-white/10">
                      <thead className="bg-neutral-900 text-neutral-400 uppercase text-[10px] sticky top-0 z-10">
                        <tr>
                          <th className="p-3">Lead ID</th>
                          <th className="p-3">Customer Name</th>
                          <th className="p-3">Email</th>
                          <th className="p-3">WhatsApp / Phone</th>
                          <th className="p-3">Magnet Source</th>
                          <th className="p-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 bg-neutral-950/60">
                        {filteredLeads.map((l) => {
                          const cleanPhone = (l.phone || "").replace(/\D/g, "");
                          const waLink = cleanPhone ? `https://wa.me/${cleanPhone}?text=Hello!%20This%20is%20Badass%20Designs%20with%20your%20Drop%20Alert.` : null;
                          return (
                            <tr key={l.leadId} className="hover:bg-white/5 transition-colors">
                              <td className="p-3 font-bold text-amber-400 whitespace-nowrap">{l.leadId}</td>
                              <td className="p-3 text-white whitespace-nowrap">{l.name || "Subscriber"}</td>
                              <td className="p-3 text-neutral-300 whitespace-nowrap">{l.email || "N/A"}</td>
                              <td className="p-3 text-neutral-300 whitespace-nowrap">
                                {waLink ? (
                                  <a href={waLink} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 underline flex items-center gap-1 font-semibold">
                                    <MessageCircle size={12} />
                                    <span>{l.phone}</span>
                                  </a>
                                ) : (
                                  <span>{l.phone || "N/A"}</span>
                                )}
                              </td>
                              <td className="p-3 text-neutral-400 text-[10px] whitespace-nowrap">{l.source}</td>
                              <td className="p-3 text-right whitespace-nowrap">
                                <button
                                  onClick={() => handleDeleteLead(l.leadId, `${l.name || "Subscriber"} (${l.email || l.phone || l.leadId})`)}
                                  className="text-neutral-400 hover:text-red-400 p-1.5 rounded hover:bg-red-500/10 cursor-pointer transition-colors"
                                  title="Delete Lead"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Referrals & Rewards Leaderboard ($100M Leads Framework) */}
            {activeTab === "referrals" && (
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-display font-black text-lg text-white uppercase tracking-tight">
                        Referral Machine & Rewards Leaderboard
                      </h4>
                      <span className="text-[10px] bg-amber-400/10 text-amber-400 border border-amber-400/30 px-2 py-0.5 rounded-full font-bold">
                        $100M Leads Engine
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Track customer promoters, viral invite loops, and reward milestone fulfillment.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownloadCsv("referrals", "raw")}
                      className="bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold px-3 py-2 rounded text-xs uppercase flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Download size={13} />
                      <span>Export Referrals CSV</span>
                    </button>
                  </div>
                </div>

                {/* Referral Overview Metric Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-neutral-900/80 border border-white/10 rounded-xl p-3">
                    <span className="text-[10px] uppercase text-neutral-400">Referred Orders</span>
                    <div className="text-xl font-bold text-amber-400 mt-1 flex items-baseline gap-1.5">
                      <span>{totalReferredOrdersCount}</span>
                      <span className="text-[10px] text-neutral-500 font-normal">
                        ({orders.length > 0 ? Math.round((totalReferredOrdersCount / orders.length) * 100) : 0}% of all drops)
                      </span>
                    </div>
                  </div>

                  <div className="bg-neutral-900/80 border border-white/10 rounded-xl p-3">
                    <span className="text-[10px] uppercase text-neutral-400">Referred Revenue</span>
                    <div className="text-xl font-bold text-emerald-400 mt-1">
                      {totalReferredRevenue.toLocaleString()} <span className="text-[10px] text-neutral-500">FCFA</span>
                    </div>
                  </div>

                  <div className="bg-neutral-900/80 border border-white/10 rounded-xl p-3">
                    <span className="text-[10px] uppercase text-neutral-400">Active Promoters</span>
                    <div className="text-xl font-bold text-white mt-1">
                      {activeReferralsList.length} <span className="text-[10px] text-neutral-500">founders</span>
                    </div>
                  </div>

                  <div className="bg-neutral-900/80 border border-white/10 rounded-xl p-3">
                    <span className="text-[10px] uppercase text-neutral-400">Free Tee Winners (Tier 3)</span>
                    <div className="text-xl font-bold text-sky-400 mt-1">
                      {tier3WinnersCount} <span className="text-[10px] text-neutral-500">qualified</span>
                    </div>
                  </div>
                </div>

                {/* Reward Milestones Legend */}
                <div className="p-4 bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-amber-950/30 rounded-xl border border-amber-500/30 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase tracking-wider">
                    <Trophy size={14} className="text-amber-400" />
                    <span>Customer Reward Tier Milestones</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1 text-xs">
                    <div className="p-2.5 bg-neutral-950/70 border border-white/10 rounded-lg flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded bg-amber-400/20 text-amber-300 font-bold flex items-center justify-center text-xs shrink-0">
                        1
                      </div>
                      <div>
                        <div className="font-bold text-white text-[11px]">1 Friend Invited</div>
                        <div className="text-[10px] text-neutral-400">Badass Die-Cut Vinyl Sticker Pack</div>
                      </div>
                    </div>

                    <div className="p-2.5 bg-neutral-950/70 border border-white/10 rounded-lg flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded bg-amber-400/20 text-amber-300 font-bold flex items-center justify-center text-xs shrink-0">
                        2
                      </div>
                      <div>
                        <div className="font-bold text-white text-[11px]">2 Friends Invited</div>
                        <div className="text-[10px] text-neutral-400">Limited Founder Snapback / Cap</div>
                      </div>
                    </div>

                    <div className="p-2.5 bg-neutral-950/70 border border-emerald-500/30 rounded-lg flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center text-xs shrink-0">
                        3+
                      </div>
                      <div>
                        <div className="font-bold text-emerald-300 text-[11px]">3+ Friends Invited</div>
                        <div className="text-[10px] text-neutral-300">100% Free T-Shirt on Drop 002!</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Leaderboard Table */}
                {activeReferralsList.length === 0 ? (
                  <div className="text-center py-10 bg-neutral-900/50 rounded-xl border border-white/5 text-neutral-400 text-xs space-y-2 p-6">
                    <Gift size={28} className="mx-auto text-amber-400/60" />
                    <p className="font-bold text-white">No Referrals Recorded Yet</p>
                    <p className="text-[11px] max-w-md mx-auto text-neutral-400 leading-relaxed">
                      Whenever customers share their unique invite links (<code className="text-amber-300 bg-black px-1 py-0.5 rounded">?ref=FOUNDER-XXXX</code>) or their friends enter the code at checkout, they will automatically appear here with their unlocked reward tier!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="overflow-x-auto rounded-lg border border-white/10 max-h-96">
                      <table className="w-full text-left text-xs divide-y divide-white/10">
                        <thead className="bg-neutral-900 text-neutral-400 uppercase text-[10px] sticky top-0 z-10">
                          <tr>
                            <th className="p-3">Rank</th>
                            <th className="p-3">Promoter / Founder</th>
                            <th className="p-3">Invite Code</th>
                            <th className="p-3">Preorders Driven</th>
                            <th className="p-3">Gross Value</th>
                            <th className="p-3">Reward Milestone</th>
                            <th className="p-3 text-right">Reward Outreach</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 bg-neutral-950/60">
                          {activeReferralsList.map((ref, idx) => {
                            const isExpanded = expandedReferrer === ref.code;
                            const cleanPhone = (ref.referrerPhone || "").replace(/\D/g, "");
                            const rewardMsg = `Hello ${ref.referrerName}! Badass Designs here. Fantastic news: ${ref.referredOrders.length} of your friends preordered from Drop 001 using your invite code [${ref.code}]! You have officially unlocked your ${ref.tierReward}. We will be fulfilling this with your order. Thank you for championing the brand!`;
                            const waRewardLink = cleanPhone
                              ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(rewardMsg)}`
                              : null;

                            return (
                              <React.Fragment key={ref.code}>
                                <tr className="hover:bg-white/5 transition-colors">
                                  <td className="p-3 font-bold whitespace-nowrap">
                                    {idx === 0 ? (
                                      <span className="inline-flex items-center gap-1 text-amber-300 font-black">
                                        🥇 #1
                                      </span>
                                    ) : idx === 1 ? (
                                      <span className="inline-flex items-center gap-1 text-neutral-300 font-black">
                                        🥈 #2
                                      </span>
                                    ) : idx === 2 ? (
                                      <span className="inline-flex items-center gap-1 text-amber-600 font-black">
                                        🥉 #3
                                      </span>
                                    ) : (
                                      <span className="text-neutral-500 font-bold">#{idx + 1}</span>
                                    )}
                                  </td>
                                  <td className="p-3 text-white whitespace-nowrap">
                                    <div className="font-semibold">{ref.referrerName}</div>
                                    <div className="text-[10px] text-neutral-400">{ref.referrerPhone || ref.referrerEmail || "No direct phone"}</div>
                                  </td>
                                  <td className="p-3 whitespace-nowrap">
                                    <span className="font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                                      {ref.code}
                                    </span>
                                  </td>
                                  <td className="p-3 whitespace-nowrap">
                                    <span className="inline-flex items-center gap-1 font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                                      {ref.referredOrders.length} {ref.referredOrders.length === 1 ? "preorder" : "preorders"}
                                    </span>
                                  </td>
                                  <td className="p-3 text-neutral-200 font-bold whitespace-nowrap">
                                    {ref.totalRevenue.toLocaleString()} FCFA
                                  </td>
                                  <td className="p-3 whitespace-nowrap">
                                    {ref.tier === 3 ? (
                                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse">
                                        <Trophy size={11} />
                                        <span>Tier 3 (Free T-Shirt)</span>
                                      </span>
                                    ) : ref.tier === 2 ? (
                                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40">
                                        <Gift size={11} />
                                        <span>Tier 2 (Snapback Cap)</span>
                                      </span>
                                    ) : ref.tier === 1 ? (
                                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40">
                                        <Gift size={11} />
                                        <span>Tier 1 (Sticker Pack)</span>
                                      </span>
                                    ) : (
                                      <span className="text-neutral-500 text-[10px]">No Reward Yet</span>
                                    )}
                                  </td>
                                  <td className="p-3 text-right whitespace-nowrap space-x-2">
                                    <button
                                      type="button"
                                      onClick={() => setExpandedReferrer(isExpanded ? null : ref.code)}
                                      className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-700 rounded text-[10px] cursor-pointer inline-flex items-center gap-1"
                                    >
                                      <span>{isExpanded ? "Hide Friends" : "View Friends"}</span>
                                      {isExpanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                                    </button>

                                    {waRewardLink && (
                                      <a
                                        href={waRewardLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-bold inline-flex items-center gap-1 transition-colors"
                                        title="Notify promoter of their reward via WhatsApp"
                                      >
                                        <MessageCircle size={11} />
                                        <span>WhatsApp Reward</span>
                                      </a>
                                    )}
                                  </td>
                                </tr>

                                {/* Expanded breakdown of referred orders */}
                                {isExpanded && (
                                  <tr className="bg-black/50">
                                    <td colSpan={7} className="p-3.5 border-t border-b border-amber-500/20">
                                      <div className="space-y-2">
                                        <div className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                                          <Users size={13} />
                                          <span>Friends Referred by {ref.referrerName} ({ref.code}):</span>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                          {ref.referredOrders.map((cust) => (
                                            <div
                                              key={cust.orderId}
                                              className="p-2.5 bg-neutral-900 rounded-lg border border-white/10 space-y-1 text-[11px]"
                                            >
                                              <div className="flex justify-between items-center">
                                                <span className="font-bold text-white">{cust.name}</span>
                                                <span className="text-[10px] text-amber-400 font-mono">#{cust.orderId}</span>
                                              </div>
                                              <div className="text-neutral-400 text-[10px]">
                                                {cust.phone} • {cust.location}
                                              </div>
                                              <div className="flex justify-between text-[10px] text-neutral-300 pt-0.5">
                                                <span>Size {cust.size} ({cust.color})</span>
                                                <span className="text-emerald-400 font-bold">{cust.totalAmount.toLocaleString()} FCFA</span>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* How Referral Tracking Operates Guide Box */}
                <div className="p-4 bg-neutral-900/80 rounded-xl border border-white/10 space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-white uppercase text-[11px]">
                    <Sparkles size={13} className="text-amber-400" />
                    <span>How Badass Designs Referral Tracking Works</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1 text-[11px] text-neutral-400 leading-relaxed">
                    <div className="p-2.5 bg-neutral-950 rounded-lg border border-white/5 space-y-1">
                      <div className="font-bold text-amber-300">1. Unique Code Stamped</div>
                      <p>Every founder receives their serialized code (e.g. <code className="text-white">FOUNDER-9821</code>) on their digital certificate.</p>
                    </div>
                    <div className="p-2.5 bg-neutral-950 rounded-lg border border-white/5 space-y-1">
                      <div className="font-bold text-amber-300">2. One-Click Share</div>
                      <p>The invite link <code className="text-white">?ref=FOUNDER-XXXX</code> preloads their code into friends' checkout automatically.</p>
                    </div>
                    <div className="p-2.5 bg-neutral-950 rounded-lg border border-white/5 space-y-1">
                      <div className="font-bold text-amber-300">3. Real-Time Attribution</div>
                      <p>When the preorder is placed, the referral is linked to both the local database and the live Google Sheet.</p>
                    </div>
                    <div className="p-2.5 bg-neutral-950 rounded-lg border border-white/5 space-y-1">
                      <div className="font-bold text-amber-300">4. Reward Fulfillment</div>
                      <p>The Leaderboard tracks reward unlocks and lets you send 1-click WhatsApp reward notifications.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === "sheets" && (
              <div className="bg-neutral-900/90 border border-amber-400/30 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-400 font-bold uppercase text-xs">
                    <FileSpreadsheet size={16} />
                    <span>Google Sheets Webhook Sync Connector</span>
                  </div>
                  <span className="text-[10px] text-neutral-400">
                    {webhookUrlInput ? "🟢 Configured" : "⚠️ Needs URL"}
                  </span>
                </div>

                <form onSubmit={handleSaveWebhook} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    value={webhookUrlInput}
                    onChange={(e) => setWebhookUrlInput(e.target.value)}
                    placeholder="https://script.google.com/macros/s/.../exec"
                    className="flex-1 bg-neutral-950 border border-neutral-700 text-white rounded px-3 py-2 text-xs focus:border-amber-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-bold uppercase px-4 py-2 rounded transition-colors cursor-pointer shrink-0"
                  >
                    Save Webhook URL
                  </button>
                </form>

                {saveWebhookSuccess && (
                  <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 size={13} />
                    <span>{saveWebhookSuccess}</span>
                  </p>
                )}

                <details className="text-xs text-neutral-400 pt-1">
                  <summary className="cursor-pointer text-amber-400 underline font-semibold">
                    View Google Apps Script Deployment Code
                  </summary>
                  <div className="relative mt-2">
                    <pre className="bg-neutral-950 p-3.5 rounded-lg border border-white/10 text-[10px] text-neutral-300 overflow-x-auto max-h-52 leading-relaxed">
                      {googleAppsScriptSnippet}
                    </pre>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(googleAppsScriptSnippet);
                        setCopiedScript(true);
                        setTimeout(() => setCopiedScript(false), 2000);
                      }}
                      className="absolute top-2 right-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold px-2.5 py-1 rounded text-[10px] flex items-center gap-1 cursor-pointer"
                    >
                      <Copy size={10} />
                      <span>{copiedScript ? "Copied!" : "Copy Code"}</span>
                    </button>
                  </div>
                </details>
              </div>
            )}

            {/* Tab 4: Security & PIN Management */}
            {activeTab === "security" && (
              <div className="bg-neutral-900/90 border border-white/10 rounded-xl p-5 space-y-4 max-w-md">
                <div className="flex items-center gap-2 text-white font-bold uppercase text-xs">
                  <Key size={16} className="text-amber-400" />
                  <span>Update Owner PIN</span>
                </div>
                <p className="text-xs text-neutral-400">
                  Update your access PIN to keep customer preorder data and Google Sheets keys secure.
                </p>

                <form onSubmit={handleChangePin} className="space-y-3">
                  <div>
                    <label className="block text-[10px] uppercase text-neutral-400 mb-1">Current PIN</label>
                    <input
                      type="password"
                      required
                      value={currentPin}
                      onChange={(e) => setCurrentPin(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-700 text-white rounded px-3 py-2 text-xs focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-neutral-400 mb-1">New PIN (4+ digits)</label>
                    <input
                      type="password"
                      required
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-700 text-white rounded px-3 py-2 text-xs focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-neutral-400 mb-1">Confirm New PIN</label>
                    <input
                      type="password"
                      required
                      value={confirmPin}
                      onChange={(e) => setConfirmPin(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-700 text-white rounded px-3 py-2 text-xs focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  {pinChangeError && (
                    <p className="text-xs text-red-400 bg-red-950/40 p-2 rounded border border-red-800">{pinChangeError}</p>
                  )}
                  {pinChangeMsg && (
                    <p className="text-xs text-emerald-400 font-bold bg-emerald-950/40 p-2 rounded border border-emerald-800">{pinChangeMsg}</p>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 rounded font-bold text-xs uppercase cursor-pointer"
                  >
                    Save New PIN
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* In-App Delete Confirmation Modal */}
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-neutral-900 border border-red-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center gap-3 text-red-400">
                <div className="p-3 bg-red-950/60 rounded-xl border border-red-500/30">
                  <Trash2 size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-base text-white">
                    {deleteTarget.type === "all-leads"
                      ? "Clear All Leads?"
                      : deleteTarget.type === "order"
                      ? "Delete Order Record?"
                      : "Delete Lead Record?"}
                  </h4>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    This action permanently deletes data from the server.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-neutral-950 rounded-xl border border-white/5 text-xs text-neutral-300 break-words">
                <span className="text-neutral-500 block text-[10px] uppercase mb-1">Target Entry</span>
                <span className="font-mono font-semibold text-white">
                  {deleteTarget.label || deleteTarget.id}
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setDeleteTarget(null)}
                  className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={executeDelete}
                  className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Trash2 size={13} className={isDeleting ? "animate-spin" : ""} />
                  <span>{isDeleting ? "Deleting..." : "Delete Permanently"}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
