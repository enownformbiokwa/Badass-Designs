# BADASS DESIGNS — Gothic Streetwear Catalog & Preorder Platform

An interactive, high-performance web application and digital lookbook for **Badass Designs**, an exclusive streetwear brand. The platform allows users to explore streetwear drops, inspect multi-angle product photos in high resolution, select custom color variants, place preorder reservations with live database syncing, and connect directly with official support channels.

---

## 🚀 Key Features

* **Interactive Lookbook & Product Angles**: Browse high-resolution streetwear photography across multiple angles (Pose 1, Pose 2, Pose 3 - Front, Back, On-Model) for each colorway.
* **Color Variant Switcher**: Real-time switching between 4 distinct colorways (*Black / Blue*, *Black / Gold*, *Black / Pink*, *Black / White*) with instant visual model state updates.
* **Full-Screen High-Res Zoom Modal**: Inspect fabric details, prints, and stitching with touch/click backdrop dismiss.
* **Preorder Reservation System**: Streamlined preorder form with terms acceptance, live order totals, and real-time database storage.
* **Official Contact Desk**: Direct modal links to:
  * **WhatsApp Business**: `+237 679798568`
  * **Instagram**: `@badass_designs.cm`
  * **TikTok**: `@badass_designs.cm`
  * **Email**: `enownformbiokwa@gmail.com`
* **Performance Optimized**: Sub-second bundle load time using compressed WebP local image assets mapped directly by colorway and pose, fast asset loading, and Vite code splitting.

---

## 🛠️ Tech Stack & Why It Was Used

| Technology | Role | Why It Was Chosen |
| :--- | :--- | :--- |
| **React 18 + TypeScript** | Core UI Engine | Provides component modularity, predictable state management, and strict type safety across all preorder forms and modal views. |
| **Vite** | Build Tool & Dev Server | Offers instant Hot Module Replacement (HMR) during development and optimized Rollup builds for production. |
| **Tailwind CSS** | Styling & Layout | Delivers a high-contrast dark aesthetic with utility classes, zero CSS bundle bloat, and seamless mobile/tablet/desktop responsiveness. |
| **Motion (`motion/react`)** | Fluid UI Animations | Powers smooth spring-based modal transitions, image fade-ins, and interactive button feedback. |
| **Lucide React** | Vector Iconography | Lightweight, accessible SVG icons (`ShoppingBag`, `Instagram`, `MessageCircle`, `Video`, etc.). |
| **Firebase Firestore** | Database / Persistence | Cloud NoSQL document database used to store customer preorders securely in real time without managing server infrastructure. |
| **Cloudinary CDN** | Asset Delivery | Automatically optimizes image formats (`f_auto`) and quality (`q_auto`) based on the user's browser and connection speed. |

---

## 🔒 Security Architecture

* **100% Immune to SQL Injection**: The application uses Google Cloud Firestore (a NoSQL document database). There are no SQL engines, ORMs, or raw string queries in the codebase, rendering traditional SQL injection attacks impossible.
* **Client-Side Validation & Sanitization**: Form inputs (name, phone number, email, address, quantity) are validated and sanitized prior to submission.
* **Firestore Security Rules**: Database access is governed by cloud security rules ensuring data integrity.
* **Safe External Links**: All outbound social and messaging links use `rel="noopener noreferrer"` to prevent window opener vulnerability exploits.

---

## 💻 How to Run Locally on Localhost

Follow these steps to run the application on your local machine:

### 1. Prerequisites
Ensure you have the following installed on your computer:
* **Node.js** (v18.0.0 or higher recommended)
* **npm** (v9.0.0 or higher)

### 2. Installation
Open your terminal, navigate to the project directory, and install the dependencies:

```bash
npm install
```

### 3. Environment Variables
If you are using Firebase Firestore persistence locally, create a `.env` file in the root directory (refer to `.env.example` if available):

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Start Development Server
Run the Vite development server:

```bash
npm run dev
```

By default, the server will launch on:
```
http://localhost:3000
```
*(or `http://localhost:5173` if port 3000 is occupied).*

### 5. Build for Production & Preview
To test the production build locally:

```bash
# Build optimized static assets
npm run build

# Preview the production build locally
npm run start
```

---

## 📁 Project Directory Overview

```
├── public/                # Static public assets
├── src/
│   ├── assets/images/     # Local WebP lookbook photos (bb, bg, bp, bw poses 1-3) & brand logo
│   ├── App.tsx            # Main application component & layout state
│   ├── firebase.ts        # Firebase Firestore initialization & config
│   ├── main.tsx           # React DOM root entry point
│   ├── index.css          # Tailwind CSS global styles
│   └── types.ts           # TypeScript interfaces & product data models
├── package.json           # Dependencies and scripts
├── vite.config.ts         # Vite bundler configuration & chunking rules
└── README.md              # Documentation
```

---

## 📞 Official Brand Channels

For inquiries, support, or custom orders, connect via:
* **WhatsApp**: [+237 679798568](https://wa.me/237679798568)
* **Instagram**: [@badass_designs.cm](https://instagram.com/badass_designs.cm)
* **TikTok**: [@badass_designs.cm](https://tiktok.com/@badass_designs.cm)
* **Email**: `enownformbiokwa@gmail.com`
