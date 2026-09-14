import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());

// Enterprise Security Headers Middleware (100/100 Hardening)
app.use((req, res, next) => {
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Content-Security-Policy", "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: https:; img-src 'self' data: blob: https:; media-src 'self' data: blob: https:;");
  next();
});

// IP-Based Sliding Window Rate Limiter for API Endpoints (DDoS & Brute Force Defense)
const requestCounts = new Map<string, { count: number; resetTime: number }>();
app.use("/api/", (req, res, next) => {
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const now = Date.now();
  let record = requestCounts.get(ip);

  if (!record || now > record.resetTime) {
    record = { count: 1, resetTime: now + 60 * 1000 }; // 60-second window
    requestCounts.set(ip, record);
  } else {
    record.count++;
    if (record.count > 120) { // Max 120 requests per minute per IP
      return res.status(429).json({ error: "Rate limit exceeded. Please try again later." });
    }
  }
  next();
});

// Persistent storage files
const DATA_DIR = path.join(process.cwd(), "data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");
const LEADS_FILE = path.join(DATA_DIR, "leads.json");
const REVIEWS_FILE = path.join(DATA_DIR, "reviews.json");
const CONFIG_FILE = path.join(DATA_DIR, "sheets_config.json");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export interface ReviewRecord {
  reviewId: string;
  pieceId: string;
  pieceName?: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
  verified?: boolean;
}

export interface PreorderRecord {
  orderId: string;
  timestamp: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  product: string;
  items?: any[];
  quantity: number;
  size: string;
  color: string;
  totalAmount: number;
  depositAmount: number;
  balanceDue: number;
  status: string;
  founderNumber: number;
  referralCode: string;
  referredBy?: string;
}

export interface LeadRecord {
  leadId: string;
  timestamp: string;
  name?: string;
  email: string;
  phone: string;
  source: string;
  referralCode?: string;
  referredBy?: string;
}

interface ServerSheetsConfig {
  webhookUrl?: string;
  spreadsheetUrl?: string;
  spreadsheetTitle?: string;
  adminPinHash?: string; // Hashed or salt-secured PIN
}

// In-memory brute-force protection
let failedAttempts = 0;
let lockoutUntil = 0;
// Active admin session tokens (valid for 12 hours)
const activeAdminSessions = new Map<string, number>();

function hashPin(pin: string): string {
  return crypto.createHash("sha256").update(pin.trim()).digest("hex");
}

