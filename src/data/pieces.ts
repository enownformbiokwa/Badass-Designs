import { Piece } from "../types";

import BB_POSE_1 from "../assets/images/bb pose 1.webp";
import BB_POSE_2 from "../assets/images/bb pose 2.webp";
import BB_POSE_3 from "../assets/images/bb pose 3.webp";

import BG_POSE_1 from "../assets/images/bg psoe 1.webp";
import BG_POSE_2 from "../assets/images/bg pose 2.webp";
import BG_POSE_3 from "../assets/images/bg pose 3.webp";

import BP_POSE_1 from "../assets/images/bp pose 1.webp";
import BP_POSE_2 from "../assets/images/bp pose 2.webp";
import BP_POSE_3 from "../assets/images/bp pose 3.webp";

import BW_POSE_1 from "../assets/images/bw pose 1.webp";
import BW_POSE_2 from "../assets/images/bw pose 2.webp";
import BW_POSE_3 from "../assets/images/bw pose 3.webp";

export const COLOR_POSE_GALLERIES: Record<string, string[]> = {
  "Black/White": [BW_POSE_1, BW_POSE_2, BW_POSE_3],
  "Black/Blue": [BB_POSE_1, BB_POSE_2, BB_POSE_3],
  "Black/Gold": [BG_POSE_1, BG_POSE_2, BG_POSE_3],
  "Black/Pink": [BP_POSE_1, BP_POSE_2, BP_POSE_3],
};

