export type PieceStatus = "CURRENT" | "ARCHIVE" | "RETIRED";
export type PieceCategory = "TEES" | "CAPS" | "TROUSERS" | "ACCESSORIES";

export interface PieceReview {
  reviewId: string;
  pieceId: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
  verified?: boolean;
}

export interface Piece {
  id: string;
  name: string;
  category: PieceCategory;
  status: PieceStatus;
  drop: string;
  dropPrice: number; // 4,500 XAF
  archivePrice: number; // 5,000 XAF
  description: string;
  animeSource: string;
  story: string;
  fabric: {
    composition: string;
    weight: string;
    printMethod: string;
    features: string[];
    careInstructions: string;
  };
  delivery: {
    timeline: string;
    bueaPickup: string;
    nationwideShipping: string;
    paymentNote: string;
  };
  colors: string[];
  sizes: string[];
  images: {
    front: string;
    back: string;
  };
  colorGalleries?: Record<string, string[]>;
  featured?: boolean;
  dropDeadline?: string;
  dropPrivileges?: string[];
  reviews?: PieceReview[];
}

export interface BagItem {
  pieceId: string;
  pieceName: string;
  image: string;
  color: string;
  size: string;
  quantity: number;
  unitPrice: number;
  status: PieceStatus;
}

export interface PreorderRecord {
  orderId: string;
  timestamp: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  product: string;
  items?: BagItem[];
  quantity: number;
  size: string;
  color: string;
  totalAmount: number;
  depositAmount: number;
  balanceDue: number;
  status: string;
  founderNumber?: number;
  referralCode?: string;
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
}

export interface ServerSheetsConfig {
  webhookUrl?: string;
  spreadsheetUrl?: string;
  spreadsheetTitle?: string;
  adminPin?: string;
}

export interface OrderConfirmation {
  orderId: string;
  timestamp: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  product: string;
  items?: BagItem[];
  quantity: number;
  size: string;
  color: string;
  totalAmount: number;
  depositAmount: number;
  balanceDue: number;
  founderNumber: number;
  referralCode: string;
}