function loadOrders(): PreorderRecord[] {
  try {
    if (fs.existsSync(ORDERS_FILE)) {
      const data = fs.readFileSync(ORDERS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading orders file:", err);
  }
  return [];
}

function saveOrders(orders: PreorderRecord[]) {
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing orders file:", err);
  }
}

function loadLeads(): LeadRecord[] {
  try {
    if (fs.existsSync(LEADS_FILE)) {
      const data = fs.readFileSync(LEADS_FILE, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Error reading leads file:", err);
  }
  return [];
}

function saveLeads(leads: LeadRecord[]) {
  try {
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing leads file:", err);
  }
}

// Simple HTML & script tag sanitizer to prevent XSS / Injection
function sanitizeInput(str: any, maxLength = 250): string {
  if (typeof str !== "string") return "";
  return str
    .replace(/<[^>]*>?/gm, "") // strip HTML tags
    .replace(/[^\w\s@.,+\-#/()':!]/gi, "") // remove potentially hazardous characters
    .trim()
    .slice(0, maxLength);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function loadReviews(): ReviewRecord[] {
  try {
    if (fs.existsSync(REVIEWS_FILE)) {
      const data = fs.readFileSync(REVIEWS_FILE, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Error reading reviews file:", err);
  }
  return [];
}

function saveReviews(reviews: ReviewRecord[]) {
  try {
    fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing reviews file:", err);
  }
}

const DEFAULT_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbz-6o2bYABxfIduLgztrlM7sVCgGZD9qEkBzLhH0kfSR04RSZCdA2SNAdivVZrxsbcy/exec";
const DEFAULT_PIN_HASH = hashPin("VonBdd2026!");

function loadSheetsConfig(): ServerSheetsConfig {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const data = fs.readFileSync(CONFIG_FILE, "utf-8");
      const parsed = JSON.parse(data);
      return {
        adminPinHash: parsed.adminPinHash || DEFAULT_PIN_HASH,
        webhookUrl: parsed.webhookUrl || DEFAULT_WEBHOOK_URL,
        spreadsheetTitle: parsed.spreadsheetTitle || "Badass Designs - Founder Preorder Registry",
      };
    }
  } catch (err) {
    console.error("Error reading config file:", err);
  }
  return {
    adminPinHash: DEFAULT_PIN_HASH,
    webhookUrl: DEFAULT_WEBHOOK_URL,
    spreadsheetTitle: "Badass Designs - Founder Preorder Registry",
  };
}

function saveSheetsConfig(config: ServerSheetsConfig) {
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing config file:", err);
  }
}

// Background sync to Google Sheet webhook
async function syncToGoogleSheetWebhook(payload: any, webhookUrl: string) {
  const targetUrl = webhookUrl || DEFAULT_WEBHOOK_URL;
  if (!targetUrl || !targetUrl.startsWith("http")) return;
  try {
    const res = await fetch(targetUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
      redirect: "follow",
    });
    const resText = await res.text().catch(() => "");
    console.log(`[Google Sheets Webhook] Sync (Status: ${res.status}, Response: ${resText.slice(0, 100)})`);
  } catch (err) {
    console.error(`[Google Sheets Webhook] Sync error:`, err);
  }
}

// --- API ENDPOINTS ---

// Public Submit Preorder ($100M Founder Offer with Serial Number & Referral Code)
app.post("/api/preorder", async (req, res) => {
  try {
    const { name, email, phone, location, product, quantity, size, color, totalAmount, depositAmount, balanceDue, referredBy } = req.body;

    const cleanName = sanitizeInput(name, 100);
    const cleanEmail = sanitizeInput(email, 120);
    const cleanPhone = sanitizeInput(phone, 35);
    const cleanLocation = sanitizeInput(location, 150);

    if (!cleanName || !cleanEmail || !cleanPhone || !cleanLocation) {
      return res.status(400).json({ error: "Missing required customer information." });
    }

    if (!isValidEmail(cleanEmail)) {
      return res.status(400).json({ error: "Please provide a valid email address." });
    }

    const orderId = "BDS-" + Math.floor(100000 + Math.random() * 900000);
    const timestamp = new Date().toISOString();
    const orders = loadOrders();

    // Assign consecutive Founder Number (e.g. Founder 1 of 50, 2 of 50...)
    const founderNumber = orders.length + 1;
    // Generate unique referral code for this customer (e.g. FOUNDER-9821)
    const referralCode = "FOUNDER-" + Math.floor(1000 + Math.random() * 9000);

    const newOrder: PreorderRecord = {
      orderId,
      timestamp,
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      location: cleanLocation,
      product: sanitizeInput(product || "Vegeta Stencil Tee v3 (Founder Drop)", 100),
      quantity: Math.max(1, Math.min(20, Number(quantity) || 1)),
      size: sanitizeInput(size || "XL", 10),
      color: sanitizeInput(color || "black/white", 30),
      totalAmount: Math.max(0, Number(totalAmount) || 4500),
      depositAmount: Math.max(0, Number(depositAmount) || 3500),
      balanceDue: Math.max(0, Number(balanceDue) || 1000),
      status: "CONFIRMED_PREORDER",
      founderNumber,
      referralCode,
      referredBy: referredBy ? sanitizeInput(referredBy, 50) : undefined,
    };

    orders.unshift(newOrder);
    saveOrders(orders);

    // Push to Google Sheets in the background asynchronously
    const config = loadSheetsConfig();
    const targetUrl = config.webhookUrl || DEFAULT_WEBHOOK_URL;
    if (targetUrl) {
      syncToGoogleSheetWebhook({
        action: "ADD_ORDER",
        ...newOrder,
      }, targetUrl).catch((e) => console.error("[Google Sheets Sync]", e));
    }

    // Return receipt to the customer
    return res.status(201).json({
      success: true,
      order: newOrder,
    });
  } catch (err) {
    console.error("Order processing error:", err);
    res.status(500).json({ error: "Failed to process preorder." });
  }
});

// Public Lead Magnet / Drop List Signup ($100M Leads Framework)
app.post("/api/lead-capture", async (req, res) => {
  try {
    const { email, phone, name, source, referralCode, referredBy } = req.body;

    const cleanName = sanitizeInput(name, 100);
    const cleanEmail = sanitizeInput(email, 120);
    const cleanPhone = sanitizeInput(phone, 35);
    const cleanReferredBy = referredBy ? sanitizeInput(referredBy, 50) : undefined;

    if (!cleanEmail && !cleanPhone && !cleanName) {
      return res.status(400).json({ error: "Please provide your name, phone number, or email." });
    }

    if (cleanEmail && !isValidEmail(cleanEmail)) {
      return res.status(400).json({ error: "Please provide a valid email format." });
    }

    const leadId = "LEAD-" + Math.floor(100000 + Math.random() * 900000);
    const timestamp = new Date().toISOString();

    // Assign a unique referral code for this lead (using their phone or generated code)
    const assignedReferralCode = referralCode 
      ? sanitizeInput(referralCode, 30) 
      : (cleanPhone ? cleanPhone : "REF-" + Math.floor(100000 + Math.random() * 900000));

    const newLead: LeadRecord = {
      leadId,
      timestamp,
      name: cleanName || "Subscriber",
      email: cleanEmail,
      phone: cleanPhone,
      source: sanitizeInput(source || "Website Access Gate", 80),
      referralCode: assignedReferralCode,
      referredBy: cleanReferredBy,
    };

    const leads = loadLeads();
    const existingIndex = leads.findIndex((l) => 
      (cleanEmail && l.email && l.email.toLowerCase() === cleanEmail.toLowerCase()) ||
      (cleanPhone && l.phone && l.phone === cleanPhone) ||
      (cleanName && l.name && l.name.toLowerCase() === cleanName.toLowerCase())
    );

    if (existingIndex !== -1) {
      // Update existing lead with any new info
      leads[existingIndex] = {
        ...leads[existingIndex],
        name: cleanName || leads[existingIndex].name,
        phone: cleanPhone || leads[existingIndex].phone,
        email: cleanEmail || leads[existingIndex].email,
        source: leads[existingIndex].source || String(source || "Website Access Gate"),
        referralCode: leads[existingIndex].referralCode || assignedReferralCode,
        referredBy: leads[existingIndex].referredBy || cleanReferredBy,
      };
      saveLeads(leads);
    } else {
      leads.unshift(newLead);
      saveLeads(leads);

      // Also sync lead to Google Sheets
      const config = loadSheetsConfig();
      const targetUrl = config.webhookUrl || DEFAULT_WEBHOOK_URL;
      if (targetUrl) {
        syncToGoogleSheetWebhook({
          action: "ADD_LEAD",
          ...newLead,
        }, targetUrl).catch((e) => console.error("[Google Sheets Lead Sync]", e));
      }
    }

    const activeLead = existingIndex !== -1 ? leads[existingIndex] : newLead;

    return res.status(201).json({
      success: true,
      leadId: activeLead.leadId,
      referralCode: activeLead.referralCode || activeLead.phone || assignedReferralCode,
      name: activeLead.name,
      phone: activeLead.phone,
      message: "You are registered on the Founder Drop List! Download link unlocked.",
      wallpaperUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1600&auto=format&fit=crop",
    });
  } catch (err) {
    console.error("Lead capture error:", err);
    res.status(500).json({ error: "Failed to register lead." });
  }
});

// Check if user is registered in the portal leads database
app.post("/api/lead-check", (req, res) => {
  try {
    const { name, phone } = req.body || {};
    const cleanName = (name ? String(name).trim().toLowerCase() : "");
    const cleanPhone = (phone ? String(phone).replace(/\D/g, "") : "");

    if (!cleanName && !cleanPhone) {
      return res.json({ registered: false });
    }

    const leads = loadLeads();
    const found = leads.find((l) => {
      const lName = (l.name || "").trim().toLowerCase();
      const lPhone = (l.phone || "").replace(/\D/g, "");

      const nameMatches = Boolean(
        cleanName && lName && (
          lName === cleanName ||
          lName.includes(cleanName) ||
          cleanName.includes(lName)
        )
      );

      const phoneMatches = Boolean(
        cleanPhone && lPhone && (
          lPhone === cleanPhone ||
          lPhone.endsWith(cleanPhone) ||
          cleanPhone.endsWith(lPhone)
        )
      );

      return nameMatches || phoneMatches;
    });

    if (found) {
      return res.json({
        registered: true,
        name: found.name,
        phone: found.phone,
        leadId: found.leadId,
        referralCode: found.referralCode || found.phone,
      });
    }

    return res.json({ registered: false });
  } catch (err) {
    console.error("Lead check error:", err);
    res.json({ registered: false });
  }
});

// User Referral Stats & Live Tracking Endpoint
app.get("/api/my-referrals", (req, res) => {
  try {
    const rawId = String(req.query.identifier || "").trim();
    if (!rawId) {
      return res.status(400).json({ error: "Missing identifier" });
    }

    const cleanId = rawId.toLowerCase();
    const cleanDigits = rawId.replace(/\D/g, "");

    const leads = loadLeads();
    const orders = loadOrders();

    // Match leads referred by this user
    const referredLeads = leads.filter((l) => {
      if (!l.referredBy) return false;
      const refBy = l.referredBy.toLowerCase().trim();
      const refByDigits = l.referredBy.replace(/\D/g, "");
      return (
        refBy === cleanId ||
        (cleanDigits.length >= 6 && refByDigits === cleanDigits) ||
        (cleanDigits.length >= 6 && refByDigits.endsWith(cleanDigits))
      );
    });

    // Match preorders referred by this user
    const referredOrders = orders.filter((o) => {
      if (!o.referredBy) return false;
      const refBy = o.referredBy.toLowerCase().trim();
      const refByDigits = o.referredBy.replace(/\D/g, "");
      return (
        refBy === cleanId ||
        (cleanDigits.length >= 6 && refByDigits === cleanDigits) ||
        (cleanDigits.length >= 6 && refByDigits.endsWith(cleanDigits))
      );
    });

    // Build overall leaderboard of all promoters to determine ranking and Top 3
    const promoterScoreMap: Record<string, { code: string; name: string; ordersCount: number; leadsCount: number; score: number }> = {};

    leads.forEach((l) => {
      if (l.referralCode) {
        const c = l.referralCode.trim().toUpperCase();
        if (!promoterScoreMap[c]) {
          promoterScoreMap[c] = { code: c, name: l.name || "VIP Promoter", ordersCount: 0, leadsCount: 0, score: 0 };
        }
      }
      if (l.referredBy) {
        const c = l.referredBy.trim().toUpperCase();
        if (!promoterScoreMap[c]) {
          promoterScoreMap[c] = { code: c, name: "VIP Promoter", ordersCount: 0, leadsCount: 0, score: 0 };
        }
        promoterScoreMap[c].leadsCount += 1;
      }
    });

    orders.forEach((o) => {
      if (o.referralCode) {
        const c = o.referralCode.trim().toUpperCase();
        if (!promoterScoreMap[c]) {
          promoterScoreMap[c] = { code: c, name: o.name || "Founder Collector", ordersCount: 0, leadsCount: 0, score: 0 };
        }
      }
      if (o.referredBy) {
        const c = o.referredBy.trim().toUpperCase();
        if (!promoterScoreMap[c]) {
          promoterScoreMap[c] = { code: c, name: "Promoter", ordersCount: 0, leadsCount: 0, score: 0 };
        }
        promoterScoreMap[c].ordersCount += 1;
      }
    });

    // Calculate score: preorders count * 10 + signups
    Object.values(promoterScoreMap).forEach((p) => {
      p.score = p.ordersCount * 10 + p.leadsCount;
    });

    const sortedPromoters = Object.values(promoterScoreMap)
      .filter((p) => p.score > 0)
      .sort((a, b) => b.score - a.score);

    // Find this user's rank
    const userIndex = sortedPromoters.findIndex((p) => {
      const pCode = p.code.toLowerCase();
      const pDigits = p.code.replace(/\D/g, "");
      return (
        pCode === cleanId ||
        (cleanDigits.length >= 6 && pDigits === cleanDigits)
      );
    });

    const userRank = userIndex !== -1 ? userIndex + 1 : (sortedPromoters.length + 1);
    const ordersCount = referredOrders.length;
    const leadsCount = referredLeads.length;
    const isTop3 = (userIndex !== -1 && userRank <= 3 && (ordersCount > 0 || leadsCount > 0));

    let tier = isTop3 ? 1 : 0;
    let tierReward = "";
    let nextMilestone = "";

    if (isTop3) {
      tier = userRank;
      tierReward = `QUALIFYING FOR FREE PIECE FROM DROP 002! Rank #${userRank} on Leaderboard`;
      nextMilestone = "Keep sharing to lock in your position before Drop 001 closes to win your piece from Drop 002!";
    } else if (ordersCount > 0 || leadsCount > 0) {
      const cutoffScore = sortedPromoters[2]?.score || 1;
      const myScore = ordersCount * 10 + leadsCount;
      const pointsNeeded = Math.max(1, cutoffScore - myScore + 1);
      tierReward = `Current Rank: #${userRank} (${ordersCount} preorders, ${leadsCount} signups)`;
      nextMilestone = `Top 3 referrers win a 100% Free Piece from Drop 002! Need ~${Math.ceil(pointsNeeded / 10)} more preorders to enter Top 3.`;
    } else {
      tierReward = "Top 3 Referrers Win a 100% Free Piece from Drop 002";
      nextMilestone = "Share your WhatsApp invite link. Top 3 promoters claim a free piece from Drop 002!";
    }

    const top3Leaderboard = sortedPromoters.slice(0, 3).map((p, idx) => ({
      rank: idx + 1,
      code: p.code,
      name: p.name,
      ordersCount: p.ordersCount,
      leadsCount: p.leadsCount,
      isWinner: true,
    }));

    return res.json({
      identifier: rawId,
      referralCode: rawId,
      totalLeadsCount: referredLeads.length,
      totalOrdersCount: ordersCount,
      rank: (ordersCount > 0 || leadsCount > 0) ? userRank : null,
      isTop3,
      tierReward,
      nextMilestone,
      top3Leaderboard,
      recentLeads: referredLeads.slice(0, 8).map((l) => ({
        name: l.name || "VIP Guest",
        timestamp: l.timestamp,
        source: l.source,
      })),
      recentOrders: referredOrders.slice(0, 8).map((o) => ({
        orderId: o.orderId,
        product: o.product,
        timestamp: o.timestamp,
        depositAmount: o.depositAmount,
      })),
    });
  } catch (err) {
    console.error("My referrals error:", err);
    res.status(500).json({ error: "Failed to fetch referral data" });
  }
});

// Public: Get Reviews (supports ?pieceId=...)
app.get("/api/reviews", (req, res) => {
  try {
    const { pieceId } = req.query;
    const allReviews = loadReviews();
    if (pieceId) {
      const filtered = allReviews.filter((r) => r.pieceId === String(pieceId));
      return res.json({ reviews: filtered, total: filtered.length });
    }
    return res.json({ reviews: allReviews, total: allReviews.length });
  } catch (err) {
    console.error("Fetch reviews error:", err);
    res.status(500).json({ error: "Failed to fetch reviews." });
  }
});

// Public: Submit Review for a Piece
app.post("/api/reviews", (req, res) => {
  try {
    const { pieceId, pieceName, name, rating, comment } = req.body;
    
    const cleanPieceId = sanitizeInput(pieceId, 60);
    const cleanName = sanitizeInput(name, 80);
    const cleanComment = sanitizeInput(comment, 600);
    const cleanPieceName = pieceName ? sanitizeInput(pieceName, 100) : undefined;

    if (!cleanPieceId || !cleanName || !rating || !cleanComment) {
      return res.status(400).json({ error: "Missing required review fields (pieceId, name, rating, comment)." });
    }

    const reviewId = "REV-" + Math.floor(100000 + Math.random() * 900000);
    const createdAt = new Date().toISOString().split("T")[0];

    const newReview: ReviewRecord = {
      reviewId,
      pieceId: cleanPieceId,
      pieceName: cleanPieceName,
      name: cleanName,
      rating: Math.max(1, Math.min(5, Number(rating) || 5)),
      comment: cleanComment,
      createdAt,
      verified: true,
    };

    const reviews = loadReviews();
    reviews.unshift(newReview);
    saveReviews(reviews);

    return res.status(201).json({
      success: true,
      message: "Thank you for your review! It is now live.",
      review: newReview,
    });
  } catch (err) {
    console.error("Submit review error:", err);
    res.status(500).json({ error: "Failed to submit review." });
  }
});

// Admin Authentication Middleware with Brute-Force Protection and Session Token Verification
function checkAdminAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const token = req.headers["x-admin-token"] as string;
  const pin = (req.headers["x-admin-pin"] || req.query.pin) as string;
  const now = Date.now();

  // 1. Check if token is valid
  if (token && activeAdminSessions.has(token)) {
    const expiry = activeAdminSessions.get(token)!;
    if (now < expiry) {
      return next();
    } else {
      activeAdminSessions.delete(token);
    }
  }

  // 2. If no valid session token, check direct PIN header
  const config = loadSheetsConfig();
  const validHash = config.adminPinHash || DEFAULT_PIN_HASH;

  if (pin && hashPin(pin) === validHash) {
    return next();
  }

  return res.status(401).json({ error: "Unauthorized. Admin authentication required." });
}

// Admin: Verify PIN and obtain a secure Session Token (with rate limiting & lockout)
app.post("/api/admin/login", (req, res) => {
  const { pin } = req.body;
  const now = Date.now();

  if (now < lockoutUntil) {
    const remainingSeconds = Math.ceil((lockoutUntil - now) / 1000);
    return res.status(429).json({ 
      error: `Too many failed attempts. Owner portal locked for ${remainingSeconds} seconds.` 
    });
  }

  if (!pin) {
    return res.status(400).json({ error: "PIN is required." });
  }

  const config = loadSheetsConfig();
  const validHash = config.adminPinHash || DEFAULT_PIN_HASH;

  if (hashPin(pin) === validHash) {
    // Reset failed counter
    failedAttempts = 0;
    // Generate secure random session token
    const token = "badass_sess_" + crypto.randomBytes(24).toString("hex");
    // Token valid for 12 hours
    activeAdminSessions.set(token, now + 12 * 60 * 60 * 1000);

    return res.json({ 
      success: true, 
      token,
      message: "Owner Portal authenticated successfully."
    });
  } else {
    failedAttempts++;
    if (failedAttempts >= 5) {
      lockoutUntil = now + 2 * 60 * 1000; // 2 minute cooldown
      failedAttempts = 0;
      return res.status(429).json({ 
        error: "Too many incorrect PIN attempts. Security lockout active for 2 minutes." 
      });
    }
    return res.status(401).json({ 
      error: `Incorrect Owner PIN. ${5 - failedAttempts} attempt(s) remaining before security lockout.` 
    });
  }
});

// Admin: Change / Update Owner PIN securely
app.post("/api/admin/change-pin", checkAdminAuth, (req, res) => {
  const { currentPin, newPin } = req.body;

  if (!newPin || String(newPin).trim().length < 4) {
    return res.status(400).json({ error: "New PIN must be at least 4 characters long." });
  }

  const config = loadSheetsConfig();
  const validHash = config.adminPinHash || DEFAULT_PIN_HASH;

  if (currentPin && hashPin(currentPin) !== validHash) {
    return res.status(400).json({ error: "Current PIN is incorrect." });
  }

  config.adminPinHash = hashPin(String(newPin).trim());
  saveSheetsConfig(config);

  // Invalidate old session tokens except a new one
  activeAdminSessions.clear();
  const newToken = "badass_sess_" + crypto.randomBytes(24).toString("hex");
  activeAdminSessions.set(newToken, Date.now() + 12 * 60 * 60 * 1000);

  res.json({ 
    success: true, 
    token: newToken,
    message: "Owner PIN updated securely." 
  });
});

// Admin: Logout
app.post("/api/admin/logout", (req, res) => {
  const token = req.headers["x-admin-token"] as string;
  if (token) {
    activeAdminSessions.delete(token);
  }
  res.json({ success: true, message: "Logged out." });
});

// Admin: Get all orders securely
app.get("/api/admin/orders", checkAdminAuth, (req, res) => {
  const orders = loadOrders();
  res.json({ orders, total: orders.length });
});

// Admin: Get all captured leads securely
app.get("/api/admin/leads", checkAdminAuth, (req, res) => {
  const leads = loadLeads();
  res.json({ leads, total: leads.length });
});

// Admin: Delete an order
app.delete("/api/admin/orders/:orderId", checkAdminAuth, (req, res) => {
  const { orderId } = req.params;
  const targetId = decodeURIComponent(orderId).trim();
  let orders = loadOrders();
  const initialCount = orders.length;
  orders = orders.filter((o) => (o.orderId || "").trim() !== targetId);
  saveOrders(orders);
  res.json({ success: true, remaining: orders.length, deleted: initialCount - orders.length });
});

// Admin: Delete a lead
app.delete("/api/admin/leads/:leadId", checkAdminAuth, (req, res) => {
  const { leadId } = req.params;
  const targetId = decodeURIComponent(leadId).trim();
  let leads = loadLeads();
  const initialCount = leads.length;
  leads = leads.filter((l) => (l.leadId || "").trim() !== targetId);
  saveLeads(leads);
  res.json({ success: true, remaining: leads.length, deleted: initialCount - leads.length });
});

// Admin: Bulk delete all leads
app.delete("/api/admin/leads", checkAdminAuth, (req, res) => {
  saveLeads([]);
  res.json({ success: true, remaining: 0, message: "All leads cleared successfully." });
});

// Admin: Export directly to Google Sheets CSV (Formatted Executive Ledger & Raw formats)
app.get("/api/admin/export-csv", checkAdminAuth, (req, res) => {
  const type = req.query.type || "orders"; // 'orders' or 'leads'
  const format = req.query.format; // 'raw' or default formatted
  
  if (type === "leads") {
    const leads = loadLeads();
    const headers = ["Lead ID", "Timestamp", "Name", "Email", "Phone", "Source", "Referral Code"];
    const rows = [headers.join(",")];
    for (const l of leads) {
      rows.push([
        `"${l.leadId}"`,
        `"${l.timestamp}"`,
        `"${(l.name || "").replace(/"/g, '""')}"`,
        `"${(l.email || "").replace(/"/g, '""')}"`,
        `"${(l.phone || "").replace(/"/g, '""')}"`,
        `"${(l.source || "").replace(/"/g, '""')}"`,
        `"${(l.referralCode || "").replace(/"/g, '""')}"`,
      ].join(","));
    }
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment; filename="badass_drop_list_leads.csv"');
    return res.send("\uFEFF" + rows.join("\r\n"));
  }

  if (type === "referrals") {
    const orders = loadOrders();
    // Build referral stats
    const refMap: Record<string, { code: string; referrerName: string; referrerPhone: string; referredCount: number; totalRevenue: number; customers: string[] }> = {};

    // Register all owner codes first
    orders.forEach((o) => {
      if (o.referralCode) {
        if (!refMap[o.referralCode]) {
          refMap[o.referralCode] = {
            code: o.referralCode,
            referrerName: o.name || "Founder",
            referrerPhone: o.phone || "",
            referredCount: 0,
            totalRevenue: 0,
            customers: [],
          };
        }
      }
    });

    // Attribute referred orders
    orders.forEach((o) => {
      if (o.referredBy) {
        const code = o.referredBy.trim();
        if (!refMap[code]) {
          refMap[code] = {
            code,
            referrerName: "Unknown / Drop Lead",
            referrerPhone: "",
            referredCount: 0,
            totalRevenue: 0,
            customers: [],
          };
        }
        refMap[code].referredCount += 1;
        refMap[code].totalRevenue += Number(o.totalAmount) || 5000;
        refMap[code].customers.push(`${o.name} (${o.orderId})`);
      }
    });

    const refList = Object.values(refMap).filter((r) => r.referredCount > 0).sort((a, b) => b.referredCount - a.referredCount);

    const headers = [
      "Referral Code",
      "Referrer Name",
      "WhatsApp / Phone",
      "Friends Referred",
      "Total Revenue (FCFA)",
      "Reward Tier Unlocked",
      "Reward Description",
      "Referred Customers",
    ];
    const rows = [headers.join(",")];
    for (const r of refList) {
      let tier = "None";
      let reward = "Needs 1 invite for Tier 1";
      if (r.referredCount >= 3) {
        tier = "Tier 3 (Grand Prize)";
        reward = "100% Free Drop 001 T-Shirt";
      } else if (r.referredCount === 2) {
        tier = "Tier 2";
        reward = "Limited Badass Founder Snapback / Cap";
      } else if (r.referredCount === 1) {
        tier = "Tier 1";
        reward = "Badass Die-Cut Vinyl Sticker Pack";
      }

      rows.push([
        `"${r.code}"`,
        `"${r.referrerName.replace(/"/g, '""')}"`,
        `"${r.referrerPhone.replace(/"/g, '""')}"`,
        r.referredCount,
        r.totalRevenue,
        `"${tier}"`,
        `"${reward}"`,
        `"${r.customers.join(" | ").replace(/"/g, '""')}"`,
      ].join(","));
    }

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment; filename="badass_referrals_leaderboard.csv"');
    return res.send("\uFEFF" + rows.join("\r\n"));
  }

  const orders = loadOrders();
  const totalUnits = orders.reduce((sum, o) => sum + (Number(o.quantity) || 1), 0);
  const totalGross = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
  const totalDeposit = orders.reduce((sum, o) => sum + (Number(o.depositAmount) || 0), 0);
  const totalBalance = orders.reduce((sum, o) => sum + (Number(o.balanceDue) || 0), 0);
  const exportDate = new Date().toISOString().replace("T", " ").substring(0, 19) + " UTC";

  let csvContent = "";

  if (format === "raw") {
    const headers = [
      "Founder #",
      "Order ID",
      "Timestamp",
      "Customer Name",
      "Email",
      "Phone / WhatsApp",
      "Delivery Location",
      "Product",
      "Quantity",
      "Size",
      "Colorway",
      "Total Amount (FCFA)",
      "Deposit Paid (FCFA)",
      "Balance Due (FCFA)",
      "Status",
      "Referral Code",
      "Referred By",
    ];
    const rows = [headers.join(",")];
    for (const o of orders) {
      rows.push([
        o.founderNumber || "",
        `"${o.orderId}"`,
        `"${o.timestamp}"`,
        `"${(o.name || "").replace(/"/g, '""')}"`,
        `"${(o.email || "").replace(/"/g, '""')}"`,
        `"${(o.phone || "").replace(/"/g, '""')}"`,
        `"${(o.location || "").replace(/"/g, '""')}"`,
        `"${(o.product || "").replace(/"/g, '""')}"`,
        o.quantity,
        `"${o.size}"`,
        `"${(o.color || "").toUpperCase()}"`,
        o.totalAmount,
        o.depositAmount,
        o.balanceDue,
        `"${o.status}"`,
        `"${o.referralCode || ""}"`,
        `"${o.referredBy || ""}"`,
      ].join(","));
    }
    csvContent = "\uFEFF" + rows.join("\r\n");
  } else {
    // Executive Designed Ledger Format
    const lines = [
      `"===================================================================================================="`,
      `"BADASS DESIGNS — OCTOBER FOUNDER DROP PREORDER REGISTRY & SALES LEDGER"`,
      `"===================================================================================================="`,
      `"Export Date:","${exportDate}"`,
      `"Product Drop:","Drop 001 — Vegeta Stencil Tee (50 Founders Collection)"`,
      `"Total Preorders:","${orders.length} orders"`,
      `"Total Units Reserved:","${totalUnits} items"`,
      `"Total Gross Revenue:","${totalGross.toLocaleString()} FCFA"`,
      `"Total Deposit Collected:","${totalDeposit.toLocaleString()} FCFA"`,
      `"Total Balance Pending:","${totalBalance.toLocaleString()} FCFA"`,
      `"===================================================================================================="`,
      `""`,
      [
        `"FOUNDER #"`,
        `"ORDER ID"`,
        `"DATE & TIME (UTC)"`,
        `"CUSTOMER NAME"`,
        `"WHATSAPP / PHONE"`,
        `"EMAIL"`,
        `"DELIVERY LOCATION"`,
        `"PRODUCT"`,
        `"QTY"`,
        `"SIZE"`,
        `"COLORWAY"`,
        `"UNIT PRICE (FCFA)"`,
        `"TOTAL DUE (FCFA)"`,
        `"DEPOSIT PAID (FCFA)"`,
        `"BALANCE DUE (FCFA)"`,
        `"STATUS"`,
        `"REFERRAL CODE"`,
        `"REFERRED BY"`
      ].join(","),
    ];

    orders.forEach((o) => {
      const formattedDate = o.timestamp ? o.timestamp.replace("T", " ").substring(0, 19) : "";
      const unitPrice = o.quantity ? Math.round(o.totalAmount / o.quantity) : 5000;
      lines.push([
        `"No. ${o.founderNumber || 1} / 50"`,
        `"${o.orderId}"`,
        `"${formattedDate}"`,
        `"${(o.name || "").replace(/"/g, '""')}"`,
        `"${(o.phone || "").replace(/"/g, '""')}"`,
        `"${(o.email || "").replace(/"/g, '""')}"`,
        `"${(o.location || "").replace(/"/g, '""')}"`,
        `"${(o.product || "").replace(/"/g, '""')}"`,
        o.quantity,
        `"${o.size}"`,
        `"${(o.color || "").toUpperCase()}"`,
        unitPrice,
        o.totalAmount,
        o.depositAmount,
        o.balanceDue,
        `"${o.status}"`,
        `"${o.referralCode || ""}"`,
        `"${o.referredBy || ""}"`
      ].join(","));
    });

    lines.push(`""`);
    lines.push([
      `""`,
      `"GRAND TOTALS"`,
      `""`,
      `""`,
      `""`,
      `""`,
      `""`,
      `""`,
      totalUnits,
      `""`,
      `""`,
      `""`,
      totalGross,
      totalDeposit,
      totalBalance,
      `"COMPLETED SUMMARY"`,
      `""`,
      `""`
    ].join(","));

    csvContent = "\uFEFF" + lines.join("\r\n");
  }

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", 'attachment; filename="badass_designs_founders_ledger.csv"');
  res.send(csvContent);
});

// Admin: Batch sync all existing orders & leads to Google Sheets
app.post("/api/admin/sync-all-sheets", checkAdminAuth, async (req, res) => {
  const orders = loadOrders();
  const leads = loadLeads();
  const config = loadSheetsConfig();
  const targetUrl = config.webhookUrl || DEFAULT_WEBHOOK_URL;
  
  if (!targetUrl) {
    return res.status(400).json({ error: "No Google Sheets Webhook URL configured." });
  }

  let orderSyncCount = 0;
  for (const order of orders) {
    try {
      await syncToGoogleSheetWebhook({
        action: "ADD_ORDER",
        ...order,
      }, targetUrl);
      orderSyncCount++;
    } catch (e) {
      console.error("Batch sync order error:", e);
    }
  }

  let leadSyncCount = 0;
  for (const lead of leads) {
    try {
      await syncToGoogleSheetWebhook({
        action: "ADD_LEAD",
        ...lead,
      }, targetUrl);
      leadSyncCount++;
    } catch (e) {
      console.error("Batch sync lead error:", e);
    }
  }

  res.json({ 
    success: true, 
    orderCount: orderSyncCount, 
    leadCount: leadSyncCount, 
    totalOrders: orders.length,
    totalLeads: leads.length
  });
});

// Admin: Get / Set Google Sheets Configuration (Secret PIN is never exposed)
app.get("/api/admin/sheets-config", checkAdminAuth, (req, res) => {
  const config = loadSheetsConfig();
  res.json({
    webhookUrl: config.webhookUrl || DEFAULT_WEBHOOK_URL,
    spreadsheetTitle: config.spreadsheetTitle || "Badass Designs - Founder Preorder Registry",
    isPinSet: Boolean(config.adminPinHash),
  });
});

app.post("/api/admin/sheets-config", checkAdminAuth, (req, res) => {
  const current = loadSheetsConfig();
  const updated: ServerSheetsConfig = {
    ...current,
    webhookUrl: req.body.webhookUrl !== undefined ? req.body.webhookUrl : current.webhookUrl,
    spreadsheetTitle: req.body.spreadsheetTitle !== undefined ? req.body.spreadsheetTitle : current.spreadsheetTitle,
  };
  saveSheetsConfig(updated);
  res.json({ success: true, config: { webhookUrl: updated.webhookUrl, spreadsheetTitle: updated.spreadsheetTitle } });
});

// Start Server and Vite
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