export const PIECES_DATA: Piece[] = [
  {
    id: "vegeta-stencil-tee-bw",
    name: "Vegeta Stencil Tee / Black/White",
    category: "TEES",
    status: "CURRENT",
    drop: "OCTOBER DROP",
    dropPrice: 4500,
    archivePrice: 5000,
    description: "Flagship 240 GSM combed cotton tee with monochrome Prince Vegeta stencil graphic.",
    animeSource: "Dragon Ball Z / Super · Prince Vegeta",
    story: "Vegeta represents unyielding royal pride, relentless discipline, and overcoming limitations. Engineered for those who move with quiet conviction in the streets of Buea.",
    fabric: {
      composition: "100% Combed Compact Ring-Spun Cotton",
      weight: "240 GSM Heavyweight Structure",
      printMethod: "High-Density DTF Wash-Proof Matrix",
      features: [
        "Pre-shrunk boxy silhouette",
        "Reinforced 1-inch ribbed collar",
        "Double-needle sleeve and hem stitching",
        "Silicone soft-wash finish"
      ],
      careInstructions: "Machine wash cold inside-out (30°C). Do not iron directly over graphic. Hang dry in shade."
    },
    delivery: {
      timeline: "Preorders close with October Drop -> 7-10 day curated batch production -> Direct delivery.",
      bueaPickup: "Direct Pickup Only at UB Junction and Campaign Street 7.",
      nationwideShipping: "Express delivery across Cameroon via certified transport agency.",
      paymentNote: "Reserve with 3,500 XAF deposit. Balance of 1,000 XAF due on dispatch/pickup."
    },
    colors: ["Black/White", "Black/Blue", "Black/Gold", "Black/Pink"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: {
      front: BW_POSE_1,
      back: BW_POSE_2,
    },
    colorGalleries: {
      "Black/White": [BW_POSE_1, BW_POSE_2, BW_POSE_3],
      "Black/Blue": [BB_POSE_1, BB_POSE_2, BB_POSE_3],
      "Black/Gold": [BG_POSE_1, BG_POSE_2, BG_POSE_3],
      "Black/Pink": [BP_POSE_1, BP_POSE_2, BP_POSE_3],
    },
    featured: true,
    dropDeadline: "October 31, 2026",
    dropPrivileges: [
      "Custom branded nylon bag packaging with sealed closure",
      "Vegeta-themed Hang Tag (brand info & drop lore)",
      "Exclusive Badass & Vegeta-themed collector stickers",
      "Founder Thank You Card & Gift Draw entry",
      "Serialized metallic collectible Founder Card",
      "Lifetime 24-hour priority access to Drop 002"
    ],
    reviews: []
  },
  {
    id: "vegeta-stencil-tee-bb",
    name: "Vegeta Stencil Tee / Black/Blue",
    category: "TEES",
    status: "CURRENT",
    drop: "OCTOBER DROP",
    dropPrice: 4500,
    archivePrice: 5000,
    description: "Heavyweight 240 GSM tee with electric cyber-blue high-density DTF graphics.",
    animeSource: "Dragon Ball Z / Super · Super Saiyan Blue",
    story: "Channeling divine ki and concentrated power. Cold, calculated warrior aesthetic in modern streetwear.",
    fabric: {
      composition: "100% Combed Compact Ring-Spun Cotton",
      weight: "240 GSM Heavyweight Structure",
      printMethod: "High-Density DTF Wash-Proof Matrix",
      features: [
        "Ultra-dense zero transparency weave",
        "Vibrant blue pigment retention",
        "Reinforced 1-inch neck ribbing"
      ],
      careInstructions: "Machine wash cold inside-out with like colors. Do not bleach. Hang dry."
    },
    delivery: {
      timeline: "Batch manufactured with the October Drop collection.",
      bueaPickup: "Direct Pickup Only at UB Junction and Campaign Street 7.",
      nationwideShipping: "Agency express delivery across Cameroon within 24-48 hours post production.",
      paymentNote: "3,500 XAF deposit secures piece. 1,000 XAF due on dispatch/pickup."
    },
    colors: ["Black/Blue", "Black/White", "Black/Gold", "Black/Pink"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: {
      front: BB_POSE_1,
      back: BB_POSE_2,
    },
    colorGalleries: {
      "Black/Blue": [BB_POSE_1, BB_POSE_2, BB_POSE_3],
      "Black/White": [BW_POSE_1, BW_POSE_2, BW_POSE_3],
      "Black/Gold": [BG_POSE_1, BG_POSE_2, BG_POSE_3],
      "Black/Pink": [BP_POSE_1, BP_POSE_2, BP_POSE_3],
    },
    featured: true,
    dropDeadline: "October 31, 2026",
    dropPrivileges: [
      "Custom branded nylon bag packaging with sealed closure",
      "Vegeta-themed Hang Tag (brand info & drop lore)",
      "Exclusive Badass & Vegeta-themed collector stickers",
      "Founder Thank You Card & Gift Draw entry",
      "Serialized metallic collectible Founder Card"
    ],
    reviews: []
  },
  {
    id: "vegeta-stencil-tee-bg",
    name: "Vegeta Stencil Tee / Black/Gold",
    category: "TEES",
    status: "CURRENT",
    drop: "OCTOBER DROP",
    dropPrice: 4500,
    archivePrice: 5000,
    description: "Heavyweight 240 GSM combed cotton tee with golden hue Saiyan stencil.",
    animeSource: "Dragon Ball Z / Super · Royal Saiyan Ascendance",
    story: "Representing royal heritage, golden aura, and absolute mastery over one's craft.",
    fabric: {
      composition: "100% Combed Compact Ring-Spun Cotton",
      weight: "240 GSM Heavyweight Structure",
      printMethod: "HD Multi-Pass DTF with Gold Pigment",
      features: [
        "Rich warm gold tones",
        "Reinforced neckline construction",
        "Heavy drape that flatters all builds"
      ],
      careInstructions: "Wash inside-out in cold water. Tumble dry low or air dry."
    },
    delivery: {
      timeline: "October Drop timeline with priority founder fulfillment.",
      bueaPickup: "Direct Pickup Only at UB Junction and Campaign Street 7.",
      nationwideShipping: "Available nationwide via certified transport agencies.",
      paymentNote: "3,500 XAF deposit / 1,000 XAF balance due on dispatch/pickup."
    },
    colors: ["Black/Gold", "Black/White", "Black/Blue", "Black/Pink"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: {
      front: BG_POSE_1,
      back: BG_POSE_2,
    },
    colorGalleries: {
      "Black/Gold": [BG_POSE_1, BG_POSE_2, BG_POSE_3],
      "Black/White": [BW_POSE_1, BW_POSE_2, BW_POSE_3],
      "Black/Blue": [BB_POSE_1, BB_POSE_2, BB_POSE_3],
      "Black/Pink": [BP_POSE_1, BP_POSE_2, BP_POSE_3],
    },
    featured: true,
    dropDeadline: "October 31, 2026",
    dropPrivileges: [
      "Custom branded nylon bag packaging with sealed closure",
      "Vegeta-themed Hang Tag (brand info & drop lore)",
      "Exclusive Badass & Vegeta-themed collector stickers",
      "Founder Thank You Card & Gift Draw entry",
      "Serialized metallic collectible Founder Card"
    ],
    reviews: []
  },
  {
    id: "vegeta-stencil-tee-bp",
    name: "Vegeta Stencil Tee / Black/Pink",
    category: "TEES",
    status: "CURRENT",
    drop: "OCTOBER DROP",
    dropPrice: 4500,
    archivePrice: 5000,
    description: "Heavyweight 240 GSM combed cotton tee with neon magenta anime graphics.",
    animeSource: "Dragon Ball Super · Ultra Ego / Magenta Aura",
    story: "Embodying raw unbridled power and high-energy street presence. A bold statement silhouette.",
    fabric: {
      composition: "100% Combed Compact Ring-Spun Cotton",
      weight: "240 GSM Heavyweight Structure",
      printMethod: "Matte Finish DTF Screen Integration",
      features: [
        "Vivid neon magenta pigments",
        "Pre-washed to eliminate shrinkage",
        "Reinforced neckband"
      ],
      careInstructions: "Gentle cold cycle. Iron on reverse side only."
    },
    delivery: {
      timeline: "Batch produced alongside Drop 001 collection.",
      bueaPickup: "Direct Pickup Only at UB Junction and Campaign Street 7.",
      nationwideShipping: "Shipped throughout Cameroon via express agency courier.",
      paymentNote: "3,500 XAF deposit / 1,000 XAF balance due on dispatch/pickup."
    },
    colors: ["Black/Pink", "Black/White", "Black/Blue", "Black/Gold"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: {
      front: BP_POSE_1,
      back: BP_POSE_2,
    },
    colorGalleries: {
      "Black/Pink": [BP_POSE_1, BP_POSE_2, BP_POSE_3],
      "Black/White": [BW_POSE_1, BW_POSE_2, BW_POSE_3],
      "Black/Blue": [BB_POSE_1, BB_POSE_2, BB_POSE_3],
      "Black/Gold": [BG_POSE_1, BG_POSE_2, BG_POSE_3],
    },
    featured: true,
    dropDeadline: "October 31, 2026",
    dropPrivileges: [
      "Custom branded nylon bag packaging with sealed closure",
      "Vegeta-themed Hang Tag (brand info & drop lore)",
      "Exclusive Badass & Vegeta-themed collector stickers",
      "Founder Thank You Card & Gift Draw entry",
      "Serialized metallic collectible Founder Card"
    ],
    reviews: []
  }
];

export const DROP_001_PACKAGING = [
  {
    id: "nylon-bag",
    name: "Custom Branded Nylon Bag",
    tagline: "Protective Heavy-Duty Shell",
    description: "Custom heavy-duty branded nylon garment bag with sealed closure, designed to protect your 240 GSM piece during delivery and storage.",
    badge: "CUSTOM NYLON",
    highlight: "Water-resistant matte nylon with industrial brand seal",
  },
  {
    id: "hang-tag",
    name: "Vegeta-Themed Hang Tag",
    tagline: "Brand Information & Drop Lore",
    description: "Collector card tag carrying Badass Designs brand philosophy, Drop 001 Vegeta stencil inspiration, anime lore, and fabric care instructions.",
    badge: "VEGETA THEMED",
    highlight: "High-density card with Vegeta stencil graphic & brand manifesto",
  },
  {
    id: "stickers",
    name: "Badass & Vegeta Collector Stickers",
    tagline: "Exclusive Die-Cut Decals",
    description: "Weatherproof vinyl stickers featuring the Badass Designs insignia and Drop 001 Vegeta stencil artwork for laptops, phones, and gear.",
    badge: "STICKER PACK",
    highlight: "Die-cut waterproof vinyl collector decals",
  },
  {
    id: "thank-you-card",
    name: "Founder Thank You Card",
    tagline: "Gen-1 Believer Recognition",
    description: "Personal card from the founder team expressing gratitude for championing Badass Designs from the very first drop in Buea.",
    badge: "THANK YOU CARD",
    highlight: "Signed founder card commemorating Gen-1 Drop 001 membership",
  },
];

export const BRAND_MANIFESTO = {
  origin: "Buea, Cameroon",
  founder: "Von Enownfor M.",
  signature: "FOR THOSE WHO KNOW.",
  taglines: [
    "Anime. Culture. Streetwear.",
    "Pieces built around characters, stories and attitude.",
    "Not made for everyone.",
    "Wear what you stand for."
  ],
  whatsapp: "+237 679798568",
  whatsappUrl: "https://wa.me/237679798568?text=Hello%20Badass%20Designs!%20I'm%20interested%20in%20the%20October%20Drop%20pieces.",
  whatsappCommunityUrl: "https://chat.whatsapp.com/D9cylrMF05SKAONofCRPij",
  instagram: "@badass_designs.cm",
  instagramUrl: "https://instagram.com/badass_designs.cm",
  tiktok: "@badass_designs.cm",
  tiktokUrl: "https://tiktok.com/@badass_designs.cm",
  websiteUrl: "https://badassdesigns.netlify.app"
};
